import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./CreateProposalDrawer.css";
import DatePicker from "./DatePicker";
import { uploadFile } from "../../services/fileService";
import { getStoredUser } from "../../services/authService";
import {
  createProposal,
  cacheProposalDetails,
  validateProposalName,
  getIndustryOptions,
  getSegmentOptions,
} from "../../services/proposalService";

const fallbackIndustryOptions = [
  "The Public",
  "National Defence",
  "Finance",
  "Manufacturing",
  "Service",
  "Medical Care",
  "Logistics",
];
const fallbackSegmentOptions = [
  "Cloud Transformation",
  "AI Contact Center",
  "SaaS Transformation",
  "Security",
  "App ITO",
  "Consulting",
  "ERP",
  "Standard Cloud",
  "Gen AI Transformation",
  "PUM",
  "Cloud App ITO",
  "Telecom MW",
  "CRM",
  "Finance Service System",
  "Portal",
  "Dedicated Cloud",
  "Data Center",
  "EPSS",
  "RPA",
];
const typeOptions = ["Internal", "External"];

function CustomSelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  errorMessage,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const getOptionKey = (option) =>
    typeof option === "string" ? option : option?.key;
  const getOptionLabel = (option) =>
    typeof option === "string" ? option : (option?.label ?? option?.key);
  const selectedOptionLabel = options.find(
    (option) => getOptionKey(option) === value,
  );

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="cpd-field" ref={ref}>
      <label className="cpd-label">{label}</label>
      <div className="cpd-custom-select-wrapper">
        <button
          type="button"
          className={`cpd-custom-select-trigger ${open ? "open" : ""}${error ? " cpd-input-error" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span
            className={value ? "cpd-select-value" : "cpd-select-placeholder"}
          >
            {selectedOptionLabel
              ? getOptionLabel(selectedOptionLabel)
              : placeholder}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`cpd-select-chevron ${open ? "flipped" : ""}`}
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="#1d1d1f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <div className="cpd-custom-dropdown">
            {options.map((opt, i) => {
              const optionKey = getOptionKey(opt);
              const optionLabel = getOptionLabel(opt);

              return (
                <button
                  key={optionKey}
                  type="button"
                  className={`cpd-custom-dropdown-item ${value === optionKey ? "selected" : ""}`}
                  onClick={() => {
                    onChange(optionKey);
                    setOpen(false);
                  }}
                >
                  {i > 0 && <div className="cpd-dropdown-divider" />}
                  <span>{optionLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {error && (
        <div className="cpd-field-error" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  error,
  errorMessage,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const toggleOption = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const removeChip = (opt, e) => {
    e.stopPropagation();
    onChange(selected.filter((s) => s !== opt));
  };

  return (
    <div className="cpd-field" ref={ref}>
      <label className="cpd-label">{label}</label>
      <div className="cpd-custom-select-wrapper">
        <button
          type="button"
          className={`cpd-multi-trigger ${open ? "open" : ""} ${selected.length > 0 ? "has-chips" : ""}${error ? " cpd-input-error" : ""}`}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          {selected.length > 0 ? (
            <div className="cpd-chips-area">
              {selected.map((item) => (
                <span key={item} className="cpd-chip">
                  <span className="cpd-chip-text">{item}</span>
                  <button
                    type="button"
                    className="cpd-chip-remove"
                    onClick={(e) => removeChip(item, e)}
                    aria-label={`Remove ${item}`}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" fill="#9FA8B8" />
                      <path
                        d="M7 7l6 6M13 7l-6 6"
                        stroke="#fff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span className="cpd-select-placeholder">{placeholder}</span>
          )}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`cpd-select-chevron ${open ? "flipped" : ""}`}
          >
            <path
              d="M7 10l5 5 5-5"
              stroke="#1d1d1f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && (
          <div className="cpd-custom-dropdown cpd-multi-dropdown" role="listbox" aria-label={label}>
            {options.map((opt) => (
              <label key={opt} className="cpd-multi-item">
                <input
                  type="checkbox"
                  className="cpd-checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggleOption(opt)}
                />
                <span
                  className={`cpd-checkbox-custom ${selected.includes(opt) ? "checked" : ""}`}
                >
                  {selected.includes(opt) && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className="cpd-multi-label">{opt}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="cpd-field-error" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

function FileChip({ name, size, onRemove }) {
  return (
    <div className="cpd-file-chip">
      <div className="cpd-file-icon">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect
            x="3"
            y="1"
            width="14"
            height="18"
            rx="2"
            fill="#fff"
            stroke="#ddd"
            strokeWidth="1"
          />
          <text
            x="10"
            y="14"
            textAnchor="middle"
            fill="#e53935"
            fontSize="6"
            fontWeight="700"
          >
            PDF
          </text>
        </svg>
      </div>
      <div className="cpd-file-info">
        <span className="cpd-file-name">{name}</span>
        <span className="cpd-file-meta">{size} | Uploaded</span>
      </div>
      <button
        type="button"
        className="cpd-file-remove"
        onClick={onRemove}
        aria-label="Remove file"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M6 6l8 8M14 6l-8 8"
            stroke="#1d1d1f"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default function CreateProposalDrawer({ show, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileTypeOptions = [
    { key: "rfp", label: t("createProposal.fileTypeOptions.rfp") },
    {
      key: "requirementAnalysis",
      label: t("createProposal.fileTypeOptions.requirementAnalysis"),
    },
    {
      key: "competitiveAnalysis",
      label: t("createProposal.fileTypeOptions.competitiveAnalysis"),
    },
  ];
  const [formData, setFormData] = useState({
    proposalName: "",
    opportunityId: "",
    clientName: "",
    fileType: "",
    industry: "",
    serviceSegment: [],
    internalExternal: "",
    projectGoal: "",
    submissionDate: null,
  });
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [createProposalError, setCreateProposalError] = useState("");
  const [proposalNameError, setProposalNameError] = useState("");
  const [proposalNameChecking, setProposalNameChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState("idle");
  const [formErrors, setFormErrors] = useState({});
  const [industryOptions, setIndustryOptions] = useState(
    fallbackIndustryOptions,
  );
  const [segmentOptions, setSegmentOptions] = useState(fallbackSegmentOptions);
  const fileInputRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const requiredFieldMessage = t("createProposal.requiredField");

  useEffect(() => {
    let isMounted = true;

    const loadFormOptions = async () => {
      const [industryFromApi, segmentFromApi] = await Promise.all([
        getIndustryOptions(),
        getSegmentOptions(),
      ]);

      if (!isMounted) return;

      if (industryFromApi.length > 0) {
        setIndustryOptions(industryFromApi);
      } else {
        setIndustryOptions(fallbackIndustryOptions);
      }

      if (segmentFromApi.length > 0) {
        setSegmentOptions(segmentFromApi);
      } else {
        setSegmentOptions(fallbackSegmentOptions);
      }
    };

    loadFormOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!show) return;
    closeButtonRef.current?.focus();
  }, [show]);

  const clearFieldError = (field) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (field) => (e) => {
    if (field === "proposalName" && proposalNameError) {
      setProposalNameError("");
    }
    clearFieldError(field);
    const nextValue =
      field === "opportunityId"
        ? e.target.value.replace(/\D/g, "")
        : e.target.value;
    setFormData({ ...formData, [field]: nextValue });
  };

  const handleSelectChange = (field) => (val) => {
    clearFieldError(field);
    setFormData({ ...formData, [field]: val });
  };

  const normalizeUploadedFile = (file) => {
    setUploadedFile(null);

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

    return {
      id: `selected-${Date.now()}`,
      name: file.name,
      size: `${sizeMB} MB`,
      raw: file,
    };
  };

  const processFile = (file) => {
    if (!file) return;

    setCreateProposalError("");
    setUploadError("");
    clearFieldError("file");
    setUploadedFile(normalizeUploadedFile(file));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const { files } = e.dataTransfer;
    if (!files?.length) return;
    if (files.length > 1)
      return setUploadError(t("createProposal.singleFileOnly"));
    processFile(files[0]);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }

    e.target.value = "";
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadError("");
  };

  const dismissCreateProposalError = () => {
    setCreateProposalError("");
  };

  const validateRequiredFields = () => {
    const nextErrors = {};

    if (!uploadedFile) nextErrors.file = requiredFieldMessage;
    if (!formData.proposalName.trim())
      nextErrors.proposalName = requiredFieldMessage;
    if (!formData.opportunityId.trim())
      nextErrors.opportunityId = requiredFieldMessage;
    if (!formData.clientName.trim())
      nextErrors.clientName = requiredFieldMessage;
    if (!formData.fileType) nextErrors.fileType = requiredFieldMessage;
    if (!formData.industry) nextErrors.industry = requiredFieldMessage;
    if (!formData.serviceSegment.length)
      nextErrors.serviceSegment = requiredFieldMessage;
    if (!formData.internalExternal)
      nextErrors.internalExternal = requiredFieldMessage;
    if (!formData.projectGoal.trim())
      nextErrors.projectGoal = requiredFieldMessage;
    if (!formData.submissionDate)
      nextErrors.submissionDate = requiredFieldMessage;

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isProposalNameValid = (payload) => {
    if (typeof payload === "boolean") return payload;
    if (!payload || typeof payload !== "object") return true;

    if (typeof payload.valid === "boolean") return payload.valid;
    if (typeof payload.isValid === "boolean") return payload.isValid;
    if (typeof payload.available === "boolean") return payload.available;
    if (typeof payload.status === "boolean") return payload.status;
    if (typeof payload.success === "boolean") return payload.success;
    if (typeof payload.message === "string") {
      return !payload.message.toLowerCase().includes("exist");
    }

    return true;
  };

  const handleProposalNameBlur = async () => {
    const proposalName = formData.proposalName.trim();

    if (!proposalName) {
      setProposalNameError("");
      return;
    }

    setProposalNameChecking(true);

    try {
      const result = await validateProposalName(proposalName);

      if (!isProposalNameValid(result)) {
        setProposalNameError(t("createProposal.proposalNameExists"));
      } else {
        setProposalNameError("");
      }
    } catch (error) {
      setProposalNameError(
        error?.message || "Unable to validate proposal name.",
      );
    } finally {
      setProposalNameChecking(false);
    }
  };

  const parseSessionId = (payload) =>
    payload?.session_id ||
    payload?.data?.sessionId ||
    payload?.id ||
    payload?.data?.id ||
    payload?.proposalSessionId ||
    payload?.data?.proposalSessionId ||
    null;

  const getUserId = () => {
    const user = getStoredUser();
    return String(user?.user_id ?? user?.id ?? user?._id ?? "0");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateRequiredFields();

    if (!isFormValid) {
      return;
    }

    if (proposalNameError || proposalNameChecking) {
      return;
    }
    setCreateProposalError("");
    setIsSubmitting(true);
    setSubmitPhase("creating");

    const dateStr = formData.submissionDate
      ? `${String(formData.submissionDate.getMonth() + 1).padStart(2, "0")},${String(formData.submissionDate.getDate()).padStart(2, "0")},${formData.submissionDate.getFullYear()}`
      : "";

    const userId = getUserId();

    const createPayload = {
      user_id: userId,
      name: formData.proposalName,
      client_name: formData.clientName,
      opportunity_id: formData.opportunityId,
      industry: formData.industry,
      service_segment: formData.serviceSegment,
      internal_external: formData.internalExternal,
      description: formData.projectGoal,
      submission_date: dateStr,
    };

    try {
      const createResponse = await createProposal(createPayload);
      const sessionId = parseSessionId(createResponse);
      if (!sessionId) {
        throw new Error("Session ID was not returned from create-proposal.");
      }

      const fileForUpload = uploadedFile?.raw || null;
      if (!fileForUpload) {
        throw new Error("File is required.");
      }

      setSubmitPhase("uploading");
      const uploadResponse = await uploadFile(fileForUpload, {
        user_id: userId,
        client_name: formData.clientName,
        file_type: formData.fileType,
        session_id: sessionId,
      });

      const fileId =
        uploadResponse?.fileId ??
        uploadResponse?.id ??
        uploadResponse?.data?.fileId ??
        null;

      const proposalState = {
        proposalName: formData.proposalName,
        opportunityId: formData.opportunityId,
        clientName: formData.clientName,
        fileType: formData.fileType,
        industry: formData.industry,
        serviceSegment: formData.serviceSegment,
        internalExternal: formData.internalExternal,
        projectGoal: formData.projectGoal,
        submissionDate: dateStr,
        sessionId,
        fileName: uploadedFile?.name || null,
        fileId,
        uploadedFile: null,
      };

      cacheProposalDetails(sessionId, proposalState);

      navigate(`/proposal/new/${encodeURIComponent(sessionId)}`, {
        state: proposalState,
      });
      onClose();
    } catch (error) {
      setCreateProposalError(error?.message || "Failed to create proposal.");
    } finally {
      setSubmitPhase("idle");
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="cpd-overlay" onKeyDown={(e) => (e.key === "Escape" ? onClose() : null)}>
      <div className="cpd-drawer" role="dialog" aria-modal="true" aria-labelledby="cpd-title">
        <div className="cpd-topbar">
          <span id="cpd-title" className="cpd-topbar-title">{t("createProposal.title")}</span>
          <button
            ref={closeButtonRef}
            className="cpd-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="#1d1d1f"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        {createProposalError && (
          <div className="cpd-error-popup" role="alert" aria-live="assertive">
            <div className="cpd-error-popup-text">{createProposalError}</div>
            <button
              type="button"
              className="cpd-error-popup-close"
              onClick={dismissCreateProposalError}
              aria-label="Dismiss error"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="#8F8F8F"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        <div className="cpd-content">
          <form onSubmit={handleSubmit}>
            <h2 className="cpd-heading">{t("createProposal.heading")}</h2>
            <p className="cpd-subtext">{t("createProposal.subtext")}</p>

            {/* Upload area */}
            <div
              className={`cpd-upload-area ${dragOver ? "drag-over" : ""}${formErrors.file ? " cpd-upload-area-error" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
            >
              <>
                <div className="cpd-upload-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 16V4m0 0l-4 4m4-4l4 4"
                      stroke="#09121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                      stroke="#09121F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="cpd-upload-title">
                  {t("createProposal.uploadLabel")}
                </p>
                <p className="cpd-upload-hint">
                  {t("createProposal.uploadOr")}
                </p>
                <button
                  type="button"
                  className="cpd-browse-btn"
                  disabled={isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {t("createProposal.browseFiles")}
                </button>
              </>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                multiple={false}
                onChange={handleFileSelect}
                hidden
              />
            </div>

            {uploadError && (
              <div className="cpd-upload-error" role="alert">
                {uploadError}
              </div>
            )}
            {!uploadError && formErrors.file && (
              <div className="cpd-field-error" role="alert">
                {formErrors.file}
              </div>
            )}
            {/* File chip */}
            {uploadedFile && (
              <FileChip
                name={uploadedFile.name}
                size={uploadedFile.size}
                onRemove={handleRemoveFile}
              />
            )}

            <h2 className="cpd-section-heading">
              {t("createProposal.addDetails")}
            </h2>

            <div className="cpd-field">
              <label className="cpd-label">
                {t("createProposal.proposalName")}
              </label>
              <input
                type="text"
                className={`cpd-input${proposalNameError || formErrors.proposalName ? " cpd-input-error" : ""}`}
                placeholder={t("createProposal.proposalNamePlaceholder")}
                value={formData.proposalName}
                onChange={handleChange("proposalName")}
                onBlur={handleProposalNameBlur}
              />
              {(proposalNameError || formErrors.proposalName) && (
                <div className="cpd-field-error" role="alert">
                  {proposalNameError || formErrors.proposalName}
                </div>
              )}
            </div>

            <div className="cpd-field">
              <label className="cpd-label">
                {t("createProposal.opportunityId")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                className={`cpd-input${formErrors.opportunityId ? " cpd-input-error" : ""}`}
                placeholder={t("createProposal.opportunityIdPlaceholder")}
                value={formData.opportunityId}
                onChange={handleChange("opportunityId")}
              />
              {formErrors.opportunityId && (
                <div className="cpd-field-error" role="alert">
                  {formErrors.opportunityId}
                </div>
              )}
            </div>

            <div className="cpd-field">
              <label className="cpd-label">
                {t("createProposal.clientName")}
              </label>
              <input
                type="text"
                className={`cpd-input${formErrors.clientName ? " cpd-input-error" : ""}`}
                placeholder={t("createProposal.clientNamePlaceholder")}
                value={formData.clientName}
                onChange={handleChange("clientName")}
              />
              {formErrors.clientName && (
                <div className="cpd-field-error" role="alert">
                  {formErrors.clientName}
                </div>
              )}
            </div>

            <CustomSelect
              label={t("createProposal.fileType")}
              options={fileTypeOptions}
              value={formData.fileType}
              onChange={handleSelectChange("fileType")}
              placeholder={t("createProposal.fileTypePlaceholder")}
              error={Boolean(formErrors.fileType)}
              errorMessage={formErrors.fileType}
            />

            <CustomSelect
              label={t("createProposal.industry")}
              options={industryOptions}
              value={formData.industry}
              onChange={handleSelectChange("industry")}
              placeholder={t("createProposal.industryPlaceholder")}
              error={Boolean(formErrors.industry)}
              errorMessage={formErrors.industry}
            />

            <MultiSelect
              label={t("createProposal.service")}
              options={segmentOptions}
              selected={formData.serviceSegment}
              onChange={(val) => {
                clearFieldError("serviceSegment");
                setFormData({ ...formData, serviceSegment: val });
              }}
              placeholder={t("createProposal.servicePlaceholder")}
              error={Boolean(formErrors.serviceSegment)}
              errorMessage={formErrors.serviceSegment}
            />

            <CustomSelect
              label={t("createProposal.internalExternal")}
              options={typeOptions}
              value={formData.internalExternal}
              onChange={handleSelectChange("internalExternal")}
              placeholder={t("createProposal.internalExternalPlaceholder")}
              error={Boolean(formErrors.internalExternal)}
              errorMessage={formErrors.internalExternal}
            />

            <div className="cpd-field">
              <label className="cpd-label">
                {t("createProposal.projectGoal")}
              </label>
              <textarea
                className={`cpd-textarea${formErrors.projectGoal ? " cpd-input-error" : ""}`}
                placeholder={t("createProposal.projectGoalPlaceholder")}
                rows={4}
                value={formData.projectGoal}
                onChange={handleChange("projectGoal")}
              />
              {formErrors.projectGoal && (
                <div className="cpd-field-error" role="alert">
                  {formErrors.projectGoal}
                </div>
              )}
            </div>

            <div className="cpd-field cpd-field-date">
              <label className="cpd-label">
                {t("createProposal.submissionDate")}
              </label>
              <div
                className={formErrors.submissionDate ? "cpd-date-error" : ""}
              >
                <DatePicker
                  value={formData.submissionDate}
                  onlyToday
                  onChange={(date) => {
                    clearFieldError("submissionDate");
                    setFormData({ ...formData, submissionDate: date });
                  }}
                />
              </div>
              {formErrors.submissionDate && (
                <div className="cpd-field-error" role="alert">
                  {formErrors.submissionDate}
                </div>
              )}
            </div>

            <div className="cpd-footer">
              <button
                type="submit"
                className="cpd-submit-btn"
                disabled={isSubmitting || proposalNameChecking}
              >
                {submitPhase === "uploading"
                  ? t("createProposal.uploading")
                  : submitPhase === "creating"
                    ? t("createProposal.creatingProposal")
                    : t("createProposal.createBtn")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
