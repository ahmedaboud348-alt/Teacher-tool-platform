"use client";

import { useCallback, useState } from "react";
import { renderExamSheetPdf } from "../../../lib/exporters/exam-sheet/pdf/render-exam-sheet-pdf";
import { ExamSheetDocumentModel } from "../types/exam-sheet-document";

type ExportState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "error"; message: string };

export function useExamSheetPdfExport(
  documentModel: ExamSheetDocumentModel | null
) {
  const [exportState, setExportState] = useState<ExportState>({
    status: "idle",
  });

  const exportPdf = useCallback(async () => {
    if (!documentModel) return;
    if (exportState.status === "generating") return;

    setExportState({ status: "generating" });

    try {
      const blob = await renderExamSheetPdf(documentModel);

      const title    = documentModel.meta.title?.trim() || "جذاذة-الفرض";
      const level    = documentModel.meta.levelLabel?.trim() || "";
      const term     = documentModel.meta.term === "second" ? "الدورة-الثانية" : "الدورة-الأولى";
      const filename = [title, level, term].filter(Boolean).join("-") + ".pdf";

      const url    = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href     = url;
      anchor.download = filename;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 5000);

      setExportState({ status: "idle" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء التصدير.";
      setExportState({ status: "error", message });
    }
  }, [documentModel, exportState.status]);

  const resetError = useCallback(() => {
    setExportState({ status: "idle" });
  }, []);

  return { exportPdf, exportState, resetError };
}