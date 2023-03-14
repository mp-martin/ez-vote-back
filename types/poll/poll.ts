export interface PollEntity {
    poll_id?: string;
    poll_title: string;
    poll_owner?: string | null;
    question_body: string;
    answer_body: string;
    votes: number;
}

export type PollAnswer = [string, number]

export interface PollQuestion {
    body: string;
    answers: PollAnswer;
}

export interface PollModel {
    title: string;
    owner?: string;
    questions: PollQuestion[];

}