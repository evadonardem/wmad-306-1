import { Head, Link } from '@inertiajs/react';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />

            <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9' }}>
                {/* Navigation */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#064E3B' }}>
                    <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
                        <SchoolIcon sx={{ mr: 1.5, fontSize: 32 }} />
                        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                            Highland Scholar
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {auth.user ? (
                                <Button
                                    component={Link}
                                    href={route('dashboard')}
                                    variant="outlined"
                                    sx={{
                                        color: '#FAFAF9',
                                        borderColor: 'rgba(250,250,249,0.4)',
                                        '&:hover': { borderColor: '#FAFAF9', bgcolor: 'rgba(250,250,249,0.1)' },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        component={Link}
                                        href={route('login')}
                                        sx={{ color: '#FAFAF9', '&:hover': { bgcolor: 'rgba(250,250,249,0.1)' } }}
                                    >
                                        Log In
                                    </Button>
                                    <Button
                                        component={Link}
                                        href={route('register')}
                                        variant="contained"
                                        sx={{
                                            bgcolor: '#C2410C',
                                            '&:hover': { bgcolor: '#9A3412' },
                                        }}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Toolbar>
                </AppBar>

                {/* Hero Section */}
                <Box
                    sx={{
                        bgcolor: '#064E3B',
                        color: '#FAFAF9',
                        py: { xs: 8, md: 12 },
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(ellipse at 30% 50%, rgba(13,115,84,0.4) 0%, transparent 70%)',
                        },
                    }}
                >
                    <Container maxWidth="md" sx={{ position: 'relative' }}>
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                            Student Article Publication Platform
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, color: 'rgba(250,250,249,0.85)', fontWeight: 400, maxWidth: 600, mx: 'auto' }}>
                            Write, review, and publish scholarly articles in a collaborative academic environment.
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                component={Link}
                                href={route('register')}
                                variant="contained"
                                size="large"
                                sx={{
                                    bgcolor: '#C2410C',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': { bgcolor: '#9A3412' },
                                }}
                            >
                                Get Started
                            </Button>
                            <Button
                                component={Link}
                                href={route('login')}
                                variant="outlined"
                                size="large"
                                sx={{
                                    color: '#FAFAF9',
                                    borderColor: 'rgba(250,250,249,0.4)',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    '&:hover': { borderColor: '#FAFAF9', bgcolor: 'rgba(250,250,249,0.1)' },
                                }}
                            >
                                Sign In
                            </Button>
                        </Stack>
                    </Container>
                </Box>

                {/* Role Cards */}
                <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1C1917', mb: 1 }}>
                        Three Roles, One Platform
                    </Typography>
                    <Typography variant="body1" align="center" sx={{ color: '#57534E', mb: 6, maxWidth: 600, mx: 'auto' }}>
                        Whether you write, review, or read — Highland Scholar gives every voice a place.
                    </Typography>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 4 }}>
                        {/* Writer */}
                        <Card elevation={2} sx={{ borderTop: '4px solid #064E3B', height: '100%' }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(6,78,59,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                    <EditNoteIcon sx={{ fontSize: 32, color: '#064E3B' }} />
                                </Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Writer</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Draft articles with a rich text editor, submit for editorial review, and revise based on feedback.
                                </Typography>
                                <Stack spacing={0.5} alignItems="center">
                                    {['Create & edit articles', 'Rich Jodit Editor', 'Submit for review', 'Track article status'].map((item) => (
                                        <Typography key={item} variant="caption" color="text.secondary">
                                            &#x2713; {item}
                                        </Typography>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Editor */}
                        <Card elevation={2} sx={{ borderTop: '4px solid #C2410C', height: '100%' }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(194,65,12,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                    <RateReviewIcon sx={{ fontSize: 32, color: '#C2410C' }} />
                                </Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Editor</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Review submitted articles, provide revision feedback, and publish approved content.
                                </Typography>
                                <Stack spacing={0.5} alignItems="center">
                                    {['Review submissions', 'Request revisions', 'Publish articles', 'Revision history'].map((item) => (
                                        <Typography key={item} variant="caption" color="text.secondary">
                                            &#x2713; {item}
                                        </Typography>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Student */}
                        <Card elevation={2} sx={{ borderTop: '4px solid #15803D', height: '100%' }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(21,128,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                                    <AutoStoriesIcon sx={{ fontSize: 32, color: '#15803D' }} />
                                </Box>
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Student</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Browse published articles, read full content, and engage with writers through comments.
                                </Typography>
                                <Stack spacing={0.5} alignItems="center">
                                    {['Read published articles', 'Post comments', 'Engage with authors', 'Academic resources'].map((item) => (
                                        <Typography key={item} variant="caption" color="text.secondary">
                                            &#x2713; {item}
                                        </Typography>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>

                {/* Footer */}
                <Box sx={{ py: 4, textAlign: 'center', borderTop: '1px solid #E7E5E4' }}>
                    <Typography variant="body2" color="text.secondary">
                        Highland Scholar &copy; {new Date().getFullYear()} &mdash; Student Article Publication Platform
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
