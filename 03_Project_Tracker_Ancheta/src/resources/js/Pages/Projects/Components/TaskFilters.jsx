import React, { useState } from 'react';
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useTheme } from '@/Context/ThemeContext';

export default function TaskFilters({
  currentFilter,
  onFilterChange,
  currentPriorityFilter,
  onPriorityFilterChange
}) {
  const { colors, isDarkMode } = useTheme();
  const [showFilters, setShowFilters] = useState(false);

  const statusFilters = [
    { value: 'all', label: 'All Tasks' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityFilters = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return colors.warning;
      case 'in_progress': return colors.info;
      case 'completed': return colors.success;
      default: return colors.primary;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return colors.danger;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.primary;
    }
  };

  const isFilterActive = currentFilter !== 'all' || currentPriorityFilter !== 'all';

  return (
    <Box sx={{ mb: 2 }}>
      {/* Filter Toggle Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              color: showFilters || isFilterActive ? colors.primary : colors.textSecondary,
              backgroundColor: showFilters || isFilterActive ? `${colors.primary}10` : 'transparent',
              '&:hover': {
                backgroundColor: `${colors.primary}15`,
              },
            }}
          >
            <FilterIcon fontSize="small" />
          </IconButton>

          {/* Active Filter Chips */}
          {isFilterActive && (
            <Stack direction="row" spacing={0.5}>
              {currentFilter !== 'all' && (
                <Chip
                  label={`Status: ${statusFilters.find(f => f.value === currentFilter)?.label}`}
                  size="small"
                  onDelete={() => onFilterChange('all')}
                  sx={{
                    height: 24,
                    backgroundColor: `${getStatusColor(currentFilter)}15`,
                    color: getStatusColor(currentFilter),
                    '& .MuiChip-label': { fontSize: '0.7rem', px: 1 },
                    '& .MuiChip-deleteIcon': {
                      fontSize: 14,
                      color: getStatusColor(currentFilter),
                      '&:hover': { color: getStatusColor(currentFilter) }
                    },
                  }}
                />
              )}
              {currentPriorityFilter !== 'all' && (
                <Chip
                  label={`Priority: ${priorityFilters.find(f => f.value === currentPriorityFilter)?.label}`}
                  size="small"
                  onDelete={() => onPriorityFilterChange('all')}
                  sx={{
                    height: 24,
                    backgroundColor: `${getPriorityColor(currentPriorityFilter)}15`,
                    color: getPriorityColor(currentPriorityFilter),
                    '& .MuiChip-label': { fontSize: '0.7rem', px: 1 },
                    '& .MuiChip-deleteIcon': {
                      fontSize: 14,
                      color: getPriorityColor(currentPriorityFilter),
                      '&:hover': { color: getPriorityColor(currentPriorityFilter) }
                    },
                  }}
                />
              )}
              <Tooltip title="Clear all filters">
                <IconButton
                  size="small"
                  onClick={() => {
                    onFilterChange('all');
                    onPriorityFilterChange('all');
                  }}
                  sx={{
                    color: colors.textSecondary,
                    padding: 0.5,
                    '&:hover': { color: colors.danger },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        {/* Filter Count */}
        {isFilterActive && (
          <Chip
            label={`${(currentFilter !== 'all' ? 1 : 0) + (currentPriorityFilter !== 'all' ? 1 : 0)} active`}
            size="small"
            sx={{
              height: 20,
              backgroundColor: `${colors.primary}10`,
              color: colors.primary,
              '& .MuiChip-label': { fontSize: '0.65rem', px: 1 },
            }}
          />
        )}
      </Stack>

      {/* Dropdown Filters */}
      {showFilters && (
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{
            mt: 2,
            p: 2,
            background: isDarkMode ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: `1px solid ${colors.border}`,
          }}
        >
          {/* Status Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
            <InputLabel sx={{ color: colors.textSecondary }}>Filter by Status</InputLabel>
            <Select
              value={currentFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              label="Filter by Status"
              sx={{
                color: colors.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary,
                },
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            >
              {statusFilters.map((filter) => (
                <MenuItem
                  key={filter.value}
                  value={filter.value}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {filter.value !== 'all' && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(filter.value),
                        mr: 1,
                      }}
                    />
                  )}
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Priority Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 140, flex: 1 }}>
            <InputLabel sx={{ color: colors.textSecondary }}>Filter by Priority</InputLabel>
            <Select
              value={currentPriorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value)}
              label="Filter by Priority"
              sx={{
                color: colors.textPrimary,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.border,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.primary,
                },
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            >
              {priorityFilters.map((filter) => (
                <MenuItem
                  key={filter.value}
                  value={filter.value}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {filter.value !== 'all' && (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getPriorityColor(filter.value),
                        mr: 1,
                      }}
                    />
                  )}
                  {filter.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}
    </Box>
  );
}
