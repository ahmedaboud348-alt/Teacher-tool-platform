import type { ExamSheetExportLayout } from "./types";

export function buildExamSheetExportLayout(model: {
  meta: { title: string; direction: "rtl" | "ltr" };
}): ExamSheetExportLayout {
  return {
    meta: {
      direction: model.meta.direction,
      title: model.meta.title
    },
    sections: []
  };
}
