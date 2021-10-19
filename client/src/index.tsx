import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import App from './App';
import {createStore} from 'redux/store/store';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {main: '#02b89b'},
    secondary: {main: '#1e1e1e'},
    error: {main: '#cf6679'},
    success: {main: '#004c40'},
    action: {disabled: 'white', disabledBackground: '#CCCCCC'},
  },
});

ReactDOM.render(
  <Provider store={createStore()}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
