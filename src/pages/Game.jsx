import React, { useEffect, useRef, useState } from 'react'
import { store } from '../store';
import { updateScore, addOneWord } from '../actions';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Cell, Container, P, TextBox, h2, h3 } from '@salutejs/plasma-ui';
import Modal from '../components/Modal';
import CellForScore from '../components/cellForScore/CellForScore';
import CustomButton from '../components/CustomButton';
import wordsList from '../db/wordsList';
import './game.css'

function Game() {
  const navigate = useNavigate();
  // Флаг для айдишника выигравшей команды
  let idWinning = null;

  // Объект настроек получаем из хранилища
  const settings = store.getState().settings;

  // Стэйты для слов
  let [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  // Стэйты для команд

  // Id-1 команды, у которой сейчас ход. На этот стейт повешен слушатель useEffect, который
  // диспатчит новый счёт команды в редьюсер и дает ход следующей команде
  const [turn, setTurn] = useState(0);
  // Текущая команда (по очереди берутся из reducerа)
  const [currentTeam, setCurrentTeam] = useState(store.getState().teamsArray[0]);

  // Определяет была ли начата игра (для того, чтобы отображать фразу продолжить вместо начать)
  const [isStarted, setIsStarted] = useState(false);

  // Получение количества команд из reducer
  const numberOfTeams = store.getState().teamsArray.length;

  const [thisIsLastWord, setThisIsLastWord] = useState(false);

  const [tempModalGuessedWord, setTempModalGuessedWord] = useState('');

  const [currentGuessedWords, setCurrentGuessedWords] = useState([]);
  const [currentSkippedWords, setCurrentSkippedWords] = useState([]);
  const [localScore, setLocalScore] = useState(0);

  useEffect(() => {
    if (settings.penaltyForSkip) {
      if (currentGuessedWords.length > currentSkippedWords.length) {
        setLocalScore(currentGuessedWords.length - currentSkippedWords.length);
      } else {
        setLocalScore(0);
      }
    } else {
      setLocalScore(currentGuessedWords.length);
    }
  }, [currentGuessedWords, currentSkippedWords])

  function addCurrentGuessedWord(word) {
    setCurrentGuessedWords(prevState => (
      [...prevState, word]
    ))
  }
  function addCurrentSkippedWord(word) {
    setCurrentSkippedWords(prevState => (
      [...prevState, word]
    ))
  }
  
  // Циклично передает ход другой команде по кругу
  function nextTurn() {
    //checkForWinner();
    setTurn((turn+1) % numberOfTeams);
    setIsStarted(false);
    console.log('Отработал next turn!');
  }

  // Получает новое слово из массива words (обновляет индекс)
  function getNewWord() {
    const newIndex = currentWordIndex + 1;
    const clampedIndex = Math.max(0, Math.min(newIndex, words.length - 1));
    setCurrentWordIndex(clampedIndex);
  }

  function shuffleArray(array) {
    const ans = [...array];
    console.log('ANS', ans)
    for (let i = ans.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [ans[i], ans[j]] = [ans[j], ans[i]]; // Элементы меняются местами
    }
    return ans;
}

function createObjectsWordsFromArray(words) {
  let ans = words.map((word, index) => {
    return {"id": index, "value": word};
  })
  return ans;
}

// Делает запрос на сервер json для получения слов и устанавливает статус "Loaded"
useEffect (() => {
  store.getState();
    const localWordsList = [...wordsList];
    //console.log('Локальные настройки: ', settings);
    //console.log('Настройки в сторе: ', store.getState().settings);
    // console.log('Изначальный', localWordsList);

    const shuffledWordsList = shuffleArray(localWordsList);
    // console.log('Перемешанный', shuffledWordsList);

    const objectWordsList = createObjectsWordsFromArray(shuffledWordsList);
    // console.log('Объектный', objectWordsList);

    setWords(objectWordsList);
}, []);

  // useEffect при новом ходе
  useEffect(() => {
    
    //console.log(`Локальное состояние команды ${newTeam.name}: `, newTeam);
    store.dispatch(updateScore(currentTeam.id, currentTeam.guessedWords, currentTeam.skippedWords, currentTeam.score));
    checkForWinner();
    //console.log('store state: ', store.getState())
    setCurrentTeam(store.getState().teamsArray[turn]);
    setTempModalGuessedWord('');
    setCurrentGuessedWords([]);
    setCurrentSkippedWords([]);
  }, [turn])

  useEffect(() => {
    if (settings.penaltyForSkip) {
      if (currentTeam.guessedWords.length > currentTeam.skippedWords.length) {
        setCurrentTeam(prevState => ({
          ...prevState,
           score: currentTeam.guessedWords.length - currentTeam.skippedWords.length
         }));
      }
      else {
        setCurrentTeam(prevState => ({
          ...prevState,
           score: 0
         }));
      }
    } else {
      setCurrentTeam(prevState => ({
        ...prevState,
         score: currentTeam.guessedWords.length
       }));
    }
    
  }, [currentTeam.guessedWords, currentTeam.skippedWords])

  // функция для проверки кто достиг победного количества слов
  function checkForWinner() {
    let maxScore = 0;
    store.getState().teamsArray.forEach(team => {
      if (team.score > maxScore) {
        maxScore = team.score;
        idWinning = team.id;
      }
      // console.log(`settings: ${settings}\n team name: ${team.name}\n id winning: ${idWinning}\n max score: ${maxScore} \n turn: ${turn}\n guessed words length: ${Gnumber}\n skipped words length: ${Snumber} \n score: ${score}`);
    })

    if (maxScore > settings.wordsCountToWin) {
      // console.log('Зашел в условие maxScore > settings.wordsCountToWin!');
      if (turn === 0) {
        //console.log('Переход на страницу с результатом!');
        maxScore = 0;
        idWinning = null;
        navigate('/result');
      }
    }
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
      setThisIsLastWord(true);
    }
  }, [isActive, timer]);
  
  const startTimer = () => {
    setIsActive(true);
    setIsStarted(true);
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
    //checkForWinner();
    nextTurn();
    resetTimer();
    getNewWord();
    setThisIsLastWord(false);
    setIsModalResultsOpen(false);
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
    openModalResults();
  }

  const addGuessedWord = (newWord) => {
    setCurrentTeam(prevState => ({
     ...prevState,
      guessedWords: [...prevState.guessedWords, newWord]
    }));
  };

  const addSkippedWord = (newWord) => {
    setCurrentTeam(prevState => ({
     ...prevState,
      skippedWords: [...prevState.skippedWords, newWord]
    }));
  };

  // Обработчик нажатия на кнопки "правильно" и "пропуск"
  const handleOnClickNextWord = (type) => {
    console.log('Сработала handleOnClickNextWord');
    if (timer !== 0) {
      if (type === 'guessed') {
        console.log('guessed');
        addGuessedWord(words[currentWordIndex]?.value);
        addCurrentGuessedWord(words[currentWordIndex]?.value);
        // setCurrentGuessedWords([...currentGuessedWords, words[currentWordIndex]?.value]);
      }
      if (type === 'skipped') {
        console.log('skipped');
        // setCurrentSkippedWords([...currentSkippedWords, words[currentWordIndex]?.value]);
        addSkippedWord(words[currentWordIndex]?.value);
        addCurrentSkippedWord(words[currentWordIndex]?.value);
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
          addGuessedWord(words[currentWordIndex]?.value);
          addCurrentGuessedWord(words[currentWordIndex]?.value);
          openModalResults();
        }
      }
      if (type === 'skipped') {
        console.log('skipped');
        addSkippedWord(words[currentWordIndex]?.value);
        addCurrentSkippedWord(words[currentWordIndex]?.value);
        openModalResults();
      }
    }
  }

  return (
    <>
      
      { isActive ?
        <div style={{marginBottom:"200px"}}>
          <Container style={{display:"flex", flexDirection:"column", gap:"10px"}}>
            <h2 style={{display:"flex", justifyContent:"center", wordBreak:"break-all"}}>{currentTeam.name}</h2>
            <h2 style={{display:"flex", justifyContent:"center", borderBottom:"0.2rem solid rgb(220,220,220)", paddingBottom:"10px"}}>
              {words[currentWordIndex]?.value || 'No more words'}</h2>
            <Button  onClick={() => handleOnClickNextWord('guessed')}>
              Правильно
            </Button>
            <Button onClick={() => handleOnClickNextWord('skipped')}> Пропуск </Button>
            <h3 style={{display:"flex", justifyContent:"center"}}>Оставшееся время: {timer}</h3>
            {
              thisIsLastWord ?
              <h3 style={{display:"flex", justifyContent:"center"}}>Это последнее слово!</h3> :
              <></>
            }
            <Button onClick={pauseTimer}>Пауза</Button>
            
            <div>
            <h3 style={{display:"flex", justifyContent:"center"}}>Угадано слов: {currentTeam.guessedWords.length}</h3>
            <h3 style={{display:"flex", justifyContent:"center"}}>Пропущено слов: {currentTeam.skippedWords.length}</h3>
            <h3 style={{display:"flex", justifyContent:"center"}}>{
              settings.wordsCountToWin - currentTeam.score > 0 ?
                `Осталось до победы: ${settings.wordsCountToWin - currentTeam.score}` :
                `Осталось до победы: ${0}`
            }</h3>
            </div>
            {/* Отладочная кнопка*/}
            {/* <Button onClick={() => setTimer(0)}>
              Пропустить ход до следующей команды
            </Button> */}
          </Container>
          
          <Modal className="modalResult" isOpen={isModalResultsOpen} onClose={closeModalResults}>
            <CellForScore
              team_name={currentTeam.name}
              settings={settings}
              score={`Счёт этого раунда: ${localScore}`}
              rest={`Общий счёт: ${currentTeam.score}`}
            />
            <h3>Угаданные слова: {currentGuessedWords.map((word, index) => {
              return index !== currentGuessedWords.length-1
              ?  word + ', '
              : word
            })}</h3>
            <h3>Пропущенные слова: {currentSkippedWords.map((word, index) => {
              return index !== currentSkippedWords.length-1
              ?  word + ', '
              : word
            })}</h3>
          </Modal>

          <Modal isOpen={isModalTeamPickerOpen} onClose={closeModalTeamPicker} buttonText={'Никому'}>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              <Cell content={<TextBox title={`Выберете команду, которой достанется очко за угаданное слово "${words[currentWordIndex]?.value}"`} ></TextBox>} />
              {
                store.getState().teamsArray.map((team) => {
                  return <Button onClick={() => {
                    if (currentTeam.id === team.id) {
                      addGuessedWord(words[currentWordIndex]?.value);
                      addCurrentGuessedWord(words[currentWordIndex]?.value);
                    } else {
                      // console.log('store.dispatch(addOneWord(currentTeam.id, words[currentWordIndex]?.value))!!!');
                      store.dispatch(addOneWord(team.id, words[currentWordIndex]?.value));
                      console.log(store.getState().teamsArray);
                    }
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
            <h2 style={{wordBreak:"break-all"}}>Сейчас Играет</h2>
            <h2 style={{wordBreak:"break-all"}}>{currentTeam.name}</h2>
            <Button onClick={startTimer}>
                {
                  isStarted
                  ? 'Продолжить игру'
                  : 'Начать игру'
                }
            </Button>
            <h3>Общий счёт</h3>
            {store.getState().teamsArray.map((team) => {
              return (
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"15px"}}>
                    <TextBox style={{wordBreak:"break-all"}} title={`${team.name}`} />
                    <TextBox title={team.score} />
                    
                </div>
              )
            })}
        <div style={{backgroundColor:"white", height:"3px", marginTop:"10px"}}></div>
          </Container>
        </div>
      }
    </>
  )
}

export default Game