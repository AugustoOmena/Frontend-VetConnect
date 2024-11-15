import { User } from "./user";

export interface LoginResponse {
    data: Data;
    success: boolean;
}

export interface Data {
    user: User;
    accessToken: string;
}
