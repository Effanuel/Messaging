import React from 'react';
import ReactDOM from 'react-dom';
import {Provider, useSelector} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {isLoaded, ReactReduxFirebaseProvider} from 'react-redux-firebase';
import {reactReduxFirebaseProps} from 'redux/store/firebaseSetup';
import {AppState} from 'redux/models/state';
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';
import {store} from 'redux/store/store';

const theme = createMuiTheme({
  palette: {
    primary: {main: '#00796b'},
    secondary: {main: '#1e1e1e'},
    error: {main: '#cf6679'},
    success: {main: '#004c40'},
    action: {disabled: '#838383', disabledBackground: '#CCCCCC'},
  },
});

function AuthIsLoaded({children}: any) {
  const auth = useSelector((state: AppState) => state.firebase.auth);
  return !isLoaded(auth) ? (
    <div style={{display: 'flex', color: 'white', justifyContent: 'center'}}>Loading Screen...</div>
  ) : (
    children
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
        <AuthIsLoaded>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </AuthIsLoaded>
      </ReactReduxFirebaseProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
