import {AnswerEntity} from "../answer";
import {QuestionRecord} from "../../records/question.record";

export interface PollEntity {
    poll_id?: string;
    poll_title: string;
    poll_owner?: string | null;
}

export interface AnswerPool {
    question_header: QuestionRecord,
    answers: AnswerEntity[]
}

export interface CompletePoll {
    poll_header: PollEntity;
    poll_body: AnswerPool[]
}