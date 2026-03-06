import { Box, Chip, Paper, Stack, Typography, Avatar, Tooltip, alpha, useTheme } from '@mui/material';
import {
  TrendingUp,
  Whatshot,
  AccessTime,
  PlayCircle,
} from '@mui/icons-material';
import { COLORS, DARK_COLORS } from './dashboardTheme';

// Widget Header Component
const WidgetHeader = ({ icon, title, badge }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2.5 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color: isDark ? DARK_COLORS.softPink : COLORS.softPink, display: 'flex' }}>
          {icon}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {title}
        </Typography>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              bgcolor: alpha(COLORS.warning, 0.1),
              color: COLORS.warning,
              height: 20,
              fontSize: '0.7rem',
              borderRadius: 1,
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};

// Trending Item Component
const TrendingItem = ({ item, index, onClick, isDark }) => (
  <Paper
    elevation={0}
    onClick={() => onClick?.(item.id)}
    sx={{
      p: 2,
      borderRadius: 2,
      border: `1px solid transparent`,
      bgcolor: 'transparent',
      cursor: 'pointer',
      transition: 'all 200ms ease',
      '&:hover': {
        bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.05) : alpha(COLORS.softPink, 0.03),
        transform: 'translateX(4px)',
      },
    }}
  >
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar
        sx={{
          width: 28,
          height: 28,
          bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.1) : alpha(COLORS.softPink, 0.1),
          color: isDark ? DARK_COLORS.softPink : COLORS.softPink,
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        {index + 1}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: 'text.primary',
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
              bgcolor: isDark ? alpha(DARK_COLORS.royalPurple, 0.2) : alpha(COLORS.royalPurple, 0.1),
              color: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
              borderRadius: 1,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Whatshot sx={{ fontSize: 12, color: COLORS.warning }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {item.trending || Math.floor(Math.random() * 50) + 50}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Paper>
);

// Continue Reading Item Component
const ContinueReadingItem = ({ item, onClick, isDark }) => (
  <Paper
    elevation={0}
    onClick={() => onClick?.(item.id)}
    sx={{
      p: 2,
      borderRadius: 2,
      border: `1px solid ${isDark ? alpha(DARK_COLORS.border, 0.3) : alpha(COLORS.mediumPurple, 0.1)}`,
      cursor: 'pointer',
      transition: 'all 200ms ease',
      bgcolor: 'background.paper',
      '&:hover': {
        borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
        bgcolor: isDark ? alpha(DARK_COLORS.softPink, 0.02) : alpha(COLORS.softPink, 0.02),
      },
    }}
  >
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {item.title}
        </Typography>
        <Tooltip title="Continue reading">
          <PlayCircle sx={{ fontSize: 18, color: isDark ? DARK_COLORS.softPink : COLORS.softPink }} />
        </Tooltip>
      </Stack>
    </Stack>
  </Paper>
);

export default function RightWidgets({
  trendingItems = [],
  continueReading = [],
  textPrimary,
  textSecondary,
  borderColor,
  onArticleClick,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Stack spacing={{ xs: 2, md: 3 }}>
      {/* Trending Widget */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: `1px solid ${isDark ? alpha(DARK_COLORS.border, 0.3) : alpha(COLORS.mediumPurple, 0.1)}`,
          bgcolor: 'background.paper',
        }}
      >
        <WidgetHeader
          icon={<TrendingUp sx={{ fontSize: 20 }} />}
          title="Trending Now"
          badge="Live"
        />

        <Box
          sx={{
            maxHeight: { xs: 280, md: 340 },
            overflowY: 'auto',
            pr: 0.5,
            mr: -0.5,
          }}
        >
          <Stack spacing={0.5}>
            {trendingItems.map((item, index) => (
              <TrendingItem
                key={item.id || index}
                item={item}
                index={index}
                onClick={onArticleClick}
                isDark={isDark}
              />
            ))}
          </Stack>
        </Box>

        {trendingItems.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
            No trending items
          </Typography>
        )}
      </Paper>

      {/* Continue Reading Widget */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: `1px solid ${isDark ? alpha(DARK_COLORS.border, 0.3) : alpha(COLORS.mediumPurple, 0.1)}`,
          bgcolor: 'background.paper',
        }}
      >
        <WidgetHeader
          icon={<AccessTime sx={{ fontSize: 20 }} />}
          title="Continue Reading"
        />

        <Box
          sx={{
            maxHeight: { xs: 280, md: 340 },
            overflowY: 'auto',
            pr: 0.5,
            mr: -0.5,
          }}
        >
          <Stack spacing={1.5}>
            {continueReading.length > 0 ? (
              continueReading.map((item, index) => (
                <ContinueReadingItem
                  key={item.id || index}
                  item={item}
                  onClick={onArticleClick}
                  isDark={isDark}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
                No articles in progress
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
