import React, { useEffect, useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../store';

import { Button, Button1, Cell, Slider, Switch, TextBox, TextField, h3 } from '@salutejs/plasma-ui';
import { Container, CellDisclosure } from '@salutejs/plasma-ui';
import CellForScore from '../components/cellForScore/CellForScore';



function Result() {
    const navigate = useNavigate();
    const teams = store.getState().teamsArray;
    const settings = store.getState().settings;
    console.log(store.getState());
    // let i = 0;
    // team_name, settings, Gnumber, Snumber
    useEffect(() => {
        
        console.log('Setting store: ', settings);
    }, [])
  return (
    <div>

        <Container style={{marginBottom: "200px"}}>
            <h1>Итоги игры</h1>
            {
                teams.map((team) => {
                    return <div>
                        <div style={{backgroundColor:"white", height:"3px", marginTop:"10px"}}></div>
                        <CellForScore
                            team_name={team.name}
                            settings={settings}
                            Gnumber={team.guessedWords.length}
                            Snumber={team.skippedWords.length}
                        />
                        <h3>
                            Угаданные слова: {team.guessedWords.map((word, index) => {
                                return index !== team.guessedWords.length-1
                                ?  word + ', '
                                : word
                            })}
                        </h3>
                        <h2> Пропущенные слова:</h2>
                        <h3>
                        {team.skippedWords.map((word, index) => {
                                return index !== team.skippedWords.length-1
                                ?  word + ', '
                                : word
                            })}
                        </h3>
                        
                    </div>
                })
            }
            <Button onClick={() => {
                store.dispatch({type: 'RESET'});
                navigate('/');
            }}>
                Начать новую игру
            </Button>
        </Container>
    </div>
  )
}

export default Result