import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Testing.css';

const SAMPLE_PDF_URL = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

function detectTypeFromUrl(url) {
  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.pdf')) return 'pdf';
  if (cleanUrl.endsWith('.ppt') || cleanUrl.endsWith('.pptx')) return 'ppt';
  return 'unknown';
}

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function Testing() {
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [embeddedBlobUrl, setEmbeddedBlobUrl] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [error, setError] = useState('');

  const detectedType = useMemo(() => detectTypeFromUrl(previewUrl), [previewUrl]);

  const officeViewerUrl = useMemo(() => {
    if (!previewUrl) return '';
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`;
  }, [previewUrl]);

  const googleViewerUrl = useMemo(() => {
    if (!previewUrl) return '';
    return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(previewUrl)}`;
  }, [previewUrl]);

  const handlePreview = () => {
    const nextUrl = urlInput.trim();
    if (!nextUrl) {
      setError('Please enter a file URL.');
      return;
    }
    if (!isValidHttpUrl(nextUrl)) {
      setError('Please enter a valid http(s) URL.');
      return;
    }
    setError('');
    setPreviewUrl(nextUrl);
    setEmbeddedBlobUrl('');
  };

  const handleOpenEmbeddedViewer = () => {
    if (!previewUrl) return;
    if (detectedType === 'pdf') {
      window.open(googleViewerUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (detectedType === 'ppt') {
      window.open(officeViewerUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setError('Unsupported file type. Use a direct URL ending with .pdf, .ppt, or .pptx');
  };

  const handlePreviewInPage = async () => {
    if (!previewUrl) return;
    if (detectedType !== 'pdf') {
      setError('Same-window preview is available for PDF. PPT/PPTX needs backend conversion/proxy for in-page rendering.');
      return;
    }

    setIsLoadingPreview(true);
    setError('');
    try {
      const response = await fetch(previewUrl);
      if (!response.ok) {
        throw new Error(`Unable to fetch file (${response.status})`);
      }
      const blob = await response.blob();
      if (embeddedBlobUrl) {
        URL.revokeObjectURL(embeddedBlobUrl);
      }
      const objectUrl = URL.createObjectURL(blob);
      setEmbeddedBlobUrl(objectUrl);
    } catch (e) {
      setEmbeddedBlobUrl('');
      setError(e?.message || 'Could not load file in-page. This URL may block cross-origin fetch.');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  return (
    <div className="testing-page">
      <header className="testing-header">
        <button type="button" className="testing-back" onClick={() => navigate(-1)}>
          Back
        </button>
        <h1>Live Document Preview</h1>
      </header>

      <section className="testing-controls">
        <label htmlFor="docUrl">PDF/PPT Live URL</label>
        <div className="testing-input-row">
          <input
            id="docUrl"
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/file.pdf or .pptx"
          />
          <button type="button" onClick={handlePreview}>Preview</button>
        </div>
        <p className="testing-hint">
          In-page preview uses browser fetch + blob URL (PDF only) and requires CORS permission on the file URL.
        </p>
        <button
          type="button"
          className="testing-sample"
          onClick={() => {
            setUrlInput(SAMPLE_PDF_URL);
            setPreviewUrl(SAMPLE_PDF_URL);
            setError('');
          }}
        >
          Use sample PDF URL
        </button>
        {previewUrl && (
          <div className="testing-actions">
            <button
              type="button"
              className="testing-open"
              onClick={handlePreviewInPage}
              disabled={isLoadingPreview}
            >
              {isLoadingPreview ? 'Loading preview...' : 'Preview in same window'}
            </button>
            <button type="button" className="testing-open" onClick={handleOpenEmbeddedViewer}>
              Open viewer in new tab
            </button>
            <button
              type="button"
              className="testing-open"
              onClick={() => window.open(previewUrl, '_blank', 'noopener,noreferrer')}
            >
              Open original URL in new tab
            </button>
          </div>
        )}
        {error && <p className="testing-error">{error}</p>}
      </section>

      <section className="testing-preview">
        {!previewUrl ? (
          <div className="testing-empty">Enter a live URL and click Preview.</div>
        ) : embeddedBlobUrl ? (
          <iframe title="In-page PDF Preview" src={embeddedBlobUrl} className="testing-frame" />
        ) : detectedType === 'pdf' || detectedType === 'ppt' ? (
          <div className="testing-empty">
            Ready to preview.
            {detectedType === 'pdf'
              ? ' Click "Preview in same window".'
              : ' PPT/PPTX in-page preview needs backend conversion/proxy; use viewer/new-tab options.'}
          </div>
        ) : (
          <div className="testing-empty">
            Unsupported file type. Use a direct URL ending with `.pdf`, `.ppt`, or `.pptx`.
          </div>
        )}
      </section>
    </div>
  );
}
