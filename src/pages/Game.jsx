import React, { useEffect, useRef, useState } from 'react'
import { teamStore, teamId, settingsStore } from '../store';
import { updateScore } from '../actions';
import { DocStyles, Theme } from '../SberStyles';
import { Link } from 'react-router-dom';
import { Button } from '@salutejs/plasma-ui';

// import Timer from '../components/Timer';

const defaultTeam = {
    id: 0,
    name: '',
    score: 0,
    guessedWords: []
}

function Game() {
    // Получаем список команд из redux хранилища
    const teams = teamStore.getState();

    // Загрузчик
    const [isLoaded, setIsLoaded] = useState(false);

    // Стэйты для слов
    let [words, setWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    // Стэйты для команд
    const [turn, setTurn] = useState(0);
    const [currentTeam, setCurrentTeam] = useState(teams[0]);
    const [guessedWords, setguessedWords] = useState([]);
    const [skippedWords, setSkippedWords] = useState([]);
    
    // Запрос на сервер для получения json слов
    const request = async () => {
        const url = 'http://localhost:3001/words';
        await fetch(url)
            .then((response) => response.json())
            .then((data) => { 
                console.log('Data received');
                setWords(data);
            })
            .catch(e => console.log(e))
    }

    // Получение количества команд
    const numberOfTeams = teamStore.getState().length;
    
    function nextTurn() {
        setTurn((turn+1) % numberOfTeams);
        console.log('Отработал next turn!');
    }

    // Получает новое слово из массива words
    function getNewWord() {
        const newIndex = currentWordIndex + 1;
        const clampedIndex = Math.max(0, Math.min(newIndex, words.length - 1));
        setCurrentWordIndex(clampedIndex);
    }

    useEffect (() => {
        request();
        setIsLoaded(true);
        console.log(numberOfTeams);
        console.log(teams);
        console.log(currentTeam)
    }, []);

    useEffect(() => {
        
        const newTeam = {
            ...currentTeam,
            score: currentTeam.score + guessedWords.length,
            guessedWords: guessedWords
        }
        setSkippedWords([]);
        setguessedWords([]);
        console.log(`Локальное состояние команды ${newTeam.name}: `, newTeam);
        teamStore.dispatch(updateScore(newTeam.id, newTeam.score, newTeam.guessedWords));
        console.log('teamStore state: ', teamStore.getState())
        setCurrentTeam(teams[turn]);
    }, [turn])

    useEffect(() => {
        console.log('Угаданные: ', guessedWords);
        console.log('Пропущенные: ', skippedWords);
    }, [skippedWords, guessedWords])

    // Таймер
    const requestedDuration = settingsStore.getState().roundDuration;
    const [timer, setTimer] = useState(requestedDuration);
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        if (isActive && timer > 0) {
        const intervalId = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
    
        return () => clearInterval(intervalId);
        }
    }, [isActive, timer]);
    
    useEffect(() => {
        if (timer === 0) {
        console.log('Таймер истек!');
        // Здесь можно вызвать функцию, которую нужно выполнить после истечения времени
        }
    }, [timer]);
    
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

  return (
    <>
        <DocStyles />
        <Theme />
        {isLoaded ?
        <div>
            <h2>Ход команды: {currentTeam.name}</h2>
            <div>
                <div>Оставшееся время: {timer}</div>
                <Button onClick={startTimer}>
                    Запустить таймер
                </Button>
            </div>

            <h2>{words[currentWordIndex]?.value || 'No more words'}</h2>
            <button onClick={() => {
                setguessedWords([...guessedWords, words[currentWordIndex]?.value]);
                getNewWord();
            }}>
                Right
            </button>
            <button onClick={() => {
                setSkippedWords([...skippedWords, words[currentWordIndex]?.value]);
                getNewWord();
            }}>
                Wrong
            </button>
            <button
                style={{display:'block'}}
                onClick={() => {nextTurn()}}
            >Следующая команда</button>
            
            <Link to={'/result'}>
                <Button onClick={() => {nextTurn()}}>
                    Окончить игру
                </Button>
            </Link>

            <Button onClick={startTimer}>
                Запустить таймер
            </Button>
        </div>
    :  
        <h2>Loading...</h2>
}
    </>
  )
}

export default Game