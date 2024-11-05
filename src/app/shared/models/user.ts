import { EUserType } from "../Enums/eusertype";
import { Pet } from "./pet";

export interface User {
    id: string;
    firstName: string,
    lastName: string,
    password: string,
    userType: EUserType,
    email?: string,
    phone?: string,
    pets?: Pet[]
    accessToken: string;
}