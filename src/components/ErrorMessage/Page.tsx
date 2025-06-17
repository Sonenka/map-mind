// components/ErrorMessage.tsx
export default function ErrorMessage({ text }: { text: string }) {
  if (!text) return null;
  return <p className="error">{text}</p>;
}
