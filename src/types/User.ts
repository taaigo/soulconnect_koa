export namespace UserTypes {
  export interface UserResponse {
    id: number;
    name: string;
    createdAt: Date;
  }

  export interface AdminResponse {
    id: number;
    name: string;
    email: string;
    privilege: number;
    createdAt: Date;
  }

  export interface FormData {
    name: string;
    email: string;
    gender: number;
    target_gender: number;
    password: string;
  }
}

export namespace UserViews {

  export const asUser = {
    id: true,
    name: true,
    createdAt: true
  } 

  export const asAdmin = {
    id: true,
    name: true,
    email: true,
    privilege: true,
    createdAt: true
  } 
}
