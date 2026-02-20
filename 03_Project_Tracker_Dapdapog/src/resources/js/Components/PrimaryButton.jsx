export default function PrimaryButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition ${className || ""}`}
    >
      {children}
    </button>
  );
}
