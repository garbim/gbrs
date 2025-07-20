import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from 'react-router-dom';
import Home from './pages/Home';
import CriarTijolo from './pages/CriarTijolo';
import DetalhesTijolo from './pages/DetalhesTijolo';
import Relatorio from './pages/Relatorio';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Stack,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentIcon from '@mui/icons-material/Assessment';

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Tijolos
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              component={RouterLink}
              to="/"
              startIcon={<HomeIcon />}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/criar"
              startIcon={<AddCircleOutlineIcon />}
            >
              Criar Tijolo
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/relatorio"
              startIcon={<AssessmentIcon />}
            >
              Relatório
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/criar" element={<CriarTijolo />} />
          <Route path="/tijolos/:id" element={<DetalhesTijolo />} />
          <Route path="/relatorio" element={<Relatorio />} />
        </Routes>
      </Container>
    </Router>
  );
}
