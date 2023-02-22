
import Header from './components/Header.js';
import Tasks from './components/Tasks.js';
import { useState, useEffect } from "react"
import AddTask from './components/AddTask.js';
import Footer from './components/Footer.js';
import About from './components/About.js';


function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([])

  useEffect(() => {
     const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
     }
     getTasks()
  },[])

  const fetchTasks = async () => {
    const response = await fetch('http://localhost:5000/tasks');
    const data = await response.json()

    return data;
  }

  const fetchTask = async (id) => {
    const response = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await response.json()

    return data;
  }


  const addTask = async (task) => {
    const response = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })

    const data = await response.json()

    setTasks([...tasks, data])
  }

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {method: 'DELETE'})
    setTasks(tasks.filter((task) => task.id!== id))
  }

  const toggleRemainder = async (id) => {
    const tasktoToggle = await fetchTask(id)
    const updTask = {...tasktoToggle,remainder:!tasktoToggle.remainder}

    const response = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updTask)
    })

    const data = await response.json()

    setTasks(tasks.map((task) => task.id === id? {...task, remainder:!task.remainder} : task))
  }

  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
      {showAddTask && <AddTask onAdd={addTask}/>}
      {tasks.length > 0 ? (<Tasks tasks={tasks} onDelete = {deleteTask} onToggle={toggleRemainder}/>) : (<p>No tasks yet</p>)}
      <Footer />
    </div>
  );
}

export default App;