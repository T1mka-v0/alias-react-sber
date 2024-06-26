import React, { useEffect, useRef, useState } from 'react'
import { store } from '../store';
import { updateScore } from '../actions';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Cell, Container, P, TextBox, h2, h3 } from '@salutejs/plasma-ui';
import Modal from '../components/Modal';
import CellForScore from '../components/cellForScore/CellForScore';
import CustomButton from '../components/CustomButton';
import wordsList from '../db/wordsList';
import './game.css'

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
  const navigate = useNavigate();
  // Флаг для айдишника выигравшей команды
  let idWinning = null;

  // Получаем список команд из redux хранилища
let teams = store.getState().teamsArray;
  useEffect(() => {
    teams = store.getState().teamsArray;
  })

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
  const [currentTeam, setCurrentTeam] = useState(teams[0]);
  // Текущий локальный список угаданных слов, нужный для рендера в модальном окне
  // и отправки в reducer
  const [currentGuessedWords, setCurrentGuessedWords] = useState([]);
  // Текущий локальный список пропушенных слов, нужный для рендера в модальном окне
  // и отправки в reducer, а также для счёта score
  const [currentSkippedWords, setCurrentSkippedWords] = useState([]);

  // Определяет была ли начата игра (для того, чтобы отображать фразу продолжить вместо начать)
  const [isStarted, setIsStarted] = useState(false);

  // Получение количества команд из reducer
  const numberOfTeams = store.getState().teamsArray.length;

  const [thisIsLastWord, setThisIsLastWord] = useState(false);

  const [localScore, setLocalScore] = useState(teams[0].score);

  const [tempModalGuessedWord, setTempModalGuessedWord] = useState('');
  
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
    const localWordsList = [...wordsList];
    //console.log('Локальные настройки: ', settings);
    //console.log('Настройки в сторе: ', store.getState().settings);
    console.log('Изначальный', localWordsList);

    const shuffledWordsList = shuffleArray(localWordsList);
    console.log('Перемешанный', shuffledWordsList);

    const objectWordsList = createObjectsWordsFromArray(shuffledWordsList);
    console.log('Объектный', objectWordsList);

    setWords(objectWordsList);
}, []);

  // useEffect при новом ходе
  useEffect(() => {
    const newTeam = {
        ...currentTeam,
        guessedWords: currentGuessedWords,
        skippedWords: currentSkippedWords
    }
    setCurrentSkippedWords([]);
    setCurrentGuessedWords([]);
    //console.log(`Локальное состояние команды ${newTeam.name}: `, newTeam);
    store.dispatch(updateScore(newTeam.id, newTeam.guessedWords, newTeam.skippedWords, localScore));
    checkForWinner();
    //console.log('store state: ', store.getState())
    setCurrentTeam(teams[turn]);
    setLocalScore(teams[turn].score);
    setTempModalGuessedWord('');
  }, [turn])

  useEffect(() => {
    //console.log('Угаданные: ', currentGuessedWords);
    //console.log('Пропущенные: ', currentSkippedWords);
  }, [currentSkippedWords, currentGuessedWords])

  // функция для проверки кто достиг победного количества слов
  function checkForWinner() {
    let maxScore = 0;
    teams.forEach(team => {
      const Gnumber = team.guessedWords.length;
      const Snumber = team.skippedWords.length;

      let score = 
      settings.penaltyForSkip ?
        Gnumber - Snumber > 0 ?
          Gnumber - Snumber
          : 0
      : Gnumber;

      if (score > maxScore) {
        maxScore = score;
        idWinning = team.id;
      }
      // console.log(`settings: ${settings}\n team name: ${team.name}\n id winning: ${idWinning}\n max score: ${maxScore} \n turn: ${turn}\n guessed words length: ${Gnumber}\n skipped words length: ${Snumber} \n score: ${score}`);
    })

    if (maxScore > settings.wordsCountToWin) {
      // console.log('Зашел в условие maxScore > settings.wordsCountToWin!');
      if (turn === 0) {
        //console.log('Переход на страницу с результатом!');
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

  // Обработчик нажатия на кнопки "правильно" и "пропуск"
  const handleOnClickNextWord = (type) => {
    console.log('Сработала handleOnClickNextWord');
    if (timer !== 0) {
      if (type === 'guessed') {
        console.log('guessed');
        setCurrentGuessedWords([...currentGuessedWords, words[currentWordIndex]?.value]);
        setLocalScore(prevLocalScore => prevLocalScore + 1);
      }
      if (type === 'skipped') {
        console.log('skipped');
        setCurrentSkippedWords([...currentSkippedWords, words[currentWordIndex]?.value]);
        if (settings.penaltyForSkip) {
          if (localScore > 0) {
            setLocalScore(prevLocalScore => prevLocalScore - 1);
          }
          else {
            setLocalScore(0);
          }
        }
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
          setLocalScore(prevLocalScore => prevLocalScore + 1);
          openModalResults();
        }
      }
      if (type === 'skipped') {
        console.log('skipped');
        setCurrentSkippedWords([...currentSkippedWords, words[currentWordIndex]?.value]);
        if (settings.penaltyForSkip) {
          if (localScore > 0) {
            setLocalScore(prevLocalScore => prevLocalScore - 1);
          }
          else {
            setLocalScore(0);
          }
        }
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
            <h3 style={{display:"flex", justifyContent:"center"}}>Угадано слов: {currentGuessedWords.length}</h3>
            <h3 style={{display:"flex", justifyContent:"center"}}>Пропущено слов: {currentSkippedWords.length}</h3>
            <h3>{
              settings.wordsCountToWin - localScore > 0 ?
                `Осталось до победы: ${settings.wordsCountToWin - localScore}` :
                `Осталось до победы: ${0}`
            }</h3>
            </div>
            {/* Отладочная кнопка*/}
            <Button onClick={() => setTimer(0)}>
              Пропустить ход до следующей команды
            </Button>
          </Container>
          
          <Modal className="modalResult" isOpen={isModalResultsOpen} onClose={closeModalResults}>
            <CellForScore
              team_name={currentTeam.name}
              settings={settings}
              score={localScore + Number(!!tempModalGuessedWord)}
              rest={`Общий счёт: ${teams[turn].score + localScore}`}
            />
            <h3>Угаданные слова: {[...currentGuessedWords, tempModalGuessedWord].map((word, index) => {
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
                teams.map((team) => {
                  return <Button onClick={() => {
                    // Мб хуйня написана какая то
                    team.guessedWords.push(words[currentWordIndex]?.value);
                    team.score += 1;
                    if (currentTeam.id === team.id) {
                      setTempModalGuessedWord(words[currentWordIndex]?.value);
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
                    <TextBox title={settings.penaltyForSkip ?
                      team.guessedWords.length - team.skippedWords.length > 0 ?
                      <p>{team.guessedWords.length - team.skippedWords.length}</p> 
                      : <p>0</p>
                  : <p>{team.guessedWords.length}</p>} />
                    
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