import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

import App from './App';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';
import Result from './pages/Result';

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
      }
    ],
  },
]);

export default router;
