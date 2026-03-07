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

export default function SubmittedList({ articles = [] }) {
    const { colors } = useTheme();
    const submitted = articles.filter((article) => {
        const slug = article?.status?.slug ?? null;
        if (slug) return slug !== 'draft';
        return Boolean(article.submitted_at || article.published_at);
    });

    const statusTone = (slug = '') => {
        if (slug === 'published') return 'success';
        if (slug === 'revision-requested') return 'warning';
        if (slug === 'rejected') return 'error';
        return 'default';
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: colors.text }}>
                    Submitted
                </Typography>
                <Chip
                    size="small"
                    label={`${submitted.length} item${submitted.length === 1 ? '' : 's'}`}
                    sx={{
                        bgcolor: `${colors.accent}18`,
                        color: colors.accent,
                        border: `1px solid ${colors.border}`,
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: colors.border }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: `${colors.hover}80` }}>
                            <TableCell sx={{ color: colors.textSecondary, fontWeight: 700 }}>Title</TableCell>
                            <TableCell sx={{ color: colors.textSecondary, fontWeight: 700 }}>Status</TableCell>
                            <TableCell sx={{ color: colors.textSecondary, fontWeight: 700 }}>Activity</TableCell>
                            <TableCell align="right" sx={{ color: colors.textSecondary, fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {submitted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                        No submissions yet.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            submitted.map((article) => (
                                <TableRow key={article.id} hover>
                                    <TableCell sx={{ color: colors.text, fontWeight: 700 }}>{article.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            size="small"
                                            label={article?.status?.name ?? article?.status?.slug ?? 'N/A'}
                                            color={statusTone(article?.status?.slug)}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: colors.textSecondary }}>
                                        {article.submitted_at ? `Submitted: ${new Date(article.submitted_at).toLocaleString()}` : 'Not submitted'}
                                        {article.published_at ? ` | Published: ${new Date(article.published_at).toLocaleString()}` : ''}
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
