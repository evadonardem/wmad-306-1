import { Link } from '@inertiajs/react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import WriterLayout from '@/Layouts/WriterLayout';
import ArticleForm from './Components/ArticleForm';
import { useTheme } from '@/Contexts/ThemeContext';

export default function EditArticle({ article, categories = [], initialDraftVersions = [] }) {
    const { colors } = useTheme();

    return (
        <WriterLayout>
            <Box sx={{ mx: 'auto', maxWidth: '1500px', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 1.5, sm: 2 } }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: colors.border, mb: 2 }}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: colors.textSecondary, letterSpacing: '0.2em' }}>
                                WRITER DESK
                            </Typography>
                            <Typography variant="h4" fontWeight={900} sx={{ color: colors.text }}>
                                Edit Article
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                Update draft content, versions, and submission status.
                            </Typography>
                        </Box>
                        <Link
                            href={route('writer.dashboard')}
                            className="inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold"
                            style={{ borderColor: colors.primary, color: colors.primary }}
                        >
                            BACK
                        </Link>
                    </CardContent>
                </Card>
            </Box>

            <ArticleForm article={article} categories={categories} initialDraftVersions={initialDraftVersions} />
        </WriterLayout>
    );
}
