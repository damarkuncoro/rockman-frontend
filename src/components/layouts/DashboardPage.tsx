"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/shadcn/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs"

type Stat = {
  label: string
  value: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  helperText?: string
}

export type DashboardPageProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  toolbar?: React.ReactNode
  stats?: Stat[]
  children?: React.ReactNode
  className?: string
  contentCard?: boolean
  tabs?: { value: string; label: string; content: React.ReactNode }[]
  defaultTab?: string
}

export function DashboardPage({
  title,
  description,
  actions,
  toolbar,
  stats,
  children,
  className,
  contentCard = true,
  tabs,
  defaultTab,
}: DashboardPageProps) {
  return (
    <div className={cn("container mx-auto p-8 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1 max-w-2xl">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">{actions}</div>
        )}
      </div>

      {/* Toolbar */}
      {toolbar && (
        <div className="flex items-center justify-between gap-2">{toolbar}</div>
      )}

      {/* Stats Grid */}
      {stats && stats.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Card key={i} className="@container/card">
              <CardHeader>
                <CardDescription>{s.label}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
                  {s.icon && <s.icon className="h-4 w-4" />}
                  {s.value}
                </CardTitle>
              </CardHeader>
              {s.helperText && (
                <CardContent className="text-sm text-muted-foreground">{s.helperText}</CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Main Content / Tabs */}
      {tabs && tabs.length > 0 ? (
        <Tabs defaultValue={defaultTab || tabs[0]?.value} className="space-y-6" suppressHydrationWarning>
          <TabsList className="grid w-full grid-cols-3">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value} className="space-y-6">
              {contentCard ? (
                <Card>
                  <CardContent className="pt-6">{t.content}</CardContent>
                </Card>
              ) : (
                <div>{t.content}</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        contentCard ? (
          <Card>
            <CardContent className="pt-6">{children}</CardContent>
          </Card>
        ) : (
          <div>{children}</div>
        )
      )}
    </div>
  )
}