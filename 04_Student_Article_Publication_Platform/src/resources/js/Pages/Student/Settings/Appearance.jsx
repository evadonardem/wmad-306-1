import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import StudentLayout from '@/Layouts/StudentLayout';
import { useTheme } from '@/Contexts/ThemeContext';
import axios from 'axios';

export default function AppearanceSettings() {
    const { auth } = usePage().props;
    const { theme, setTheme, isDarkMode, setIsDarkMode, availableThemes, colors } = useTheme();
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [previewTheme, setPreviewTheme] = useState(theme);
    const [previewMode, setPreviewMode] = useState(isDarkMode);

    // Preview colors based on selected preview
    const previewColors = availableThemes[previewTheme][previewMode ? 'dark' : 'light'];

    // Save settings to backend
    const saveSettings = async () => {
        setSaving(true);
        try {
            await axios.post('/api/user/preferences', {
                theme: previewTheme,
                dark_mode: previewMode
            });

            // Update actual theme after successful save
            setTheme(previewTheme);
            setIsDarkMode(previewMode);

            setSaveMessage('Settings saved successfully!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            setSaveMessage('Failed to save settings. Please try again.');
            setTimeout(() => setSaveMessage(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    // Reset to current saved settings
    const resetToSaved = () => {
        setPreviewTheme(theme);
        setPreviewMode(isDarkMode);
    };

    return (
        <StudentLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-serif font-bold" style={{ color: colors.text }}>
                        Appearance Settings
                    </h1>
                    <p className="text-sm mt-2" style={{ color: colors.textSecondary }}>
                        Customize how the journal looks and feels across all devices.
                    </p>
                </div>

                {/* Save Bar */}
                <AnimatePresence>
                    {(previewTheme !== theme || previewMode !== isDarkMode) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="sticky top-20 z-10 mb-6 p-4 rounded-lg shadow-lg"
                            style={{
                                backgroundColor: previewColors.accent,
                                color: previewColors.background
                            }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span
                                        className="h-3 w-3 rounded-full"
                                        style={{ backgroundColor: previewColors.background }}
                                    />
                                    <span className="font-serif">You have unsaved changes</span>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={resetToSaved}
                                        className="px-4 py-2 rounded-lg transition"
                                        style={{
                                            backgroundColor: previewColors.background + '20',
                                            color: previewColors.background
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveSettings}
                                        disabled={saving}
                                        className="px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
                                        style={{
                                            backgroundColor: previewColors.background,
                                            color: previewColors.accent
                                        }}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="animate-spin">⏳</span>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </div>
                            {saveMessage && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm mt-2 text-center"
                                    style={{ color: previewColors.background }}
                                >
                                    {saveMessage}
                                </motion.p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Preview Card */}
                <motion.div
                    className="mb-8 p-6 rounded-xl border-2 overflow-hidden"
                    style={{
                        backgroundColor: previewColors.background,
                        borderColor: previewColors.border,
                    }}
                    animate={{
                        backgroundColor: previewColors.background,
                        borderColor: previewColors.border
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-serif font-semibold" style={{ color: previewColors.text }}>
                            Live Preview
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPreviewMode(false)}
                                className={`px-4 py-2 rounded-lg text-sm font-mono transition ${
                                    !previewMode ? 'ring-2' : 'opacity-50'
                                }`}
                                style={{
                                    backgroundColor: !previewMode ? previewColors.accent : 'transparent',
                                    color: !previewMode ? previewColors.background : previewColors.text,
                                    ringColor: previewColors.accent
                                }}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setPreviewMode(true)}
                                className={`px-4 py-2 rounded-lg text-sm font-mono transition ${
                                    previewMode ? 'ring-2' : 'opacity-50'
                                }`}
                                style={{
                                    backgroundColor: previewMode ? previewColors.accent : 'transparent',
                                    color: previewMode ? previewColors.background : previewColors.text,
                                    ringColor: previewColors.accent
                                }}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* Mini Dashboard Preview */}
                    <div className="grid grid-cols-3 gap-3 p-4 rounded-lg" style={{ backgroundColor: previewColors.surface }}>
                        {/* Sidebar Mini */}
                        <div className="col-span-1 space-y-2">
                            <div className="h-8 rounded" style={{ backgroundColor: previewColors.primary + '40' }}></div>
                            <div className="h-8 rounded" style={{ backgroundColor: previewColors.accent + '30' }}></div>
                            <div className="h-8 rounded" style={{ backgroundColor: previewColors.border }}></div>
                        </div>

                        {/* Content Mini */}
                        <div className="col-span-2 space-y-2">
                            <div className="h-12 rounded" style={{ backgroundColor: previewColors.primary }}></div>
                            <div className="h-24 rounded" style={{ backgroundColor: previewColors.accent + '20' }}></div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-16 rounded" style={{ backgroundColor: previewColors.border }}></div>
                                <div className="h-16 rounded" style={{ backgroundColor: previewColors.border }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div className="mt-4">
                        <h3 className="text-sm font-mono mb-2" style={{ color: previewColors.textSecondary }}>
                            Color Palette
                        </h3>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <div className="h-12 rounded-t-lg" style={{ backgroundColor: previewColors.primary }}></div>
                                <div className="text-center text-xs py-1" style={{ backgroundColor: previewColors.surface, color: previewColors.textSecondary }}>
                                    Primary
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="h-12 rounded-t-lg" style={{ backgroundColor: previewColors.secondary }}></div>
                                <div className="text-center text-xs py-1" style={{ backgroundColor: previewColors.surface, color: previewColors.textSecondary }}>
                                    Secondary
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="h-12 rounded-t-lg" style={{ backgroundColor: previewColors.accent }}></div>
                                <div className="text-center text-xs py-1" style={{ backgroundColor: previewColors.surface, color: previewColors.textSecondary }}>
                                    Accent
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="h-12 rounded-t-lg" style={{ backgroundColor: previewColors.background }}></div>
                                <div className="text-center text-xs py-1" style={{ backgroundColor: previewColors.surface, color: previewColors.textSecondary }}>
                                    Background
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="h-12 rounded-t-lg" style={{ backgroundColor: previewColors.surface }}></div>
                                <div className="text-center text-xs py-1" style={{ backgroundColor: previewColors.surface, color: previewColors.textSecondary }}>
                                    Surface
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Theme Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(availableThemes).map(([key, themeData]) => (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPreviewTheme(key)}
                            className="p-4 rounded-xl border-2 text-left transition-all"
                            style={{
                                backgroundColor: previewTheme === key ? previewColors.surface : colors.surface,
                                borderColor: previewTheme === key ? previewColors.accent : colors.border,
                            }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span className="flex items-center gap-1">
                                    <span
                                        className="w-5 h-5 rounded-full border"
                                        style={{ backgroundColor: themeData.light.primary, borderColor: colors.border }}
                                    />
                                    <span
                                        className="w-5 h-5 rounded-full border"
                                        style={{ backgroundColor: themeData.light.secondary, borderColor: colors.border }}
                                    />
                                    <span
                                        className="w-5 h-5 rounded-full border"
                                        style={{ backgroundColor: themeData.light.accent, borderColor: colors.border }}
                                    />
                                </span>
                                <div>
                                    <h3 className="font-serif font-semibold" style={{ color: colors.text }}>
                                        {themeData.name}
                                    </h3>
                                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                                        {previewTheme === key ? 'Selected' : 'Click to preview'}
                                    </p>
                                </div>
                                {previewTheme === key && (
                                    <span className="ml-auto text-xl" style={{ color: previewColors.accent }}>
                                        ✓
                                    </span>
                                )}
                            </div>

                            {/* Theme Preview Swatches */}
                            <div className="grid grid-cols-5 gap-1 mt-2">
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.light.primary }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.light.secondary }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.light.accent }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.light.background }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.light.surface }}></div>
                            </div>
                            <div className="grid grid-cols-5 gap-1 mt-1">
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.dark.primary }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.dark.secondary }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.dark.accent }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.dark.background }}></div>
                                <div className="h-6 rounded" style={{ backgroundColor: themeData.dark.surface }}></div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Theme Description */}
                <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
                    <h3 className="font-serif text-lg font-semibold mb-2" style={{ color: colors.text }}>
                        About {availableThemes[previewTheme].name}
                    </h3>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        {previewTheme === 'classic' && 'Traditional black and white newspaper aesthetic with high contrast for optimal readability.'}
                        {previewTheme === 'modern' && 'Clean, minimal design with subtle grays and crisp typography for a contemporary feel.'}
                        {previewTheme === 'broadsheet' && 'Cool blue tones inspired by serious journalism, perfect for focused reading.'}
                        {previewTheme === 'guardian' && 'Fresh green palette that\'s easy on the eyes, ideal for long reading sessions.'}
                        {previewTheme === 'berliner' && 'Sophisticated burgundy accents with warm neutrals for a European editorial style.'}
                        {previewTheme === 'heritage' && 'Warm vintage tones reminiscent of aged paper and classic typewriters.'}
                        {previewTheme === 'dawn' && 'Soft, warm colors inspired by morning light and early editions.'}
                        {previewTheme === 'rustic' && 'Earthy, grounded tones that evoke a sense of tradition and craftsmanship.'}
                    </p>

                    {/* Typography Preview */}
                    <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                        <p className="font-serif text-lg" style={{ color: previewColors.primary }}>
                            "The student journal where every voice matters."
                        </p>
                        <p className="font-mono text-xs mt-2" style={{ color: previewColors.textSecondary }}>
                            — Serif headlines, mono for metadata
                        </p>
                    </div>
                </div>

                {/* System Preference */}
                <div className="mt-6 p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: colors.surface }}>
                    <div>
                        <h4 className="font-serif font-medium" style={{ color: colors.text }}>
                            Follow System Preference
                        </h4>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>
                            Automatically switch between light and dark mode based on your system settings
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    // Follow system preference
                                    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                    setPreviewMode(systemDark);
                                }
                            }}
                        />
                        <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                            style={{ backgroundColor: previewColors.accent }}></div>
                    </label>
                </div>
            </div>
        </StudentLayout>
    );
}

