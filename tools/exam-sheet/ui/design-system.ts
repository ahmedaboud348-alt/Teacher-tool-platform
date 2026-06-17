import type { CSSProperties } from "react";

export const ds = {
  colors: {
    primary50: "#EEF3FF",
    primary100: "#DCE7FF",
    primary200: "#BED0FF",
    primary500: "#1D3FAE",
    primary600: "#17358F",
    primary700: "#122C77",

    accent50: "#ECFDF8",
    accent100: "#D6FAF1",
    accent200: "#AEEFE2",
    accent500: "#0F766E",
    accent600: "#0C625C",

    bgPage: "#F2F6FB",
    bgPanel: "#FFFFFF",
    bgSubtle: "#F8FAFD",
    bgMuted: "#F5F8FC",

    borderSoft: "#DCE5F0",
    borderMuted: "#E7EDF5",
    borderStrong: "#C7D3E2",

    textPrimary: "#0F172A",
    textSecondary: "#334155",
    textMuted: "#64748B",
    textInverse: "#FFFFFF",

    success: "#15803D",
    successBg: "#EEFDF3",

    danger: "#B91C1C",
    dangerBg: "#FFF3F3",

    warning: "#B45309",
    warningBg: "#FFF8EB",
  },

  spacing: {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 32,
    8: 40,
  },

  radius: {
    sm: 10,
    md: 12,
    lg: 16,
    xl: 20,
    pill: 999,
  },

  shadow: {
    sm: "0 10px 24px rgba(15, 23, 42, 0.05)",
    md: "0 22px 48px rgba(15, 23, 42, 0.08)",
  },

  typography: {
    h1: {
      fontSize: 32,
      lineHeight: 1.2,
      fontWeight: 800,
    },
    h2: {
      fontSize: 20,
      lineHeight: 1.35,
      fontWeight: 800,
    },
    section: {
      fontSize: 18,
      lineHeight: 1.4,
      fontWeight: 800,
    },
    body: {
      fontSize: 14,
      lineHeight: 1.8,
      fontWeight: 400,
    },
    label: {
      fontSize: 12,
      lineHeight: 1.4,
      fontWeight: 800,
    },
    meta: {
      fontSize: 12,
      lineHeight: 1.6,
      fontWeight: 600,
    },
    small: {
      fontSize: 11,
      lineHeight: 1.5,
      fontWeight: 700,
    },
  },

  layout: {
    maxWidth: 1320,
    formMaxWidth: 1120,
    previewMaxWidth: 1120,
    appBarHeight: 68,
  },
} as const;

export const ui = {
  pageShell(dir: "rtl" | "ltr" = "rtl"): CSSProperties {
    return {
      direction: dir,
      backgroundColor: ds.colors.bgPage,
      minHeight: "100vh",
      boxSizing: "border-box",
      padding: ds.spacing[6],
    };
  },

  pageFrame: {
    maxWidth: ds.layout.maxWidth,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  } satisfies CSSProperties,

  appBar: {
    position: "sticky",
    top: 0,
    zIndex: 30,
    minHeight: ds.layout.appBarHeight,
    backgroundColor: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    borderBottom: `1px solid ${ds.colors.borderSoft}`,
    boxSizing: "border-box",
    boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
  } satisfies CSSProperties,

  appBarInner: {
    maxWidth: ds.layout.maxWidth,
    margin: "0 auto",
    minHeight: ds.layout.appBarHeight,
    padding: `0 ${ds.spacing[6]}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: ds.spacing[4],
    boxSizing: "border-box",
  } satisfies CSSProperties,

  panel: {
    backgroundColor: ds.colors.bgPanel,
    border: `1px solid ${ds.colors.borderSoft}`,
    borderRadius: ds.radius.xl,
    boxShadow: ds.shadow.md,
    boxSizing: "border-box",
  } satisfies CSSProperties,

  sectionPanel: {
    backgroundColor: ds.colors.bgPanel,
    border: `1px solid ${ds.colors.borderSoft}`,
    borderRadius: ds.radius.lg,
    padding: ds.spacing[5],
    boxShadow: ds.shadow.sm,
    boxSizing: "border-box",
  } satisfies CSSProperties,

  subtleBlock: {
    backgroundColor: ds.colors.bgSubtle,
    border: `1px solid ${ds.colors.borderMuted}`,
    borderRadius: ds.radius.lg,
    boxSizing: "border-box",
  } satisfies CSSProperties,

  input: {
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    padding: "10px 12px",
    borderRadius: ds.radius.md,
    border: `1px solid ${ds.colors.borderStrong}`,
    backgroundColor: ds.colors.bgPanel,
    color: ds.colors.textPrimary,
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14,
  } satisfies CSSProperties,

  select: {
    width: "100%",
    minWidth: 0,
    minHeight: 44,
    padding: "10px 40px 10px 12px",
    borderRadius: ds.radius.md,
    border: `1px solid ${ds.colors.borderStrong}`,
    backgroundColor: ds.colors.bgPanel,
    color: ds.colors.textPrimary,
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14,
    appearance: "none",
  } satisfies CSSProperties,

  buttonPrimary: {
    minHeight: 42,
    padding: "10px 14px",
    borderRadius: ds.radius.md,
    border: `1px solid ${ds.colors.primary500}`,
    backgroundColor: ds.colors.primary500,
    color: ds.colors.textInverse,
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 160ms ease",
    boxSizing: "border-box",
    boxShadow: "0 10px 22px rgba(29, 63, 174, 0.16)",
  } satisfies CSSProperties,

  buttonSecondary: {
    minHeight: 42,
    padding: "10px 14px",
    borderRadius: ds.radius.md,
    border: `1px solid ${ds.colors.borderStrong}`,
    backgroundColor: ds.colors.bgPanel,
    color: ds.colors.textPrimary,
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 160ms ease",
    boxSizing: "border-box",
  } satisfies CSSProperties,

  buttonDanger: {
    minHeight: 40,
    padding: "8px 12px",
    borderRadius: ds.radius.md,
    border: `1px solid ${ds.colors.danger}`,
    backgroundColor: ds.colors.dangerBg,
    color: ds.colors.danger,
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 160ms ease",
    boxSizing: "border-box",
  } satisfies CSSProperties,

  badgeNeutral: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 9px",
    borderRadius: ds.radius.pill,
    fontSize: 11,
    fontWeight: 800,
    backgroundColor: ds.colors.bgSubtle,
    color: ds.colors.textSecondary,
    border: `1px solid ${ds.colors.borderSoft}`,
    boxSizing: "border-box",
  } satisfies CSSProperties,

  badgePrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 9px",
    borderRadius: ds.radius.pill,
    fontSize: 11,
    fontWeight: 800,
    backgroundColor: ds.colors.primary100,
    color: ds.colors.primary600,
    border: `1px solid ${ds.colors.primary200}`,
    boxSizing: "border-box",
  } satisfies CSSProperties,

  badgeAccent: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 9px",
    borderRadius: ds.radius.pill,
    fontSize: 11,
    fontWeight: 800,
    backgroundColor: ds.colors.accent100,
    color: ds.colors.accent600,
    border: `1px solid ${ds.colors.accent200}`,
    boxSizing: "border-box",
  } satisfies CSSProperties,
};

export function getLevelLabel(levelId: string): string {
  switch (levelId) {
    case "1ac":
      return "الأولى إعدادي";
    case "2ac":
      return "الثانية إعدادي";
    case "3ac":
      return "الثالثة إعدادي";
    default:
      return levelId;
  }
}

export function getTrackLabel(track: "general" | "international"): string {
  return track === "general" ? "العام" : "الدولي";
}

export function formatObjectivesCount(count: number): string {
  if (count === 1) return "هدف واحد";
  if (count === 2) return "هدفان";
  if (count >= 3 && count <= 10) return `${count} أهداف`;
  if (count >= 11) return `${count} هدفًا`;
  return "0 أهداف";
}