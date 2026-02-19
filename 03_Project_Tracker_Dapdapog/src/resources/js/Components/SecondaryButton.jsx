export default function SecondaryButton({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition ${className || ""}`}
    >
      {children}
    </button>
  );
}
