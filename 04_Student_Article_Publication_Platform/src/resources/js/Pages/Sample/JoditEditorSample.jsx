import React, { useState, useRef, useMemo, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import { Button, Container, Divider, Stack, TextField, Typography } from '@mui/material';
import { Head } from '@inertiajs/react';

export default function JoditEditorSample() {

    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: 'Start writing your article...'
        }),
        []
    );

    const handleBlur = useCallback((newContent) => {
        setContent(newContent);
    }, []);

    const handleChange = useCallback((newContent) => {
        // You can handle onChange here if needed
    }, []);

    return (
        <Container maxWidth="md" sx={{ p: 2 }}>
            <Head>
                <title>Jodit Editor Sample</title>
            </Head>
            <Typography variant="h1">Jodit Editor</Typography>
            <Typography variant="caption">
                This is a basic usage of the Jodit editor to be used
                in editing article contents.
                See: <a
                    href="https://xdsoft.net/jodit/docs/docs/getting-started.html#using-with-react"
                    target="_blank"
                    rel="noopener noreferrer">Jodit Editor - Using with React</a> for more details.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={1}>
                <TextField label="Title" variant="outlined" />
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                <Button variant="contained">Create</Button>
            </Stack>
        </Container>
    );
}
