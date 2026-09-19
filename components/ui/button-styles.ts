export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-500 text-white active:bg-brand-600 disabled:bg-brand-200",
  secondary: "bg-white text-gray-900 border border-gray-200 active:bg-gray-50",
  ghost: "bg-transparent text-brand-600 active:bg-brand-50",
  danger: "bg-red-500 text-white active:bg-red-600",
};

export const buttonBaseClass =
  "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60";
