import { EUserType } from "../Enums/eusertype";
import { Pet } from "./pet";

export interface User {
    id: string;
    email?: string,
    firstName: string,
    lastName: string,
    phone?: string,
    userType: EUserType,
    pets?: Pet[]
    accessToken?: string;
}