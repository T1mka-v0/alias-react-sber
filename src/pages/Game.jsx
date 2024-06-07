import React, { useEffect, useRef, useState } from 'react'
import { store } from '../store';
import { updateScore } from '../actions';
import { DocStyles, Theme } from '../SberStyles';
import { Link } from 'react-router-dom';
import { Button, Cell, Container, TextBox } from '@salutejs/plasma-ui';
import Modal from '../components/Modal';
import CellForScore from '../components/cellForScore/CellForScore';
import CustomButton from '../components/CustomButton';
import wordsList from '../db/wordsList';

// const defaultTeam = {
//     id: 0,
//     name: '',
//     score: 0,
//     currentGuessedWords: []
// }
// const settingsInitialState = {
//     roundDuration: 60,
//     wordsCountToWin: 30,
//     commonLastWord: false,
//     penaltyForSkip: false
// }

function Game() {
  // Получаем список команд из redux хранилища
  const teams = store.getState().teamsArray;

  // Объект настроек получаем из хранилища
  const settings = store.getState().settings;

  // Загрузчик
  const [isLoaded, setIsLoaded] = useState(true);

  // Стэйты для слов
  let [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Стэйты для команд

  // Id команды, у которой сейчас ход. На этот стейт повешен слушатель useEffect, который
  // диспатчит новый счёт команды в редьюсер и дает ход следующей команде
  const [turn, setTurn] = useState(0);
  // Текущая команда (по очереди берутся из reducerа)
  const [currentTeam, setCurrentTeam] = useState(teams[0]);
  // Текущий локальный список угаданных слов, нужный для рендера в модальном окне
  // и отправки в reducer
  const [currentGuessedWords, setCurrentGuessedWords] = useState([]);
  // Текущий локальный список пропушенных слов, нужный для рендера в модальном окне
  // и отправки в reducer, а также для счёта score
  const [currentSkippedWords, setCurrentSkippedWords] = useState([]);
  
  // Запрос на сервер для получения json слов
  // const request = async () => {
  //   const url = '../words/words.json';
  //   await fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => { 
  //       console.log('Data received');
  //       setWords(data);
  //     })
  //     .catch(e => console.log(e))
  // }

  // Получение количества команд из reducer
  const numberOfTeams = store.getState().teamsArray.length;
  
  // Циклично передает ход другой команде по кругу
  function nextTurn() {
    setTurn((turn+1) % numberOfTeams);
    console.log('Отработал next turn!');
  }

  // Получает новое слово из массива words (обновляет индекс)
  function getNewWord() {
    const newIndex = currentWordIndex + 1;
    const clampedIndex = Math.max(0, Math.min(newIndex, words.length - 1));
    setCurrentWordIndex(clampedIndex);
  }

  // Делает запрос на сервер json для получения слов и устанавливает статус "Loaded"
  useEffect (() => {
    // request();
    // setIsLoaded(true);
    // console.log(numberOfTeams);
    // console.log(teams);
    // console.log(currentTeam)
    console.log('Локальные настройки: ', settings);
    console.log('Настройки в сторе: ', store.getState().settings);
    setWords(wordsList);
  }, []);

  // 
  useEffect(() => {
    const newTeam = {
        ...currentTeam,
        guessedWords: currentGuessedWords,
        skippedWords: currentSkippedWords
    }
    setCurrentSkippedWords([]);
    setCurrentGuessedWords([]);
    console.log(`Локальное состояние команды ${newTeam.name}: `, newTeam);
    store.dispatch(updateScore(newTeam.id, newTeam.guessedWords, newTeam.skippedWords));
    console.log('store state: ', store.getState())
    setCurrentTeam(teams[turn]);
  }, [turn])

  useEffect(() => {
    console.log('Угаданные: ', currentGuessedWords);
    console.log('Пропущенные: ', currentSkippedWords);
  }, [currentSkippedWords, currentGuessedWords])

  // функция для проверки кто достиг победного количества слов
  function checkForWinner() {

  }

  // !--------------------------------------------------------------------------------------------------!
  // Таймер
  // !--------------------------------------------------------------------------------------------------!

  const requestedDuration = store.getState().settings.roundDuration;

  // отладочные 3 секунды
  const [timer, setTimer] = useState(requestedDuration);
  // const [timer, setTimer] = useState(requestedDuration);
  const [isActive, setIsActive] = useState(false);
  
  // Счётчик таймера
  useEffect(() => {
    if (isActive && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(intervalId);
    }
    if (timer === 0) {
      console.log('Таймер истек!');
    }
  }, [isActive, timer]);
  
  const startTimer = () => {
    setIsActive(true);
  };
  const resetTimer = () => {
    setIsActive(false);
    setTimer(requestedDuration);
  }
  const pauseTimer = () => {
    setIsActive(false);
  }

  // !--------------------------------------------------------------------------------------------------!
  // Модальное окно на промежуточный результат
  // !--------------------------------------------------------------------------------------------------!

  const [isModalResultsOpen, setIsModalResultsOpen] = useState(false);
  const openModalResults = () => {
    setIsModalResultsOpen(true);
  }
  const closeModalResults = () => {
    setIsModalResultsOpen(false);
    nextTurn();
    resetTimer();
    getNewWord();
  }

  // !--------------------------------------------------------------------------------------------------!
  // Модальное окно на выбор команды кому присудить очко
  // !--------------------------------------------------------------------------------------------------!

  const [isModalTeamPickerOpen, setIsModalTeamPickerOpen] = useState(false);
  const openModalTeamPicker = () => {
    setIsModalTeamPickerOpen(true);
  }
  const closeModalTeamPicker = () => {
    setIsModalTeamPickerOpen(false);
    nextTurn();
    resetTimer();
    getNewWord();
  }

  // Обработчик нажатия на кнопки "правильно" и "пропуск"
  const handleOnClickNextWord = (type) => {
    console.log('Сработала handleOnClickNextWord');
    if (timer !== 0) {
      if (type === 'guessed') {
        console.log('guessed');
        setCurrentGuessedWords([...currentGuessedWords, words[currentWordIndex]?.value]);
      }
      if (type === 'skipped') {
        console.log('skipped');
        setCurrentSkippedWords([...currentSkippedWords, words[currentWordIndex]?.value]);
      }
      getNewWord();
    }
    else {
      if (type === 'guessed') {
        console.log('guessed');
        if (settings.commonLastWord) {
          openModalTeamPicker();
        }
        else {
          setCurrentGuessedWords([...currentGuessedWords, words[currentWordIndex]?.value]);
          openModalResults();
        }
      }
      if (type === 'skipped') {
        console.log('skipped');
        setCurrentSkippedWords([...currentSkippedWords, words[currentWordIndex]?.value]);
        openModalResults();
      }
    }
  }

  return (
    <>
      <DocStyles />
      <Theme />
      {isLoaded ? 
        isActive ?
          <div>
            <Container style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              <h2 style={{display:"flex", justifyContent:"center"}}>Играет: {currentTeam.name}</h2>
              <h2 style={{display:"flex", justifyContent:"center"}}>{words[currentWordIndex]?.value || 'No more words'}</h2>
              <Button  onClick={() => handleOnClickNextWord('guessed')}>
                Правильно
              </Button>
              <Button onClick={() => handleOnClickNextWord('skipped')}> Пропуск </Button>
              <h2 style={{display:"flex", justifyContent:"center"}}>Оставшееся время: {timer}</h2>
              <Button onClick={pauseTimer}>Пауза</Button>
              <h2 style={{display:"flex", justifyContent:"center"}}>Отладочные кнопки:</h2>
              <Link to={'/result'}>
                <Button>
                  Закончить игру 
                </Button>
              </Link>

              <Button onClick={() => setTimer(0)}>
                Пропустить ход до следующей команды
              </Button>
            </Container>
            
            <Modal isOpen={isModalResultsOpen} onClose={closeModalResults}>
              <CellForScore
                team_name={currentTeam.name}
                settings={settings}
                Gnumber={currentGuessedWords.length}
                Snumber={currentSkippedWords.length}
              />
              <h2>Угаданные слова: {currentGuessedWords.map((word, index) => {
                return index !== currentGuessedWords.length-1
                ?  word + ', '
                : word
              })}</h2>
              <h2>Пропущенные слова: {currentSkippedWords.map((word, index) => {
                return index !== currentSkippedWords.length-1
                ?  word + ', '
                : word
              })}</h2>
            </Modal>

            <Modal isOpen={isModalTeamPickerOpen} onClose={closeModalTeamPicker} buttonText={'Никому'}>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                <Cell content={<TextBox title={`Выберете команду, которой достанется очко за угаданное слово "${words[currentWordIndex]?.value}"`} ></TextBox>} />
                {
                  teams.map((team) => {
                    return <Button onClick={() => {
                      team.guessedWords.push(words[currentWordIndex]?.value);
                      closeModalTeamPicker();
                    }}>{team.name}</Button>
                  })
                }
              </div>
            </Modal>
          </div>
        :
        <div>
          <Container style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
            <h2>Играет: {currentTeam.name}</h2>
            <Button onClick={startTimer}>
                Начать игру
            </Button>
          </Container>
        </div>
      :  
        <h2>Loading...</h2>
      }
    </>
  )
}

export default Game