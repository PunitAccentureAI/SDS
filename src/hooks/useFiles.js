import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchFiles, fetchFileById, uploadFile } from '../services/fileService';

export const fileQueryKeys = {
  all: ['files'],
  list: (params = {}) => ['files', 'list', params],
  detail: (fileId) => ['files', 'detail', fileId],
};

export const useFilesQuery = (params = {}, options = {}) =>
  useQuery({
    queryKey: fileQueryKeys.list(params),
    queryFn: () => fetchFiles(params),
    ...options,
  });

export const useFileQuery = (fileId, options = {}) =>
  useQuery({
    queryKey: fileQueryKeys.detail(fileId),
    queryFn: () => fetchFileById(fileId),
    enabled: Boolean(fileId) && (options.enabled ?? true),
    ...options,
  });

export const useUploadFileMutation = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, extraFields, isTest } = {}) => uploadFile(file, extraFields, isTest),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: fileQueryKeys.all });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};
