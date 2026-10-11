import { AlertCircle } from "lucide-react";

export default function ErrorState({ message = "Something went wrong. Please try again." }: { message?: string }) {
  return (
    <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {message}
    </div>
  );
}
