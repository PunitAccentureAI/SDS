import { apiClient } from '../api';

export const fetchFiles = async (params = {}) => {
  const response = await apiClient.get('/file', { params });
  return response.data;
};

export const uploadFile = async (file, extraFields = {}, isTest = false) => {
  if (!file) {
    throw new Error('file is required');
  }

  if (isTest) {
    return {
      status: true,
      fileId: `test-file-${Date.now()}`,
      fileName: file.name,
      isTest: true,
    };
  }

  const formData = new FormData();
  formData.append('file', file);

  Object.entries(extraFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await apiClient.post('/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const fetchFileById = async (fileId, config = {}) => {
  if (!fileId) {
    throw new Error('fileId is required');
  }

  const response = await apiClient.get(`/file/${fileId}`, config);
  return response.data;
};
