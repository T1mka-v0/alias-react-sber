import { Cell, TextBox } from '@salutejs/plasma-ui'
import React from 'react'

function CellForScore({team_name, settings, Gnumber, Snumber}) {
  return (
    <Cell // условие на неотрицательность счета
        content={<TextBox title={`Команда: ${team_name}`} subTitle={
            settings.penaltyForSkip ?
                Gnumber - Snumber > 0 ?
                `Счёт: ${Gnumber - Snumber}`
                : 'Счёт: 0'
            : `Счёт: ${Gnumber}`
        } />}
    />
  )
}

export default CellForScore