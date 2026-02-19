import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CreatePost from '@/Components/CreatePost';
import PostCard from '@/Components/PostCard';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Stack,
    Avatar,
    AvatarGroup,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    Groups as GroupsIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    ArrowRight as ArrowRightIcon,
    Star as StarIcon,
} from '@mui/icons-material';

export default function Dashboard() {
    const [learnMoreOpen, setLearnMoreOpen] = useState(false);

    const handleLearnMore = () => {
        setLearnMoreOpen(true);
    };

    const handleCloseLearnMore = () => {
        setLearnMoreOpen(false);
    };

    const samplePosts = [
        {
            id: 1,
            author: 'John Manager',
            avatar: 'J',
            timestamp: '2 hours ago',
            content: '🎉 Great news! Our Q1 project just hit 100% completion. Amazing work by the entire team!',
            image: null,
            likes: 24,
            comments: 5,
        },
        {
            id: 2,
            author: 'Sarah Designer',
            avatar: 'S',
            timestamp: '4 hours ago',
            content: 'Just finished the new UI mockups for the mobile app. Check the design system updates in the project documentation. Feedback welcome! 🎨',
            image: null,
            likes: 18,
            comments: 8,
        },
        {
            id: 3,
            author: 'Mike Developer',
            avatar: 'M',
            timestamp: '6 hours ago',
            content: 'Deployed the API v2.0 to production. All tests passing, performance improvements are live! 🚀',
            image: null,
            likes: 32,
            comments: 12,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <Box sx={{
                background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #1a365d 100%)',
                minHeight: '100vh',
                py: 6,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    pointerEvents: 'none',
                },
            }}>
                <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

                    {/* Hero Section */}
                    <Box sx={{
                        mb: 8,
                        perspective: '1000px',
                    }}>
                        <Paper sx={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: 4,
                            overflow: 'hidden',
                            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            position: 'relative',
                        }}>
                            <Box sx={{
                                background: `linear-gradient(135deg, rgba(67, 56, 202, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%),
                                           url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgba(255,255,255,0.1);stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:rgba(255,255,255,0);stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='600' fill='url(%23grad)' /%3E%3C/svg%3E")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                p: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                minHeight: '400px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}>
                                {/* Left Content */}
                                <Box sx={{ flex: 1, zIndex: 2, pr: 4 }}>
                                    <Typography variant="overline" sx={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontWeight: 700,
                                        letterSpacing: '2px',
                                        mb: 2,
                                    }}>
                                        WELCOME
                                    </Typography>
                                    <Typography variant="h2" sx={{
                                        color: 'white',
                                        fontWeight: 900,
                                        mb: 2,
                                        letterSpacing: '-1px',
                                        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                                    }}>
                                        Manage Your Business <br /> Like Never Before
                                    </Typography>
                                    <Typography variant="h6" sx={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontWeight: 300,
                                        mb: 4,
                                        maxWidth: '500px',
                                        lineHeight: 1.8,
                                    }}>
                                        Bring teams together, track project progress, and accelerate results with our next-generation project management platform.
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        <Link href="/projects">
                                            <Button
                                                variant="contained"
                                                size="large"
                                                endIcon={<ArrowRightIcon />}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    px: 4,
                                                    py: 1.5,
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    fontSize: '1rem',
                                                    boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                                                    transition: 'all 0.3s ease',
                                                    '&:hover': {
                                                        boxShadow: '0 15px 40px rgba(102, 126, 234, 0.6)',
                                                        transform: 'translateY(-3px)',
                                                    }
                                                }}
                                            >
                                                View Projects
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            onClick={handleLearnMore}
                                            sx={{
                                                color: 'white',
                                                borderColor: 'rgba(255, 255, 255, 0.5)',
                                                fontWeight: 700,
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    borderColor: 'white',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                }
                                            }}
                                        >
                                            Learn More
                                        </Button>
                                    </Stack>
                                </Box>

                                {/* Right Decorative Element */}
                                <Box sx={{
                                    position: 'absolute',
                                    right: -50,
                                    top: -50,
                                    width: 400,
                                    height: 400,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
                                    zIndex: 0,
                                }} />
                                <Box sx={{
                                    position: 'absolute',
                                    right: 50,
                                    bottom: -100,
                                    width: 300,
                                    height: 300,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                                    zIndex: 0,
                                }} />
                            </Box>
                        </Paper>
                    </Box>

                    {/* Key Metrics */}
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                        {[
                            {
                                icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#667eea' }} />,
                                title: 'Active Projects',
                                value: '12',
                                subtitle: '+3 this week',
                                color: '#667eea',
                            },
                            {
                                icon: <CheckCircleIcon sx={{ fontSize: 40, color: '#48bb78' }} />,
                                title: 'Completed',
                                value: '45',
                                subtitle: '+8 this month',
                                color: '#48bb78',
                            },
                            {
                                icon: <GroupsIcon sx={{ fontSize: 40, color: '#4299e1' }} />,
                                title: 'Team Members',
                                value: '24',
                                subtitle: '+2 new members',
                                color: '#4299e1',
                            },
                            {
                                icon: <ScheduleIcon sx={{ fontSize: 40, color: '#ed8936' }} />,
                                title: 'Upcoming Tasks',
                                value: '18',
                                subtitle: 'This week',
                                color: '#ed8936',
                            },
                        ].map((metric, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Paper sx={{
                                    p: 3,
                                    borderRadius: 3,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: metric.color,
                                    },
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 15px 48px rgba(0, 0, 0, 0.15)',
                                    }
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: 2,
                                            background: `linear-gradient(135deg, ${metric.color}15 0%, ${metric.color}05 100%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {metric.icon}
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#a0aec0', fontWeight: 600, mb: 1, display: 'block' }}>
                                        {metric.title}
                                    </Typography>
                                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a202c', mb: 1 }}>
                                        {metric.value}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#718096', fontWeight: 500 }}>
                                        {metric.subtitle}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Main Content Grid */}
                    <Grid container spacing={4}>
                        {/* Left Column - Feed */}
                        <Grid item xs={12} md={8}>
                            {/* Create Post Card */}
                            <Box sx={{ mb: 4 }}>
                                <CreatePost />
                            </Box>

                            {/* Team Updates Section */}
                            <Paper sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                mb: 4,
                                p: 4,
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                        👥 Team Updates
                                    </Typography>
                                    <Button sx={{ color: '#667eea', fontWeight: 600, textTransform: 'none' }}>
                                        View All
                                    </Button>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 3, overflowX: 'auto', pb: 2 }}>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Box key={i} sx={{ flex: '0 0 auto' }}>
                                            <Box sx={{
                                                width: 80,
                                                height: 100,
                                                borderRadius: 2,
                                                background: `linear-gradient(135deg, hsl(${i * 72}, 70%, 60%) 0%, hsl(${i * 72}, 70%, 40%) 100%)`,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                                                }
                                            }}>
                                                <Typography sx={{ fontSize: 32, mb: 1 }}>👤</Typography>
                                                <Typography sx={{ fontSize: '0.7rem', textAlign: 'center', fontWeight: 600 }}>
                                                    User {i}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>

                            {/* Feed */}
                            <Box sx={{ space: 4 }}>
                                {samplePosts.map((post) => (
                                    <Box key={post.id} sx={{ mb: 3 }}>
                                        <PostCard {...post} />
                                    </Box>
                                ))}
                            </Box>

                            {/* Load More */}
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Button
                                    sx={{
                                        px: 6,
                                        py: 1.5,
                                        color: '#667eea',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        fontSize: '1rem',
                                        borderRadius: 2,
                                        border: '2px solid #667eea',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            boxShadow: '0 5px 15px rgba(102, 126, 234, 0.2)',
                                        }
                                    }}
                                >
                                    Load More Posts
                                </Button>
                            </Box>
                        </Grid>

                        {/* Right Column - Widgets */}
                        <Grid item xs={12} md={4}>
                            {/* Quick Actions */}
                            <Paper sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                mb: 3,
                                p: 3,
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                                    ⚡ Quick Actions
                                </Typography>
                                <Stack spacing={2}>
                                    <Link href="/projects">
                                        <Button
                                            fullWidth
                                            sx={{
                                                justifyContent: 'flex-start',
                                                color: '#667eea',
                                                fontWeight: 600,
                                                textTransform: 'none',
                                                fontSize: '0.95rem',
                                                py: 1.5,
                                                '&:hover': {
                                                    background: 'rgba(102, 126, 234, 0.1)',
                                                }
                                            }}
                                        >
                                            📋 View All Projects
                                        </Button>
                                    </Link>
                                    <Button
                                        fullWidth
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: '#4299e1',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            '&:hover': {
                                                background: 'rgba(66, 153, 225, 0.1)',
                                            }
                                        }}
                                    >
                                        ➕ Create New Project
                                    </Button>
                                    <Button
                                        fullWidth
                                        sx={{
                                            justifyContent: 'flex-start',
                                            color: '#48bb78',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            py: 1.5,
                                            '&:hover': {
                                                background: 'rgba(72, 187, 120, 0.1)',
                                            }
                                        }}
                                    >
                                        👥 Invite Team
                                    </Button>
                                </Stack>
                            </Paper>

                            {/* Top Performers */}
                            <Paper sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                mb: 3,
                                p: 3,
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                                    ⭐ Top Performers
                                </Typography>
                                {[
                                    { name: 'John Doe', role: 'Project Lead', score: 95 },
                                    { name: 'Sarah Smith', role: 'Designer', score: 88 },
                                    { name: 'Mike Johnson', role: 'Developer', score: 92 },
                                ].map((performer, index) => (
                                    <Box key={index} sx={{ mb: 2.5, pb: 2.5, borderBottom: index < 2 ? '1px solid #e2e8f0' : 'none' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Avatar sx={{
                                                    width: 40,
                                                    height: 40,
                                                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                                                    fontWeight: 700,
                                                }}>
                                                    {performer.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                                        {performer.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#718096' }}>
                                                        {performer.role}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Chip
                                                icon={<StarIcon />}
                                                label={performer.score}
                                                sx={{
                                                    background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </Paper>

                            {/* Coming This Week */}
                            <Paper sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                p: 3,
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                                    📅 This Week
                                </Typography>
                                <Stack spacing={2}>
                                    {[
                                        { day: 'Monday', event: 'Team Meeting', time: '10:00 AM' },
                                        { day: 'Wednesday', event: 'Project Review', time: '2:00 PM' },
                                        { day: 'Friday', event: 'Demo Day', time: '4:00 PM' },
                                    ].map((item, index) => (
                                        <Box key={index} sx={{
                                            p: 2,
                                            borderLeft: '4px solid #667eea',
                                            background: '#f7fafc',
                                            borderRadius: 1,
                                        }}>
                                            <Typography variant="caption" sx={{ color: '#718096', fontWeight: 600 }}>
                                                {item.day}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a202c' }}>
                                                {item.event}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#a0aec0' }}>
                                                {item.time}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Learn More Dialog */}
            <Dialog
                open={learnMoreOpen}
                onClose={handleCloseLearnMore}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                    }
                }}
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.5rem',
                }}>
                    🚀 About BizHub
                </DialogTitle>
                <DialogContent sx={{ py: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                        Welcome to BizHub
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', mb: 3, lineHeight: 1.8 }}>
                        BizHub is a modern project management platform designed to help teams collaborate, track progress, and deliver results faster.
                    </Typography>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                        ✨ Key Features
                    </Typography>
                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            <strong>📋 Project Management:</strong> Create, organize, and track all your projects in one place
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            <strong>✅ Task Tracking:</strong> Break down projects into manageable tasks with priorities and deadlines
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            <strong>📊 Real-time Progress:</strong> Monitor project completion rates and team productivity
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            <strong>👥 Team Collaboration:</strong> Work seamlessly with your team with shared updates and notifications
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#718096' }}>
                            <strong>💬 Activity Feed:</strong> Stay connected with team announcements and project updates
                        </Typography>
                    </Stack>

                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1a202c', mb: 2 }}>
                        🎯 Getting Started
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#718096', lineHeight: 1.8 }}>
                        Start by creating your first project, then add tasks and assign them to team members. Track progress in real-time and celebrate wins together!
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
                    <Button
                        onClick={handleCloseLearnMore}
                        sx={{ color: '#718096', fontWeight: 600 }}
                    >
                        Close
                    </Button>
                    <Link href="/projects">
                        <Button
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 700,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                            }}
                        >
                            Explore Projects
                        </Button>
                    </Link>
                </DialogActions>
            </Dialog>
        </AuthenticatedLayout>
    );
}
