export default function JoditEditor({ value, onChange }) {
    return (
        <textarea
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder="Jodit editor wrapper placeholder"
            rows={10}
            style={{ width: '100%' }}
        />
    );
}
