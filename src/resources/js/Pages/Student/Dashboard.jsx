import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Stack,
    Typography,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import CommentIcon from '@mui/icons-material/Comment';

export default function StudentDashboard({ articles }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Student Dashboard</Typography>}
        >
            <Head title="Student Dashboard" />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {flash?.success && (
                    <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>
                )}

                <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                    Published Articles
                </Typography>

                {articles.data.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <ArticleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography color="text.secondary">
                            No published articles yet. Check back later!
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                        {articles.data.map((article) => (
                            <Box key={article.id}>
                                <Card
                                    elevation={2}
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: '.2s',
                                        '&:hover': { elevation: 6, transform: 'translateY(-2px)' },
                                    }}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Chip
                                                label={article.category?.name}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </Stack>
                                        <Typography variant="h6" component="h2" gutterBottom sx={{ lineHeight: 1.4 }}>
                                            {article.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            By {article.writer?.name} &bull;{' '}
                                            {new Date(article.updated_at).toLocaleDateString()}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mt: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: article.content?.replace(/<[^>]+>/g, '').slice(0, 150) + '...',
                                            }}
                                        />
                                    </CardContent>
                                    <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <CommentIcon fontSize="small" color="action" />
                                            <Typography variant="caption" color="text.secondary">
                                                {article.comments?.length ?? 0} comments
                                            </Typography>
                                        </Stack>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            component={Link}
                                            href={route('student.show', article.id)}
                                        >
                                            Read More
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Pagination */}
                {articles.last_page > 1 && (
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 4 }}>
                        {articles.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'contained' : 'outlined'}
                                size="small"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Button>
                        ))}
                    </Stack>
                )}

            </Container>
        </AuthenticatedLayout>
    );
}
