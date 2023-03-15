import {Router} from "express";
import {ValidationError} from "../utils/error";
import {QuestionRecord} from "../records/question.record";
import {AnswerRecord} from "../records/answer.record";
import {PollRecord} from "../records/poll.record";
import {CompletePoll} from "../types";

export const pollRouter = Router();

pollRouter

	.post("/", async (req, res) => {
		const newPoll = req.body;

	})

	.get("/:id", async (req, res) => {
		const pollId = req.params.id;
		const poll = await PollRecord.getOne(pollId);
		const questions = (await QuestionRecord.getByPollOfOrigin(pollId));

		if (!poll) {
			throw new ValidationError("Cannot get that poll`s details");
		}

		if (!questions) {
			throw new ValidationError("Cannot get questions from the poll. Please try again later.");
		}

		const promises = questions.map(async (question) => {
			const answers = await AnswerRecord.getByQuestionOfOrigin(question.question_id);

			if (!answers) {
				throw new ValidationError("Cannot get questions from the poll. Please try again later.");
			}

			return {
				question_header: question,
				answers
			};
		});
		const answers = await Promise.all(promises);

		const completePoll: CompletePoll = {
			poll_header: poll,
			poll_body: answers
		};


		res.json(completePoll);
	});