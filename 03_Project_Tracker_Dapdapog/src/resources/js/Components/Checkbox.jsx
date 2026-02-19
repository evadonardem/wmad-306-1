export default function Checkbox({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center space-x-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="form-checkbox" />
      <span>{label}</span>
    </label>
  );
}
