import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { store } from './store';

import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';

import router from './router';

import { DeviceThemeProvider } from '@salutejs/plasma-ui';
import { GlobalStyle } from './GlobalStyle';
import { createGlobalStyle } from 'styled-components';
import assistant from './assistant';

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
