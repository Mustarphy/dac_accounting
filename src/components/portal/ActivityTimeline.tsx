import { formatDateTime } from "@/lib/client/format";
import type { RequestActivityItem } from "@/lib/client/types";

export default function ActivityTimeline({ activity }: { activity: RequestActivityItem[] }) {
  if (activity.length === 0) {
    return <p className="text-sm text-muted">No activity yet.</p>;
  }

  return (
    <ol className="flex flex-col gap-4">
      {activity.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pl-1">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
            {index < activity.length - 1 && <span className="mt-1 w-px flex-1 bg-slate-200" />}
          </div>
          <div className="pb-2">
            <p className="text-sm text-ink">{item.description}</p>
            <p className="mt-0.5 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
