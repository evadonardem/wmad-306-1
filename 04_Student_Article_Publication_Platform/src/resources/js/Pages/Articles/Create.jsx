import React, { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button, Container, TextField, FormControl, InputLabel, Select, MenuItem, Stack, Alert } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import JoditEditor from 'jodit-react';

export default function Create() {
    const editor = useRef(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        content: '',
        status: 'draft',
    });

    const config = {
        readonly: false,
        placeholder: 'Start writing your article...',
        height: 400,
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('articles.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center space-x-4">
                    <Link href={route('articles.index')}>
                        <Button startIcon={<ArrowBack />}>
                            Back to Articles
                        </Button>
                    </Link>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create New Article
                    </h2>
                </div>
            }
        >
            <Head title="Create Article" />

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
                            <Link href={route('articles.index')}>
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
                                Create Article
                            </Button>
                        </div>
                    </Stack>
                </form>
            </Container>
        </AuthenticatedLayout>
    );
}