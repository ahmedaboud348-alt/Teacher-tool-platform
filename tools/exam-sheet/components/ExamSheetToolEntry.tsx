"use client";

import { useState } from "react";
import ExamSheetTool from "../ExamSheetTool";
import { ExamTrack } from "../types/exam-sheet-draft";
import { LevelSelectionStep } from "./LevelSelectionStep";
import { TrackSelectionStep } from "./TrackSelectionStep";

export function ExamSheetToolEntry() {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<ExamTrack | null>(null);

  if (!selectedLevelId) {
    return <LevelSelectionStep onSelectLevel={setSelectedLevelId} />;
  }

  if (!selectedTrack) {
    return (
      <TrackSelectionStep
        selectedLevelId={selectedLevelId}
        onBack={() => setSelectedLevelId(null)}
        onSelectTrack={setSelectedTrack}
      />
    );
  }

  return (
    <ExamSheetTool
      key={`${selectedLevelId}-${selectedTrack}`}
      initialTrack={selectedTrack}
      selectedLevelId={selectedLevelId}
    />
  );
}