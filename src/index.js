import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux'
import { teamStore } from './store'

import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';

import { DeviceThemeProvider } from '@salutejs/plasma-ui';
import { GlobalStyle } from './GlobalStyle';
import { createGlobalStyle } from 'styled-components';
import Result from './pages/Result';

let isGameStarted = true;

const router = createBrowserRouter([
  {
    path: 'game',
    element: <Game />,
  },
  {
    path: 'rules',
    element: <Rules />
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: 'settings',
    element: <Settings />
  },
  {
    path: 'result',
    element: <Result />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DeviceThemeProvider responsiveTypo>
  <GlobalStyle />
    <RouterProvider router={router}>
      <Provider store={teamStore}>
        
      </Provider>
      
    </RouterProvider>
  </DeviceThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals