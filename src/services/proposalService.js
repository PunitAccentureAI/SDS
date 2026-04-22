import { apiClient } from "../api";

const proposalDetailsCache = new Map();

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
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object") {
        return (item.name || item.label || item.value || "").toString().trim();
      }
      return "";
    })
    .filter(Boolean);
};

export const validateProposalName = async (proposalName) => {
  const normalizedName = proposalName?.trim();

  if (!normalizedName) {
    throw new Error("proposalName is required");
  }

  if (normalizedName.toLowerCase()) {
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
    const response = await apiClient.get("/industries");
    return normalizeOptionList(response?.data);
  } catch (error) {
    return [];
  }
};

export const getSegmentOptions = async () => {
  try {
    const response = await apiClient.get("/service-segments");
    return normalizeOptionList(response?.data);
  } catch (error) {
    return [];
  }
};

export const createProposal = async (payload = {}) => {
  const response = await apiClient.post("/create-proposal", payload);
  return response?.data ?? {};
};

export const cacheProposalDetails = (sessionId, details = {}) => {
  if (!sessionId) return;
  proposalDetailsCache.set(String(sessionId), {
    ...details,
    sessionId: String(sessionId),
  });
};

export const getProposalDetails = async (sessionId) => {
  if (!sessionId) {
    throw new Error("sessionId is required");
  }

  const cacheKey = String(sessionId);
  const cached = proposalDetailsCache.get(cacheKey);
  if (cached) {
    return { data: cached };
  }

  // Enable this when backend endpoint is ready.
  // const response = await apiClient.get('/get-proposal-details', {
  //   params: { session_id: cacheKey },
  // });
  // return response?.data ?? {};

  return {
    data: {
      session_id: cacheKey,
      name: "Untitled Proposal",
      client_name: "",
      opportunity_id: "",
      industry: "",
      service_segment: [],
      internal_external: "",
      description: "",
      submission_date: "",
      file_name: null,
    },
  };
};
