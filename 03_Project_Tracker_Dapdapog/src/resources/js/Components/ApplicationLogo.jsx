export default function ApplicationLogo({ className }) {
  return (
    <div className={`text-3xl font-bold text-red-600 ${className || ""}`}>
      PT
    </div>
  );
}
