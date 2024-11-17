export interface ServiceHistory {
    id: string;
    name: string;
    description: string;
    serviceType: number;
    price: number;
}

export interface ServiceHistoryParams {
    serviceId?: string,
    name: string;
    description: string;
    price: number;
    serviceType: number;
}