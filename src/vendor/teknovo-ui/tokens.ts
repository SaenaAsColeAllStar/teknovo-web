/**
 * Token desain Atlas — sumber kebenaran untuk @teknovo/ui (PRD-2).
 * @see docs/skill-frontend/colors.md, radius.md
 */
export const TEKNOVO_UI_COLORS = {
  brand: "#1313BA",
  brandStrong: "#0E0E8C",
  heading: "#1313BA",
  body: "#6363C6",
  bodySubtle: "#9090CE",
  border: "#E8E8F8",
  borderDefault: "#E8E8F8",
  neutralSoft: "#F7F7FC",
  surface: "#FFFFFF",
  danger: "#BE123C",
  success: "#15A34A",
  warning: "#F97316",
} as const;

/** Nama variabel CSS — konsumsi via globals.css @theme di masing-masing app. */
export const TEKNOVO_UI_CSS_VARS = {
  brand: "--color-brand",
  borderDefault: "--color-border-default",
  heading: "--color-heading",
  body: "--color-body",
  surface: "--color-surface",
} as const;

/** Kelas layout shell — dipakai console + landing secara bertahap. */
export const teknovoShellClasses = {
  root: "flex min-h-screen min-h-dvh w-full overflow-x-clip bg-surface text-foreground",
  publicRoot:
    "flex min-h-screen flex-col bg-surface text-foreground pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))] md:pb-0",
  dashboardRoot: "flex min-h-screen min-h-dvh w-full overflow-x-clip bg-surface",
  bodyRow: "flex min-h-screen min-h-dvh min-w-0 flex-1 flex-col",
  main: "min-w-0 flex-1 overflow-x-clip",
  dashboardMain:
    "flex-1 min-w-0 overflow-x-clip pt-4 sm:pt-6 pb-4 sm:pb-6 max-lg:pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))]",
  contentContainer:
    "mx-auto w-full min-w-0 max-w-6xl px-3 sm:px-6 ps-[max(0.75rem,env(safe-area-inset-left,0px))] pe-[max(0.75rem,env(safe-area-inset-right,0px))] xl:max-w-7xl 2xl:max-w-[min(100%,96rem)]",
} as const;
