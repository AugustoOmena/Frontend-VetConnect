import { Pet } from "./pet";

export interface ServiceHistory {
    id?: string;
    name: string;
    description: string;
    price: number;
    petId: string;
    pet?: Pet;
}

export interface ServiceHistoryParams {
    serviceId?: string,
    name: string;
    description: string;
    price: number;
    petId: string;
}