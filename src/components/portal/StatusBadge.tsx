import { cn } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/client/format";
import type { RequestStatus } from "@/lib/client/types";

const STATUS_STYLES: Record<RequestStatus, string> = {
  opened: "bg-amber-50 text-amber-800 border-amber-200",
  ongoing: "bg-blue-50 text-blue-800 border-blue-200",
  concluded: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        STATUS_STYLES[status]
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
