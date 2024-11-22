import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from '../../firebaseconfing';
import './TodoList.css';
import { Task } from '../../Types/Task';
import { deleteTask } from '../../Services/Task/Service';

export const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState<string>("");

  const tasksCollectionRef = collection(database, 'tasks');
  const categoriesCollectionRef = collection(database, 'categories');

  const fetchTasksAndCategories = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const tasksQuery = query(tasksCollectionRef, where("userID", "==", userId));
      const tasksData = await getDocs(tasksQuery);
      setTasks(tasksData.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Task)));

      const categoriesQuery = query(categoriesCollectionRef, where("userID", "==", userId));
      const categoriesData = await getDocs(categoriesQuery);
      setCategories(categoriesData.docs.map((doc) => doc.data().name as string));
    } catch (error) {
      if (userId) {
        console.error("Error fetching tasks and categories:", error);
      }
    }
  }, [tasksCollectionRef, categoriesCollectionRef]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTasksAndCategories(currentUser.uid);
      } else {
        setUser(null);
        setTasks([]);
        setCategories([]);
      }
    });
    return () => unsubscribe();
  }, [fetchTasksAndCategories]);

  const handleAddTask = async () => {
    if (!category.trim()) {
      setErrorMessage("Trebate odabrati kategoriju kako bi dodali zadatak.");
      return;
    }
    if (newTaskTitle.trim() === '') {
      setErrorMessage("Unesite naslov zadatka.");
      return;
    }
    if (user) {
      try {
        const newTask: Task = {
          title: newTaskTitle,
          description: newTaskDescription,
          completed: false,
          category: category,
          userID: user.uid,
        };
        const docRef = await addDoc(tasksCollectionRef, newTask);
        setTasks([...tasks, { ...newTask, id: docRef.id }]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setErrorMessage("");
        console.log("New task added:", newTask);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() === '') {
      setCategoryErrorMessage("Unesite ime kategorije.");
      return;
    }
    if (!categories.includes(newCategory) && user) {
      try {
        const newCategoryItem = { name: newCategory, userID: user.uid };
        await addDoc(categoriesCollectionRef, newCategoryItem);
        setCategories([...categories, newCategory]);
        setNewCategory('');
        setCategoryErrorMessage("");
        console.log("New category added:", newCategoryItem);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleDeleteCategory = async (index: number) => {
    const categoryToDelete = categories[index];
    if (user) {
      try {
        const categoryQuery = query(categoriesCollectionRef, where("name", "==", categoryToDelete), where("userID", "==", user.uid));
        const categoryDocs = await getDocs(categoryQuery);
        categoryDocs.forEach(async (document) => {
          await deleteDoc(document.ref);
        });

        const tasksQuery = query(tasksCollectionRef, where("category", "==", categoryToDelete), where("userID", "==", user.uid));
        const tasksDocs = await getDocs(tasksQuery);
        tasksDocs.forEach(async (document) => {
          await deleteDoc(document.ref);
        });

        setCategories(categories.filter((_, i) => i !== index));
        setTasks(tasks.filter(task => task.category !== categoryToDelete));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const filterTasksByCategory = (category: string) => {
    return tasks.filter((task) => task.category === category);
  };

  return (
    <div className="todo-container">
      <input
        type="text"
        placeholder="Dodaj novu kategoriju"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={handleAddCategory}>Dodaj kategoriju</button>
      {categoryErrorMessage && <p style={{ color: "red" }}>{categoryErrorMessage}</p>}
      <br />
      <hr />
      <br />
      {categories.length > 0 && <h2 className='naslovi'>Kategorije:</h2>}
      <ul>
        {categories.map((cat, index) => (
          <li key={index}>
            {cat}
            <button onClick={() => handleDeleteCategory(index)} style={{ marginLeft: '10px' }}>
              Izbriši
            </button>
          </li>
        ))}
      </ul>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Izaberite kategoriju</option>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <br />
      <input
        type="text"
        placeholder="Dodaj novi zadatak"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Opis zadatka"
        value={newTaskDescription}
        onChange={(e) => setNewTaskDescription(e.target.value)}
      />
      <button onClick={handleAddTask}>Dodaj zadatak</button>
      <hr />  
      {category && filterTasksByCategory(category).length > 0 && <h2 className='naslovi'>Zadaci:</h2>}
      <ul>
        {category ? (
          filterTasksByCategory(category).length === 0 ? (
            <li>Nema raspoloživih zadataka.</li>
          ) : (
            filterTasksByCategory(category).map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <div onClick={() => {
                    const taskDoc = doc(database, 'tasks', task.id!);
                    updateDoc(taskDoc, { completed: !task.completed });
                    setTasks(tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item));
                  }} className="task-text">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <p>({task.category})</p>
                </div>
                <button className="delete" onClick={() => {
                  deleteTask(task.id!); // Use the deleteTask function here
                  setTasks(tasks.filter((item) => item.id !== task.id));
                }}>Obriši</button>
              </li>
            ))
          )
        ) : (
          <li>Izaberite kategoriju za prikaz zadataka.</li>
        )}
      </ul>
    </div>
  );
};