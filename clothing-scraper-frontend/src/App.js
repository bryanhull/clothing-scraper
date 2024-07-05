// src/App.js
import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import ClothingList from './components/ClothingList';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <ClothingList retailer="banana-republic" size="M" />
      </div>
    </ThemeProvider>
  );
};

export default App;
