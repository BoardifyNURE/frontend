export interface ILabel {
  color: string;
  text: string;
}

export interface ITodos {
  id:string
  content: string;
  is_done: boolean;
  is_edit?:boolean
  order?:number
}

export interface INewTodos {
  task_id: string;
  content: string;
  order:number
}

export interface INewTask {
  title: string;
  description:string;
  assignee_id?:string;
  status:TaskStatus
  order?:number
  column_id?:string
}

export interface ICard {
  id: string;
  title: string;
  description:string;
  todos: ITodos[];
  status:TaskStatus
  order?:number
  assignee_id?:string;
  column_id?:string
  available_statuses?:Array<string>
  selectedUser?:IUser
}

export interface INewBoard {
  title: string;
}

export interface IBoard {
  id: string;
  title: string;
  cards: ICard[];
  isEdit?:boolean
}

export interface IColumn {
  id?: string;
  title: string;
  order:number
  cards:ICard[]
  boardId?:string
  isEdit?:boolean
}

export interface ILogin {
  email:string
  password:string
}

export interface IRegistration {
  firstName:string
  lastName:string
  email:string
  username:string
  password:string
}

export interface IUser {
  id:string
  email:string
  username:string
}

export enum TaskStatus {
  ToDo = 'todo',
  InProgress = 'in progress',
  ReadyForTesting = 'ready for testing',
  TestingFailed = 'testing failed',
  Fixing = 'fixing',
  TestingSucceded = 'testing succeded',
  Done = 'done',
  Cancelled = 'cancelled',
}