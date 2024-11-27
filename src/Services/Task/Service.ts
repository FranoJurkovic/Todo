import { doc, deleteDoc, addDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { database } from '../../firebaseconfing';
import { Task } from '../../Types/Task';

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    const taskDocRef = doc(database, 'tasks', taskId);
    await deleteDoc(taskDocRef);
    console.log(`Task with ID ${taskId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error(`Error deleting task with ID ${taskId}`);
  }
};

export const addTask = async (newTask: Task): Promise<Task> => {
  try {
    const tasksCollectionRef = collection(database, 'tasks');
    const docRef = await addDoc(tasksCollectionRef, { ...newTask, createdAt: new Date() });
    console.log("New task added:", newTask);
    return { ...newTask, id: docRef.id, createdAt: new Date() };
  } catch (error) {
    console.error("Error adding task:", error);
    throw new Error("Error adding task");
  }
};

export const handleAddCategory = async (newCategory: string, userId: string): Promise<void> => {
  try {
    const categoriesCollectionRef = collection(database, 'categories');
    const newCategoryItem = { name: newCategory, userID: userId };
    await addDoc(categoriesCollectionRef, newCategoryItem);
    console.log("New category added:", newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error("Error adding category");
  }
};

export const handleDeleteCategory = async (categoryToDelete: string, userId: string): Promise<void> => {
  try {
    const categoriesCollectionRef = collection(database, 'categories');
    const categoryQuery = query(categoriesCollectionRef, where("name", "==", categoryToDelete), where("userID", "==", userId));
    const categoryDocs = await getDocs(categoryQuery);
    categoryDocs.forEach(async (document) => {
      await deleteDoc(document.ref);
    });

    const tasksQuery = query(collection(database, 'tasks'), where("category", "==", categoryToDelete), where("userID", "==", userId));
    const tasksDocs = await getDocs(tasksQuery);
    tasksDocs.forEach(async (document) => {
      await deleteDoc(document.ref);
    });

    console.log(`Category ${categoryToDelete} and its tasks deleted successfully.`);
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Error deleting category");
  }
};

export const fetchTasksAndCategories = async (userId: string) => {
  if (!userId) return { tasks: [], categories: [] };
  try {
    const tasksCollectionRef = collection(database, 'tasks');
    const categoriesCollectionRef = collection(database, 'categories');
    
    const tasksQuery = query(tasksCollectionRef, where("userID", "==", userId));
    const tasksData = await getDocs(tasksQuery);
    const tasks = tasksData.docs.map((doc) => {
      const data = doc.data();
      return { ...data, id: doc.id, createdAt: data.createdAt ? data.createdAt.toDate() : new Date() } as Task;
    });

    const categoriesQuery = query(categoriesCollectionRef, where("userID", "==", userId));
    const categoriesData = await getDocs(categoriesQuery);
    const categories = categoriesData.docs.map((doc) => doc.data().name as string);

    return { tasks, categories };
  } catch (error) {
    console.error("Error fetching tasks and categories:", error);
    throw new Error("Error fetching tasks and categories");
  }
};

export const getUserTasks = async (userId: string): Promise<Task[]> => {
  try {
    const q = query(collection(database, "tasks"), where("userID", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => {
        const data = doc.data();
        return { id: doc.id, ...data, createdAt: data.createdAt ? data.createdAt.toDate() : new Date() } as Task;
      }
    );
  } catch (error) {
    console.error("Error getting user tasks:", error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<void> => {
  try {
    await updateDoc(doc(database, "tasks", taskId), updates);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const handleSaveChanges = async (task: Task, userId: string): Promise<void> => {
  try {
    // Delete the old task
    const taskDocRef = doc(database, 'tasks', task.id!);
    await deleteDoc(taskDocRef);
    console.log(`Old task with ID ${task.id} deleted successfully.`);

    // Add the new task without the id field
    const { id, ...newTaskData } = task;
    const tasksCollectionRef = collection(database, 'tasks');
    const docRef = await addDoc(tasksCollectionRef, { ...newTaskData, createdAt: new Date() });
    console.log("New task added:", { ...newTaskData, id: docRef.id });
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Error updating task");
  }
};