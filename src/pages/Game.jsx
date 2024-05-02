import React, { useEffect, useState } from 'react'

function Game() {
    let [words, setWords] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    
    const request = async () => {
        const url = 'http://localhost:3001/words';
        await fetch(url)
            .then((response) => response.json())
            .then((data) => { 
                console.log('Data received');
                setWords(data);
                console.log(data);
            })
            .catch(e => console.log(e))
    }

    useEffect (() => {
        request();
        setIsLoaded(true);
    }, []);

    function getNewWord() {
        const newIndex = currentWordIndex + 1;
        const clampedIndex = Math.max(0, Math.min(newIndex, words.length - 1));
        setCurrentWordIndex(clampedIndex);
    }

  return (
    isLoaded ?
        <div>
            <h2>{words[currentWordIndex]?.value || 'No more words'}</h2>
            <button onClick={() => getNewWord()}>
                Right
            </button>
            <button onClick={() => getNewWord()}>
                Wrong
            </button>
            {
                words.map((word, index) => {
                    console.log(index + " - Word : " + word.value);
                    // return <Word key={index} word={word} />;
                })
            }
            
        </div>
    :  
        <h2>Loading...</h2>
  )
}

export default Game