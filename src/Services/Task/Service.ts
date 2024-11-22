import { doc, deleteDoc } from 'firebase/firestore';
import { database } from '../../firebaseconfing';

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