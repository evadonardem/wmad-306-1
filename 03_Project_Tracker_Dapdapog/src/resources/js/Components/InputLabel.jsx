export default function InputLabel({ children, htmlFor, className }) {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium mb-1 ${className || ""}`}>
      {children}
    </label>
  );
}
