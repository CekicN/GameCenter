import { Role } from "../enums/role.enum"

export type CurrentUser = {
    id:number,
    email:string,
    role:Role
}