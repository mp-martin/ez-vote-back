export interface AnswerEntity {
    answerId?: string;
    aNo: number
    answer: string;
    votes: number;
    questionId: string;
}

export type AnswerEntityRequest = {
	answer: string;
};