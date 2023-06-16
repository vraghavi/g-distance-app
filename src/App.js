import './App.css';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect } from 'react';

const defaultTheme = createTheme();

function App() {

  const [lata, setLata] = useState('');
  const [lona, setLona] = useState('');
  const [latb, setLatb] = useState('');
  const [lonb, setLonb] = useState('');
  const [fdistance, setFDistance] = useState('');

  useEffect(() => {
    calculateDistance(lata, lona, latb, lonb);
  }, [lata, lona, latb, lonb]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // lat1, lon1, lat2, lon2;
    const earthRadius = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude values from degrees to radians
    const lat1Rad = degreesToRadians(lat1);
    const lon1Rad = degreesToRadians(lon1);
    const lat2Rad = degreesToRadians(lat2);
    const lon2Rad = degreesToRadians(lon2);

    // Calculate the differences between latitudes and longitudes
    const latDiff = lat2Rad - lat1Rad;
    const lonDiff = lon2Rad - lon1Rad;

    // Use the Haversine formula to calculate the distance
    const a =
      Math.sin(latDiff / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(lonDiff / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    setFDistance(distance);
    console.log(fdistance);

    return distance;
  }

  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  }

  const getLatLonFromOSM = (addressString) => {
    let url =
      'https://nominatim.openstreetmap.org/search?q=' +
      addressString.replace(/\s/g, '+') +
      '&format=json&polygon_geojson=1&addressdetails=1';

    return axios
      .get(url)
      .then((response) => {
        if (response !== []) {
          const lat = response.data[0].lat;
          const lon = response.data[0].lon;
          return [lat, lon];
        } else {
          console.log("Enter a better points")
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const pointa = data.get('pointa');
    const pointb = data.get('pointb');

    if (!/^\d+$/.test(pointa)) {
      const [lat1, lon1] = await getLatLonFromOSM(pointa);
      setLata(lat1);
      setLona(lon1);
    } else {
      const [lat1, lon1] = pointa.replace('(', '').replace(')', '').split(',');
      setLata(lat1);
      setLona(lon1);
    }

    if (!/^\d+$/.test(pointb)) {
      const [lat2, lon2] = await getLatLonFromOSM(pointb);
      setLatb(lat2);
      setLonb(lon2);
    } else {
      const [lat2, lon2] = pointb.replace('(', '').replace(')', '').split(',');
      setLatb(lat2);
      setLonb(lon2);
    }
  };

  const reset = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.set('pointa', '');
    data.set('pointb', '');
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* <LockOutlinedIcon /> */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Calculate G Distance
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="pointa"
              label="Point A"
              name="pointa"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="pointb"
              label="Point B"
              type="pointb"
              id="pointb"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Calculate
            </Button>
            <Button
              type="reset"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset
            </Button>
            <p>Distance is : {fdistance} kms.</p>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
