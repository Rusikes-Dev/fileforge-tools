import { ShieldCheckIcon } from "./Icon";

export default function PrivacyBadge({ compact = false }: { compact?: boolean }) {
  return (
    <p className="badge-accent gap-2">
      <span className="pulse-dot" aria-hidden />
      <ShieldCheckIcon className="h-3.5 w-3.5" />
      {compact ? "Runs in your browser" : "Runs in your browser — files never leave your device"}
    </p>
  );
}
