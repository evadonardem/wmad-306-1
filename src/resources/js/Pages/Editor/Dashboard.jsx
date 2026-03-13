import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import RateReviewIcon from '@mui/icons-material/RateReview';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function EditorDashboard({ articlesForReview, needsRevisionArticles, publishedArticles }) {
    const { flash } = usePage().props;
    const [tab, setTab] = useState(0);

    return (
        <AuthenticatedLayout
            header={<Typography variant="h6">Editor Dashboard</Typography>}
        >
            <Head title="Editor Dashboard" />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {flash?.success && (
                    <Alert severity="success" sx={{ mb: 2 }}>{flash.success}</Alert>
                )}
                {flash?.error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{flash.error}</Alert>
                )}

                <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
                    Editor Dashboard
                </Typography>

                <Paper elevation={2}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                    >
                        <Tab
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>Pending Review</span>
                                    <Chip
                                        label={articlesForReview.total}
                                        size="small"
                                        color="primary"
                                    />
                                </Stack>
                            }
                        />
                        <Tab
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>Needs Revision</span>
                                    <Chip
                                        label={needsRevisionArticles.total}
                                        size="small"
                                        color="warning"
                                    />
                                </Stack>
                            }
                        />
                        <Tab
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <span>Published</span>
                                    <Chip
                                        label={publishedArticles.total}
                                        size="small"
                                        color="success"
                                    />
                                </Stack>
                            }
                        />
                    </Tabs>

                    {/* Pending Articles */}
                    {tab === 0 && (
                        <Box>
                            <ArticleTable
                                articles={articlesForReview}
                                actionType="review"
                                emptyMessage="No articles are waiting for review."
                            />
                        </Box>
                    )}

                    {/* Needs Revision Articles */}
                    {tab === 1 && (
                        <Box>
                            <ArticleTable
                                articles={needsRevisionArticles}
                                actionType="view"
                                emptyMessage="No articles are currently awaiting revision."
                            />
                        </Box>
                    )}

                    {/* Published Articles */}
                    {tab === 2 && (
                        <Box>
                            <ArticleTable
                                articles={publishedArticles}
                                emptyMessage="No articles have been published yet."
                            />
                        </Box>
                    )}
                </Paper>

            </Container>
        </AuthenticatedLayout>
    );
}

function ArticleTable({ articles, actionType, emptyMessage }) {
    const hasAction = !!actionType;
    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Title</strong></TableCell>
                            <TableCell><strong>Author</strong></TableCell>
                            <TableCell><strong>Category</strong></TableCell>
                            <TableCell><strong>Status</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            {hasAction && <TableCell align="right"><strong>Action</strong></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {articles.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={hasAction ? 6 : 5} align="center" sx={{ py: 6 }}>
                                    <Typography color="text.secondary">{emptyMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : articles.data.map((article) => (
                            <TableRow key={article.id} hover>
                                <TableCell>
                                    <Typography fontWeight="medium">{article.title}</Typography>
                                </TableCell>
                                <TableCell>{article.writer?.name ?? '—'}</TableCell>
                                <TableCell>{article.category?.name ?? '—'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={article.status?.name}
                                        color={
                                            article.status?.name === 'Published' ? 'success'
                                            : article.status?.name === 'Needs Revision' ? 'warning'
                                            : 'primary'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(article.updated_at).toLocaleDateString()}
                                </TableCell>
                                {actionType === 'review' && (
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<RateReviewIcon />}
                                            component={Link}
                                            href={route('editor.review', article.id)}
                                        >
                                            Review
                                        </Button>
                                    </TableCell>
                                )}
                                {actionType === 'view' && (
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            component={Link}
                                            href={route('editor.review', article.id)}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {articles.last_page > 1 && (
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ p: 2 }}>
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
        </>
    );
}
