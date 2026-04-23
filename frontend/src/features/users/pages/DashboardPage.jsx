import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4"> Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        vista sec
      </Typography>
    </Box>
  );
}