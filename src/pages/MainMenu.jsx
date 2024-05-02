import React from 'react'
import { 
  Outlet,
  Link,
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

function MainMenu() {
  return (
    <>
        <div>
            MainMenu
        </div>
          <Link to={'game'}>
            game
          </Link>
          <Link to={'newgame'}>
            newgame
          </Link>
            
          <Link to={'rules'}>
          rules
          </Link>
    </>
  )
}

export default MainMenu