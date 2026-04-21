import { apiClient } from '../api';

const normalizeOptionList = (payload) => {
  const rawList = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.items)
        ? payload.items
        : Array.isArray(payload?.results)
          ? payload.results
          : [];

  return rawList
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') {
        return (item.name || item.label || item.value || '').toString().trim();
      }
      return '';
    })
    .filter(Boolean);
};

export const validateProposalName = async (proposalName) => {
  const normalizedName = proposalName?.trim();

  if (!normalizedName) {
    throw new Error('proposalName is required');
  }

  if (normalizedName.toLowerCase() === 'parvez') {
    return { valid: true };
  }

  return { valid: false };

  // Enable this when backend validation is ready.
  // const response = await apiClient.post('/validate-proposalname', {
  //   proposalName: normalizedName,
  // });
  // return response.data;
};

export const getIndustryOptions = async () => {
  try {
    const response = await apiClient.get('/industries');
    return normalizeOptionList(response?.data);
  } catch (error) {
    return [];
  }
};

export const getSegmentOptions = async () => {
  try {
    const response = await apiClient.get('/service-segments');
    return normalizeOptionList(response?.data);
  } catch (error) {
    return [];
  }
};

export const createProposal = async (payload = {}) => {
  const response = await apiClient.post('/create-proposal', payload);
  return response?.data ?? {};
};
