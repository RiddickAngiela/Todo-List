import { useState, useEffect } from "react";
import "./TodoList.css";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { fireApp } from "../firebaseConfig";

const TodoList = () => {
  const [newTodo, setNewTodo] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [todos, setTodos] = useState([]);

  const db = getFirestore(fireApp);
  const todosRef = collection(db, "todos");

  useEffect(() => {
    const unsubscribe = onSnapshot(query(todosRef), (snapshot) => {
      const updatedTodos = [];
      snapshot.forEach((doc) => {
        updatedTodos.push({ id: doc.id, ...doc.data() });
      });
      setTodos(updatedTodos);
    });

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTodo = async () => {
    try {
      if (newTodo.trim() !== "" && newTitle.trim() !== "") {
        const docRef = await addDoc(todosRef, {
          title: newTitle,
          text: newTodo,
          completed: false,
          createdAt: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
        setNewTodo("");
        setNewTitle("");
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        completed: !completed,
      });
      console.log("Document updated with ID: ", id);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const todoRef = doc(db, "todos", id);
      await deleteDoc(todoRef);
      console.log("Document deleted with ID: ", id);

      // Update local state to reflect deletion
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  return (
    <div className="todo-container">
      <input
        type="text"
        className="todo-title-input"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        className="todo-input"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button className="add-button" onClick={handleAddTodo}>
        Add Todo
      </button>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.completed ? "completed" : ""}`}
          >
            <h3>{todo.title}</h3>
            <span>{todo.text}</span>
            <small>{new Date(todo.createdAt.toDate()).toLocaleString()}</small>
            <div className="todo-buttons">
              <button
                className="complete-button"
                onClick={() => handleToggleComplete(todo.id, todo.completed)}
              >
                {todo.completed ? "Mark Incomplete" : "Mark Complete"}
              </button>
              <button
                className="delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
