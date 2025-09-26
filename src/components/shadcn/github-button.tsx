"use client"

import * as React from "react"
import { Button } from "@/components/shadcn/ui/button"

export function GithubButton() {
    
  return (
    <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
      <a
        href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
        rel="noopener noreferrer"
        target="_blank"
        className="dark:text-foreground"
      >
        GitHub
      </a>
    </Button>
  )
}