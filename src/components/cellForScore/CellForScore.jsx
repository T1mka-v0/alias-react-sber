import { Cell, TextBox } from '@salutejs/plasma-ui'
import React from 'react'

function CellForScore({team_name, settings, Gnumber, Snumber, rest}) {
  return (
    <>
      <h3>{team_name} </h3>
      <h3>{settings.penaltyForSkip ?
                Gnumber - Snumber > 0 ?
                `Текущий счёт: ${Gnumber - Snumber}`
                : 'Текущий счёт: 0'
            : `Текущий счёт: ${Gnumber}`}</h3>
      {rest}
    </>
  )
}

export default CellForScore

/*
`Команда: ${team_name}` 

settings.penaltyForSkip ?
                Gnumber - Snumber > 0 ?
                `Текущий счёт: ${Gnumber - Snumber}`
                : 'Текущий счёт: 0'
            : `Текущий счёт: ${Gnumber}`

*/