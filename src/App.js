import React from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';

function App() {

  const path = 'https://jsonplaceholder.typicode.com/users';
  async function getUsers() {
    let response = await fetch(path);
    if (response.ok) return await response.json();
    console.log(response);
  }

  return (
    <div className="App">
      <h1>Alias</h1>
      <nav>
        <ul>
          <li>
            <Link to={'menu'}>Home</Link>
          </li>
          <li>
            <Link to={'settings'}>Settings</Link>
          </li>
          <li>
            <Link to={'rules'}>Rules</Link>
          </li>
          <li>
            <Link to={'game'}>Game</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;

/*

*/