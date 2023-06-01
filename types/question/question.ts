export interface QuestionEntity {
    questionId: string;
    questionTitle: string;
    questionType: string;
    qNo: number;
    pollId: string;
}

export type QuestionEntityRequest = {
	questionTitle: string;
	questionType: string;
};