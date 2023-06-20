import {AnswerEntity, AnswerEntityRequest} from "../answer";
import {QuestionRecord} from "../../records/question.record";
import {QuestionEntityRequest} from "../question";
import {PollRecord} from "../../records/poll.record";

export interface PollEntity {
	createdAt?: string;
    pollId?: string;
    pollTitle: string;
    pollOwner: string | null;
}

export type PollEntityRequest = {
    pollTitle: string;
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

export type SuccessMsgNewPoll = {
    isSuccess: true;
    newPollId: string;
};

export type SuccessMsgVote = {
    success: boolean,
    pollId: string,
    answersVoted: number,
};

export type UserPollsSuccessResponse = {
    success: true,
    polls: PollRecord[] | null
}