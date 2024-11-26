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
    const docRef = await addDoc(tasksCollectionRef, newTask);
    console.log("New task added:", newTask);
    return { ...newTask, id: docRef.id };
  } catch (error) {
    console.error("Error adding task:", error);
    throw new Error("Error adding task");
  }
};

export const fetchTasksAndCategories = async (userId: string) => {
  if (!userId) return { tasks: [], categories: [] };
  try {
    const tasksCollectionRef = collection(database, 'tasks');
    const categoriesCollectionRef = collection(database, 'categories');
    
    const tasksQuery = query(tasksCollectionRef, where("userID", "==", userId));
    const tasksData = await getDocs(tasksQuery);
    const tasks = tasksData.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Task));

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
      (doc) => ({ id: doc.id, ...doc.data() } as Task)
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