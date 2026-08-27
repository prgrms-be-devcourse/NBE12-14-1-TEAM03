export interface ProductResponse {
    id: number;
    name: string;
    category: string;
    price: number;
    photoUrl: string | null;
    createDate: string | null;
    modifyDate: string | null;
}