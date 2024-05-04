import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { teamStore, teamId } from '../store';
import { addTeam, removeTeam, renameTeam } from '../actions';

import { Button, Slider, Switch, TextField } from '@salutejs/plasma-ui';
import { Theme, DocStyles } from '../SberStyles';

 const duration_const = 60; // seconds
 const words_const = 30; // words
function Settings() {

  const [duration, setDuration] = useState(duration_const);
  const  [wordsCount, setWordsCount] = useState(words_const);

  // Локальное состояние - массив команд для отображения на странице
  const [teams, setTeams] = useState(teamStore.getState());

  const [currentTeamName, setCurrentTeamName] = useState('');

  return (
    <div>
      <DocStyles />
      <Theme />
          <h1>Настройки</h1>
          <div>
            <TextField
              placeholder='Название команды'
              onChange={(e) => setCurrentTeamName(e.target.value)}
              value={currentTeamName}
            />
          </div>

          <Button
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

          <div>
            <ul>
              {teams.map((team) => {
                return (<li key={team.id}>{team.name}</li>)
              })}
            </ul>
          </div>
          <h2>Продолжительность раунда: {duration} сек.</h2>

          <Slider
            onChangeCommitted={(e) => {setDuration(e.value)}}
            min={30}
            max={120}
            value={duration}
          />
          
          <h2>Количество слов для победы: {wordsCount}</h2>
          <Slider
            onChangeCommitted={(e) => {setWordsCount(e.value)}}
            min={10}
            max={60}
            value={wordsCount}
          />
          
          {/* Поменять gap между объектами */}
          
              <h2>Общее последнее слово</h2>
            <Switch />
          
              <h2>Штраф за пропуск</h2>
              <Switch />
          
          <Link to={'game'}>
            <Button text='Начать игру'></Button>
          </Link>
    </div>
  )
}

export default Settings