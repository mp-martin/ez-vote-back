import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {AnswerEntity} from "../types";
import {v4 as uuid} from "uuid";

type AnswerRecordResults = [AnswerRecord[], FieldPacket[]]

export class AnswerRecord implements AnswerEntity {

	answer_id?: string;
	answer_body: string;
	questionId: string;
	votes: number;

	constructor(obj: AnswerEntity) {
		if (!obj.answer_body) {
			throw new ValidationError("Content of the answer needed!");
		}

		this.answer_id = obj.answer_id;
		this.answer_body = obj.answer_body;
		this.questionId = obj.questionId;
		this.votes = obj.votes;
	}

	async insert(): Promise<string> {
		if (!this.answer_id) {
			this.answer_id = uuid();
		}

		await pool.execute("INSERT INTO `answers`(`answer_id`, `answer_body`, `questionId`) VALUES(:id, :body, :questionId)", {
			id: this.answer_id,
			body: this.answer_body,
			questionId: this.questionId,
		});

		return this.answer_id;
	}

	static async getOne(id: string): Promise<AnswerRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `answers` WHERE `answer_id` = :id", {
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

		await pool.execute("UPDATE `answers` SET `votes` = :votes WHERE `answer_id` = :id", {
			id: selectedAnswer.answer_id,
			votes: selectedAnswer.votes,
		});
		return `The answer ${selectedAnswer.answer_body} now has ${selectedAnswer.votes} votes`;
	}

}