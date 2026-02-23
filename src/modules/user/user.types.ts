import { z } from "zod";
import { updateUserSchema } from "./user.schema";

export interface IRegister {
    email: string;
    password: string;
  }
  
  export interface ILogin {
    email: string;
    password: string;
  }
  
//   export interface IUpdateUser{
//     email?: string;
//     password?: string;
//   }
export type IUpdateUser = z.infer<typeof updateUserSchema>;
  
  export interface IRegisterResponse {
    id: string;
    email: string;
    createdAt: Date;
  }
  
  export interface ILoginResponse {
    accessToken: string;
  }

  export interface IUpdateUserResponse {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }