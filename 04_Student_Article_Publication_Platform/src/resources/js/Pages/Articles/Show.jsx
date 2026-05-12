import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Container, Typography, Chip, Stack, Paper, Divider } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';

export default function Show({ article }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('articles.index')}>
                            <Button startIcon={<ArrowBack />}>
                                Back to Articles
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            {article.title}
                        </h2>
                    </div>
                    <Link href={route('articles.edit', article.id)}>
                        <Button variant="contained" startIcon={<Edit />}>
                            Edit Article
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={article.title} />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Stack spacing={3}>
                        <div>
                            <Typography variant="h4" component="h1" gutterBottom>
                                {article.title}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Chip
                                    label={article.status}
                                    color={article.status === 'published' ? 'success' : 'default'}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    By {article.user.name}
                                </Typography>
                                {article.published_at && (
                                    <Typography variant="body2" color="text.secondary">
                                        Published: {new Date(article.published_at).toLocaleDateString()}
                                    </Typography>
                                )}
                            </Stack>
                        </div>

                        <Divider />

                        <div
                            dangerouslySetInnerHTML={{ __html: article.content }}
                            style={{
                                '& img': { maxWidth: '100%', height: 'auto' },
                                '& p': { marginBottom: '1rem' },
                                '& h1, & h2, & h3, & h4, & h5, & h6': { marginTop: '1.5rem', marginBottom: '0.5rem' }
                            }}
                        />
                    </Stack>
                </Paper>
            </Container>
        </AuthenticatedLayout>
    );
}