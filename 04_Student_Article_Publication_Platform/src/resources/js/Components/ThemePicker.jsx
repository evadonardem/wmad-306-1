import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/Contexts/ThemeContext';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export default function ThemePicker({ position = 'inline' }) {
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef(null);
    const { theme, setTheme, isDarkMode, setIsDarkMode, availableThemes, colors } = useTheme();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={pickerRef} className="relative flex items-center justify-center">
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 flex items-center justify-center cursor-pointer select-none transition-colors"
                style={{
                    color: isOpen ? colors.accent : colors.textSecondary,
                    WebkitTapHighlightColor: 'transparent',
                }}
            >
                <ColorLensIcon sx={{ fontSize: 20 }} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className={`absolute p-2 rounded-[24px] border shadow-2xl w-56 z-[2000] ${
                            position === 'floating-bottom-right'
                                ? 'bottom-4 right-4'
                                : 'top-10 right-0'
                        }`}
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            boxShadow: isDarkMode
                                ? '0 20px 40px rgba(0,0,0,0.5)'
                                : '0 20px 40px rgba(0,0,0,0.15)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <div className="grid grid-cols-3 gap-1">
                            {Object.entries(availableThemes).map(([key, themeData]) => {
                                const isSelected = theme === key;
                                const previewColors = isDarkMode ? themeData.dark : themeData.light;

                                return (
                                    <button
                                        key={key}
                                        onClick={() => setTheme(key)}
                                        className="group relative flex flex-col items-center justify-center aspect-square rounded-[18px] transition-all hover:scale-105"
                                        style={{
                                            backgroundColor: isSelected ? `${colors.accent}15` : 'transparent',
                                        }}
                                    >
                                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                                            {themeData.icon}
                                        </span>
                                        <span
                                            className="text-[9px] font-bold tracking-tight"
                                            style={{
                                                color: isSelected ? colors.accent : colors.textSecondary,
                                            }}
                                        >
                                            {themeData.name}
                                        </span>

                                        <div className="flex gap-0.5 mt-1">
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: previewColors.primary }}
                                            />
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: previewColors.accent }}
                                            />
                                            <div
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: previewColors.secondary }}
                                            />
                                        </div>

                                        {isSelected && (
                                            <motion.div
                                                layoutId="active-frame"
                                                className="absolute inset-0 border-2 rounded-[18px]"
                                                style={{ borderColor: colors.accent }}
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-2 pt-2 border-t" style={{ borderColor: `${colors.border}60` }}>
                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl transition-all hover:opacity-80"
                                style={{
                                    backgroundColor: `${colors.accent}10`,
                                    color: colors.text,
                                }}
                            >
                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                                    {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                </span>
                            </button>
                        </div>

                        <div className="mt-1 text-center">
                            <span
                                className="text-[7px] font-mono uppercase tracking-wider"
                                style={{ color: `${colors.textSecondary}80` }}
                            >
                                {availableThemes[theme]?.name || 'Classic'} • {isDarkMode ? 'Dark' : 'Light'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
