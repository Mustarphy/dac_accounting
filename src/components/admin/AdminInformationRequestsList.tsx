import { CheckCircle2, MessageCircleQuestion } from "lucide-react";
import { formatDateTime } from "@/lib/client/format";
import type { InformationRequestItem } from "@/lib/client/types";

/**
 * Staff view of information requests they've raised — read only. Only
 * the client can respond (that's a client-side ability, not staff's).
 */
export default function AdminInformationRequestsList({
  informationRequests,
}: {
  informationRequests: InformationRequestItem[];
}) {
  if (informationRequests.length === 0) {
    return <p className="text-sm text-muted">No information requests yet.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {informationRequests.map((item) => {
        const isPending = item.status === "pending";
        return (
          <li
            key={item.id}
            className={
              isPending
                ? "rounded-xl border border-amber-200 bg-amber-50 p-5"
                : "rounded-xl border border-slate-200 bg-white p-5"
            }
          >
            <div className="flex items-start gap-3">
              <span
                className={
                  isPending
                    ? "flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700"
                    : "flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                }
              >
                {isPending ? (
                  <MessageCircleQuestion className="size-4" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                )}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">
                  {isPending ? "Waiting on the client" : "Resolved by the client"}
                </p>
                <p className="mt-1 text-sm text-ink">{item.message}</p>
                <p className="mt-1 text-xs text-muted">{formatDateTime(item.createdAt)}</p>

                {!isPending && item.responseMessage && (
                  <div className="mt-3 rounded-md bg-slate-50 p-3 text-sm">
                    <p className="font-medium text-ink">Client&apos;s response:</p>
                    <p className="mt-1 text-ink">{item.responseMessage}</p>
                    {item.respondedAt && <p className="mt-1 text-xs text-muted">{formatDateTime(item.respondedAt)}</p>}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
