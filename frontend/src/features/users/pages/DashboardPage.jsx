import { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3000/dashboard';

const getDefaultRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 30);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10)
  };
};

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { startDate, endDate } = getDefaultRange();

      try {
        setLoading(true);
        setError('');

        const [kpisResponse, registrationsResponse] = await Promise.all([
          axios.get(`${API_URL}/kpis`),
          axios.get(`${API_URL}/charts/registrations`, {
            params: { startDate, endDate }
          })
        ]);

        setKpis(kpisResponse.data);
        setRegistrations(registrationsResponse.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'No se pudo cargar el dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const maxRegistrations = registrations.reduce(
    (max, item) => Math.max(max, item.usersRegistered),
    1
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && kpis && (
        <>
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              mb: 4
            }}
          >
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Total usuarios
                </Typography>
                <Typography variant="h4">{kpis.totalUsers}</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Admins activos
                </Typography>
                <Typography variant="h4">{kpis.activeAdmins}</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Nuevos este mes
                </Typography>
                <Typography variant="h4">{kpis.newUsersThisMonth}</Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2">
                  Crecimiento mensual
                </Typography>
                <Typography variant="h4">{kpis.monthlyGrowthPercentage}%</Typography>
              </CardContent>
            </Card>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Registros ultimos 30 dias
              </Typography>

              {registrations.length === 0 ? (
                <Typography color="text.secondary">
                  No hay registros en el rango consultado.
                </Typography>
              ) : (
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {registrations.map((item) => (
                    <Box
                      key={item.date}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '110px 1fr 40px',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <Typography variant="body2">{item.date}</Typography>
                      <Box sx={{ height: 12, bgcolor: '#e0e0e0', borderRadius: 1 }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(item.usersRegistered / maxRegistrations) * 100}%`,
                            bgcolor: '#1976d2',
                            borderRadius: 1
                          }}
                        />
                      </Box>
                      <Typography variant="body2" textAlign="right">
                        {item.usersRegistered}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
