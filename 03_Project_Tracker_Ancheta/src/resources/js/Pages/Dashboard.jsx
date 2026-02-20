import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  LinearProgress,
  Chip,
  List,
  ListItem,
  Divider,
  IconButton,
  Avatar,
  Paper,
  Tooltip,
  Container,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  PendingActions,
  Timeline,
  TrendingUp,
  TrendingDown,
  Refresh,
  DateRange,
  Task,
  Folder,
  Speed as SpeedIcon,
  EmojiEvents as TrophyIcon,
  RocketLaunch as RocketIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

export default function Dashboard({
  stats,
  priorityBreakdown,
  recentActivity,
  projects = [],
}) {
  const { colors, isDarkMode, getGradient } = useTheme();

  // Helper functions
  const getPriorityColor = (priority) => {
    if (typeof priority === 'string') {
      return priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981';
    }
    return priority === 3 ? '#EF4444' : priority === 2 ? '#F59E0B' : '#10B981';
  };

  const getPriorityBgColor = (priority) => {
    const color = getPriorityColor(priority);
    return `${color}20`;
  };

  const getPriorityLabel = (priority) => {
    if (typeof priority === 'string') {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    }
    return ['Low', 'Medium', 'High'][priority - 1] || 'Medium';
  };

  // Calculate metrics
  const totalTasks = stats.totalTasks || 0;
  const completedTasks = stats.completedTasks || 0;
  const pendingTasks = stats.pendingTasks || 0;
  const totalProjects = stats.totalProjects || projects.length || 0;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const productivityScore = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority chart data
  const priorityData = [
    { name: 'High', value: priorityBreakdown?.high || 0, color: '#EF4444' },
    { name: 'Medium', value: priorityBreakdown?.medium || 0, color: '#F59E0B' },
    { name: 'Low', value: priorityBreakdown?.low || 0, color: '#10B981' },
  ].filter(item => item.value > 0);

  // Weekly activity data (mock - replace with real data)
  const weeklyData = [
    { day: 'Mon', tasks: 8, completed: 5 },
    { day: 'Tue', tasks: 12, completed: 9 },
    { day: 'Wed', tasks: 10, completed: 7 },
    { day: 'Thu', tasks: 15, completed: 12 },
    { day: 'Fri', tasks: 9, completed: 8 },
    { day: 'Sat', tasks: 5, completed: 4 },
    { day: 'Sun', tasks: 4, completed: 3 },
  ];

  // Project progress data
  const projectProgressData = projects.map(project => ({
    name: project.title,
    progress: project.progress || Math.round((project.completed_tasks / project.total_tasks) * 100) || 0,
    total: project.total_tasks || 0,
    completed: project.completed_tasks || 0,
    dueDate: project.due_date || 'No due date',
  }));

  // Card styles
  const cardStyle = {
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(245, 247, 250, 0.95))',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    border: `1px solid ${colors.border}`,
    boxShadow: isDarkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    height: '100%',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: isDarkMode
        ? '0 16px 48px rgba(0, 0, 0, 0.4)'
        : '0 16px 48px rgba(0, 0, 0, 0.12)',
    },
  };

  const gradientCardStyle = {
    ...cardStyle,
    background: getGradient(),
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 16px 48px ${colors.primary}60`,
    },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // KPI Card Component
  const KPICard = ({ title, value, icon: Icon, trend, color = colors.primary, subtitle }) => (
    <MotionCard
      variants={itemVariants}
      sx={cardStyle}
    >
      {/* Gradient Accent Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: getGradient(),
        }}
      />

      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: colors.textSecondary,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.7rem',
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: colors.textPrimary,
                lineHeight: 1.2,
                fontSize: '2rem',
                mt: 0.5,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: colors.textSecondary,
                  display: 'block',
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}20`,
              width: 48,
              height: 48,
            }}
          >
            <Icon sx={{ color, fontSize: 24 }} />
          </Avatar>
        </Stack>

        {trend !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 2 }}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: '6px',
                bgcolor: trend >= 0 ? `${colors.success}20` : `${colors.danger}20`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {trend >= 0 ? (
                <TrendingUp sx={{ fontSize: 14, color: colors.success }} />
              ) : (
                <TrendingDown sx={{ fontSize: 14, color: colors.danger }} />
              )}
            </Box>
            <Typography variant="caption" sx={{
              color: trend >= 0 ? colors.success : colors.danger,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}>
              {Math.abs(trend)}% from last week
            </Typography>
          </Stack>
        )}
      </CardContent>
    </MotionCard>
  );

  return (
    <AuthenticatedLayout
      header={
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: '100%', py: 1 }}
          >
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  background: getGradient(),
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.textSecondary,
                  display: 'block',
                  mt: 0.5,
                }}
              >
                Welcome! Here's your performance overview
              </Typography>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
            </MotionBox>
          </Stack>
        </Container>
      }
    >
      <Head title="Dashboard" />

      <Container maxWidth="xl" sx={{ py: 0, px: { xs: 2, sm: 3 } }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Banner */}
          <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
            <Paper
              sx={{
                ...cardStyle,
                p: 3,
                background: isDarkMode
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(56, 189, 248, 0.2))'
                  : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(56, 189, 248, 0.1))',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      background: getGradient(),
                      boxShadow: `0 4px 12px ${colors.primary}60`,
                    }}
                  >
                    <RocketIcon sx={{ fontSize: 32, color: '#fff' }} />
                  </Avatar>
                </Zoom>
                <Box>
                  <Typography variant="h6" sx={{ color: colors.textPrimary, fontWeight: 700 }}>
                    You're making great progress!
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    {completedTasks} tasks completed • {totalProjects} active projects
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </MotionBox>

          {/* KPI Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Total Projects"
                value={totalProjects}
                icon={Folder}
                trend={8}
                color={colors.primary}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Completed Tasks"
                value={completedTasks}
                icon={CheckCircle}
                trend={12}
                color={colors.success}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Pending Tasks"
                value={pendingTasks}
                icon={PendingActions}
                trend={-5}
                color={colors.warning}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Productivity"
                value={`${productivityScore}%`}
                icon={SpeedIcon}
                trend={productivityScore > 50 ? 5 : -3}
                color={colors.info}
                subtitle={`${completionRate}% completion rate`}
              />
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Priority Distribution */}
            <Grid item xs={12} md={5}>
              <MotionCard variants={itemVariants} sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                      Priority Distribution
                    </Typography>
                    <Chip
                      label="Tasks"
                      size="small"
                      sx={{
                        background: `${colors.primary}15`,
                        color: colors.primary,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  {priorityData.length > 0 ? (
                    <>
                      <Box sx={{ height: 200, mb: 2 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={priorityData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {priorityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: colors.surface,
                                border: `1px solid ${colors.border}`,
                                borderRadius: '8px',
                                fontSize: '12px',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>

                      <Stack spacing={1.5}>
                        {priorityData.map((item) => (
                          <Stack key={item.name} direction="row" alignItems="center" spacing={1}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                            <Typography variant="body2" sx={{ color: colors.textSecondary, flex: 1 }}>
                              {item.name} Priority
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                              {item.value}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              ({Math.round((item.value / totalTasks) * 100)}%)
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography sx={{ color: colors.textSecondary }}>
                        No tasks available
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </MotionCard>
            </Grid>

            {/* Weekly Activity */}
            <Grid item xs={12} md={7}>
              <MotionCard variants={itemVariants} sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                      Weekly Activity
                    </Typography>
                    <Chip
                      icon={<Timeline />}
                      label="Last 7 days"
                      size="small"
                      sx={{
                        background: `${colors.info}15`,
                        color: colors.info,
                        fontWeight: 600,
                      }}
                    />
                  </Stack>

                  <Box sx={{ height: 200 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                        <XAxis dataKey="day" stroke={colors.textSecondary} />
                        <YAxis stroke={colors.textSecondary} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="tasks" fill={colors.primary} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completed" fill={colors.success} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>

          {/* Project Progress */}
          {projectProgressData.length > 0 && (
            <MotionBox variants={itemVariants} sx={{ mb: 4 }}>
              <Card sx={cardStyle}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary, mb: 3 }}>
                    Project Progress
                  </Typography>

                  <Grid container spacing={3}>
                    {projectProgressData.slice(0, 3).map((project, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                          <Paper
                            sx={{
                              p: 2,
                              background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                              borderRadius: '12px',
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary, mb: 1 }}>
                              {project.name}
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                Progress
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.primary, fontWeight: 600 }}>
                                {project.progress}%
                              </Typography>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={project.progress}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                backgroundColor: colors.border,
                                '& .MuiLinearProgress-bar': {
                                  background: getGradient(),
                                  borderRadius: 3,
                                },
                                mb: 1,
                              }}
                            />
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {project.completed}/{project.total} tasks
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {project.dueDate}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Fade>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </MotionBox>
          )}

          {/* Recent Activity */}
          <MotionBox variants={itemVariants}>
            <Card sx={cardStyle}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                    Recent Activity
                  </Typography>
                  <Chip
                    icon={<StarIcon />}
                    label="Latest updates"
                    size="small"
                    sx={{
                      background: `${colors.warning}15`,
                      color: colors.warning,
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                {recentActivity?.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {recentActivity.slice(0, 5).map((task, index) => (
                      <Fade in={true} key={task.id} style={{ transitionDelay: `${index * 50}ms` }}>
                        <Box>
                          <ListItem sx={{ px: 0, py: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: getPriorityBgColor(task.priority),
                                }}
                              >
                                <Task sx={{ color: getPriorityColor(task.priority) }} />
                              </Avatar>

                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                                  {task.title}
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                  <Link
                                    href={route('projects.show', task.project_id)}
                                    style={{
                                      color: colors.primary,
                                      textDecoration: 'none',
                                      fontSize: '0.75rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {task.project?.title}
                                  </Link>
                                  <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: colors.divider }} />
                                  <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                    {new Date(task.created_at).toLocaleDateString()}
                                  </Typography>
                                </Stack>
                              </Box>

                              <Chip
                                label={getPriorityLabel(task.priority)}
                                size="small"
                                sx={{
                                  height: 24,
                                  backgroundColor: getPriorityBgColor(task.priority),
                                  color: getPriorityColor(task.priority),
                                  fontWeight: 600,
                                }}
                              />
                            </Stack>
                          </ListItem>
                          {index < Math.min(recentActivity.length, 5) - 1 && (
                            <Divider sx={{ borderColor: colors.divider }} />
                          )}
                        </Box>
                      </Fade>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography sx={{ color: colors.textSecondary }}>
                      No recent activity
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </MotionBox>
        </MotionBox>
      </Container>
    </AuthenticatedLayout>
  );
}
