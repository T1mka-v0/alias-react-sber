import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { teamStore, teamId, settingsStore } from '../store';
import { addTeam, removeTeam, renameTeam,
  setCommonLastWord,
  setPenaltyForSkip,
  setRoundDuration,
  setWordsCountToWin
 } from '../actions';

import { Button, Cell, Slider, Switch, TextBox, TextField } from '@salutejs/plasma-ui';
import { Theme, DocStyles } from '../SberStyles';
import { Container, CellDisclosure } from '@salutejs/plasma-ui';

function Settings() {

  const [duration, setDuration] = useState(settingsStore.getState().roundDuration);
  const  [wordsCount, setWordsCount] = useState(settingsStore.getState().wordsCountToWin);

  // Локальное состояние - массив команд для отображения на странице
  const [teams, setTeams] = useState(teamStore.getState());

  const [currentTeamName, setCurrentTeamName] = useState('');

  const [commonLW, setCommonLW] = useState(settingsStore.getState().commonLastWord);
  const [penalty, setPenalty] = useState(settingsStore.getState().penaltyForSkip);

  const navigate = useNavigate();

  return (
    <div>
      <DocStyles />
      <Theme />
          <h1 style={{display:"flex", justifyContent:"center"}}>Настройки</h1>
          <Container style={{marginBottom:"10px"}}>
            <TextField
              placeholder='Название команды'
              onChange={(e) => setCurrentTeamName(e.target.value)}
              value={currentTeamName}
            />
          </Container>

          <Container>
          <Button
            style={{marginBottom:"10px"}}
            text='Добавить команду'
            outlined={true}
            onClick={() => {

              // Отправляю в redux новую команду с название из инпута
              teamStore.dispatch(addTeam(teamId.getState(), currentTeamName));

              // Добавляю новую команду локально
              setTeams([...teams, {
                id: teamId.getState(),
                name: currentTeamName,
                score: 0,
                words: []
              }]);

              // увеличиваю id для следующей команды
              teamId.dispatch({type: 'NEXT'});

              // Очищаем поле ввода
              setCurrentTeamName('');

              // Отладка
              console.log('teamStore state: ', teamStore.getState());
              console.log('Next id: ', teamId.getState());
              console.log('currentTeamName: ', currentTeamName);
            }}>
          </Button>
          </Container>

          <Container>
            {teams.map((team) => {
                return (
                  <Cell
                    key={team.id}
                    content={<TextBox style={{marginLeft:"10px"}} title={`${team.name}`} />}
                    contentLeft={<CellDisclosure tabIndex={-1} />}
                  >
                  </Cell>
                )
              })}
          </Container>
          <Container>
            <h2>Продолжительность раунда: {duration} сек.</h2>
            <Slider
              onChangeCommitted={(value) => {
                setDuration(value);
                settingsStore.dispatch(setRoundDuration(value));
              }}
              min={30}
              max={120}
              value={duration}
            />
          </Container>

          <Container>
            <h2>Количество слов для победы: {wordsCount}</h2>
            <Slider
              onChangeCommitted={(value) => {
                setWordsCount(value);
                settingsStore.dispatch(setWordsCountToWin(value));
              }}
              min={10}
              max={60}
              value={wordsCount}
            />
          </Container>
          
          {/* Поменять gap между объектами */}
          
          <Container>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <h2>Общее последнее слово</h2>
              <Switch
                value={commonLW}
                onChange={() => {
                  setCommonLW(!commonLW);
                  settingsStore.dispatch(setCommonLastWord(!commonLW));
                }}
              />
            </div>
          </Container>

          <Container>
            <div style={{display:"flex", justifyContent:"space-between"}}>
              <h2>Штраф за пропуск</h2>
              <Switch
                value={penalty}
                onChange={() => {
                  setPenalty(!penalty);
                  settingsStore.dispatch(setPenaltyForSkip(!penalty));
                }}
              />
            </div>
          </Container>
          
          <Link to={'game'}>
            <Container>
            <Button text='Начать игру'></Button>
            </Container>
          </Link>
    </div>
  )
}

export default Settings

/*
<ul>
              {teams.map((team) => {
                return (<li key={team.id}>{team.name}</li>)
              })}
            </ul>
*/