import {AnswerEntity, AnswerEntityRequest} from "../answer";
import {QuestionRecord} from "../../records/question.record";
import {QuestionEntityRequest} from "../question";

export interface PollEntity {
    pollId?: string;
    pollTitle: string;
    pollOwner?: string | null;
}

export type PollEntityRequest = {
	pollTitle: string;
	/* eslint-disable @typescript-eslint/ban-types */
	pollOwner: string | null;
};

export interface AnswerPool {
    questionHeader: QuestionRecord,
    answers: AnswerEntity[]
}

export type AnswerPoolRequest = {
	questionHeader: QuestionEntityRequest;
	answers: AnswerEntityRequest[];
};

export interface CompletePoll {
    pollHeader: PollEntity;
    pollBody: AnswerPool[]
}

export type CompletePollRequest = {
	pollHeader: PollEntityRequest;
	pollBody: AnswerPoolRequest[];
};

export type SuccessMsg = {
	isSuccess: true;
	newPollId: string;
};