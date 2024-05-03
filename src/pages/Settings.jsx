import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { teamStore, teamId } from '../store';
import { addTeam, removeTeam, renameTeam } from '../actions';

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
          <h1>Настройки</h1>
          <div>
            <input
              id='new-team'
              type="text"
              placeholder='Название команды'
              onChange={(e) => setCurrentTeamName(e.target.value)}
              value={currentTeamName}
            />
          </div>
          <button onClick={() => {

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
            Добавить команду
          </button>
          <div>
            <ul>
              {teams.map((team) => {
                return (<li key={team.id}>{team.name}</li>)
              })}
            </ul>
          </div>
          <h2>Продолжительность раунда: {duration} сек.</h2>
          
          <h2>Количество слов для победы: {wordsCount}</h2>
          
          {/* Поменять gap между объектами */}
          
              <h2>Общее последнее слово</h2>
            
          
              <h2>Штраф за пропуск</h2>
          
          <Link to={'game'}>
            start game
          </Link>
    </div>
  )
}

export default Settings