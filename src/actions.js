export const addTeam = (id, name) => {
    return {
        type: 'ADD_TEAM',
        payload: {
            team: {
                id: id,
                name: name,
                guessedWords: [],
                skippedWords: [],
                score: 0
            }
        }
    }
}

export const removeTeam = (id) => {
    console.log('Вызвана команда диспатч REMOVE_TEAM с id ', id);
    return {
        type: 'REMOVE_TEAM',
        payload: {
            team: {
                id: id
            }
        }
    }
}

export const renameTeam = (id, newName) => {
    return {
        type: 'RENAME_TEAM',
        payload: {
            team: {
                id: id,
                name: newName
            }
        }
    }
}

// Обновить счет команды и добавить им угаданные слова
export const updateScore = (id, guessedWords, skippedWords, score) => {
    return {
        type: "UPDATE_SCORE",
        payload: {
            team: {
                id: id,
                guessedWords: guessedWords,
                skippedWords: skippedWords,
                score: score
            }
        }
    }
}

export const addOneWord = (id, word) => {
    return {
        type: "ADD_ONE_WORD",
        payload: {
            team: {
                id: id,
                word: word
            }
        }
    }
}

// Установить новые id при удалении команды
export const setNewId = () => {
    return {
        type: 'SET_NEW_ID'
    }
}

export const setPenaltyForSkip = (bool) => {
    return {
        type: 'SET_PENALTY_FOR_SKIP',
        payload: {
            penaltyForSkip: bool
        }
    }
}

export const setCommonLastWord = (bool) => {
    return {
        type: 'SET_COMMON_LAST_WORD',
        payload: {
            commonLastWord: bool
        }
    }
}

export const setWordsCountToWin = (number) => {
    return {
        type: 'SET_WORDS_TO_WIN',
        payload: {
            wordsCountToWin: number
        }
    }
}

export const setRoundDuration = (number) => {
    return {
        type: 'SET_ROUND_DURATION',
        payload: {
            roundDuration: number
        }
    }
}