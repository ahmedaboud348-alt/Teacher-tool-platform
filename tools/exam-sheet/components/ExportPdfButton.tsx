"use client";

import type { CSSProperties } from "react";
import { useExamSheetPdfExport } from "../hooks/useExamSheetPdfExport";
import { ExamSheetDocumentModel } from "../types/exam-sheet-document";

type Props = {
  documentModel: ExamSheetDocumentModel | null;
};

/**
 * Drop-in export button. Place this inside DraftActionsBar or anywhere
 * you have access to documentModel.
 *
 * @example
 * <ExportPdfButton documentModel={documentModel} />
 */
export function ExportPdfButton({ documentModel }: Props) {
  const { exportPdf, exportState, resetError } =
    useExamSheetPdfExport(documentModel);

  const isGenerating = exportState.status === "generating";
  const hasError = exportState.status === "error";
  const isDisabled = !documentModel || isGenerating;

  return (
    <div style={wrapStyle}>
      <button
        type="button"
        onClick={exportPdf}
        disabled={isDisabled}
        style={{
          ...btnStyle,
          ...(isDisabled ? btnDisabledStyle : {}),
        }}
      >
        {isGenerating ? (
          <>
            <SpinnerIcon />
            جارٍ التصدير...
          </>
        ) : (
          <>
            <PdfIcon />
            تصدير PDF
          </>
        )}
      </button>

      {hasError && exportState.status === "error" && (
        <div style={errorStyle}>
          <span style={errorTextStyle}>{exportState.message}</span>
          <button type="button" onClick={resetError} style={errorDismissStyle}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function PdfIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 8,
};

const btnStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  minHeight: 42,
  padding: "10px 16px",
  borderRadius: 12,
  border: "1px solid #1D3FAE",
  backgroundColor: "#1D3FAE",
  color: "#FFFFFF",
  fontFamily: "inherit",
  fontWeight: 800,
  fontSize: 13,
  cursor: "pointer",
  transition: "all 160ms ease",
  boxShadow: "0 10px 22px rgba(29, 63, 174, 0.18)",
  direction: "rtl",
};

const btnDisabledStyle: CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
  boxShadow: "none",
};

const errorStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 10px",
  borderRadius: 10,
  backgroundColor: "#FFF3F3",
  border: "1px solid #B91C1C",
  direction: "rtl",
};

const errorTextStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#B91C1C",
};

const errorDismissStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "#B91C1C",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 800,
  padding: "0 2px",
};
