import { useMemo, useState } from "react";
import { ExamTrack } from "../types/exam-sheet-draft";
import {
  LessonSuggestion,
  useLessonSuggestions,
} from "../hooks/useLessonSuggestions";
import {
  ds,
  formatObjectivesCount,
  getLevelLabel,
  ui,
} from "../ui/design-system";

type Props = {
  value: string;
  levelId: string;
  track: ExamTrack;
  onChange: (value: string) => void;
  onSelectSuggestion: (suggestion: LessonSuggestion) => void;
};

export function LessonAutocomplete({
  value,
  levelId,
  track,
  onChange,
  onSelectSuggestion,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useLessonSuggestions({
    query: value,
    levelId,
    track,
  });

  const shouldShowSuggestions = useMemo(() => {
    return isOpen && value.trim().length > 0 && suggestions.length > 0;
  }, [isOpen, suggestions.length, value]);

  return (
    <div style={wrapperStyle}>
      <input
        type="text"
        placeholder="عنوان الدرس"
        value={value}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 120);
        }}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        style={ui.input}
      />

      {shouldShowSuggestions && (
        <div style={popoverStyle}>
          <div style={popoverHeaderStyle}>الدروس المرجعية</div>

          <div style={suggestionsListStyle}>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                style={suggestionItemStyle}
                onMouseDown={(event) => {
                  event.preventDefault();
                  onSelectSuggestion(suggestion);
                  setIsOpen(false);
                }}
              >
                <div style={suggestionRowStyle}>
                  <div style={suggestionTextBlockStyle}>
                    <div style={suggestionLabelStyle}>{suggestion.label}</div>
                    <div style={suggestionMetaStyle}>
                      <span>{getLevelLabel(suggestion.levelId)}</span>
                      <span>{suggestion.defaultDurationHours}س</span>
                      <span>
                        {formatObjectivesCount(
                          suggestion.defaultObjectives.length
                        )}
                      </span>
                    </div>
                  </div>

                  <span style={ui.badgePrimary}>مرجع</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const wrapperStyle = {
  position: "relative" as const,
  flex: 1,
  minWidth: 0,
};

const popoverStyle = {
  position: "absolute" as const,
  insetInlineStart: 0,
  insetInlineEnd: 0,
  top: "calc(100% + 8px)",
  zIndex: 20,
  backgroundColor: ds.colors.bgPanel,
  border: `1px solid ${ds.colors.borderSoft}`,
  borderRadius: ds.radius.lg,
  boxShadow: ds.shadow.md,
  overflow: "hidden",
};

const popoverHeaderStyle = {
  padding: "10px 12px",
  ...ds.typography.label,
  color: ds.colors.textMuted,
  backgroundColor: ds.colors.bgSubtle,
  borderBottom: `1px solid ${ds.colors.borderMuted}`,
};

const suggestionsListStyle = {
  display: "flex",
  flexDirection: "column" as const,
  maxHeight: 300,
  overflowY: "auto" as const,
};

const suggestionItemStyle = {
  width: "100%",
  border: "none",
  borderBottom: `1px solid ${ds.colors.borderMuted}`,
  backgroundColor: ds.colors.bgPanel,
  textAlign: "right" as const,
  padding: "11px 14px",
  cursor: "pointer",
};

const suggestionRowStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: ds.spacing[3],
};

const suggestionTextBlockStyle = {
  minWidth: 0,
  flex: 1,
};

const suggestionLabelStyle = {
  fontSize: 14,
  fontWeight: 700,
  color: ds.colors.textPrimary,
  lineHeight: 1.55,
};

const suggestionMetaStyle = {
  marginTop: 4,
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "4px 12px",
  ...ds.typography.meta,
  color: ds.colors.textMuted,
};