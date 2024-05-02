export const addTeam = (id, name) => {
    return {
        type: 'ADD_TEAM',
        team: {
            id: id,
            name: name,
            score: 0,
            words: []
        }
    }
}

export const removeTeam = (id) => {
    return {
        type: 'REMOVE_TEAM',
        team: {
            id: id
        }
    }
}

export const renameTeam = (id, newName) => {
    return {
        type: 'RENAME_TEAM',
        team: {
            id: id,
            name: newName
        }
    }
}