import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/Contexts/ThemeContext';

export default function ThemePicker({ position = 'bottom-right' }) {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme, isDarkMode, setIsDarkMode, availableThemes, colors } = useTheme();

    const positions = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-24 right-6',
        'top-left': 'top-24 left-6',
    };

    return (
        <div className={`fixed ${positions[position]} z-50`}>
            {/* Theme Picker Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
                style={{
                    backgroundColor: colors.accent,
                    color: colors.background
                }}
            >
                <span className="flex items-center -space-x-1">
                    <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: colors.primary, borderColor: colors.background }}
                    />
                    <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: colors.secondary, borderColor: colors.background }}
                    />
                    <span
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: colors.background, borderColor: colors.surface }}
                    />
                </span>
            </motion.button>

            {/* Theme Picker Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className={`absolute ${position.includes('bottom') ? 'bottom-16' : 'top-16'}
                                   right-0 p-4 rounded-lg shadow-xl min-w-[280px]`}
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            borderWidth: '1px'
                        }}
                    >
                        <h3 className="font-serif text-sm font-bold mb-3" style={{ color: colors.text }}>
                            Theme Preferences
                        </h3>

                        {/* Dark Mode Toggle */}
                        <div className="mb-4 pb-4 border-b" style={{ borderColor: colors.border }}>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="flex items-center justify-between w-full px-3 py-2 rounded transition-colors"
                                style={{
                                    backgroundColor: colors.hover,
                                    color: colors.text
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    <span
                                        className="w-3.5 h-3.5 rounded-full border"
                                        style={{
                                            backgroundColor: isDarkMode ? colors.surface : colors.background,
                                            borderColor: colors.border,
                                        }}
                                    />
                                    <span className="font-serif text-sm">Dark Mode</span>
                                </span>
                                <span className="text-xs opacity-70">
                                    {isDarkMode ? 'On' : 'Off'}
                                </span>
                            </button>
                        </div>

                        {/* Theme Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(availableThemes).map(([key, themeData]) => (
                                (() => {
                                    const previewColors = themeData[isDarkMode ? 'dark' : 'light'];
                                    return (
                                <motion.button
                                    key={key}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setTheme(key)}
                                    className="flex flex-col items-center p-3 rounded transition-all"
                                    style={{
                                        backgroundColor: theme === key ? colors.accent + '20' : 'transparent',
                                        borderColor: theme === key ? colors.accent : 'transparent',
                                        borderWidth: theme === key ? '2px' : '1px',
                                        borderStyle: 'solid',
                                        color: colors.text
                                    }}
                                >
                                    <span className="flex items-center gap-1 mb-2">
                                        <span
                                            className="w-4 h-4 rounded-full border"
                                            style={{ backgroundColor: previewColors.primary, borderColor: previewColors.border }}
                                        />
                                        <span
                                            className="w-4 h-4 rounded-full border"
                                            style={{ backgroundColor: previewColors.secondary, borderColor: previewColors.border }}
                                        />
                                        <span
                                            className="w-4 h-4 rounded-full border"
                                            style={{ backgroundColor: previewColors.accent, borderColor: previewColors.border }}
                                        />
                                    </span>
                                    <span className="font-serif text-xs text-center">{themeData.name}</span>
                                    {theme === key && (
                                        <span className="text-xs mt-1" style={{ color: colors.accent }}>✓</span>
                                    )}
                                </motion.button>
                                    );
                                })()
                            ))}
                        </div>

                        {/* Preview */}
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
                            <div className="flex gap-2">
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.primary }}></div>
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.secondary }}></div>
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.accent }}></div>
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.background }}></div>
                                <div className="w-6 h-6 rounded" style={{ backgroundColor: colors.surface }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
