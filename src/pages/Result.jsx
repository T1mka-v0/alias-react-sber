import React, { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { teamStore, teamId, settingsStore } from '../store';

import { Button, Button1, Cell, Slider, Switch, TextBox, TextField, h3 } from '@salutejs/plasma-ui';
import { Theme, DocStyles } from '../SberStyles';
import { Container, CellDisclosure } from '@salutejs/plasma-ui';
import CellForScore from '../components/cellForScore/CellForScore';



function Result() {
    const navigate = useNavigate();
    const teams = teamStore.getState();
    const settings = settingsStore.getState();
    console.log(teamStore.getState());
    // let i = 0;
    // team_name, settings, Gnumber, Snumber
    useEffect(() => {
        
        console.log('Setting store: ', settings);
    }, [])
  return (
    <div>
        <Theme />
        <DocStyles />

        <Container>
            <h2>Итоги игры</h2>
            {
                teams.map((team) => {
                    return <div>
                        <CellForScore
                            team_name={team.name}
                            settings={settings}
                            Gnumber={team.guessedWords.length}
                            Snumber={team.skippedWords.length}
                        />
                        <h2>
                            Угаданыые слова: {team.guessedWords.map((word, index) => {
                                return index !== team.guessedWords.length-1
                                ?  word + ', '
                                : word
                            })}
                        </h2>
                        <h2>
                            Пропущенные слова: {team.skippedWords.map((word, index) => {
                                return index !== team.skippedWords.length-1
                                ?  word + ', '
                                : word
                            })}
                        </h2>
                    </div>
                })
            }
            <Button onClick={() => navigate('/')}>
                Начать новую игру
            </Button>
        </Container>
    </div>
  )
}

export default Result