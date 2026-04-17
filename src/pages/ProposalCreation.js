import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUploadFileMutation } from '../hooks/useFiles';
import InternalEnterpriseSearch from './InternalEnterpriseSearch';
import { createProposalChatSocket, PROPOSAL_CHAT_SOCKET_EVENTS } from '../services/proposalChatSocket';
import './ProposalCreation.css';

const quickActions = [
  'Proposal storyboard',
  'Requirements analysis',
  'Differentiation strategy',
  'Proposal Review',
  'Competitive analysis',
];

const uploadedSupportFiles = [
  { id: 1, name: 'Research file 1.ppt', type: 'PPT' },
];

const documentTabFiles = [
  { id: 'doc-1', name: 'Wooribank_RFP.pdf', type: 'PDF', source: 'User' },
  { id: 'doc-2', name: 'Research_2026', type: 'DOC', source: 'System' },
  { id: 'doc-3', name: 'Research_2025', type: 'PPT', source: 'User' },
  { id: 'doc-4', name: 'Research_2022', type: 'XLS', source: 'User' },
];

const proposalOutlineSections = [
  { id: 'business', titleKey: 'outlineBusinessRequirements', children: [], expandable: true },
  {
    id: 'functional',
    titleKey: 'outlineFunctionalRequirements',
    highlight: true,
    expandable: true,
    children: [
      { id: 'functional-1', titleKey: 'outlineDataIngestion' },
      { id: 'functional-2', titleKey: 'outlineModelTraining' },
      { id: 'functional-3', titleKey: 'outlinePredictionAnalytics' },
      { id: 'functional-4', titleKey: 'outlineUserInterfaces' },
    ],
  },
  { id: 'placeholder-1', titleKey: 'outlineSectionName', children: [], expandable: true },
  { id: 'placeholder-2', titleKey: 'outlineSectionName', children: [], expandable: true },
];

function inferDocType(name = '', explicitType) {
  if (explicitType) return String(explicitType).toUpperCase();
  const ext = name.split('.').pop()?.toUpperCase() || 'FILE';
  const map = {
    PDF: 'PDF',
    DOC: 'DOC',
    DOCX: 'DOC',
    PPT: 'PPT',
    PPTX: 'PPT',
    XLS: 'XLS',
    XLSX: 'XLS',
  };
  return map[ext] || (ext.length <= 4 ? ext : 'FILE');
}

const businessRequirements = [
  { id: 'B-01', requirement: 'Automate loan underwriting', objective: 'Reduce processing time by 50%; achieve approval accuracy > 95%' },
  { id: 'B-02', requirement: 'Operate a 24/7 customer-service chatbot', objective: 'Provide uninterrupted support; achieve First-Call-Resolution (FCR) > 80%' },
  { id: 'B-03', requirement: 'Improve marketing targeting', objective: 'Increase personalized product-recommendation rate by 30% through behavioral data analysis' },
  { id: 'B-04', requirement: 'Build a fraud-detection model', objective: 'Detect suspicious transactions with a reduction-rate ≥ 90% in real time' },
  { id: 'B-05', requirement: 'Enhance internal workflow efficiency', objective: 'Cut employee-task time by 20% via automatic document classification and summarization' },
];

const functionalRequirements = [
  {
    title: 'Data Ingestion & Pre-processing',
    points: [
      'Connect to various sources: real-time transaction logs, customer behavior logs, call-center recordings, etc.',
      'Automatic cleansing pipeline for missing or corrupted data.',
    ],
  },
  {
    title: 'Model Training & Deployment',
    points: [
      'Support AutoML with automatic hyper-parameter tuning.',
      'Model versioning and A/B-testing environment.',
    ],
  },
  {
    title: 'Prediction & Analytics Services',
    points: [
      'Provide inference via RESTful APIs.',
      'Support both real-time streaming predictions and batch predictions.',
    ],
  },
];

function DocMenuIconEye() {
  return (
    <svg className="pcr-doctab-menu-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DocMenuIconDownload() {
  return (
    <svg className="pcr-doctab-menu-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocMenuIconDelete() {
  return (
    <svg className="pcr-doctab-menu-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#000" />
      <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#000" />
      <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#000" />
    </svg>
  );
}

function ReplyCloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="#09121F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function ProposalCreation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state || {};
  const chatEndRef = useRef(null);
  const chatFileInputRef = useRef(null);
  const chatSocketRef = useRef(null);
  const isSocketConnectedRef = useRef(false);

  const proposalName = formData.proposalName || 'Untitled Proposal';
  const clientName = formData.clientName || '';
  const fileName = formData.fileName || null;
  const initialEnterpriseReference = formData.enterpriseReference || null;

  const [activeTab, setActiveTab] = useState('ai-chat');
  const [toastVisible, setToastVisible] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [messages, setMessages] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showYesNo, setShowYesNo] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [flowState, setFlowState] = useState('initial');
  const [supportFiles, setSupportFiles] = useState([]);
  const [agentPlan, setAgentPlan] = useState(null);
  const [documentStatus, setDocumentStatus] = useState('blank');
  const [demoDocuments, setDemoDocuments] = useState(() => documentTabFiles.map((d) => ({ ...d })));
  const [selectedDocumentId, setSelectedDocumentId] = useState(documentTabFiles[1].id);
  const [documentsMenuOpenId, setDocumentsMenuOpenId] = useState(null);
  const documentsMenuRef = useRef(null);
  const [outlineOpenIds, setOutlineOpenIds] = useState(() => new Set(['functional']));
  const [isDragOver, setIsDragOver] = useState(false);
  const [enterpriseReference, setEnterpriseReference] = useState(initialEnterpriseReference);
  const [showEnterpriseReference, setShowEnterpriseReference] = useState(Boolean(initialEnterpriseReference));
  const [enterpriseSearchDrawerOpen, setEnterpriseSearchDrawerOpen] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showSocketIssuePopup, setShowSocketIssuePopup] = useState(false);
  const uploadFileMutation = useUploadFileMutation();

  const previewTitle = `${proposalName === 'Untitled Proposal' ? 'Wooribank' : proposalName} Requirements Analysis`;
  const canShowPromptField = flowState !== 'initial';
  const isUploadingSupportFile = uploadFileMutation.isPending;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showYesNo, aiTyping]);

  useEffect(() => {
    const socket = createProposalChatSocket({ proposalName, clientName });
    chatSocketRef.current = socket;

    const handleConnect = () => {
      isSocketConnectedRef.current = true;
      setIsSocketConnected(true);
      setShowSocketIssuePopup(false);
      socket.emit(PROPOSAL_CHAT_SOCKET_EVENTS.JOIN_ROOM, {
        proposalName,
        clientName,
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
      const text = payload?.message || payload?.text;
      if (!text) return;
      setAiTyping(false);
      setMessages((prev) => [...prev, { role: 'ai', text }]);
      if (payload?.showYesNo) {
        setShowYesNo(true);
      }
    };

    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT, handleConnect);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.DISCONNECT, handleDisconnect);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.CONNECT_ERROR, handleConnectError);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.AI_TYPING, handleTyping);
    socket.on(PROPOSAL_CHAT_SOCKET_EVENTS.AI_MESSAGE, handleAiMessage);

    return () => {
      socket.emit(PROPOSAL_CHAT_SOCKET_EVENTS.LEAVE_ROOM, { proposalName, clientName });
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
  }, [proposalName, clientName]);

  useEffect(() => {
    if (activeTab !== 'documents') {
      setDocumentsMenuOpenId(null);
    }
  }, [activeTab]);

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
    const list = supportFiles.length > 0 ? supportFiles : demoDocuments;
    const ids = new Set(list.map((item) => item.id));
    if (list.length > 0 && !ids.has(selectedDocumentId)) {
      setSelectedDocumentId(list[0].id);
    }
  }, [supportFiles, demoDocuments, selectedDocumentId]);

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
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Your proposal is ready to review.\nDo you have any further feedback?',
        },
      ]);
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
      ...meta,
    });
    return true;
  };

  const handleQuickAction = (action) => {
    setMessages((prev) => [...prev, { role: 'user', text: action }]);
    setShowQuickActions(false);
    setFlowState('awaiting-docs');
    emitProposalChatMessage({ message: action, type: 'quick-action' });
  };

  const handleYesNo = (answer) => {
    setMessages((prev) => [...prev, { role: 'user', text: answer }]);
    setShowYesNo(false);
    emitProposalChatMessage({ message: answer, type: 'yes-no' });
    if (flowState === 'awaiting-docs') {
      if (answer === 'Yes') {
        setSupportFiles(uploadedSupportFiles);
        setFlowState('supporting-docs');
        setReplyText('Use the attached documents');
      } else {
        setFlowState('ready-to-generate');
      }
      return;
    }

    if (flowState === 'ready-to-generate') {
      if (answer === 'Yes') {
        setFlowState('generating');
      }
      return;
    }

    if (answer === 'Yes') {
      setFlowState('generating');
    }
  };

  const handleSendMessage = () => {
    if (!replyText.trim()) return;
    const userMessage = replyText.trim();
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setReplyText('');
    setShowYesNo(false);
    setShowQuickActions(false);
    emitProposalChatMessage({
      message: userMessage,
      type: 'user-message',
      meta: {
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
    setShowQuickActions(false);
    setShowYesNo(false);
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
  if (formData.proposalName) detailLines.push({ key: t('createProposal.proposalName'), val: formData.proposalName });
  if (formData.opportunityId) detailLines.push({ key: t('createProposal.opportunityId'), val: formData.opportunityId });
  if (formData.industry) detailLines.push({ key: t('createProposal.industry'), val: formData.industry });
  if (formData.serviceSegment?.length) detailLines.push({ key: t('createProposal.service'), val: formData.serviceSegment.join(', ') });
  if (formData.internalExternal) detailLines.push({ key: t('createProposal.internalExternal'), val: formData.internalExternal });
  if (formData.submissionDate) detailLines.push({ key: t('createProposal.submissionDate'), val: formData.submissionDate });

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
    }));
    const usingUploads = uploadedDocuments.length > 0;
    const allDocuments = usingUploads ? uploadedDocuments : demoDocuments;

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
          <p className="pcr-doctab-empty-title">{t('proposalCreation.docEmptyTitle')}</p>
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
                <span className="pcr-doctab-filename">{doc.name}</span>
              </div>
              <div className="pcr-doctab-col-source">
                <span className="pcr-doctab-source">{doc.source}</span>
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
              proposalState={formData}
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

              {enterpriseReference && showEnterpriseReference && (
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
              {detailLines.length > 0 && (
                <div className="pcr-details-bubble">
                  {detailLines.map((line, i) => (
                    <p key={i} className="pcr-detail-line">
                      <span className="pcr-detail-key">{line.key}: </span>
                      <span className="pcr-detail-val">{line.val}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Initial AI message */}
              <div className="pcr-ai-message">
                <div className="pcr-ai-avatar">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#2189FF" />
                    <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#2189FF" />
                    <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#2189FF" />
                  </svg>
                </div>
                <div className="pcr-ai-text">
                  <p>{t('proposalCreation.aiGreeting', { name: 'Kim' })}</p>
                  <p>{t('proposalCreation.aiQuestion')}</p>
                </div>
              </div>

              {/* Quick action chips */}
              {showQuickActions && (
                <div className="pcr-quick-actions">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      className="pcr-quick-btn"
                      disabled={!isSocketConnected}
                      onClick={() => handleQuickAction(action)}
                    >
                      {action}
                    </button>
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
                      {msg.text.split('\n').map((line) => (
                        <p key={line}>{line}</p>
                      ))}
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

              {/* Yes / No action buttons */}
              {showYesNo && !aiTyping && (
                <div className="pcr-yesno-actions">
                  <button
                    type="button"
                    className="pcr-yesno-btn pcr-yesno-yes"
                    disabled={!isSocketConnected}
                    onClick={() => handleYesNo('Yes')}
                  >
                    {t('proposalCreation.yes')}
                  </button>
                  <button
                    type="button"
                    className="pcr-yesno-btn pcr-yesno-no"
                    disabled={!isSocketConnected}
                    onClick={() => handleYesNo('No')}
                  >
                    {t('proposalCreation.no')}
                  </button>
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
