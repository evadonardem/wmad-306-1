import WriterLayout from '@/Layouts/WriterLayout';
import { Box, Card, CardContent, Typography } from '@mui/material';
import ArticleForm from './Components/ArticleForm';
import { useTheme } from '@/Contexts/ThemeContext';

export default function CreateArticle({ categories = [] }) {
    const { colors } = useTheme();

    return (
        <WriterLayout>
            <Box sx={{ mx: 'auto', maxWidth: '1500px', px: { xs: 2, sm: 3, lg: 4 }, py: { xs: 1.5, sm: 2 } }}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: colors.border, mb: 2 }}>
                    <CardContent>
                        <Typography variant="overline" sx={{ color: colors.textSecondary, letterSpacing: '0.2em' }}>
                            WRITER DESK
                        </Typography>
                        <Typography variant="h4" fontWeight={900} sx={{ color: colors.text }}>
                            Create Article
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                            Start drafting and save progress automatically.
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
            <ArticleForm categories={categories} />
        </WriterLayout>
    );
}
