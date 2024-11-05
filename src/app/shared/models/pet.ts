import { User } from "./user";

export interface Pet {
    id: string;
    name: string;
    petType: number;
    race: string;
    birthDate: string;
    userId: string;
    user?: User;
    createdAt: string | null; 
    deleted: string | null;
}