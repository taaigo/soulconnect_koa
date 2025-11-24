export namespace UserTypes {
  export interface UserResponse {
    id: number;
    name: string;
    gender: number;
    createdAt: Date;
  }

  export interface AdminResponse {
    id: number;
    name: string;
    gender: number;
    email: string;
    privilege: number;
    createdAt: Date;
  }

  export interface FormData {
    name: string;
    gender: number;
    email: string;
    password: string;
  }
}

export namespace UserViews {

  export const asUser = {
    id: true,
    name: true,
    gender: true,
    createdAt: true
  } 

  export const asAdmin = {
    id: true,
    name: true,
    gender: true,
    email: true,
    privilege: true,
    createdAt: true
  } 
}
