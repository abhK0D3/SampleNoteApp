import Note from './components/Note.jsx'
import noteService from './services/notes'
import {useState, useEffect} from 'react'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNotes, setNewNotes] = useState('')
  const [showNotes, setShowNotes] = useState(true)

  useEffect(() => {
    noteService
      .getAll()
      .then(response => {
        setNotes(response.data)
      })
  }, [])

  const addNote = (event) => {    //event parameter is the event that triggers the call to event handler function
    event.preventDefault()  //prevent default action, among other things, cause page to reload
    // if (newNotes && !newNotes.trim()){
    console.log(!(newNotes == null))
    console.log(!(newNotes.trim().length === 0))
    console.log(newNotes)
    if (newNotes && !(newNotes.trim().length === 0)){
    const noteObj = {
      content: newNotes,
      important: Math.random() < 0.5,
    }
    noteService
      .create(noteObj)
      .then(response => {
        console.log(response)
        setNotes(notes.concat(response.data))
        setNewNotes('')
      })
    
    // console.log('button clicked', event.target) //event.target is form
  }
}

  const handleNotesChanges = (event) => {
    console.log(event.target.value)
    setNewNotes(event.target.value)
  }

  const handleShowNotes = () => {
    setShowNotes(!showNotes)
  }

  const toggleImportance=(id) => {
    console.log(`importance of ${id} needs to be toggled`)
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(note => note.id === id)
    const changedNote = {...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
  }
  
  const notesToShow = showNotes ? notes : notes.filter(notes => notes.important)

  return(
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={handleShowNotes}>
          show {showNotes ? 'important': 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() =>toggleImportance(note.id)}/> 
          // <li key={note.id}>
          //   {note.content}
          // </li>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input type='text' value={newNotes} onChange={handleNotesChanges}/>
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default App