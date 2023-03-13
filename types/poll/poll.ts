export interface PollEntity {
    id?: string;
    title: string;
    owner: string | null;
    createdAt?: Date;
}