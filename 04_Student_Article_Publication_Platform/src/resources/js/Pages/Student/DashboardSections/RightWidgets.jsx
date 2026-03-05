import { Box, Chip, Divider, LinearProgress, Paper, Stack, Typography, Avatar, Tooltip } from '@mui/material';
import {
  TrendingUp,
  Schedule,
  Whatshot,
  AccessTime,
  PlayCircle,
} from '@mui/icons-material';
import { COLORS, DARK_COLORS } from './dashboardTheme';

function WidgetHeader({ icon, title, badge }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box sx={{ color: COLORS.softPink, display: 'flex' }}>{icon}</Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {badge && (
          <Chip
            label={badge}
            size="small"
            sx={{
              bgcolor: COLORS.softPink,
              color: '#fff',
              height: 20,
              fontSize: '0.7rem',
              borderRadius: 1,
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}

function TrendingItem({ item, index, onClick, isDark }) {
  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(item.id)}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: `1px solid transparent`,
        bgcolor: isDark ? `${DARK_COLORS.royalPurple}10` : `${COLORS.royalPurple}05`,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        '&:hover': {
          borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
          transform: 'translateX(4px)',
          bgcolor: isDark ? `${DARK_COLORS.softPink}10` : `${COLORS.softPink}08`,
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
            color: '#fff',
            fontSize: 14,
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
            }}
          >
            {item.title}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={item.category || 'Article'}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                bgcolor: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
                color: '#fff',
                borderRadius: 1,
              }}
            />
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Whatshot sx={{ fontSize: 12, color: COLORS.warning }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {item.trending || Math.floor(Math.random() * 50) + 50}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

function ContinueReadingItem({ item, onClick, isDark }) {
  return (
    <Paper
      elevation={0}
      onClick={() => onClick?.(item.id)}
      sx={{
        p: 1.5,
        borderRadius: 2,
        border: `1px solid ${isDark ? DARK_COLORS.border : COLORS.gray200}`,
        cursor: 'pointer',
        transition: 'all 200ms ease',
        '&:hover': {
          borderColor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${isDark ? DARK_COLORS.softPink : COLORS.softPink}20`,
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {item.title}
          </Typography>
          <Tooltip title="Continue reading">
            <PlayCircle sx={{ fontSize: 20, color: COLORS.softPink }} />
          </Tooltip>
        </Stack>

        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {item.progress}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={item.progress}
            sx={{
              height: 4,
              borderRadius: 2,
              bgcolor: isDark ? DARK_COLORS.border : COLORS.gray200,
              '& .MuiLinearProgress-bar': {
                bgcolor: isDark ? DARK_COLORS.softPink : COLORS.softPink,
                borderRadius: 2,
              },
            }}
          />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {item.readMins} min left
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default function RightWidgets({
  trendingItems = [],
  continueReading = [],
  textPrimary,
  textSecondary,
  borderColor,
  onArticleClick,
}) {
  const isDark = false; // This should come from theme context

  return (
    <Stack spacing={2.5} sx={{ height: '100%' }}>
      {/* Trending Widget - Scrollable */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '400px', // Fixed height for trending section
        }}
      >
        <WidgetHeader
          icon={<TrendingUp />}
          title="Trending Now"
          badge="Live"
        />

        <Box sx={{
          overflowY: 'auto',
          pr: 1,
          mr: -1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDark ? DARK_COLORS.border : COLORS.gray200,
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
            borderRadius: '2px',
            '&:hover': {
              background: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
            },
          },
        }}>
          <Stack spacing={1.5}>
            {trendingItems.length > 0 ? (
              trendingItems.map((item, index) => (
                <TrendingItem
                  key={item.id || index}
                  item={item}
                  index={index}
                  onClick={onArticleClick}
                  isDark={isDark}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No trending items yet
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>

      {/* Continue Reading Widget - Scrollable */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1px solid ${borderColor}`,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '400px', // Fixed height for continue reading section
        }}
      >
        <WidgetHeader
          icon={<AccessTime />}
          title="Continue Reading"
        />

        <Box sx={{
          overflowY: 'auto',
          pr: 1,
          mr: -1,
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: isDark ? DARK_COLORS.border : COLORS.gray200,
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? DARK_COLORS.mediumPurple : COLORS.mediumPurple,
            borderRadius: '2px',
            '&:hover': {
              background: isDark ? DARK_COLORS.royalPurple : COLORS.royalPurple,
            },
          },
        }}>
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
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No articles in progress
              </Typography>
            )}
          </Stack>
        </Box>
      </Paper>
    </Stack>
  );
}
