import { useState, useEffect } from "react";
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
      if (newTodo.trim() !== "") {
        const docRef = await addDoc(todosRef, {
          text: newTodo,
          completed: false,
          createdAt: new Date(),
        });
        console.log("Document written with ID: ", docRef.id);
        setNewTodo("");
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
    <div>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
            <button
              onClick={() => handleToggleComplete(todo.id, todo.completed)}
            >
              {todo.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
