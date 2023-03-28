export interface QuestionEntity {
    questionId: string;
    questionBody: string;
    questionType: string;
    pollId: string;
}

export type QuestionEntityRequest = {
	questionBody: string;
	questionType: string;
};