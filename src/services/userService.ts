import axiosInstance from "../plugins/axios";
export interface User{
    userId?: number;
    firstname:string;
    lastname:string;
    username:string;
    email:string;
    roleId:number;
    isActive:boolean;
}
export const userService = {
    getUsers: () => axiosInstance.get('/users'),
}