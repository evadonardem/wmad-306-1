import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Box, Typography, Paper, Button, Container } from '@mui/material';

export default function Index({ facts }) {
    const [currentFact, setCurrentFact] = useState(
        facts && facts.length > 0 ? facts[0] : null
    );

    const showRandomFact = () => {
        if (facts && facts.length > 0) {
            const randomIndex = Math.floor(Math.random() * facts.length);
            setCurrentFact(facts[randomIndex]);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight" style={{ color: '#2e7d32' }}>
                    Credits
                </h2>
            }
        >
            <Head title="Credits" />

            <Box sx={{ minHeight: '100vh', backgroundColor: '#e8f5e9', py: 6 }}>
                <Container maxWidth="md">
                    <Paper
                        elevation={2}
                        sx={{
                            p: 4,
                            borderRadius: 2,
                            border: '1px solid #a5d6a7',
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ color: '#2e7d32', fontWeight: 700, mb: 1 }}
                        >
                            Interesting Facts
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
                            Discover something new each time you visit.
                        </Typography>

                        {currentFact ? (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 4,
                                    backgroundColor: '#f1f8e9',
                                    border: '1px solid #a5d6a7',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{ color: '#333', lineHeight: 1.8 }}
                                >
                                    {currentFact}
                                </Typography>
                            </Paper>
                        ) : (
                            <Typography variant="body1" sx={{ color: '#666', mb: 4 }}>
                                No facts available at this time.
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                            {facts && facts.length > 0 && (
                                <Button
                                    variant="contained"
                                    onClick={showRandomFact}
                                    sx={{
                                        backgroundColor: '#2e7d32',
                                        '&:hover': { backgroundColor: '#1b5e20' },
                                        textTransform: 'none',
                                        fontWeight: 600,
                                    }}
                                >
                                    Show Another Fact
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                onClick={() => router.visit(route('dashboard'))}
                                sx={{
                                    borderColor: '#2e7d32',
                                    color: '#2e7d32',
                                    '&:hover': {
                                        borderColor: '#1b5e20',
                                        backgroundColor: '#e8f5e9',
                                    },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                }}
                            >
                                Back to Dashboard
                            </Button>
                        </Box>
                    </Paper>

                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', color: '#999', mt: 4 }}
                    >
                        {facts ? facts.length : 0} facts available
                    </Typography>
                </Container>
            </Box>
        </AuthenticatedLayout>
    );
}
