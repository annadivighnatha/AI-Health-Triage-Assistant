import { cn } from "@/lib/utils"
import type { UrgencyLevel } from "@/lib/triage-data"
import { URGENCY_META } from "@/lib/triage-data"
import { ShieldCheck, AlertTriangle, AlertCircle, Siren } from "lucide-react"

const STYLES: Record<UrgencyLevel, string> = {
  Low: "bg-urgency-low/15 text-urgency-low border-urgency-low/30",
  Moderate: "bg-urgency-moderate/15 text-urgency-moderate border-urgency-moderate/40",
  High: "bg-urgency-high/15 text-urgency-high border-urgency-high/40",
  Emergency: "bg-urgency-emergency/15 text-urgency-emergency border-urgency-emergency/40",
}

const ICONS: Record<UrgencyLevel, React.ElementType> = {
  Low: ShieldCheck,
  Moderate: AlertTriangle,
  High: AlertCircle,
  Emergency: Siren,
}

interface UrgencyBadgeProps {
  level: UrgencyLevel
  showMeaning?: boolean
  size?: "sm" | "md"
  className?: string
}

export function UrgencyBadge({ level, showMeaning = false, size = "md", className }: UrgencyBadgeProps) {
  const meta = URGENCY_META[level]
  const Icon = ICONS[level]
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        STYLES[level],
        className,
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4")} aria-hidden="true" />
      <span>{meta.label}</span>
      {showMeaning && <span className="font-normal opacity-80">- {meta.meaning}</span>}
    </div>
  )
}
