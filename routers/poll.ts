import {Router} from "express";
import {ValidationError} from "../utils/error";
import {QuestionRecord} from "../records/question.record";
import {AnswerRecord} from "../records/answer.record";
import {PollRecord} from "../records/poll.record";
import {AnswerEntity, CompletePoll, PollEntity, QuestionEntity} from "../types";

export const pollRouter = Router();

pollRouter

	.post("/", async (req, res) => {
		const newPoll: CompletePoll = req.body;
		const newPollRecord: PollEntity = newPoll.poll_header;

		try {
			const pollId = await PollRecord.insert(newPollRecord);
			newPoll.poll_header["poll_id"] = pollId;
			newPoll.poll_body.map((element) => {
				element.question_header.pollId = pollId;
			});

			const newQuestionRecords: QuestionEntity[] = newPoll.poll_body.map((element) => {
				return {
					...element.question_header
				};
			});

			const questionIds = await Promise.all(newQuestionRecords.map(async (record) => await QuestionRecord.insert(record)));

			newPoll.poll_body.map((element, index) => {
				element.question_header.question_id = questionIds[index];
			});

			const newAnswerRecords = newPoll.poll_body.map((element) => {
				return element.answers.map((answer) => {
					return {
						...answer,
						questionId: element.question_header.question_id
					};
				});
			}).flat();

			await Promise.all(newAnswerRecords.map(async (record: AnswerEntity) => await AnswerRecord.insert(record)));

			res.json({
				"success": true,
				"newPollId": pollId
			});

		} catch(e) {
			res.json({
				"Success": false
			});
			throw new Error(e);
		}

	})

	.get("/:id", async (req, res) => {
		const pollId = req.params.id;
		const poll = await PollRecord.getOne(pollId);
		const questions = (await QuestionRecord.getByPollOfOrigin(pollId));

		if (!poll) {
			throw new ValidationError("Cannot get that poll`s details. Try again later.");
		}

		if (!questions) {
			throw new ValidationError("Cannot get questions from the poll. Please try again later.");
		}

		const promises = questions.map(async (question) => {
			const answers = await AnswerRecord.getByQuestionOfOrigin(question.question_id);

			if (!answers) {
				throw new ValidationError("Cannot get answers from the poll. Please try again later.");
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