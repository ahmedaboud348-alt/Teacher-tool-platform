export type ExportDirection = "rtl" | "ltr";

export type ExamSheetExportLayout = {
  meta: {
    direction: ExportDirection;
    title: string;
  };
  sections: Array<{
    kind: string;
    data: unknown;
  }>;
};
