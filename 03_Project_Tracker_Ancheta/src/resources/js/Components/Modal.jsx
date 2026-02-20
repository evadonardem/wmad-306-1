import {
    Dialog,
    DialogPanel,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useTheme } from '@/Context/ThemeContext';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const { colors, isDarkMode } = useTheme();

    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
    }[maxWidth];

    return (
        <Transition show={show} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 z-50 flex transform items-center overflow-y-auto px-4 py-6 transition-all sm:px-0"
                onClose={close}
            >
                <TransitionChild
                    enter="ease-out duration-400"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="absolute inset-0 glass-effect"
                        style={{
                            backgroundColor: isDarkMode
                                ? 'rgba(15, 23, 42, 0.85)'
                                : 'rgba(17, 24, 39, 0.4)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                        }}
                    />
                </TransitionChild>

                <TransitionChild
                    enter="ease-out duration-500"
                    enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-90"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-300"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-90"
                >
                    <DialogPanel
                        className={`mb-6 transform overflow-hidden rounded-3xl shadow-2xl transition-all sm:mx-auto sm:w-full animate-fade-in-scale relative ${maxWidthClass}`}
                        style={{
                            background: isDarkMode
                                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 247, 250, 0.95) 100%)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: `1px solid ${isDarkMode
                                ? 'rgba(71, 85, 105, 0.3)'
                                : 'rgba(255, 255, 255, 0.3)'}`,
                            color: colors.textPrimary,
                            boxShadow: isDarkMode
                                ? '0 20px 60px -12px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05)'
                                : '0 20px 60px -12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        {/* Glass shine effect */}
                        <div
                            className="absolute top-0 left-0 right-0 h-px opacity-50"
                            style={{
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            }}
                        />
                        {children}
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
