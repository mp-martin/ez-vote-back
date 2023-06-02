import {Router} from "express";
import {ValidationError} from "../utils/error";
import {QuestionRecord} from "../records/question.record";
import {AnswerRecord} from "../records/answer.record";
import {PollRecord} from "../records/poll.record";
import {
	AnswerEntity,
	CompletePoll,
	PollEntity,
	PollEntityRequest,
	QuestionEntity,
	QuestionEntityRequest
} from "../types";

export const pollRouter = Router();

pollRouter

	.post("/", async (req, res) => {

		const newPoll: PollEntityRequest = {pollTitle: req.body.pollTitle};
		const newPollToAdd = new PollRecord(newPoll);
		const newPollId = await PollRecord.insert(newPollToAdd);

		const newQuestions: QuestionEntityRequest[] = req.body.pollBody.map((element: QuestionEntityRequest, i: number) => {
			return {
				questionTitle: element.questionTitle,
				questionType: element.questionType,
				qNo: i,
				pollId: newPollId,
			};
		});

		const newQuestionIds = newQuestions.map(async (question) => {
			return await QuestionRecord.insert(question);

		});



		console.log(newQuestions);

		//
		// 	const questionIds = await Promise.all(newQuestionRecords.map(async (record) => await QuestionRecord.insert(record)));
		//
		// 	newPoll.pollBody.map((element, index) => {
		// 		element.questionHeader.questionId = questionIds[index];
		// 	});
		//
		// 	const newAnswerRecords = newPoll.pollBody.map((element) => {
		// 		return element.answers.map((answer) => {
		// 			return {
		// 				...answer,
		// 				questionId: element.questionHeader.questionId
		// 			};
		// 		});
		// 	}).flat();
		//
		// 	await Promise.all(newAnswerRecords.map(async (record: AnswerEntity) => await AnswerRecord.insert(record)));
		//
		// 	res.json({
		// 		"success": true,
		// 		"newPollId": pollId
		// 	});
		//
		// } catch (e) {
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
			throw new ValidationError("Cannot get that poll`s details. Try again later.");
		}

		if (!questions) {
			throw new ValidationError("Cannot get questions from the poll. Please try again later.");
		}

		const promises = questions.map(async (question) => {
			const answers = await AnswerRecord.getByQuestionOfOrigin(question.questionId);

			if (!answers) {
				throw new ValidationError("Cannot get answers from the poll. Please try again later.");
			}

			return {
				questionHeader: question,
				answers
			};
		});
		const answers = await Promise.all(promises);

		const completePoll: CompletePoll = {
			pollHeader: poll,
			pollBody: answers
		};


		res.json(completePoll);
	})

	.patch("/", async (req, res) => {
		const pollId: string = req.body.pollId;
		const {votedPolls} = req.cookies;
		const isVoted = votedPolls ? JSON.parse(votedPolls) : [];

		if (isVoted.includes(pollId)) {
			res.json({
				"success": false,
				"reason": `You have already voted on poll ${pollId}`,
			});
			return;
		}
		console.log(isVoted);
		const answersPackage: string[] = req.body.answers;
		answersPackage.forEach(async (id: string) => {
			await AnswerRecord.voteForAnswer(id);
		});

		isVoted.push(pollId);
		res.cookie("votedPolls", JSON.stringify(isVoted), {
			maxAge: 60 * 60 * 24 * 365,
			httpOnly: false
		});
		res.json({
			"success": true,
			"pollId": pollId,
			"answersVoted": answersPackage.length
		});
	});
