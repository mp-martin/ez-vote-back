import {AnswerEntity} from "../answer";
import {QuestionRecord} from "../../records/question.record";

export interface PollEntity {
    pollId?: string;
    pollTitle: string;
    pollOwner?: string | null;
}

export interface AnswerPool {
    questionHeader: QuestionRecord,
    answers: AnswerEntity[]
}

export interface CompletePoll {
    pollHeader: PollEntity;
    pollBody: AnswerPool[]
}