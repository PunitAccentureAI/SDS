import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProposalDetailPanel from '../components/ui/ProposalDetailPanel';
import LanguageSwitcher from '../components/ui/LanguageSwitcher';
import './ProposalBuilder.css';

const sampleProposalData = {
  1: {
    id: 1,
    name: 'Wooribank Proposal',
    client: 'Wooribank',
    opportunityId: '12345678910',
    industry: 'Finance',
    serviceSegment: 'Cloud Transformation',
    internalExternal: 'Internal',
    description: 'Requirements analysis for financial services.',
    submissionDate: '17/04/2026',
    docTitle: 'Wooribank Requirements Analysis',
    lastEdited: 'Last edited today',
  },
  2: {
    id: 2,
    name: 'Proposal Name',
    client: 'Client 1',
    opportunityId: '98765432100',
    industry: 'Healthcare',
    serviceSegment: 'Digital Transformation',
    internalExternal: 'External',
    description: 'Digital transformation for healthcare.',
    submissionDate: '20/04/2026',
    docTitle: 'Healthcare Digital Transformation',
    lastEdited: 'Last edited yesterday',
  },
};

const defaultProposal = sampleProposalData[1];

const businessRequirements = [
  { id: 'BR-001', requirement: 'AI/ML-based customer churn prediction', priority: 'High', status: 'Approved' },
  { id: 'BR-002', requirement: 'Cloud infrastructure with scalable compute', priority: 'High', status: 'Approved' },
  { id: 'BR-003', requirement: 'Real-time analytics processing pipeline', priority: 'Medium', status: 'Under Review' },
  { id: 'BR-004', requirement: 'Customer 360 view dashboard', priority: 'High', status: 'Approved' },
  { id: 'BR-005', requirement: 'Daily batch processing for risk model', priority: 'Medium', status: 'Approved' },
];

const functionalSections = [
  {
    title: 'Data Ingestion & Pre-processing',
    content: 'Connect to various sources: real-time transaction logs, customer behavior logs, call-center recordings, etc. Automatic cleansing pipeline for missing or corrupted data.',
  },
  {
    title: 'Model Training & Deployment',
    content: 'Support AutoML (automatic hyper-parameter tuning). Model versioning and A/B-testing environment.',
  },
  {
    title: 'Prediction & Analytics Services',
    content: 'Provide inference via RESTful APIs. Support both real-time streaming predictions and batch predictions.',
  },
  {
    title: 'User Interfaces',
    content: 'Admin console: model performance dashboards, log monitoring, policy configuration, etc. Customer-facing UI: chatbot dialog screen, personalized product-recommendation interface.',
  },
];

const goalsSections = [
  {
    title: 'Brand objective',
    content: 'Being is a natural skincare brand designed for those who already value clean beauty and seek products that meet high standards. With an emphasis on ingredient integrity, Being uses clean, high-quality actives and botanicals chosen for their safety, efficacy, and transparency.',
  },
  {
    title: 'Commercial objective',
    content: 'Accelerate Sales Growth: Achieve 10% market share within 6 months through targeted digital campaigns and promotional strategies. Boost Product Trials: Drive a 15% increase in first-time purchases by highlighting product innovation and user-friendly design.',
  },
  {
    title: 'Marketing objective',
    content: 'Our marketing objective is to strengthen brand loyalty and expand awareness by highlighting our commitment to ingredient integrity, transparent communication, and potent, clean formulations.',
  },
  {
    title: 'Primary KPIs',
    content: 'Market Share: Achieve 10% market share within 6 months. First-Time Purchases: 15% increase in new customer purchases. Retail Expansion: Secure partnerships with at least 5 top-tier beauty retailers or platforms.',
  },
];

const insightsSections = [
  {
    title: 'Target persona / segment name',
    content: 'Conscious Beauty Seekers (Ages 22–35) — Digitally native Millennials and Gen Z consumers who prioritize clean ingredients, ethical sourcing, and minimal, effective skincare.',
  },
  {
    title: 'Demographics',
    content: '18-35 years old, Female dominated, geographically dispersed with key concentrations in Sydney, Melbourne, Brisbane and Perth.',
  },
  {
    title: 'Primary competitors',
    content: 'GlowTheory – Known for tech-driven skincare and clean aesthetic branding. LunaSkin – Strong influencer presence and simplified daily skincare routines. Everyday Dew – Positioned around skin positivity and gentle, inclusive messaging.',
  },
];

export default function ProposalBuilder() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const proposal = sampleProposalData[id] || defaultProposal;

  const handleSaveClose = () => {
    navigate('/testhome');
  };

  return (
    <div className="pb-page">
      <header className="pb-nav">
        <div className="pb-nav-left">
          <span className="pb-nav-title">{t('proposal.proposalCreation')}</span>
          <span className="pb-nav-subtitle">{proposal.client} • {proposal.lastEdited || t('proposal.lastEdited')}</span>
        </div>
        <div className="pb-nav-right">
          <LanguageSwitcher />
          <button
            type="button"
            className="pb-nav-search-btn"
            onClick={() => navigate('/internal-enterprise-search')}
          >
            <span>{t('proposal.enterpriseSearch')}</span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2l1.5 3.5L15 7l-3.5 1.5L10 12l-1.5-3.5L5 7l3.5-1.5L10 2z" fill="#000" />
              <path d="M15 12l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#000" />
              <path d="M4 14l.75 1.5L6 16.25l-1.25.75L4 18.5l-.75-1.5L2 16.25l1.25-.75L4 14z" fill="#000" />
            </svg>
          </button>
          <button type="button" className="pb-nav-close-btn" onClick={handleSaveClose}>
            <span>{t('proposal.saveClose')}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="#5A5D6E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div className="pb-content">
        <div className="pb-sidebar">
          <ProposalDetailPanel proposal={proposal} inline />
        </div>

        <div className="pb-preview">
          <div className="pb-preview-inner">
            <div className="pb-doc">
              <div className="pb-doc-header">
                <h1 className="pb-doc-title">{proposal.docTitle || proposal.name}</h1>
                <div className="pb-doc-divider" />
              </div>

              <div className="pb-doc-sections">
                <section className="pb-section">
                  <h2 className="pb-section-title">Business Requirements</h2>

                  <div className="pb-table">
                    <div className="pb-table-header">
                      <span className="pb-th" style={{ width: '80px' }}>ID</span>
                      <span className="pb-th" style={{ flex: 1 }}>Requirement</span>
                      <span className="pb-th" style={{ width: '80px' }}>Priority</span>
                      <span className="pb-th" style={{ width: '100px' }}>Status</span>
                    </div>
                    {businessRequirements.map((row) => (
                      <div key={row.id} className="pb-table-row">
                        <span className="pb-td" style={{ width: '80px' }}>{row.id}</span>
                        <span className="pb-td" style={{ flex: 1 }}>{row.requirement}</span>
                        <span className="pb-td" style={{ width: '80px' }}>{row.priority}</span>
                        <span className="pb-td" style={{ width: '100px' }}>{row.status}</span>
                      </div>
                    ))}
                  </div>

                  <h3 className="pb-subsection-title">Functional Requirements</h3>
                  {functionalSections.map((s) => (
                    <div key={s.title} className="pb-text-block">
                      <h4 className="pb-text-heading">{s.title}</h4>
                      <p className="pb-text-body">{s.content}</p>
                    </div>
                  ))}
                </section>

                <section className="pb-section">
                  <h2 className="pb-section-title">Goals & Performance Tracking</h2>
                  {goalsSections.map((s) => (
                    <div key={s.title} className="pb-text-block">
                      <h4 className="pb-text-heading">{s.title}</h4>
                      <p className="pb-text-body">{s.content}</p>
                    </div>
                  ))}
                </section>

                <section className="pb-section">
                  <h2 className="pb-section-title">Insights & Targeting</h2>
                  {insightsSections.map((s) => (
                    <div key={s.title} className="pb-text-block">
                      <h4 className="pb-text-heading">{s.title}</h4>
                      <p className="pb-text-body">{s.content}</p>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>

          <div className="pb-scrollbar-track">
            <div className="pb-scrollbar-thumb" />
          </div>
        </div>
      </div>

      <button type="button" className="pb-setup-btn">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <path d="M10 13a3 3 0 100-6 3 3 0 000 6z" stroke="#fff" strokeWidth="1.5" />
          <path d="M17.4 12.3a1.5 1.5 0 00.3-1.65l-.6-1.3a1.5 1.5 0 00-1.4-.85h-.3a7 7 0 00-.6-.6v-.3a1.5 1.5 0 00-.85-1.4l-1.3-.6a1.5 1.5 0 00-1.65.3l-.2.2a7 7 0 00-.8 0l-.2-.2a1.5 1.5 0 00-1.65-.3l-1.3.6a1.5 1.5 0 00-.85 1.4v.3a7 7 0 00-.6.6h-.3a1.5 1.5 0 00-1.4.85l-.6 1.3a1.5 1.5 0 00.3 1.65l.2.2a7 7 0 000 .8l-.2.2a1.5 1.5 0 00-.3 1.65l.6 1.3a1.5 1.5 0 001.4.85h.3a7 7 0 00.6.6v.3a1.5 1.5 0 00.85 1.4l1.3.6a1.5 1.5 0 001.65-.3l.2-.2a7 7 0 00.8 0l.2.2a1.5 1.5 0 001.65.3l1.3-.6a1.5 1.5 0 00.85-1.4v-.3a7 7 0 00.6-.6h.3a1.5 1.5 0 001.4-.85l.6-1.3a1.5 1.5 0 00-.3-1.65l-.2-.2a7 7 0 000-.8l.2-.2z" stroke="#fff" strokeWidth="1.5" />
        </svg>
        <span>{t('proposal.setup')}</span>
      </button>
    </div>
  );
}
