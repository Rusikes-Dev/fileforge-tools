import { AlertIcon } from "@/components/common/Icon";

export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="animate-pop-in mt-4 flex items-start gap-2.5 rounded-xl border border-danger-200 border-l-4 border-l-danger-600 bg-danger-50 px-3.5 py-3 text-sm text-danger-700"
    >
      <AlertIcon className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="leading-relaxed">{message}</p>
    </div>
  );
}
