import { EPetType } from "../Enums/epettype";
import { User } from "./user";

export interface Pet {
    id: string;
    name: string;
    petType: number;
    race: string;
    birthDate: string;
    userId: string;
    userName: string;
    user?: User;
    createdAt: string | null; 
    deleted: string | null;
}

  export interface PetParams {
    petId?: string,
    name: string;
    petType: number | EPetType;
    race: string;
    birthDate: string;
}