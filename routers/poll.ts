import {NextFunction, Request, Response, Router} from "express";
import {ValidationError} from "../utils/error";
import {QuestionRecord} from "../records/question.record";
import {AnswerRecord} from "../records/answer.record";
import {PollRecord} from "../records/poll.record";

export const pollRouter = Router();

pollRouter

	.get("/:id", async(req, res) => {
		const pollId = req.params.id;
		const poll = await PollRecord.getOne(pollId);
		const questions = (await QuestionRecord.getByPollOfOrigin(pollId)) as any[];
		if (!questions) {
			throw new ValidationError("Cannot get questions from the poll. Please try again later.");
		}

		questions.map(async question => {
			const answers = (await AnswerRecord.getByQuestionOfOrigin(question.question_id));
			if (!answers) {throw new ValidationError("answers are missing!");}
			console.log(answers);
		});


		res.json({
			poll,
			questions,
		});

		// if (!questions) { throw new ValidationError("whepss");}
		// const questionIds
		// const answers = await AnswerRecord.getByQuestionOfOrigin();
	});