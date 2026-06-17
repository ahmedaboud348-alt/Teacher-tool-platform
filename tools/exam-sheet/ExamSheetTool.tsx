"use client";

import type { ExamTrack } from "./types/exam-sheet-draft";
import { useExamSheetDraft } from "./hooks/useExamSheetDraft";
import { useExamSheetCalculation } from "./hooks/useExamSheetCalculation";
import { useExamSheetDocument } from "./hooks/useExamSheetDocument";
import { ExamSheetWorkspace } from "./components/ExamSheetWorkspace";

type Props = {
  initialTrack: ExamTrack;
  selectedLevelId: string;
};

export default function ExamSheetTool({
  initialTrack,
  selectedLevelId,
}: Props) {
  const draftController = useExamSheetDraft({
  track: initialTrack,
  levelId: selectedLevelId,
});

  const calculationResult = useExamSheetCalculation(draftController.draft);
  const documentModel = useExamSheetDocument(
    draftController.draft,
    calculationResult
  );

  return (
    <ExamSheetWorkspace
      {...draftController}
      documentModel={documentModel}
    />
  );
}