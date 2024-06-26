import { Cell, TextBox } from '@salutejs/plasma-ui'
import React from 'react'

function CellForScore({team_name, settings, score, rest}) {
  return (
    <>
      <h3>{team_name} </h3>
      <h3>{score}</h3>
      <h3>{rest}</h3>
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