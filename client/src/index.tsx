import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, useSelector} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@material-ui/core/styles';
import {AppState} from 'redux/models/state';
import App from './App';
import {createStore} from 'redux/store/store';
import * as serviceWorker from './serviceWorker';
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
