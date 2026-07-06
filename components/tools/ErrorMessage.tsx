export default function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
      {message}
    </p>
  );
}
