import * as React from 'react';
import { Chip } from '@mui/material';

const priorityMap = {
  low: { label: 'Low', color: 'success' },
  medium: { label: 'Medium', color: 'warning' },
  high: { label: 'High', color: 'error' }
};

export default function PriorityChip({ priority }) {
  const p = priorityMap[priority] || { label: priority, color: 'default' };
  return <Chip label={p.label} color={p.color} size="small" />;
}
