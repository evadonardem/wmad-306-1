import { Link } from '@inertiajs/react';
import {
    Box,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useTheme } from '@/Contexts/ThemeContext';

export default function DraftList({ articles = [] }) {
    const { colors } = useTheme();
    const drafts = articles.filter((article) => {
        const slug = article?.status?.slug ?? null;
        if (slug) return slug === 'draft';
        return !article.submitted_at && !article.published_at;
    });

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: colors.text }}>
                    Drafts
                </Typography>
                <Chip
                    size="small"
                    label={`${drafts.length} item${drafts.length === 1 ? '' : 's'}`}
                    sx={{
                        bgcolor: `${colors.primary}18`,
                        color: colors.primary,
                        border: `1px solid ${colors.border}`,
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: colors.border }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: `${colors.hover}80` }}>
                            <TableCell sx={{ color: colors.textSecondary, fontWeight: 700 }}>Title</TableCell>
                            <TableCell sx={{ color: colors.textSecondary, fontWeight: 700 }}>Last Updated</TableCell>
                            <TableCell align="right" sx={{ color: colors.textSecondary, fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {drafts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                        No drafts yet.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            drafts.map((article) => (
                                <TableRow key={article.id} hover>
                                    <TableCell sx={{ color: colors.text, fontWeight: 700 }}>{article.title}</TableCell>
                                    <TableCell sx={{ color: colors.textSecondary }}>
                                        {article.updated_at ? new Date(article.updated_at).toLocaleString() : 'N/A'}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Link
                                            href={route('writer.articles.edit', article.id)}
                                            className="inline-flex items-center border px-3 py-1 text-xs font-semibold"
                                            style={{
                                                color: colors.primary,
                                                borderColor: colors.primary,
                                                backgroundColor: 'transparent',
                                            }}
                                        >
                                            Open
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
