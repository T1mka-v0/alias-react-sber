import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { teamStore, teamId, settingsStore } from '../store';

import { Button, Button1, Cell, Slider, Switch, TextBox, TextField } from '@salutejs/plasma-ui';
import { Theme, DocStyles } from '../SberStyles';
import { Container, CellDisclosure } from '@salutejs/plasma-ui';
import CellForScore from '../components/cellForScore/CellForScore';

const settings = settingsStore.getState();

function Result() {
    const teams = teamStore.getState();
    console.log(teamStore.getState());
    // let i = 0;
    // team_name, settings, Gnumber, Snumber
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
                    </div>
                })
            }
        </Container>
    </div>
  )
}

export default Result