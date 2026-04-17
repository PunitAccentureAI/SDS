import React, { useState } from 'react';
import './ProposalDetailPanel.css';

const TABS = ['AI Chat', 'Details', 'Outline', 'Documents'];

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M11.333 2a1.414 1.414 0 012 2L5 12.333l-2.667.667.667-2.667L11.333 2z"
        stroke="#09121F"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 3.333l2.667 2.667" stroke="#09121F" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DetailItem({ title, value }) {
  return (
    <div className="pdp-list-item">
      <div className="pdp-item-divider" />
      <div className="pdp-item-content">
        <div className="pdp-item-text">
          <span className="pdp-item-title">{title}</span>
          <span className="pdp-item-value">{value}</span>
        </div>
        <button type="button" className="pdp-item-edit" aria-label={`Edit ${title}`}>
          <EditIcon />
        </button>
      </div>
    </div>
  );
}

export default function ProposalDetailPanel({ proposal, onClose, inline }) {
  const [activeTab, setActiveTab] = useState('Details');

  if (!proposal) return null;

  const details = [
    { title: 'Proposal name', value: proposal.name || 'Wooribank Proposal' },
    { title: 'Opportunity ID', value: proposal.opportunityId || '12345678910' },
    { title: 'Industry', value: proposal.industry || 'Finance' },
    { title: 'Service Segment', value: proposal.serviceSegment || 'Cloud Transformation' },
    { title: 'Internal/External', value: proposal.internalExternal || 'Internal' },
    { title: 'Project goal / description', value: proposal.description || 'Requirements analysis for financial services.' },
    { title: 'Submission Date', value: proposal.submissionDate || '17/04/2026' },
  ];

  const panelContent = (
    <div className={`pdp-panel ${inline ? 'pdp-panel-inline' : ''}`} onClick={(e) => e.stopPropagation()}>
      <div className="pdp-header">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`pdp-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="pdp-tab-label">{tab}</span>
            {activeTab === tab && <div className="pdp-tab-underline" />}
          </button>
        ))}
      </div>

      <div className="pdp-body">
        {activeTab === 'Details' && (
          <div className="pdp-details-list">
            {details.map((item) => (
              <DetailItem key={item.title} title={item.title} value={item.value} />
            ))}
          </div>
        )}

        {activeTab === 'AI Chat' && (
          <div className="pdp-placeholder">AI Chat coming soon</div>
        )}

        {activeTab === 'Outline' && (
          <div className="pdp-placeholder">Outline coming soon</div>
        )}

        {activeTab === 'Documents' && (
          <div className="pdp-placeholder">Documents coming soon</div>
        )}
      </div>
    </div>
  );

  if (inline) {
    return panelContent;
  }

  return (
    <div className="pdp-overlay" onClick={onClose}>
      {panelContent}
    </div>
  );
}
