import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Container, TextField, FormControl, InputLabel, Select, MenuItem, Stack, Alert } from '@mui/material';
import { ArrowBack, Save, Delete } from '@mui/icons-material';
import JoditEditor from 'jodit-react';

export default function Edit({ article }) {
    const editor = useRef(null);
    const { data, setData, put, processing, errors, delete: destroy } = useForm({
        title: article.title,
        content: article.content,
        status: article.status,
    });

    const config = {
        readonly: false,
        placeholder: 'Start writing your article...',
        height: 400,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('articles.update', article.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this article?')) {
            destroy(route('articles.destroy', article.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('articles.show', article.id)}>
                            <Button startIcon={<ArrowBack />}>
                                Back to Article
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Edit Article
                        </h2>
                    </div>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            }
        >
            <Head title="Edit Article" />

            <Container maxWidth="md" sx={{ py: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Article Title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            error={!!errors.title}
                            helperText={errors.title}
                            required
                        />

                        <div>
                            <InputLabel>Content</InputLabel>
                            <JoditEditor
                                ref={editor}
                                value={data.content}
                                config={config}
                                onBlur={(newContent) => setData('content', newContent)}
                            />
                            {errors.content && (
                                <Alert severity="error" sx={{ mt: 1 }}>
                                    {errors.content}
                                </Alert>
                            )}
                        </div>

                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={data.status}
                                label="Status"
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <MenuItem value="draft">Draft</MenuItem>
                                <MenuItem value="published">Published</MenuItem>
                            </Select>
                        </FormControl>

                        <div className="flex justify-end space-x-4">
                            <Link href={route('articles.show', article.id)}>
                                <Button variant="outlined">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<Save />}
                                disabled={processing}
                            >
                                Update Article
                            </Button>
                        </div>
                    </Stack>
                </form>
            </Container>
        </AuthenticatedLayout>
    );
}