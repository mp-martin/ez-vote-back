import {Router} from "express";
import {ValidationError} from "../utils/error";
import {QuestionRecord} from "../records/question.record";
import {AnswerRecord} from "../records/answer.record";
import {PollRecord} from "../records/poll.record";
import {AnswerEntity, AnswerPool, CompletePoll, PollEntity, QuestionEntity} from "../types";

export const pollRouter = Router();

pollRouter

	.post("/", async (req, res) => {
		const newPoll: CompletePoll = req.body;
		const newPollRecord: PollEntity = newPoll.poll_header;

		// try {
		const pollId = await PollRecord.insert(newPollRecord);
		newPoll.poll_header["poll_id"] = pollId;

		const newQuestionRecords: QuestionEntity[] = newPoll.poll_body.map((element) => {
			return {
				...element.question_header,
				pollId
			};
		});

		newPoll.poll_body	;



		// const questionIds = await Promise.all(newQuestionRecords.map(async (record) => await QuestionRecord.insert(record)));
		//
		//
		// const newAnswerRecords: AnswerEntity[][] = newPoll.poll_body.map((element, index) => {
		// 	return {
		// 		...element.answers,
		// 		questionId: questionIds[index]
		// 	};
		// });

		// await Promise.all(newAnswerRecords.map(async (record) => await AnswerRecord.insert(record)));

		res.json({
			newPoll
			// newQuestionRecords,
			// newAnswerRecords
		});
		// } catch(e) {
		// 	res.json({
		// 		"Success": false
		// 	});
		// 	throw new Error(e);
		// }

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