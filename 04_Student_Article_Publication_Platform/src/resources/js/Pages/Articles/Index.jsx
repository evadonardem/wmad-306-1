import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Card, CardContent, CardActions, Typography, Chip, Grid, Container, TextField, InputAdornment } from '@mui/material';
import { Add, Edit, Visibility, Search, Clear } from '@mui/icons-material';

export default function Index({ articles, filters }) {
    const { url } = usePage();
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    useEffect(() => {
        setSearchQuery(filters?.search || '');
    }, [filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('articles.index'), { search: searchQuery.trim() });
        } else {
            router.get(route('articles.index'));
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        router.get(route('articles.index'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        My Articles
                    </h2>
                    <Link href={route('articles.create')}>
                        <Button variant="contained" startIcon={<Add />}>
                            New Article
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Articles" />

            <Container maxWidth="lg" sx={{ py: 4 }}>
                <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
                    <TextField
                        fullWidth
                        label="Search Articles"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchQuery && (
                                        <Button onClick={clearSearch} startIcon={<Clear />}>
                                            Clear
                                        </Button>
                                    )}
                                    <Button type="submit" startIcon={<Search />}>
                                        Search
                                    </Button>
                                </InputAdornment>
                            ),
                        }}
                    />
                </form>

                <Grid container spacing={3}>
                    {articles.data.map((article) => (
                        <Grid item xs={12} md={6} lg={4} key={article.id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {article.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        mb: 2
                                    }}>
                                        {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                    </Typography>
                                    <Chip
                                        label={article.status}
                                        color={article.status === 'published' ? 'success' : 'default'}
                                        size="small"
                                    />
                                    {article.published_at && (
                                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                            Published: {new Date(article.published_at).toLocaleDateString()}
                                        </Typography>
                                    )}
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        startIcon={<Visibility />}
                                        component={Link}
                                        href={route('articles.show', article.id)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<Edit />}
                                        component={Link}
                                        href={route('articles.edit', article.id)}
                                    >
                                        Edit
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {articles.data.length === 0 && (
                    <div className="text-center py-12">
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {searchQuery ? 'No articles found matching your search.' : 'No articles yet'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {searchQuery ? 'Try a different search term.' : 'Create your first article to get started'}
                        </Typography>
                    </div>
                )}
            </Container>
        </AuthenticatedLayout>
    );
}