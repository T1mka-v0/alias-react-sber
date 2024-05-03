export const addTeam = (id, name) => {
    return {
        type: 'ADD_TEAM',
        payload: {
            team: {
                id: id,
                name: name,
                score: 0,
                guessedWords: []
            }
        }
    }
}

export const removeTeam = (id) => {
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
export const updateScore = (id, newScore, newWords) => {
    return {
        type: "UPDATE_SCORE",
        payload: {
            team: {
                id: id,
                score: newScore,
                guessedWords: newWords
            }
        }
    }
}