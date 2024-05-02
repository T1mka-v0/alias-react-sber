import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { next } from '../slices/teamId';
import { add, remove, rename } from '../slices/teamArray';

 const duration_const = 60; // seconds
 const words_const = 30; // words
function Settings() {
  function createTeamObj(id, name) {
    return {
    team: {
      id: id,
      name: name,
      score: 0,
      words: []
    }
    }
  }

  const reduxTeamId = useSelector(state => state.teamId);
  const reduxTeamArray = useSelector(state => state.teamArray.value);
  const dispatch = useDispatch();

  const [duration, setDuration] = useState(duration_const);
  const  [wordsCount, setWordsCount] = useState(words_const);

  // Локальное состояние - массив команд для отображения на странице
  const [teams, setTeams] = useState(reduxTeamArray);

  const [currentTeamName, setCurrentTeamName] = useState('');

  return (
    <div>
          <h1>Настройки</h1>
          <div>
            <ul>
              {teams.map((team) => {
                return (<li key={team.id}>{team.name}</li>)
              })}
            </ul>
          </div>
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
            dispatch(add(createTeamObj(currentTeamName)));

            // Добавляю новую команду локально
            setTeams([...teams, {
              id: reduxTeamId,
              name: currentTeamName,
              score: 0,
              words: []
            }]);

            // увеличиваю id для следующей команды
            dispatch(next());

            // Очищаем поле ввода
            setCurrentTeamName('');

            // Отладка
            console.log('Локальные команды', teams);
            console.log('teamStore state: ', reduxTeamArray);
            console.log('Next id: ', reduxTeamId);
            console.log('currentTeamName: ', currentTeamName);
          }}>
            Добавить команду
          </button>
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