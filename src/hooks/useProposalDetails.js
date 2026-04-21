import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProposalDetails } from '../services/proposalService';

const defaultDetails = {
  proposalName: 'Untitled Proposal',
  clientName: '',
  opportunityId: '',
  fileType: '',
  industry: '',
  serviceSegment: [],
  internalExternal: '',
  projectGoal: '',
  submissionDate: '',
  fileName: null,
  fileId: null,
  sessionId: '',
  enterpriseReference: null,
};

const mapProposalDetails = (details = {}, formData = {}, sessionId = '') => ({
  proposalName: details.proposalName ?? details.name ?? formData.proposalName ?? defaultDetails.proposalName,
  clientName: details.clientName ?? details.client_name ?? formData.clientName ?? defaultDetails.clientName,
  opportunityId: details.opportunityId ?? details.opportunity_id ?? formData.opportunityId ?? defaultDetails.opportunityId,
  fileType: details.fileType ?? details.file_type ?? details.file_tyope ?? formData.fileType ?? defaultDetails.fileType,
  industry: details.industry ?? formData.industry ?? defaultDetails.industry,
  serviceSegment: details.serviceSegment ?? details.service_segment ?? formData.serviceSegment ?? defaultDetails.serviceSegment,
  internalExternal: details.internalExternal ?? details.internal_external ?? formData.internalExternal ?? defaultDetails.internalExternal,
  projectGoal: details.projectGoal ?? details.description ?? formData.projectGoal ?? defaultDetails.projectGoal,
  submissionDate: details.submissionDate ?? details.submission_date ?? formData.submissionDate ?? defaultDetails.submissionDate,
  fileName: details.fileName ?? details.file_name ?? formData.fileName ?? defaultDetails.fileName,
  fileId: details.fileId ?? details.file_id ?? formData.fileId ?? defaultDetails.fileId,
  sessionId: sessionId || formData.sessionId || defaultDetails.sessionId,
  enterpriseReference: formData.enterpriseReference ?? defaultDetails.enterpriseReference,
});

export const useProposalDetails = ({ sessionId, formData }) => {
  const query = useQuery({
    queryKey: ['proposal', 'details', sessionId],
    queryFn: async () => {
      const result = await getProposalDetails(sessionId);
      return result?.data ?? result ?? {};
    },
    enabled: Boolean(sessionId),
  });

  const proposalContext = useMemo(() => {
    if (!sessionId) {
      return mapProposalDetails({}, formData, sessionId);
    }

    if (query.data) {
      return mapProposalDetails(query.data, formData, sessionId);
    }

    return mapProposalDetails({}, formData, sessionId);
  }, [formData, query.data, sessionId]);

  return {
    proposalContext,
    isProposalDetailsLoading: Boolean(sessionId) ? query.isLoading : false,
    proposalDetailsError: query.error || null,
  };
};
