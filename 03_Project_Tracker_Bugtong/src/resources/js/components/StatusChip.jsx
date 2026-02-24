import * as React from 'react';
import { Chip } from '@mui/material';

const statusMap = {
  todo: { label: 'To Do', color: 'default' },
  in_progress: { label: 'In Progress', color: 'info' },
  done: { label: 'Done', color: 'success' }
};

export default function StatusChip({ status }) {
  const s = statusMap[status] || { label: status, color: 'default' };
  return <Chip label={s.label} color={s.color} size="small" sx={{ fontWeight: 500, borderRadius: 2, boxShadow: 1, px: 1.5 }} />;
}
