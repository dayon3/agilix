import { useState, useEffect } from 'react'
import { db } from '../firebase/fbConfig'

const useKanban = (userId, boardId) => {
    const [tasks, setTasks] = useState(null)
    const [columns, setColumns] = useState(null)
    const [final, setFinal] = useState(null)
    const [boardName, setBoardName] = useState('')


    useEffect(() => {
        return db.collection(`users/${userId}/boards/${boardId}/tasks`)
            .onSnapshot(snap => {
                const documents = []
                snap.forEach(d => {
                    documents.push({ id: d.id, ...d.data() })
                })
                setTasks(documents)
            })
    }, [userId, boardId])


    useEffect(() => {
        return db.collection(`users/${userId}/boards`)
            .doc(boardId)
            .get()
            .then(d => setBoardName(d.data().name))
    }, [])


    useEffect(() => {
        return db.collection(`users/${userId}/boards/${boardId}/columns`)
            .onSnapshot(snap => {
                const documents = []
                snap.forEach(d => {
                    documents.push({ id: d.id, ...d.data() })
                })
                setColumns(documents)
            })
    }, [userId, boardId])


    useEffect(() => {
        if (tasks && columns) {
            const finalObject = {}
            finalObject.columnOrder = ['backlog', 'ready', 'inProgress', 'done']
            finalObject.columns = {}
            finalObject.tasks = {}

            tasks.forEach(t => finalObject.tasks[t.id] = t)
            columns.forEach(c => finalObject.columns[c.id] = c)

            setFinal(finalObject)
        }
    }, [tasks, columns])


    return { initialData: final, setInitialData: setFinal, boardName }

}

export default useKanban