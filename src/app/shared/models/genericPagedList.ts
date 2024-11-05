export interface PagedList<T> {
    data: {
        itens: T[];
        totalPages: number;
        totalRecords: number;
        pageSize: number;
    };
    success: boolean;
}