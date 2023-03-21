import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {AnswerEntity} from "../types";
import {v4 as uuid} from "uuid";

type AnswerRecordResults = [AnswerRecord[], FieldPacket[]]

export class AnswerRecord implements AnswerEntity {

	answerId?: string;
	answerBody: string;
	questionId: string;
	votes: number;

	constructor(obj: AnswerEntity) {
		if (!obj.answerBody) {
			throw new ValidationError("Content of the answer needed!");
		}

		this.answerId = obj.answerId;
		this.answerBody = obj.answerBody;
		this.questionId = obj.questionId;
		this.votes = obj.votes;
	}

	static async insert(answerObj: AnswerEntity): Promise<string> {
		if (!answerObj.answerId) {
			answerObj.answerId = uuid();
		}

		await pool.execute("INSERT INTO `answers`(`answerId`, `answerBody`, `questionId`) VALUES(:id, :body, :questionId)", {
			id: answerObj.answerId,
			body: answerObj.answerBody,
			questionId: answerObj.questionId,
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
		const [results] = (await pool.execute("SELECT * FROM `answers` WHERE `questionId` = :questionId", {
			questionId,
		})) as AnswerRecordResults;

		return results.length === 0 ? null : results as AnswerRecord[];
	}

	static async voteForAnswer(id: string) {
		const selectedAnswer = await AnswerRecord.getOne(id);
		console.log(selectedAnswer);
		if (selectedAnswer === null) {
			throw new ValidationError("That answer does not exist");
		}
		selectedAnswer.votes++;
		console.log(selectedAnswer);

		await pool.execute("UPDATE `answers` SET `votes` = :votes WHERE `answerId` = :id", {
			id: selectedAnswer.answerId,
			votes: selectedAnswer.votes,
		});
		return `The answer ${selectedAnswer.answerBody} now has ${selectedAnswer.votes} votes`;
	}

}