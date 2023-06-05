import {AnswerEntityRequest} from "../answer";

export interface QuestionEntity {
    questionId: string;
    question: string;
    questionType: string;
    qNo: number;
    pollId: string;
}

export type QuestionEntityRequest = {
	question: string;
	questionType: string;
    answers: AnswerEntityRequest[]
};