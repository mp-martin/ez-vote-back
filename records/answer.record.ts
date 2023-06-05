import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {AnswerEntity} from "../types";
import {v4 as uuid} from "uuid";

type AnswerRecordResults = [AnswerRecord[], FieldPacket[]]

export class AnswerRecord implements AnswerEntity {

	answerId?: string;
	aNo: number;
	answer: string;
	questionId: string;
	votes: number;

	constructor(obj: AnswerEntity) {
		if (!obj.answer) {
			throw new ValidationError("Content of the answer needed!");
		}

		this.answerId = obj.answerId;
		this.answer = obj.answer;
		this.questionId = obj.questionId;
		this.votes = obj.votes;
		this.aNo = obj.aNo;
	}

	static async insert(answerObj: AnswerEntity): Promise<string> {
		if (!answerObj.answerId) {
			answerObj.answerId = uuid();
		}

		await pool.execute("INSERT INTO `answers`(`answerId`, `answer`, `questionId`, `aNo`, `votes`) VALUES(:answerId, :answer, :questionId, :aNo, :votes)", {
			answerId: answerObj.answerId,
			answer: answerObj.answer,
			questionId: answerObj.questionId,
			aNo: answerObj.aNo,
			votes: answerObj.votes
		});

		return answerObj.answerId;
	}

	static async getOne(id: string): Promise<AnswerRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `answers` WHERE `answerId` = :id", {
			id,
		})) as AnswerRecordResults;

		return results.length === 0 ? null : new AnswerRecord(results[0]);
	}

	static async getByQuestionOfOrigin(questionId: string): Promise<AnswerRecord[] | null> {
		const [results] = (await pool.execute("SELECT * FROM `answers` WHERE `questionId` = :questionId ORDER BY `aNo` ASC", {
			questionId,
		})) as AnswerRecordResults;

		return results.length === 0 ? null : results as AnswerRecord[];
	}

	static async voteForAnswer(id: string) {
		const selectedAnswer = await AnswerRecord.getOne(id);
		if (selectedAnswer === null) {
			throw new ValidationError("That answer does not exist");
		}
		selectedAnswer.votes++;

		await pool.execute("UPDATE `answers` SET `votes` = :votes WHERE `answerId` = :id", {
			id: selectedAnswer.answerId,
			votes: selectedAnswer.votes,
		});
		return `The answer ${selectedAnswer.answer} now has ${selectedAnswer.votes} votes`;
	}

}