export interface Task {
    id: number;
    title: string;
    description: string;
    status: "To Do" | "Ongoing" | "Complete";
    createdAt: string;
  }
  
  export type ToastType = {
    message: string;
    type: "success" | "error";
  };