export type Task = {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  userID: string;
  category: string;
  createdAt: Date;
};