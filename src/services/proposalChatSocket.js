import { API_BASE_URL } from '../api';
import { getAccessToken } from './authService';
import { getStoredUser } from './authService';

const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.REACT_APP_SOCKET_URL ||
  API_BASE_URL ||
  window.location.origin;

export const PROPOSAL_CHAT_SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
  JOIN_ROOM: 'proposal:new:join',
  LEAVE_ROOM: 'proposal:new:leave',
  SEND_MESSAGE: 'proposal:new:message',
  AI_MESSAGE: 'proposal:new:ai-message',
  AI_TYPING: 'proposal:new:ai-typing',
};

function toWsUrl(baseUrl) {
  const raw = baseUrl || window.location.origin;
  if (raw.startsWith('ws://') || raw.startsWith('wss://')) return raw;
  if (raw.startsWith('https://')) return raw.replace('https://', 'wss://');
  if (raw.startsWith('http://')) return raw.replace('http://', 'ws://');
  return `ws://${raw.replace(/^\/+/, '')}`;
}

function createEmitter() {
  const listeners = new Map();

  const on = (event, handler) => {
    const bucket = listeners.get(event) || new Set();
    bucket.add(handler);
    listeners.set(event, bucket);
  };

  const off = (event, handler) => {
    if (!listeners.has(event)) return;
    if (!handler) {
      listeners.delete(event);
      return;
    }
    const bucket = listeners.get(event);
    bucket.delete(handler);
    if (bucket.size === 0) listeners.delete(event);
  };

  const emitLocal = (event, payload) => {
    const bucket = listeners.get(event);
    if (!bucket) return;
    bucket.forEach((handler) => handler(payload));
  };

  return { on, off, emitLocal };
}

function asBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') return ['1', 'true', 'yes', 'typing'].includes(value.toLowerCase());
  return false;
}

function extractText(payload) {
  if (!payload) return '';
  if (typeof payload === 'string') return payload;
  return (
    payload.message ||
    payload.text ||
    payload.output ||
    payload.response ||
    payload.content ||
    payload.answer ||
    payload.result ||
    payload?.data?.message ||
    payload?.data?.text ||
    payload?.data?.output ||
    payload?.data?.response ||
    ''
  );
}

function normalizeIncomingPayload(rawPayload) {
  const payload = rawPayload && typeof rawPayload === 'object'
    ? rawPayload
    : { message: String(rawPayload || '') };
  const eventType = String(payload?.type || payload?.event || payload?.kind || '').toLowerCase();

  const typingCandidate =
    payload?.isTyping ??
    payload?.typing ??
    payload?.status ??
    payload?.data?.isTyping ??
    payload?.data?.typing ??
    payload?.data?.status;
  const isTyping = asBoolean(typingCandidate);

  if (eventType.includes('typing') || payload?.typing !== undefined || payload?.isTyping !== undefined) {
    return {
      event: PROPOSAL_CHAT_SOCKET_EVENTS.AI_TYPING,
      payload: { isTyping },
    };
  }

  return {
    event: PROPOSAL_CHAT_SOCKET_EVENTS.AI_MESSAGE,
    payload: {
      ...payload,
      message: extractText(payload),
      showYesNo: Boolean(
        payload?.showYesNo ??
        payload?.show_yes_no ??
        payload?.data?.showYesNo ??
        payload?.data?.show_yes_no,
      ),
    },
  };
}

export const createProposalChatSocket = ({ clientName, sessionId } = {}) => {
  const token = getAccessToken();
  const user = getStoredUser();
  const userId = Number(user?.user_id ?? user?.id ?? user?._id ?? 0);
  let messageId = 0;
  let ws = null;

  const { on, off, emitLocal } = createEmitter();

  const connect = () => {
    if (!sessionId) {
      emitLocal(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT_ERROR, {
        message: 'session_id is required for websocket connection.',
      });
      return;
    }

    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const wsBase = toWsUrl(SOCKET_BASE_URL).replace(/\/+$/, '');
    const query = new URLSearchParams({
      session_id: String(sessionId),
    });
    if (token) {
      query.set('token', token);
    }
    const url = `${wsBase}/ws?${query.toString()}`;

    ws = new WebSocket(url);

    ws.onopen = () => {
      emitLocal(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT);
    };

    ws.onclose = () => {
      emitLocal(PROPOSAL_CHAT_SOCKET_EVENTS.DISCONNECT);
    };

    ws.onerror = () => {
      emitLocal(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT_ERROR, {
        message: 'WebSocket error',
      });
    };

    ws.onmessage = (event) => {
      let payload = event.data;
      try {
        payload = JSON.parse(event.data);
      } catch (error) {
        payload = { message: String(event.data || '') };
      }
      const normalized = normalizeIncomingPayload(payload);
      emitLocal(normalized.event, normalized.payload);
    };
  };

  const disconnect = () => {
    if (!ws) return;
    ws.close();
    ws = null;
  };

  const emit = (eventName, payload = {}) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    if (eventName === PROPOSAL_CHAT_SOCKET_EVENTS.SEND_MESSAGE) {
      messageId += 1;
      const messagePayload = {
        user_id: userId,
        type: 'input_prompt',
        input: payload?.message || '',
        client_name: payload?.clientName || clientName || '',
        message_id: messageId,
      };
      ws.send(JSON.stringify(messagePayload));
      return;
    }

    if (eventName === PROPOSAL_CHAT_SOCKET_EVENTS.JOIN_ROOM) {
      ws.send(JSON.stringify({
        type: 'join',
        client_name: payload?.clientName || clientName || '',
      }));
      return;
    }

    if (eventName === PROPOSAL_CHAT_SOCKET_EVENTS.LEAVE_ROOM) {
      ws.send(JSON.stringify({
        type: 'leave',
        client_name: payload?.clientName || clientName || '',
      }));
    }
  };

  connect();

  return {
    on,
    off,
    emit,
    connect,
    disconnect,
  };
};
