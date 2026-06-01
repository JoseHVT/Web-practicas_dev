import { useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';

export default function LifecycleDemo() {
  const [counter, setCounter] = useState(0);
  const hasRenderedRef = useRef(false);

  useEffect(() => {
    console.log('lifecycle demo: montaje');

    return () => {
      console.log('lifecycle demo: desmontaje');
    };
  }, []);

  useEffect(() => {
    if (!hasRenderedRef.current) {
      hasRenderedRef.current = true;
      return;
    }

    console.log(`lifecycle demo: actualizacion, contador=${counter}`);
  }, [counter]);

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6">
            demo de ciclo de vida
          </Typography>
          <Typography color="text.secondary">
            abre la consola para ver montaje, actualizacion y desmontaje.
          </Typography>
        </Box>

        <Typography>
          contador actual: {counter}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => setCounter((value) => value + 1)}>
            incrementar
          </Button>
          <Button variant="outlined" onClick={() => setCounter(0)}>
            reiniciar
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
