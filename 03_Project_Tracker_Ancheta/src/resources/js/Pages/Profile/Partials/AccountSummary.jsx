import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Stack,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Folder as ProjectIcon,
  CheckCircle as CompletedIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  LocalFireDepartment as FireIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import { Link } from '@inertiajs/react';

// Completed Project Card Component
const CompletedProjectCard = ({ project }) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${colors.primary}20`,
          borderColor: colors.primary,
        },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: `${colors.success}15`, width: 40, height: 40 }}>
              <CompletedIcon sx={{ color: colors.success, fontSize: 20 }} />
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
                {project.title}
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Completed on {new Date(project.completed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="View Project">
            <IconButton
              component={Link}
              href={route('projects.show', project.id)}
              size="small"
              sx={{
                color: colors.primary,
                '&:hover': { backgroundColor: `${colors.primary}15` },
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {project.description && (
          <Typography variant="body2" sx={{ color: colors.textSecondary, pl: 7 }}>
            {project.description.length > 100
              ? `${project.description.substring(0, 100)}...`
              : project.description}
          </Typography>
        )}

        <Stack direction="row" spacing={1} sx={{ pl: 7 }}>
          <Chip
            label={`${project.tasks_count || 0} tasks`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: `${colors.primary}15`,
              color: colors.primary,
            }}
          />
          <Chip
            label={`${project.completed_tasks || 0} completed`}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.65rem',
              bgcolor: `${colors.success}15`,
              color: colors.success,
            }}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

// Streak Card Component
const StreakCard = ({ currentStreak = 7, longestStreak = 14 }) => {
  const { colors, getGradient } = useTheme();

  return (
    <Paper
      sx={{
        p: 2.5,
        background: getGradient(),
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          opacity: 0.1,
        }}
      >
        <FireIcon sx={{ fontSize: 100, color: '#fff' }} />
      </Box>

      <Stack spacing={2} sx={{ position: 'relative', zIndex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FireIcon sx={{ color: '#fff', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
            Completion Streak
          </Typography>
        </Stack>

        <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />}>
          <Box>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1 }}>
              {currentStreak}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Current Streak
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700, lineHeight: 1 }}>
              {longestStreak}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Longest Streak
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

// Completion Stats Card
const CompletionStatsCard = ({ totalCompleted, completionRate, averageTime }) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <Paper
      sx={{
        p: 2.5,
        background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        height: '100%',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <CompletedIcon sx={{ color: colors.success, fontSize: 24 }} />
          <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 600 }}>
            Completion Overview
          </Typography>
        </Stack>

        <Stack direction="row" spacing={3} divider={<Divider orientation="vertical" flexItem />}>
          <Box>
            <Typography variant="h4" sx={{ color: colors.success, fontWeight: 700 }}>
              {totalCompleted}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              Projects Completed
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: colors.primary, fontWeight: 700 }}>
              {completionRate}%
            </Typography>
            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
              Success Rate
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
              Average completion time
            </Typography>
            <Typography variant="body2" sx={{ color: colors.primary, fontWeight: 600 }}>
              {averageTime} days
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={75}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.border,
              '& .MuiLinearProgress-bar': {
                backgroundColor: colors.success,
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

// Main Account Summary Component
export default function AccountSummary({ user, completedProjects = [] }) {
  const { colors } = useTheme();

  // Calculate stats from completed projects
  const totalCompleted = completedProjects.length;
  const completionRate = Math.min(100, totalCompleted * 8); // Example calculation
  const averageTime = 12; // Example value

  // Mock streak data - replace with real data from backend
  const currentStreak = 7;
  const longestStreak = 14;

  return (
    <Stack spacing={3}>
      {/* Completion Overview */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CompletionStatsCard
            totalCompleted={totalCompleted}
            completionRate={completionRate}
            averageTime={averageTime}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};
