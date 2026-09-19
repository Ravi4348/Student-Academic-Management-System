import React from "react";
import { cn } from "@/utils";

export const PageHeader = ({ title, description, action, className }) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
        className,
      )}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex shrink-0">{action}</div>}
    </div>
  );
};
