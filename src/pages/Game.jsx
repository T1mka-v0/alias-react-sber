import React, { useEffect, useState } from 'react'
import { teamStore, teamId } from '../store';
import { updateScore } from '../actions';

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
            guessedWords: [...teams[turn].guessedWords, ...guessedWords]
        }
        setSkippedWords([]);
        setguessedWords([]);
        console.log(`Состояние команды ${newTeam.name}: `, newTeam);
        teamStore.dispatch(updateScore(newTeam.id, newTeam.score, newTeam.guessedWords));
        setCurrentTeam(teams[turn]);
    }, [turn])

    useEffect(() => {
        console.log('Угаданные: ', guessedWords);
        console.log('Пропущенные: ', skippedWords);
    }, [skippedWords, guessedWords])

  return (
    isLoaded ?
        <div>
            <h2>Ход команды: {currentTeam.name}</h2>

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
            
        </div>
    :  
        <h2>Loading...</h2>
  )
}

export default Game