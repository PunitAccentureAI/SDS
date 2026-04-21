import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { marked } from 'marked';
import { useUploadFileMutation } from '../hooks/useFiles';
import { useProposalDetails } from '../hooks/useProposalDetails';
import { getStoredUser } from '../services/authService';
import { fetchFilesList } from '../services/fileService';
import InternalEnterpriseSearch from './InternalEnterpriseSearch';
import { createProposalChatSocket, PROPOSAL_CHAT_SOCKET_EVENTS } from '../services/proposalChatSocket';
import {
  uploadedSupportFiles,
  documentTabFiles,
  proposalOutlineSections,
  businessRequirements,
  functionalRequirements,
} from '../data/proposalCreationData';
import { inferDocType } from '../utils/proposalUtils';
import {
  DocMenuIconEye,
  DocMenuIconDownload,
  DocMenuIconDelete,
  SparklesIcon,
  ReplyCloseIcon,
} from './proposalCreation/icons';
import './ProposalCreation.css';

export default function ProposalCreation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId: sessionIdFromPath } = useParams();
  const [searchParams] = useSearchParams();
  const formData = location.state || {};
  const chatEndRef = useRef(null);
  const chatFileInputRef = useRef(null);
  const chatSocketRef = useRef(null);
  const isSocketConnectedRef = useRef(false);

  const sessionIdFromUrl = searchParams.get('sessionId') || '';
  const sessionId = formData.sessionId || sessionIdFromPath || sessionIdFromUrl;
  const { proposalContext, isProposalDetailsLoading } = useProposalDetails({ sessionId, formData });
  const proposalName = proposalContext.proposalName || 'Untitled Proposal';
  const clientName = proposalContext.clientName || '';
  const fileType = proposalContext.fileType || '';
  const fileName = proposalContext.fileName || null;
  const initialEnterpriseReference = proposalContext.enterpriseReference || null;

  const [activeTab, setActiveTab] = useState('ai-chat');
  const [toastVisible, setToastVisible] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [flowState, setFlowState] = useState('initial');
  const [supportFiles, setSupportFiles] = useState([]);
  const [agentPlan, setAgentPlan] = useState(null);
  const [documentStatus, setDocumentStatus] = useState('blank');
  const [demoDocuments, setDemoDocuments] = useState(() => documentTabFiles.map((d) => ({ ...d })));
  const [fetchedDocuments, setFetchedDocuments] = useState([]);
  const [isFilesListLoading, setIsFilesListLoading] = useState(false);
  const [filesListError, setFilesListError] = useState('');
  const [selectedDocumentId, setSelectedDocumentId] = useState(documentTabFiles[1].id);
  const [documentsMenuOpenId, setDocumentsMenuOpenId] = useState(null);
  const documentsMenuRef = useRef(null);
  const [outlineOpenIds, setOutlineOpenIds] = useState(() => new Set(['functional']));
  const [isDragOver, setIsDragOver] = useState(false);
  const [enterpriseReference, setEnterpriseReference] = useState(initialEnterpriseReference);
  const [showEnterpriseReference, setShowEnterpriseReference] = useState(false);
  const [enterpriseSearchDrawerOpen, setEnterpriseSearchDrawerOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showSocketIssuePopup, setShowSocketIssuePopup] = useState(false);
  const [lastSocketOutputType, setLastSocketOutputType] = useState('');
  const uploadFileMutation = useUploadFileMutation();

  const previewTitle = `${proposalName === 'Untitled Proposal' ? 'Wooribank' : proposalName} Requirements Analysis`;
  const canShowPromptField = true;
  const isUploadingSupportFile = uploadFileMutation.isPending;
  const currentUser = getStoredUser();
  const userId = Number(currentUser?.user_id ?? currentUser?.id ?? currentUser?._id ?? 0);

  const normalizeFetchedFiles = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

    return list.map((item, idx) => ({
      id: item?.id ?? item?.file_id ?? `${item?.name || 'file'}-${idx}`,
      name: item?.name || item?.file_name || `File ${idx + 1}`,
      type: inferDocType(item?.name || item?.file_name || '', item?.file_type),
      source: item?.source || 'User',
      status: item?.status || '-',
    }));
  };

  const loadFilesList = async () => {
    if (!sessionId) return;
    setIsFilesListLoading(true);
    setFilesListError('');
    try {
      const result = await fetchFilesList({
        user_id: userId,
        session_id: sessionId,
      });
      setFetchedDocuments(normalizeFetchedFiles(result));
    } catch (error) {
      setFilesListError(error?.message || 'Failed to load files list.');
    } finally {
      setIsFilesListLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiTyping]);

  useEffect(() => {
    if (!toastVisible) return undefined;
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastVisible]);

  useEffect(() => {
    if (isProposalDetailsLoading) return undefined;
    const socket = createProposalChatSocket({ proposalName, clientName, fileType, sessionId });
    chatSocketRef.current = socket;

    const handleConnect = () => {
      isSocketConnectedRef.current = true;
      setIsSocketConnected(true);
      setShowSocketIssuePopup(false);
      socket.emit(PROPOSAL_CHAT_SOCKET_EVENTS.JOIN_ROOM, {
        proposalName,
        clientName,
        sessionId,
      });
    };

    const handleDisconnect = () => {
      isSocketConnectedRef.current = false;
      setIsSocketConnected(false);
      setShowSocketIssuePopup(true);
    };

    const handleConnectError = () => {
      isSocketConnectedRef.current = false;
      setIsSocketConnected(false);
      setShowSocketIssuePopup(true);
    };

    const handleTyping = (payload) => {
      setAiTyping(Boolean(payload?.isTyping));
    };

    const handleAiMessage = (payload) => {
      const socketMessageType = String(payload?.type || '').toLowerCase();
      const text = payload?.message || payload?.text;
      if (!text) return;
      if (socketMessageType) {
        setLastSocketOutputType(socketMessageType);
      }
      setAiTyping(false);
      setMessages((prev) => [...prev, { role: 'ai', text }]);
    };

    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.AI_TYPING, handleTyping);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.AI_MESSAGE, handleAiMessage);

    return () => {
      socket.emit(PROPOSAL_CHAT_SOCKET_EVENTS.LEAVE_ROOM, { proposalName, clientName, sessionId });
      socket.off(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT, handleConnect);
      socket.off(PROPOSAL_CHAT_SOCKET_EVENTS.DISCONNECT, handleDisconnect);
      socket.off(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
      socket.off(PROPOSAL_CHAT_SOCKET_EVENTS.AI_TYPING, handleTyping);
      socket.off(PROPOSAL_CHAT_SOCKET_EVENTS.AI_MESSAGE, handleAiMessage);
      socket.disconnect();
      chatSocketRef.current = null;
      isSocketConnectedRef.current = false;
      setIsSocketConnected(false);
    };
  }, [proposalName, clientName, fileType, sessionId, isProposalDetailsLoading]);

  useEffect(() => {
    if (activeTab !== 'documents') {
      setDocumentsMenuOpenId(null);
      return;
    }
    loadFilesList();
  }, [activeTab, sessionId]);

  useEffect(() => {
    if (!documentsMenuOpenId) return undefined;
    const close = (e) => {
      if (documentsMenuRef.current && !documentsMenuRef.current.contains(e.target)) {
        setDocumentsMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [documentsMenuOpenId]);

  useEffect(() => {
    const list = fetchedDocuments.length > 0 ? fetchedDocuments : supportFiles.length > 0 ? supportFiles : demoDocuments;
    const ids = new Set(list.map((item) => item.id));
    if (list.length > 0 && !ids.has(selectedDocumentId)) {
      setSelectedDocumentId(list[0].id);
    }
  }, [fetchedDocuments, supportFiles, demoDocuments, selectedDocumentId]);

  useEffect(() => {
    if (flowState !== 'generating' && flowState !== 'regenerating' && flowState !== 'retrying') {
      return undefined;
    }

    const isSuccessFlow = flowState === 'generating' || flowState === 'retrying';
    setDocumentStatus(flowState === 'generating' || flowState === 'retrying' ? 'loading' : 'loading');
    setAgentPlan({
      title: '2 Agents',
      eta: '1 mins remaining',
      actionLabel: flowState === 'retrying' ? 'Retrying' : 'Pause',
      status: isSuccessFlow ? 'running' : 'running',
      steps: [
        { label: 'Analysing inputs', meta: '1 mins', progress: 0.78, complete: false },
        { label: 'Generating', meta: '2 mins', progress: 0.56, complete: false },
      ],
    });

    const timer = setTimeout(() => {
      if (flowState === 'regenerating') {
        setAgentPlan({
          title: '2 Agents',
          eta: '1 mins remaining',
          actionLabel: 'Retry',
          status: 'error',
          steps: [
            { label: 'Analysing inputs', meta: '1 mins', progress: 0.78, complete: false },
            { label: 'Generating', meta: '2 mins', progress: 0.56, complete: false },
          ],
        });
        setDocumentStatus('blank');
        setFlowState('error');
        return;
      }

      setAgentPlan({
        title: '2 Agents',
        eta: '1 mins remaining',
        actionLabel: 'Pause',
        status: 'complete',
        steps: [
          { label: 'Analysing inputs', meta: 'Complete', progress: 1, complete: true },
          { label: 'Generating', meta: 'Complete', progress: 1, complete: true },
        ],
      });
      setDocumentStatus('ready');
      setFlowState('review');
    }, 2200);

    return () => clearTimeout(timer);
  }, [flowState]);

  const emitProposalChatMessage = ({ message, type = 'text', meta = {} }) => {
    const socket = chatSocketRef.current;
    if (!socket || !isSocketConnectedRef.current) return false;

    socket.emit(PROPOSAL_CHAT_SOCKET_EVENTS.SEND_MESSAGE, {
      message,
      type,
      flowState,
      proposalName,
      clientName,
      sessionId,
      ...meta,
    });
    return true;
  };

  const handleSendMessage = () => {
    if (!replyText.trim()) return;
    const userMessage = replyText.trim();
    const outgoingMessageType = lastSocketOutputType === 'hil_output' ? 'hil_input' : 'user_input';
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setReplyText('');
    emitProposalChatMessage({
      message: userMessage,
      type: 'user_input',
      meta: {
        messageType: outgoingMessageType,
        clientName,
        fileType,
        supportFiles: supportFiles.map((file) => ({ id: file.id, name: file.name, type: file.type })),
      },
    });

    if (flowState === 'supporting-docs') {
      setFlowState('ready-to-generate');
      return;
    }

    if (flowState === 'review') {
      setFlowState('regenerating');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const normalizeUploadedFile = (uploadedFile, fallbackFile) => {
    const fallbackName = fallbackFile?.name || 'Uploaded file';
    const fallbackType = inferDocType(fallbackName);

    return {
      id:
        uploadedFile?.id ||
        uploadedFile?.fileId ||
        uploadedFile?._id ||
        `${fallbackName}-${fallbackFile?.size || Date.now()}`,
      name:
        uploadedFile?.name ||
        uploadedFile?.fileName ||
        uploadedFile?.originalName ||
        fallbackName,
      type: inferDocType(
        uploadedFile?.name || uploadedFile?.fileName || uploadedFile?.originalName || fallbackName,
        uploadedFile?.type || uploadedFile?.extension || fallbackType,
      ),
    };
  };

  const attachSupportFile = async (file) => {
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    const ext = inferDocType(file.name);
    const uploadedFile = await uploadFileMutation.mutateAsync({ file, isTest: true });
    const normalizedFile = normalizeUploadedFile(uploadedFile, file);

    setSupportFiles([normalizedFile]);
    setMessages((prev) => {
      const withoutUserFiles = prev.filter((m) => m.role !== 'user-file');
      return [...withoutUserFiles, { role: 'user-file', name: file.name, size: `${sizeMB} MB`, ext }];
    });
    setFlowState('supporting-docs');
    setReplyText((prev) => prev || 'Use the attached documents');
    emitProposalChatMessage({
      message: file.name,
      type: 'file-upload',
      meta: {
        file: {
          id: normalizedFile.id,
          name: normalizedFile.name,
          type: normalizedFile.type,
          sizeMB,
        },
      },
    });
  };

  const handleChatFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 1) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: t('createProposal.singleFileOnly') },
      ]);
      e.target.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      await attachSupportFile(file);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: error.message || 'Failed to upload file. Please try again.' },
      ]);
    }
  };

  const handleRemoveSupportFile = (fileId) => {
    setSupportFiles((prev) => prev.filter((file) => file.id !== fileId));
  };

  const handleChatDragOver = (e) => {
    if (activeTab !== 'ai-chat') return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleChatDragLeave = (e) => {
    if (activeTab !== 'ai-chat') return;
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDragOver(false);
  };

  const handleChatDrop = async (e) => {
    if (activeTab !== 'ai-chat') return;
    e.preventDefault();
    setIsDragOver(false);
    const dropped = e.dataTransfer?.files;
    if (!dropped?.length) return;
    if (dropped.length > 1) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: t('createProposal.singleFileOnly') },
      ]);
      return;
    }
    const file = dropped[0];
    if (!file) return;

    try {
      await attachSupportFile(file);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: error.message || 'Failed to upload file. Please try again.' },
      ]);
    }
  };

  const tabs = [
    { id: 'ai-chat', label: t('proposal.aiChat') },
    { id: 'outline', label: t('proposal.outline') },
    { id: 'documents', label: t('proposal.documents') },
  ];

  const handleSaveClose = () => {
    navigate('/');
  };

  const handleOpenEnterpriseSearch = () => {
    setEnterpriseSearchDrawerOpen(true);
  };

  const handleRetrySocket = () => {
    const socket = chatSocketRef.current;
    if (!socket) return;
    socket.connect();
  };

  const handleEnterpriseReferenceSelect = (selectedReference) => {
    setEnterpriseReference(selectedReference);
    setShowEnterpriseReference(true);
    setEnterpriseSearchDrawerOpen(false);
  };

  const detailLines = [];
  if (proposalContext.proposalName) detailLines.push({ key: t('createProposal.proposalName'), val: proposalContext.proposalName });
  if (proposalContext.opportunityId) detailLines.push({ key: t('createProposal.opportunityId'), val: proposalContext.opportunityId });
  if (proposalContext.clientName) detailLines.push({ key: t('createProposal.clientName'), val: proposalContext.clientName });
  if (proposalContext.fileType) {
    detailLines.push({
      key: t('createProposal.fileType'),
      val: t(`createProposal.fileTypeOptions.${proposalContext.fileType}`),
    });
  }
  if (proposalContext.industry) detailLines.push({ key: t('createProposal.industry'), val: proposalContext.industry });
  if (proposalContext.serviceSegment?.length) detailLines.push({ key: t('createProposal.service'), val: proposalContext.serviceSegment.join(', ') });
  if (proposalContext.internalExternal) detailLines.push({ key: t('createProposal.internalExternal'), val: proposalContext.internalExternal });
  if (proposalContext.submissionDate) detailLines.push({ key: t('createProposal.submissionDate'), val: proposalContext.submissionDate });

  const planButtonLabel = useMemo(() => {
    if (!agentPlan) return '';
    if (agentPlan.status === 'error') return 'Retry';
    return agentPlan.actionLabel;
  }, [agentPlan]);

  const renderPreview = () => {
    if (documentStatus === 'loading') {
      return (
        <div className="pcr-doc pcr-doc-loading">
          <div className="pcr-doc-header">
            <h1 className="pcr-doc-title">{previewTitle}</h1>
            <div className="pcr-doc-divider" />
          </div>
          {[1, 2, 3, 4].map((section) => (
            <section key={section} className="pcr-skeleton-section">
              <div className="pcr-skeleton-heading" />
              <div className="pcr-skeleton-line pcr-skeleton-line-long" />
              <div className="pcr-skeleton-line" />
              <div className="pcr-skeleton-line" />
              <div className="pcr-skeleton-line pcr-skeleton-line-short" />
            </section>
          ))}
        </div>
      );
    }

    if (documentStatus !== 'ready' && activeTab !== 'outline') {
      return <div className="pcr-doc-blank" />;
    }

    return (
      <div className="pcr-doc">
        <div className="pcr-doc-header">
          <h1 className="pcr-doc-title">{previewTitle}</h1>
          <div className="pcr-doc-divider" />
        </div>

        <div className="pcr-doc-sections">
          <section className="pcr-doc-section">
            <h2 className="pcr-doc-section-title">Business Requirements</h2>
            <div className="pcr-table">
              <div className="pcr-table-header">
                <span className="pcr-cell pcr-cell-id">#</span>
                <span className="pcr-cell pcr-cell-main">Requirement</span>
                <span className="pcr-cell pcr-cell-objective">Objective</span>
              </div>
              {businessRequirements.map((row) => (
                <div key={row.id} className="pcr-table-row">
                  <span className="pcr-cell pcr-cell-id">{row.id}</span>
                  <span className="pcr-cell pcr-cell-main">{row.requirement}</span>
                  <span className="pcr-cell pcr-cell-objective">{row.objective}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="pcr-doc-section">
            <h2 className="pcr-doc-section-title">Functional Requirements</h2>
            {functionalRequirements.map((section) => (
              <div key={section.title} className="pcr-doc-text-block">
                <h3 className="pcr-doc-subtitle">{section.title}</h3>
                <ul className="pcr-doc-list">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </div>
      </div>
    );
  };

  const toggleOutlineSection = (id) => {
    setOutlineOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderOutlineTab = () => (
    <div className="pcr-outline">
      <div className="pcr-outline-list">
        {proposalOutlineSections.map((sec) => {
          const hasChildren = Boolean(sec.children?.length);
          const canToggle = sec.expandable || hasChildren;
          const expanded = outlineOpenIds.has(sec.id);
          return (
            <div
              key={sec.id}
              className={`pcr-outline-card${sec.highlight ? ' pcr-outline-card--highlight' : ''}`}
            >
              <button
                type="button"
                className="pcr-outline-row"
                aria-expanded={canToggle ? expanded : undefined}
                aria-label={
                  canToggle
                    ? expanded
                      ? t('proposalCreation.outlineCollapse')
                      : t('proposalCreation.outlineExpand')
                    : undefined
                }
                onClick={() => {
                  if (canToggle) toggleOutlineSection(sec.id);
                }}
              >
                <span
                  className={`pcr-outline-chevron${
                    expanded ? ' pcr-outline-chevron--open' : ''
                  }`}
                  aria-hidden="true"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="#9FA8B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="pcr-outline-label">{t(`proposalCreation.${sec.titleKey}`)}</span>
              </button>

              {hasChildren && expanded ? (
                <div className="pcr-outline-sublist">
                  {sec.children.map((ch) => (
                    <div key={ch.id} className="pcr-outline-subitem">
                      <span className="pcr-outline-subicon" aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 3v6a2 2 0 002 2h8" stroke="#9FA8B8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <span className="pcr-outline-sublabel">{t(`proposalCreation.${ch.titleKey}`)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDocumentsTab = () => {
    const uploadedDocuments = supportFiles.map((file) => ({
      id: file.id,
      name: file.name,
      type: inferDocType(file.name, file.type),
      source: 'User',
      status: 'Uploaded',
    }));
    const usingFetched = fetchedDocuments.length > 0;
    const usingUploads = uploadedDocuments.length > 0;
    const allDocuments = usingFetched ? fetchedDocuments : usingUploads ? uploadedDocuments : demoDocuments;

    const menuOptions = [
      { id: 'preview', labelKey: 'docMenuPreview', Icon: DocMenuIconEye },
      { id: 'download', labelKey: 'docMenuDownload', Icon: DocMenuIconDownload },
      { id: 'delete', labelKey: 'docMenuDelete', Icon: DocMenuIconDelete, deleteRow: true },
    ];

    const handleDocMenuAction = (optionId, doc) => {
      setDocumentsMenuOpenId(null);
      if (optionId === 'delete') {
        if (usingUploads) {
          const next = supportFiles.filter((f) => f.id !== doc.id);
          setSupportFiles(next);
          setSelectedDocumentId((sel) => (sel === doc.id ? next[0]?.id ?? null : sel));
        } else {
          const next = demoDocuments.filter((d) => d.id !== doc.id);
          setDemoDocuments(next);
          setSelectedDocumentId((sel) => (sel === doc.id ? next[0]?.id ?? null : sel));
        }
      }
    };

    if (allDocuments.length === 0) {
      return (
        <div className="pcr-doctab pcr-doctab--empty">
          {isFilesListLoading ? (
            <p className="pcr-doctab-empty-title">Loading files...</p>
          ) : filesListError ? (
            <p className="pcr-doctab-empty-title">{filesListError}</p>
          ) : (
          <p className="pcr-doctab-empty-title">{t('proposalCreation.docEmptyTitle')}</p>
          )}
          <p className="pcr-doctab-empty-hint">{t('proposalCreation.docEmptyHint')}</p>
        </div>
      );
    }

    return (
      <div className="pcr-doctab">
        <div className="pcr-doctab-head">
          <div className="pcr-doctab-col-name">
            <span>Name</span>
          </div>
          <div className="pcr-doctab-col-source pcr-doctab-col-source--head">
            <span>User/System</span>
          </div>
          <div className="pcr-doctab-col-status pcr-doctab-col-status--head">
            <span>Status</span>
          </div>
          <div className="pcr-doctab-col-actions pcr-doctab-col-actions--head">
            <button
              type="button"
              className="pcr-doctab-refresh"
              onClick={(e) => {
                e.stopPropagation();
                loadFilesList();
              }}
              aria-label="Refresh files"
              disabled={isFilesListLoading}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M16.8 9.2a6.8 6.8 0 10.7 3" stroke="#1D1D1F" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M17 4.5v4h-4" stroke="#1D1D1F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {allDocuments.map((doc) => {
          const typeKey = String(doc.type || 'FILE').toLowerCase();
          const iconVariant = ['pdf', 'doc', 'ppt', 'xls'].includes(typeKey) ? typeKey : 'file';
          return (
            <div
              key={doc.id}
              className="pcr-doctab-row"
              role="presentation"
              onClick={() => setSelectedDocumentId(doc.id)}
            >
              <div className="pcr-doctab-col-name">
                <div className={`pcr-doctab-icon pcr-doctab-icon-${iconVariant}`} aria-hidden="true" />
                <span className="pcr-doctab-filename" title={doc.name}>{doc.name}</span>
              </div>
              <div className="pcr-doctab-col-source">
                <span className="pcr-doctab-source">{doc.source}</span>
              </div>
              <div className="pcr-doctab-col-status">
                <span className="pcr-doctab-status">{doc.status || '-'}</span>
              </div>
              <div className="pcr-doctab-col-actions">
                <div
                  ref={documentsMenuOpenId === doc.id ? documentsMenuRef : null}
                  className="pcr-doctab-more-wrap"
                >
                  <button
                    type="button"
                    className="pcr-doctab-more"
                    aria-label={t('proposalCreation.docMenuAria')}
                    aria-expanded={documentsMenuOpenId === doc.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDocumentsMenuOpenId((open) => (open === doc.id ? null : doc.id));
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="3" r="1.25" fill="#1d1d1f" />
                      <circle cx="8" cy="8" r="1.25" fill="#1d1d1f" />
                      <circle cx="8" cy="13" r="1.25" fill="#1d1d1f" />
                    </svg>
                  </button>
                  {documentsMenuOpenId === doc.id ? (
                    <div className="pcr-doctab-menu" role="menu">
                      {menuOptions.map((opt) => {
                        const Icon = opt.Icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="menuitem"
                            className={`pcr-doctab-menu-item${opt.deleteRow ? ' pcr-doctab-menu-item--delete' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDocMenuAction(opt.id, doc);
                            }}
                          >
                            <span className="pcr-doctab-menu-item-label">
                              {t(`proposalCreation.${opt.labelKey}`)}
                            </span>
                            <Icon />
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="pcr-page">
      {enterpriseSearchDrawerOpen && (
        <div
          className="pcr-enterprise-drawer-backdrop"
          onClick={() => setEnterpriseSearchDrawerOpen(false)}
        >
          <div
            className="pcr-enterprise-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <InternalEnterpriseSearch
              embedded
              proposalState={proposalContext}
              onCloseDrawer={() => setEnterpriseSearchDrawerOpen(false)}
              onReferenceSelect={handleEnterpriseReferenceSelect}
            />
          </div>
        </div>
      )}
      {toastVisible && (
        <div className="pcr-toast">
          <span className="pcr-toast-msg">
            {t('proposalCreation.toastSuccess', { name: proposalName })}
          </span>
          <button
            type="button"
            className="pcr-toast-dismiss"
            onClick={() => setToastVisible(false)}
          >
            {t('common.dismiss')}
          </button>
        </div>
      )}
      {showSocketIssuePopup && (
        <div className="pcr-socket-popup-backdrop" role="presentation">
          <div className="pcr-socket-popup" role="alertdialog" aria-live="assertive" aria-label="Socket issue">
            <h3>Chat connection issue</h3>
            <p>We are unable to connect to chat right now. Please retry.</p>
            <div className="pcr-socket-popup-actions">
              <button
                type="button"
                className="pcr-socket-popup-btn pcr-socket-popup-btn-secondary"
                onClick={() => setShowSocketIssuePopup(false)}
              >
                Dismiss
              </button>
              <button
                type="button"
                className="pcr-socket-popup-btn pcr-socket-popup-btn-primary"
                onClick={handleRetrySocket}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="pcr-nav">
        <div className="pcr-nav-left">
          <span className="pcr-nav-title">{t('proposal.proposalCreation')}</span>
          <span className="pcr-nav-subtitle">
            {clientName ? `${clientName} • ` : ''}{t('proposalCreation.lastEditedToday')}
          </span>
        </div>
        <div className="pcr-nav-right">
          <button type="button" className="pcr-nav-search-btn" onClick={handleOpenEnterpriseSearch}>
            <span>{t('proposal.enterpriseSearch')}</span>
            <SparklesIcon />
          </button>
          <button type="button" className="pcr-nav-close-btn" onClick={handleSaveClose}>
            <span>{t('proposal.saveClose')}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="#5A5D6E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="pcr-content">
        {/* Left AI Chat Panel */}
        <div className="pcr-sidebar">
          <div className="pcr-panel">
            {/* Tabs */}
            <div className="pcr-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`pcr-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chat Content */}
            <div className="pcr-chat-area">
              {activeTab === 'documents' ? (
                renderDocumentsTab()
              ) : activeTab === 'outline' ? (
                renderOutlineTab()
              ) : (
                <>
              <div className={`pcr-socket-status ${isSocketConnected ? 'connected' : 'disconnected'}`}>
                <span className="pcr-socket-dot" aria-hidden="true" />
                <span>{isSocketConnected ? 'Chat connected' : 'Chat disconnected. Reconnecting...'}</span>
              </div>
              {/* Uploaded file chip */}
              {fileName && (
                <div className="pcr-file-bubble">
                  <div className="pcr-file-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <rect x="3" y="1" width="14" height="18" rx="2" fill="#fff" stroke="#ddd" strokeWidth="1" />
                      <text x="10" y="14" textAnchor="middle" fill="#e53935" fontSize="6" fontWeight="700">PDF</text>
                    </svg>
                  </div>
                  <div className="pcr-file-info">
                    <span className="pcr-file-name">{fileName}</span>
                    <span className="pcr-file-status">{t('proposalCreation.uploaded')}</span>
                  </div>
                </div>
              )}

              {messages.length > 0 && enterpriseReference && showEnterpriseReference && (
                <>
                  <div className="pcr-ai-message">
                    <div className="pcr-ai-avatar">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#2189FF" />
                        <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#2189FF" />
                        <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#2189FF" />
                      </svg>
                    </div>
                    <div className="pcr-ai-text">
                      <p>{t('enterpriseSearch.addedFromSearch', { name: enterpriseReference.title })}</p>
                    </div>
                  </div>
                  <div className="pcr-es-ref-card">
                    <button
                      type="button"
                      className="pcr-es-ref-close"
                      aria-label={t('common.dismiss')}
                      onClick={() => setShowEnterpriseReference(false)}
                    >
                      <ReplyCloseIcon />
                    </button>
                    <h3 className="pcr-es-ref-title">{enterpriseReference.title}</h3>
                    <p className="pcr-es-ref-meta">{enterpriseReference.client} • {enterpriseReference.year}</p>
                    <p className="pcr-es-ref-summary">{enterpriseReference.summary}</p>
                    <div className="pcr-es-ref-tags">
                      {enterpriseReference.tags.map((tag) => (
                        <span key={tag} className="pcr-es-ref-tag">{tag}</span>
                      ))}
                    </div>
                    {enterpriseReference.files?.length > 0 && (
                      <div className="pcr-es-ref-files">
                        <div className="pcr-es-ref-files-head">
                          <span>{enterpriseReference.files.length} {t('enterpriseSearch.files')}</span>
                        </div>
                        <div className="pcr-es-ref-files-list">
                          {enterpriseReference.files.slice(0, 2).map((file) => (
                            <div key={file.id} className="pcr-es-ref-file">
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Proposal details summary bubble */}
              {messages.length > 0 && detailLines.length > 0 && (
                <div className="pcr-details-bubble">
                  {detailLines.map((line, i) => (
                    <p key={i} className="pcr-detail-line">
                      <span className="pcr-detail-key">{line.key}: </span>
                      <span className="pcr-detail-val">{line.val}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Dynamic message history */}
              {messages.map((msg, idx) => {
                if (msg.role === 'user') {
                  return (
                    <div key={idx} className="pcr-user-message">
                      <div className="pcr-user-bubble">{msg.text}</div>
                    </div>
                  );
                }
                if (msg.role === 'user-file') {
                  return (
                    <div key={idx} className="pcr-user-message">
                      <div className="pcr-file-bubble">
                        <div className="pcr-file-icon">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <rect x="3" y="1" width="14" height="18" rx="2" fill="#fff" stroke="#ddd" strokeWidth="1" />
                            <text x="10" y="14" textAnchor="middle" fill="#e53935" fontSize="5" fontWeight="700">{msg.ext}</text>
                          </svg>
                        </div>
                        <div className="pcr-file-info">
                          <span className="pcr-file-name">{msg.name}</span>
                          <span className="pcr-file-status">{msg.size} • {t('proposalCreation.uploaded')}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="pcr-ai-message">
                    <div className="pcr-ai-avatar">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#2189FF" />
                        <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#2189FF" />
                        <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#2189FF" />
                      </svg>
                    </div>
                    <div className="pcr-ai-text">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(String(msg.text || '')),
                        }}
                      />
                    </div>
                  </div>
                );
              })}

              {/* AI typing indicator */}
              {aiTyping && (
                <div className="pcr-ai-message">
                  <div className="pcr-ai-avatar">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#2189FF" />
                      <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#2189FF" />
                      <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#2189FF" />
                    </svg>
                  </div>
                  <div className="pcr-ai-text">
                    <div className="pcr-typing-indicator">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}

              {agentPlan && (
                <div className={`pcr-agent-plan ${agentPlan.status === 'error' ? 'error' : ''}`}>
                  <div className="pcr-agent-plan-top">
                    <span className="pcr-agent-plan-title">{agentPlan.title}</span>
                    <span className="pcr-agent-plan-eta">{agentPlan.eta}</span>
                  </div>
                  {agentPlan.steps.map((step) => (
                    <div key={step.label} className="pcr-plan-step">
                      <div className="pcr-plan-step-head">
                        <span>{step.label}</span>
                        <span className={step.complete ? 'complete' : ''}>{step.meta}</span>
                      </div>
                      <div className="pcr-plan-track">
                        <div
                          className={`pcr-plan-fill ${agentPlan.status === 'error' ? 'error' : ''} ${step.complete ? 'complete' : ''}`}
                          style={{ width: `${step.progress * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pcr-plan-actions">
                    <button
                      type="button"
                      className="pcr-plan-btn"
                      onClick={() => {
                        if (agentPlan.status === 'error') {
                          setFlowState('retrying');
                        }
                      }}
                    >
                      {planButtonLabel}
                    </button>
                  </div>
                </div>
              )}
                </>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Reply input */}
            {canShowPromptField && activeTab !== 'documents' && activeTab !== 'outline' && (
              <div
                className={`pcr-reply-bar${isDragOver ? ' pcr-reply-bar--dragover' : ''}`}
                onDragOver={handleChatDragOver}
                onDragLeave={handleChatDragLeave}
                onDrop={handleChatDrop}
              >
                <div className={`pcr-reply-field${supportFiles.length > 0 ? ' pcr-reply-field--attached' : ''}`}>
                  <div className="pcr-reply-main">
                    <input
                      type="text"
                      className="pcr-reply-input"
                      placeholder={t('proposalCreation.replyPlaceholder')}
                      value={replyText}
                      disabled={!isSocketConnected}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <div className="pcr-reply-actions">
                      <input
                        ref={chatFileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv"
                        multiple={false}
                        onChange={handleChatFileSelect}
                        hidden
                      />
                      <button
                        type="button"
                        className="pcr-reply-icon-btn"
                        aria-label="Attach"
                        disabled={isUploadingSupportFile || !isSocketConnected}
                        onClick={() => chatFileInputRef.current?.click()}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M15.5 10.5l-5.59 5.59a4 4 0 01-5.66-5.66l5.59-5.59a2.67 2.67 0 013.77 3.77l-5.59 5.59a1.33 1.33 0 01-1.88-1.88l5.17-5.17" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="pcr-reply-icon-btn"
                        aria-label="Send"
                        disabled={!isSocketConnected || !replyText.trim()}
                        onClick={handleSendMessage}
                      >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10l12-6-6 12-2-4-4-2z" stroke={replyText.trim() ? '#09121F' : '#9FA8B8'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 10l6-6" stroke={replyText.trim() ? '#09121F' : '#9FA8B8'} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {supportFiles.length > 0 && (
                    <div className="pcr-support-files">
                      {supportFiles.map((file) => (
                        <div key={file.id} className="pcr-support-file">
                          <div className="pcr-support-file-icon">{file.type}</div>
                          <span className="pcr-support-file-name">{file.name}</span>
                          <button
                            type="button"
                            className="pcr-support-file-remove"
                            aria-label={`Remove ${file.name}`}
                            onClick={() => handleRemoveSupportFile(file.id)}
                          >
                            <ReplyCloseIcon />
                          </button>
                        </div>
                      ))}
                      {isUploadingSupportFile && (
                        <div className="pcr-support-file pcr-support-file--uploading">
                          <div className="pcr-support-file-icon">...</div>
                          <span className="pcr-support-file-name">Uploading file...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Document Preview */}
        <div className="pcr-preview">
          <div className="pcr-preview-inner">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
