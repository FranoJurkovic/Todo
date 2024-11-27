import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseconfing';
import './TaskList.scss';
import { Task } from '../../Types/Task';
import { fetchTasksAndCategories, addTask, updateTask, deleteTask, handleAddCategory, handleDeleteCategory, handleSaveChanges } from '../../Services/Task/Service';

export const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [categoryErrorMessage, setCategoryErrorMessage] = useState<string>("");

  // Državni za uređivanje
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editCategory, setEditCategory] = useState('');

  const fetchTasksAndCategoriesCallback = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const { tasks, categories } = await fetchTasksAndCategories(userId);
      setTasks(tasks);
      setCategories(categories);
    } catch (error) {
      console.error("Error fetching tasks and categories:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTasksAndCategoriesCallback(currentUser.uid);
      } else {
        setUser(null);
        setTasks([]);
        setCategories([]);
      }
    });
    return () => unsubscribe();
  }, [fetchTasksAndCategoriesCallback]);

  const handleAddTaskClick = async () => {
    if (!category.trim()) {
      setErrorMessage("Trebate odabrati kategoriju kako bi dodali zadatak.");
      return;
    }
    if (newTaskTitle.trim() === '') {
      setErrorMessage("Unesite naslov zadatka.");
      return;
    }
    if (newTaskDescription.trim() === '') {
      setErrorMessage("Unesite opis zadatka.");
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
          createdAt: new Date() // Dodano polje za vrijeme kreiranja zadatka
        };
        const addedTask = await addTask(newTask);
        setTasks([...tasks, addedTask]);
        setNewTaskTitle('');
        setNewTaskDescription('');
        setErrorMessage("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleAddCategoryClick = async () => {
    if (newCategory.trim() === '') {
      setCategoryErrorMessage("Unesite ime kategorije.");
      return;
    }
    if (!categories.includes(newCategory) && user) {
      try {
        await handleAddCategory(newCategory, user.uid);
        setCategories([...categories, newCategory]);
        setNewCategory('');
        setCategoryErrorMessage("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleDeleteCategoryClick = async (index: number) => {
    const categoryToDelete = categories[index];
    if (user) {
      try {
        await handleDeleteCategory(categoryToDelete, user.uid);
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

  const handleCheckboxChange = async (task: Task) => {
    try {
      await updateTask(task.id!, { completed: !task.completed });
      setTasks(tasks.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description);
    setEditCategory(task.category);
  };

  const handleSaveChangesClick = async () => {
    if (editingTask && user) {
      try {
        const updatedTask: Task = {
          ...editingTask,
          title: editTaskTitle,
          description: editTaskDescription,
          category: editCategory
        };
        await handleSaveChanges(updatedTask, user.uid);
        setTasks(tasks.map((task) => task.id === updatedTask.id ? updatedTask : task));
        setEditingTask(null);
      } catch (error) {
        console.error("Error saving task changes:", error);
      }
    }
  };

  const handleCancelEditClick = () => {
    setEditingTask(null);
  };

  return (
    <div className="task-container">
      <input
        type="text"
        placeholder="Dodaj novu kategoriju"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <button onClick={handleAddCategoryClick}>Dodaj kategoriju</button>
      {categoryErrorMessage && <p style={{ color: "red" }}>{categoryErrorMessage}</p>}
      <br />
      <hr />
      <br />
      {categories.length > 0 && <h2 className='naslovi'>Kategorije:</h2>}
      <ul>
        {categories.map((cat, index) => (
          <li key={index}>
            {cat}
            <button onClick={() => handleDeleteCategoryClick(index)} style={{ marginLeft: '10px' }}>
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
      <button onClick={handleAddTaskClick}>Dodaj zadatak</button>
      <hr />
      {category && filterTasksByCategory(category).length > 0 && <h2 className='naslovi'>Zadaci:</h2>}
      <ul>
        {category ? (
          filterTasksByCategory(category).length === 0 ? (
            <li>Nema raspoloživih zadataka.</li>
          ) : (
            filterTasksByCategory(category).map((task) => (
              <li key={task.id} className={task.completed ? 'completed' : ''}>
                <div className="task-text">
                  <h3 className="task-category">Kategorija: {task.category}</h3>
                  <h4 className="task-title">Naziv: {task.title}</h4>
                  <p className="task-description">Opis: {task.description}</p>
                  <p className="task-createdAt">Kreirano: {new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCheckboxChange(task)}
                />
                <button className="edit" onClick={() => handleEditClick(task)}>Uredi</button>
                <button className="delete" onClick={() => {
                  deleteTask(task.id!);
                  setTasks(tasks.filter((item) => item.id !== task.id));
                }}>Obriši</button>
                
                {editingTask && editingTask.id === task.id && (
                  <div className="edit-modal">
                    <h2>Uredi zadatak</h2>
                    <label>
                      Kategorija:
                      <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Naziv:
                      <input
                        type="text"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                      />
                    </label>
                    <label>
                      Opis:
                      <input
                        type="text"
                        value={editTaskDescription}
                        onChange={(e) => setEditTaskDescription(e.target.value)}
                      />
                    </label>
                    <button onClick={handleSaveChangesClick}>Spremi promjene</button>
                    <button onClick={handleCancelEditClick}>Odustani</button>
                  </div>
                )}
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