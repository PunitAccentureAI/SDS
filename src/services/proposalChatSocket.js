import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api';
import { getAccessToken } from './authService';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || API_BASE_URL || window.location.origin;

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

export const createProposalChatSocket = ({ proposalName, clientName } = {}) => {
  const token = getAccessToken();

  const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'],
    auth: token ? { token } : undefined,
    query: {
      context: 'proposal-new',
      proposalName: proposalName || '',
      clientName: clientName || '',
    },
  });

  return socket;
};
