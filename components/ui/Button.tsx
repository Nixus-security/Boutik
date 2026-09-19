import { ButtonHTMLAttributes, forwardRef } from "react";
import { buttonBaseClass, buttonVariantClasses, type ButtonVariant } from "./button-styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", className = "", loading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={`${buttonBaseClass} ${buttonVariantClasses[variant]} ${className}`}
        {...props}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
