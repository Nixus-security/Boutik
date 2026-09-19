import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
      {icon && (
        <div className="mb-3 text-4xl" aria-hidden="true">
          {icon}
        </div>
      )}
      <p className="text-base font-semibold text-gray-900">{title}</p>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4 w-full max-w-xs">{action}</div>}
    </div>
  );
}
