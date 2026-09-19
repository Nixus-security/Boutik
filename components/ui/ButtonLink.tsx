import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonBaseClass, buttonVariantClasses, type ButtonVariant } from "./button-styles";

type Props = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  className?: string;
};

export function ButtonLink({ variant = "primary", className = "", children, ...props }: Props) {
  return (
    <Link className={`${buttonBaseClass} ${buttonVariantClasses[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
