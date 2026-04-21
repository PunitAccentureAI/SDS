export const quickActions = [
  'Proposal storyboard',
  'Requirements analysis',
  'Differentiation strategy',
  'Proposal Review',
  'Competitive analysis',
];

export const uploadedSupportFiles = [
  { id: 1, name: 'Research file 1.ppt', type: 'PPT' },
];

export const documentTabFiles = [
  { id: 'doc-1', name: 'Wooribank_RFP.pdf', type: 'PDF', source: 'User' },
  { id: 'doc-2', name: 'Research_2026', type: 'DOC', source: 'System' },
  { id: 'doc-3', name: 'Research_2025', type: 'PPT', source: 'User' },
  { id: 'doc-4', name: 'Research_2022', type: 'XLS', source: 'User' },
];

export const proposalOutlineSections = [
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

export const businessRequirements = [
  { id: 'B-01', requirement: 'Automate loan underwriting', objective: 'Reduce processing time by 50%; achieve approval accuracy > 95%' },
  { id: 'B-02', requirement: 'Operate a 24/7 customer-service chatbot', objective: 'Provide uninterrupted support; achieve First-Call-Resolution (FCR) > 80%' },
  { id: 'B-03', requirement: 'Improve marketing targeting', objective: 'Increase personalized product-recommendation rate by 30% through behavioral data analysis' },
  { id: 'B-04', requirement: 'Build a fraud-detection model', objective: 'Detect suspicious transactions with a reduction-rate >= 90% in real time' },
  { id: 'B-05', requirement: 'Enhance internal workflow efficiency', objective: 'Cut employee-task time by 20% via automatic document classification and summarization' },
];

export const functionalRequirements = [
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
