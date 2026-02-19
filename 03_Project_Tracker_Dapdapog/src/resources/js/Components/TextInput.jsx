// converted from the default Jetstream scaffold so it behaves like a normal text input
export default function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ${className}`}
    />
  );
}
