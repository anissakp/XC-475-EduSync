export interface Assignment {
  id: string;
  name: string;
  dueDate: Date;
  courseName: string;
}

export interface Class {
  courseName: string;
  assignments: Assignment[];
}
