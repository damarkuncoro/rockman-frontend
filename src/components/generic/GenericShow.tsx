"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/shadcn/ui/card";
import { Button } from "@/components/shadcn/ui/button";
import { Badge } from "@/components/shadcn/ui/badge";
import { Skeleton } from "@/components/shadcn/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFetch } from "@/lib/useFetch";

export type ShowFieldDef = {
  id: string;
  label: string;
  type?: "text" | "textarea" | "date" | "badge" | "boolean" | "list" | "json";
  render?: (value: any, allValues?: Record<string, any>) => React.ReactNode;
  className?: string;
};

interface GenericShowProps {
  title?: string;
  description?: string;
  fields: ShowFieldDef[];
  values?: Record<string, any>;
  endpoint?: string;
  actions?: React.ReactNode;
  onBack?: () => void;
  contentCard?: boolean;
  className?: string;
}

function renderValue(field: ShowFieldDef, value: any, allValues?: Record<string, any>) {
  if (field.render) return field.render(value, allValues);
  const type = field.type || "text";
  switch (type) {
    case "textarea":
      return <div className="whitespace-pre-line text-muted-foreground">{String(value ?? "-")}</div>;
    case "date": {
      const d = value ? new Date(value) : null;
      return <span className="font-mono">{d ? d.toLocaleString() : "-"}</span>;
    }
    case "badge":
      return <Badge variant="outline">{String(value ?? "-")}</Badge>;
    case "boolean":
      return (
        <Badge variant={value ? "default" : "destructive"}>
          {value ? "Ya" : "Tidak"}
        </Badge>
      );
    case "list": {
      const arr = Array.isArray(value) ? value : [];
      if (arr.length === 0) return <span className="text-muted-foreground">-</span>;
      return (
        <ul className="list-disc pl-4 space-y-1">
          {arr.map((item, idx) => (
            <li key={idx} className="text-sm">{String(item)}</li>
          ))}
        </ul>
      );
    }
    case "json":
      return <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">{JSON.stringify(value ?? {}, null, 2)}</pre>;
    case "text":
    default:
      return <span>{String(value ?? "-")}</span>;
  }
}

export function GenericShow(props: GenericShowProps) {
  const { title, description, fields, values, endpoint, actions, onBack, contentCard = true, className } = props;

  // Data loading: prefer provided values, otherwise fetch from endpoint
  const shouldFetch = !!endpoint && !values;
  const { data, loading, error } = useFetch<any>(endpoint ?? "", { immediate: shouldFetch, useCache: true, cacheMaxAge: 300000 });
  const resolved = React.useMemo(() => {
    if (values) return values;
    const payload = data as any;
    if (!payload) return undefined;
    // Try common shapes: { data }, direct object, or array
    if (payload?.data && typeof payload.data === "object") return payload.data;
    if (typeof payload === "object") return payload;
    return undefined;
  }, [values, data]);

  const content = (
    <div className={cn("space-y-4", className)}>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.id} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-sm text-destructive">{String((error as any)?.message ?? error)}</div>
      )}

      {!loading && !error && resolved && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.id} className={cn("space-y-1", f.className)}>
              <div className="text-xs text-muted-foreground">{f.label}</div>
              <div className="text-sm">{renderValue(f, resolved[f.id], resolved)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!contentCard) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-2xl font-bold">{title}</h2>}
        {description && <p className="text-muted-foreground">{description}</p>}
        {content}
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>Kembali</Button>
          )}
          {actions}
        </div>
      </div>
    );
  }

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{content}</CardContent>
      {(onBack || actions) && (
        <CardFooter className="flex gap-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>Kembali</Button>
          )}
          {actions}
        </CardFooter>
      )}
    </Card>
  );
}