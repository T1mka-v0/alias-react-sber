import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { teamStore, teamId } from '../store';

import { Button, Button1, Cell, Slider, Switch, TextBox, TextField } from '@salutejs/plasma-ui';
import { Theme, DocStyles } from '../SberStyles';
import { Container, CellDisclosure } from '@salutejs/plasma-ui';

function Result() {
    const [teams, setTeams] = useState(teamStore.getState());
    console.log(teamStore.getState());
    // let i = 0;
  return (
    <div>
        <Theme />
        <DocStyles />

        <Container>
        {
            teams.map((team) => {
                return <div>
                    <Cell
                        content={<TextBox title={`Команда: ${team.name}`} subTitle={
                            `Счёт: ${team.score}`
                        } />}
                    />
                    {/* <Cell
                        content={<TextBox title={`Угаданные слова: ${team.guessedWords.map((word, index) => {
                            return index !== team.guessedWords.length-1
                            ?  word + ', '
                            : word
                        })}`}/>}
                    /> */}
                    <h2>Угаданные слова: {team.guessedWords.map((word, index) => {
                        return index !== team.guessedWords.length-1
                        ?  word + ', '
                        : word
                    })}</h2>
                </div>
            })
        }
        <Button>
            Продолжить
        </Button>
        </Container>
    </div>
  )
}

export default Result