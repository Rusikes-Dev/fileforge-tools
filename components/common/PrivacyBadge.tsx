export default function PrivacyBadge() {
  return (
    <p className="inline-flex items-center gap-1.5 rounded bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent-800">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-600" />
      Browser processing — files never leave your device
    </p>
  );
}
