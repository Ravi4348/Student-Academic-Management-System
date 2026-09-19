import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils";

export const StatCard = ({
  title,
  value,
  icon: Icon,
  contextLine,
  contextType = "neutral",
  className,
}) => {
  const contextColors = {
    success: "text-emerald-600",
    danger: "text-rose-600",
    warning: "text-amber-600",
    neutral: "text-slate-500",
  };

  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {contextLine && (
          <p
            className={cn(
              "text-xs mt-1 font-medium",
              contextColors[contextType],
            )}
          >
            {contextLine}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
