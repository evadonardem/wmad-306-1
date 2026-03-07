// RightWidgets.jsx (updated with weather widget)
import {
    Box,
    Chip,
    Paper,
    Stack,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemText,
    Divider,
    alpha,
} from '@mui/material';
import {
    TrendingUp,
    Whatshot,
    AccessTime,
    MenuBook,
    WbSunny,
} from '@mui/icons-material';
import { useTheme } from '@/Contexts/ThemeContext';

// Weather Widget
const WeatherWidget = () => {
    const { colors } = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: colors.border,
                bgcolor: alpha(colors.surface, 0.5),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontFamily: '"Courier New", monospace',
                fontSize: '0.75rem',
                color: colors.textSecondary,
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center">
                <WbSunny sx={{ color: colors.accent, fontSize: 20 }} />
                <span>CAMPUS WEATHER</span>
            </Stack>
            <Stack direction="row" spacing={2}>
                <span>62°F</span>
                <span>☁️ Partly Cloudy</span>
                <span>H:68° L:58°</span>
            </Stack>
        </Paper>
    );
};

// Widget Header Component
const WidgetHeader = ({ icon, title }) => {
    const { colors } = useTheme();
    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
                borderBottom: '2px solid',
                borderColor: colors.border,
                pb: 1,
                mb: 2,
            }}
        >
            <Box sx={{ color: colors.accent }}>{icon}</Box>
            <Typography
                sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: '0.05em',
                    color: colors.text,
                }}
            >
                {title}
            </Typography>
        </Stack>
    );
};

// Trending Item Component
const TrendingItem = ({ item, index, onClick }) => {
    const { colors } = useTheme();
    return (
        <ListItem
            button
            onClick={() => onClick?.(item.id)}
            sx={{
                px: 0,
                py: 1,
                borderBottom: '1px solid',
                borderColor: colors.border,
                '&:hover': {
                    backgroundColor: alpha(colors.surface, 0.5),
                },
            }}
        >
            <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ width: '100%' }}>
                <Avatar
                    sx={{
                        width: 24,
                        height: 24,
                        bgcolor: 'transparent',
                        border: '1px solid',
                        borderColor: colors.border,
                        color: colors.textSecondary,
                        fontSize: '0.75rem',
                        fontFamily: '"Courier New", monospace',
                    }}
                >
                    {index + 1}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontFamily: '"Times New Roman", Times, serif',
                            fontWeight: 700,
                            mb: 0.5,
                            color: colors.text,
                        }}
                    >
                        {item.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                            label={item.category || 'Article'}
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.6rem',
                                fontFamily: '"Courier New", monospace',
                                bgcolor: 'transparent',
                                border: '1px solid',
                                borderColor: colors.border,
                                borderRadius: 0,
                                color: colors.textSecondary,
                            }}
                        />
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Whatshot sx={{ fontSize: 12, color: colors.accent }} />
                            <Typography variant="caption" sx={{ fontFamily: '"Courier New", monospace', color: colors.accent }}>
                                {item.trending || Math.floor(Math.random() * 50) + 50}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </ListItem>
    );
};

// Stats Widget
const StatsWidget = ({ stats }) => {
    const { colors } = useTheme();
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                border: '1px solid',
                borderColor: colors.border,
                bgcolor: alpha(colors.surface, 0.3),
            }}
        >
            <Typography
                sx={{
                    fontFamily: '"Times New Roman", Times, serif',
                    fontWeight: 700,
                    mb: 2,
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    letterSpacing: '0.05em',
                    color: colors.text,
                }}
            >
                Your Reading Stats
            </Typography>
            <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: '0.75rem', color: colors.textSecondary }}>
                        Total Articles
                    </Typography>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        {stats.totalArticles}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: '0.75rem', color: colors.textSecondary }}>
                        Saved
                    </Typography>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        {stats.savedArticles}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: '0.75rem', color: colors.textSecondary }}>
                        Completed
                    </Typography>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        {stats.completedReads}
                    </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                    <Typography sx={{ fontFamily: '"Courier New", monospace', fontSize: '0.75rem', color: colors.textSecondary }}>
                        Day Streak
                    </Typography>
                    <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', fontWeight: 700, color: colors.text }}>
                        {stats.readingStreak} days
                    </Typography>
                </Stack>
            </Stack>
        </Paper>
    );
};

// Continue Reading Item Component
const ContinueReadingItem = ({ item, onClick }) => {
    const { colors } = useTheme();
    return (
        <ListItem
            button
            onClick={() => onClick?.(item.id)}
            sx={{
                px: 0,
                py: 1,
                borderBottom: '1px solid',
                borderColor: colors.border,
                '&:hover': {
                    backgroundColor: alpha(colors.surface, 0.5),
                },
            }}
        >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%' }}>
                <MenuBook sx={{ fontSize: 16, color: colors.accent }} />
                <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                        sx: {
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            color: colors.text,
                        }
                    }}
                    secondary={`${item.progress}% complete`}
                    secondaryTypographyProps={{
                        sx: {
                            fontFamily: '"Courier New", monospace',
                            fontSize: '0.65rem',
                            color: colors.accent,
                        }
                    }}
                />
            </Stack>
        </ListItem>
    );
};

export default function RightWidgets({
    trendingItems = [],
    continueReading = [],
    onArticleClick,
    stats,
    showWeather = true,
}) {
    const { colors } = useTheme();

    return (
        <Stack spacing={3}>
            {/* Weather Widget */}
            {showWeather && <WeatherWidget />}

            {/* Stats Widget */}
            {stats && <StatsWidget stats={stats} />}

            {/* Trending Widget */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: colors.border,
                    bgcolor: colors.background,
                }}
            >
                <WidgetHeader
                    icon={<TrendingUp sx={{ fontSize: 20 }} />}
                    title="Trending Now"
                />
                <List disablePadding>
                    {trendingItems.length > 0 ? (
                        trendingItems.map((item, index) => (
                            <TrendingItem
                                key={item.id || index}
                                item={item}
                                index={index}
                                onClick={onArticleClick}
                            />
                        ))
                    ) : (
                        <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: colors.textSecondary, py: 2 }}>
                            No trending items
                        </Typography>
                    )}
                </List>
            </Paper>

            {/* Continue Reading Widget */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: colors.border,
                    bgcolor: colors.background,
                }}
            >
                <WidgetHeader
                    icon={<AccessTime sx={{ fontSize: 20 }} />}
                    title="Continue Reading"
                />
                <List disablePadding>
                    {continueReading.length > 0 ? (
                        continueReading.map((item, index) => (
                            <ContinueReadingItem
                                key={item.id || index}
                                item={item}
                                onClick={onArticleClick}
                            />
                        ))
                    ) : (
                        <Typography sx={{ fontFamily: '"Times New Roman", Times, serif', color: colors.textSecondary, py: 2 }}>
                            No articles in progress
                        </Typography>
                    )}
                </List>
            </Paper>

            {/* Newspaper Quote */}
            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: colors.border,
                    bgcolor: alpha(colors.accent, 0.05),
                    fontStyle: 'italic',
                }}
            >
                <Typography
                    sx={{
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: '0.85rem',
                        color: colors.textSecondary,
                        textAlign: 'center',
                    }}
                >
                    "The student press is the voice of tomorrow's leaders."
                </Typography>
                <Typography
                    sx={{
                        fontFamily: '"Courier New", monospace',
                        fontSize: '0.65rem',
                        color: colors.accent,
                        textAlign: 'center',
                        mt: 1,
                    }}
                >
                    — FYI Editorial Board
                </Typography>
            </Paper>
        </Stack>
    );
}
