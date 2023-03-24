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
		const newPollRecord: PollEntity = newPoll.pollHeader;

		try {
			const pollId = await PollRecord.insert(newPollRecord);
			newPoll.pollHeader["pollId"] = pollId;
			newPoll.pollBody.map((element) => {
				element.questionHeader.pollId = pollId;
			});

			const newQuestionRecords: QuestionEntity[] = newPoll.pollBody.map((element) => {
				return {
					...element.questionHeader
				};
			});

			const questionIds = await Promise.all(newQuestionRecords.map(async (record) => await QuestionRecord.insert(record)));

			newPoll.pollBody.map((element, index) => {
				element.questionHeader.questionId = questionIds[index];
			});

			const newAnswerRecords = newPoll.pollBody.map((element) => {
				return element.answers.map((answer) => {
					return {
						...answer,
						questionId: element.questionHeader.questionId
					};
				});
			}).flat();

			await Promise.all(newAnswerRecords.map(async (record: AnswerEntity) => await AnswerRecord.insert(record)));

			res.json({
				"success": true,
				"newPollId": pollId
			});

		} catch (e) {
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

		const answersPackage: AnswerEntity[] = req.body.answers;
		const answerRecordsToUpdate = answersPackage.map((answer: AnswerEntity) => answer.answerId);
		answerRecordsToUpdate.forEach(async (id: string) => {await AnswerRecord.voteForAnswer(id);});

		isVoted.push(pollId);
		res.cookie("votedPolls", JSON.stringify(isVoted), {
			maxAge: 60 * 60 * 24 * 365,
		});
		res.json({
			"success": true,
			"pollId": pollId,
			"answersVoted": answerRecordsToUpdate.length
		});
	});
