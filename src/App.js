import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';

import { Theme, DocStyles } from './SberStyles';
function App() {

  const path = 'https://jsonplaceholder.typicode.com/users';
  async function getUsers() {
    let response = await fetch(path);
    if (response.ok) return await response.json();
    console.log(response);
  }

  return (
    <div className="App">
      <DocStyles />
      <Theme />
      <h1>Alias</h1>
      <nav>
        <ul>
          <li>
            <Link to={'settings'}>Продолжить игру</Link>
          </li>
          <li>
            <Link to={'settings'}>Начать игру</Link>
          </li>
          <li>
            <Link to={'rules'}>Rules</Link>
          </li>
          
        </ul>
      </nav>
    </div>
  );
}

export default App;

/*

*/