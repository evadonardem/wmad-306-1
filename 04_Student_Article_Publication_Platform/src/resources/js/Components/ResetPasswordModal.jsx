import PropTypes from 'prop-types';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useTheme } from '@/Contexts/ThemeContext';
export default function ResetPasswordModal({ isOpen, onClose, token, email }) {
    const { colors } = useTheme();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setData('token', token || '');
        setData('email', email || '');
        // Check for reset success in URL
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('reset') === 'success') {
                setSuccess(true);
            }
        }
    }, [token, email]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onSuccess: () => {
                setSuccess(true);
                reset('password', 'password_confirmation');
            },
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-sm rounded-lg shadow-xl" style={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2" style={{ borderColor: colors.accent }}></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2" style={{ borderColor: colors.accent }}></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2" style={{ borderColor: colors.accent }}></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2" style={{ borderColor: colors.accent }}></div>
                <div className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 px-3 py-0.5 font-mono text-[10px] tracking-widest z-10 whitespace-nowrap" style={{ backgroundColor: colors.accent, color: colors.background, border: `1px solid ${colors.border}` }}>RESET PASSWORD</div>
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">&times;</button>
                <div className="px-6 pt-10 pb-6">
                    {success ? (
                        <div className="text-center">
                            <div className="text-3xl mb-2">✅</div>
                            <h3 className="font-serif text-lg font-bold" style={{ color: colors.text }}>Password Reset Successful</h3>
                            <p className="text-xs mt-1 mb-4" style={{ color: colors.textSecondary }}>You can now log in with your new password.</p>
                            <button
                                className="w-full py-3 rounded font-serif font-bold text-sm transition-all"
                                style={{ backgroundColor: colors.primary, color: colors.background }}
                                onClick={onClose}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="text-center mb-2">
                                <div className="text-3xl mb-2">🔑</div>
                                <h3 className="font-serif text-lg font-bold" style={{ color: colors.text }}>Create a new password</h3>
                                <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>Use a strong password you have not used before.</p>
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>EMAIL ADDRESS</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: errors.email ? colors.error : colors.border, backgroundColor: colors.surface, color: colors.text }} placeholder="reader@university.edu" required />
                                {errors.email && <p className="mt-1 text-[10px]" style={{ color: colors.error }}>{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>NEW PASSWORD</label>
                                <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: errors.password ? colors.error : colors.border, backgroundColor: colors.surface, color: colors.text }} placeholder="••••••••" required />
                                {errors.password && <p className="mt-1 text-[10px]" style={{ color: colors.error }}>{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textSecondary }}>CONFIRM PASSWORD</label>
                                <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full px-3 py-2 rounded border text-sm" style={{ borderColor: errors.password_confirmation ? colors.error : colors.border, backgroundColor: colors.surface, color: colors.text }} placeholder="••••••••" required />
                                {errors.password_confirmation && <p className="mt-1 text-[10px]" style={{ color: colors.error }}>{errors.password_confirmation}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="w-full py-3 rounded font-serif font-bold text-sm transition-all" style={{ backgroundColor: colors.primary, color: colors.background }}>{processing ? 'Resetting...' : 'Reset Password'}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

ResetPasswordModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    token: PropTypes.string,
    email: PropTypes.string,
};
