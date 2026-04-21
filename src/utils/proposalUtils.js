export function inferDocType(name = '', explicitType) {
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
