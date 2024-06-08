import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import App from './App';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';
import Assist from './Assist';
import Result from './pages/Result';
import SwitchTest from './pages/SwitchTest';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Outlet />
      </>
    ),
    children: [
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
    ],
  },
]);

export default router;
