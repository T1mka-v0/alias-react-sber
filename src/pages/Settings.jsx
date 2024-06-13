import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { store } from '../store';
import { 
  addTeam,
  removeTeam,
  renameTeam,
  setNewId,
  setCommonLastWord,
  setPenaltyForSkip,
  setRoundDuration,
  setWordsCountToWin
 } from '../actions';

import { Button, Cell, Slider, Switch, TextBox, TextField, Checkbox } from '@salutejs/plasma-ui';
import { Theme, DocStyles } from '../SberStyles';
import { Container, CellDisclosure } from '@salutejs/plasma-ui';

// Адаптивная типографика
import { BodyL, bodyL, bodyM, bodyLBold } from '@salutejs/plasma-ui';
import { IconAddFill, IconAnimalFill, IconChatFill, IconCross, IconNextOutline, IconNoteFill, IconNotebookFill, IconNotebookWavesOutline, IconPinDashOutline, IconText, IconTrashFill, IconTrashFilled, IconViewBeautyOutline } from '@salutejs/plasma-icons';
import Modal from '../components/Modal';
import { useSelector } from 'react-redux';

import { send_action_value } from '../assistant';
import assistant from '../assistant';

function Settings() {

  // Настройки игры
  const [duration, setDuration] = useState(store.getState().settings.roundDuration);
  const  [wordsCount, setWordsCount] = useState(store.getState().settings.wordsCountToWin);
  const [commonLW, setCommonLW] = useState(store.getState().settings.commonLastWord);
  const [penalty, setPenalty] = useState(store.getState().settings.penaltyForSkip);

  // Локальное состояние - массив команд для отображения на странице
  const [teams, setTeams] = useState(store.getState().teamsArray);

  // Состояние которое отражает текущее значение поля ввода
  const [currentTeamName, setCurrentTeamName] = useState('');

  const navigate = useNavigate();

  const storeSubscribe = useSelector(state => state);

  useEffect(() => {
    console.log('Запрос на ререндер при обновлении стора', storeSubscribe);
    setTeams(store.getState().teamsArray);
    setDuration(store.getState().settings.roundDuration);
    setWordsCount(store.getState().settings.wordsCountToWin);
    setCommonLW(store.getState().settings.commonLastWord);
    setPenalty(store.getState().settings.penaltyForSkip);
  },[storeSubscribe])

  const handleAddTeam = () => {
    // Отправляю в redux новую команду с название из инпута
    store.dispatch(addTeam(store.getState().teamId, currentTeamName));

    // увеличиваю id для следующей команды
    store.dispatch({type: 'NEXT'});

    // Очищаем поле ввода
    setCurrentTeamName('');

    // Отладка
    console.log('teams state: ', store.getState().teamsArray);
    console.log('Next id: ', store.getState().teamId);
  }

  // Удаление команды по id
  const deleteTeamById = (id) => {
    store.dispatch(removeTeam(id));
    store.dispatch(setNewId());
  }

  // Модальное окно для смены имени команды
  const [modalRename, setModalRename] = useState(
    {
      teamId: null,
      opened: false
    }
  );
  const openModal = (id) => {
    setModalRename({teamId: id, opened: true});
  }
  const closeModal = () => {
    if (newTeamName === '') {
      setModalRename({...modalRename, opened: false});
    }
    else {
      // localRenameTeam(modalRename.store, newTeamName);
      store.dispatch(renameTeam(modalRename.teamId, newTeamName));
      setModalRename({...modalRename, opened: false});
      setNewTeamName('');
    }
    
  }
  // Состояние поля ввода названия команды
  const [newTeamName, setNewTeamName] = useState('');
  const localRenameTeam = (id, name) => {
    const newTeams = teams.map((team) => {
      return team.id === id ? {...team, name:name} : team;
    })
    setTeams(newTeams);
  }

  return (
    <div style={{marginBottom: '200px'}}>
      <DocStyles />
      <Theme />
      {/* Модальное окно для изменения названия команды */}
      <Modal isOpen={modalRename.opened} onClose={closeModal}>
        <TextField 
          placeholder='Новое название'
          value={newTeamName}
          onChange={e => setNewTeamName(e.target.value)}
          onSearch={closeModal}
          helperText={newTeamName === '' ? 'Название команды не может быть пустым' : null}
        />
      </Modal>
      <h1 style={{display:"flex", justifyContent:"center"}}>Настройки</h1>
      
      { /* ------------------------------------------------------------------------------ */ }
      {/* Поле для названия команды */}
      { /* ------------------------------------------------------------------------------ */ }
      <Container style={{marginBottom:"10px"}}>
        <TextField
          placeholder='Название команды'
          onChange={(e) => setCurrentTeamName(e.target.value)}
          value={currentTeamName}
          onSearch={currentTeamName !== '' ? handleAddTeam : null}
          helperText={currentTeamName === '' ? 'Название команды не может быть пустым' : null}
        />
      </Container>
      { /* ------------------------------------------------------------------------------ */ }
      {/* Кнопка для добавления команды */}
      { /* ------------------------------------------------------------------------------ */ }
      <Container>
      <Button
        style={{marginBottom:"10px", height:"4rem", letterSpacing:"1px"}}
        text='Добавить команду'
        onClick={handleAddTeam}
        size="l"
        disabled={currentTeamName === ''}
      ></Button>
      </Container>

      { /* ------------------------------------------------------------------------------ */ }
      {/* Всплывающая подсказка о малом количестве команд */}
      { /* ------------------------------------------------------------------------------ */ }
      {teams.length <= 1 &&
        <Container>
          <Cell content={<TextBox style={{marginLeft:"10px"}} title='Для игры должно быть больше одной команды' /> }></Cell>
        </Container>
      }

      { /* ------------------------------------------------------------------------------ */ }
      {/* Список команд */}
      { /* ------------------------------------------------------------------------------ */ }
      <Container style={{display:"flex", flexDirection:"column", gap:"0.5rem"}}>
        {teams.map((team) => {
          return (
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <Cell
                key={team.id}
                content={<TextBox style={{marginLeft:"10px"}} title={`${team.name}`} />}
                contentLeft={`${team.id}.`}
              >
              </Cell>
              <div style={{display:"flex", alignItems:"center", gap:"0.5rem"}}>
                <Button
                  size='s'
                  onClick={() => deleteTeamById(team.id)}
                  contentRight={<IconTrashFill/>}
                />
                <Button
                  size='s'
                  onClick={() => openModal(team.id)}
                  contentRight={<IconText/>}
                />
              </div>
            </div>
          )
        })}
      </Container>

      { /* ------------------------------------------------------------------------------ */ }
      {/* Продолжительность раунда */}
      { /* ------------------------------------------------------------------------------ */ }
      <Container>
        <h2>Продолжительность раунда: {duration} сек.</h2>
        <Slider
          onChange={(value) => {
            setDuration(value);
            store.dispatch(setRoundDuration(value));
          }}
          onChangeCommitted={(value) => {
            store.dispatch(setRoundDuration(value));
          }}
          min={30}
          max={120}
          value={duration}
        />
      </Container>

      { /* ------------------------------------------------------------------------------ */ }
      {/* Количество слов для победы */}
      { /* ------------------------------------------------------------------------------ */ }
      <Container>
        <h2>Количество слов для победы: {wordsCount}</h2>
        <Slider
          onChange={(value) => {
            setWordsCount(value);
            store.dispatch(setWordsCountToWin(value));
          }}
          onChangeCommitted={(value) => {
            store.dispatch(setWordsCountToWin(value));
          }}
          min={10}
          max={60}
          value={wordsCount}
        />
      </Container>
      
      <Container>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <h2>Общее последнее слово</h2>
          <Switch
            checked={commonLW}
            onChange={() => {
              store.dispatch(setCommonLastWord(!commonLW));
            }}
          />
        </div>
      </Container>

      <Container>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <h2>Штраф за пропуск</h2>
          <Switch
            checked={penalty}
            onChange={() => {
              store.dispatch(setPenaltyForSkip(!penalty));
            }}
          />
        </div>
      </Container>

      {/* Test */}
      {/* <Container>
        <div style={{display:"flex", justifyContent:"space-between"}}>
          <h2>Общее последнее слово</h2>
          <Checkbox
            value={commonLW}
            onChange={() => {
              setCommonLW(!commonLW);
              store.dispatch(setCommonLastWord(!commonLW));
            }}
          />
        </div>
      </Container> */}

      {/* <Button  onClick={() => setPenaltyForSkip(true)}>Вкл штраф</Button>
      <Button  onClick={() => setPenaltyForSkip(false)}>Выкл штраф</Button> */}
      
      <Container>
        <Button
          text='Начать игру'
          disabled={teams.length <= 1}
          onClick={() => {
            navigate('/game')
            // send_action_value('start_game', true);
          }}
        >
        </Button>
      </Container>

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