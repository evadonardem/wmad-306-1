import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';

export default function AppLayout({ title = 'Student Article Platform', children }) {
    return (
        <div>
            <Navbar title={title} />
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Sidebar />
                <main style={{ flex: 1 }}>{children}</main>
            </div>
        </div>
    );
}
