import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux'
import { teamStore } from './store'

import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import ErrorPage from './pages/error-page';
import Settings from './pages/Settings';
import Rules from './pages/Rules';
import Game from './pages/Game';
import NewGame from './pages/NewGame';

let isGameStarted = true;

const router = createBrowserRouter([
  {
    path: 'menu',
    element: <MainMenu/>
  },
  {
    path: 'menu/game',
    element: <Game />,
  },
  {
    path: 'menu/newgame',
    element: <Settings />
  },
  {
    path: 'menu/rules',
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
    path: 'settings/game',
    element: <Game />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}>
      <Provider store={teamStore}>
        
      </Provider>
    </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals