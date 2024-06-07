import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './store';


import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
  redirect,
  redirectDocument,
} from 'react-router-dom';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';

import { DeviceThemeProvider } from '@salutejs/plasma-ui';
import { GlobalStyle } from './GlobalStyle';
import { createGlobalStyle } from 'styled-components';
import Result from './pages/Result';

import { createSmartappDebugger, createAssistant } from '@salutejs/client';
import SwitchTest from './pages/SwitchTest';



const router = createBrowserRouter([
  {
    path: 'game',
    element: <Game />,
  },
  {
    path: 'rules',
    element: <Rules />,
  },
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'settings',
    element: <Settings />,
  },
  {
    path: 'result',
    element: <Result />,
  },
  {
    // Test
    path: 'switch',
    element: <SwitchTest />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DeviceThemeProvider responsiveTypo>
    <GlobalStyle />
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </DeviceThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
