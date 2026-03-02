export default function Notifications({ items = [] }) {
    return (
        <section>
            <h2>Notifications</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id ?? item.message}>{item.message}</li>
                ))}
            </ul>
        </section>
    );
}
