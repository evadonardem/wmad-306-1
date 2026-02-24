import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Paper, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AuthIllustration from './AuthIllustration';

/**
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.leftContent]
 */
const AuthLayout = ({ children, leftContent }) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: mdUp ? 'row' : 'column',
      }}
    >
      {mdUp && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'transparent',
            minHeight: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              background: 'linear-gradient(135deg, #6E2F7A 0%, #00AFA0 100%)',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              px: 6,
              py: 8,
            }}
          >
            <AuthIllustration />
            {leftContent}
          </Box>
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="sm" sx={{ width: '100%' }}>
          {!mdUp && (
            <Box
              sx={{
                height: 6,
                width: 64,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #6E2F7A 0%, #00AFA0 100%)',
                mx: 'auto',
                mt: 4,
                mb: 2,
              }}
            />
          )}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, sm: 5 },
              mt: { xs: 4, sm: 8 },
              mb: { xs: 4, sm: 8 },
              borderRadius: 3,
              maxWidth: 480,
              mx: 'auto',
              boxShadow: '0 2px 24px 0 rgba(14,14,16,0.07)',
            }}
          >
            {children}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  leftContent: PropTypes.node,
};

export default AuthLayout;
