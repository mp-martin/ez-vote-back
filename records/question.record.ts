import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {QuestionEntity} from "../types";
import {v4 as uuid} from "uuid";

type QuestionRecordResults = [QuestionRecord[], FieldPacket[]]

export class QuestionRecord implements QuestionEntity {

	question_id: string;
	question_body: string;
	pollId: string;

	constructor(obj: QuestionEntity) {
		if (!obj.question_body) {
			throw new ValidationError("Content of the question needed!");
		}

		this.question_id = obj.question_id;
		this.question_body = obj.question_body;
		this.pollId = obj.pollId;
	}

	static async insert(qObj: QuestionEntity): Promise<string> {
		if (!qObj.question_id) {
			qObj.question_id = uuid();
		}

		await pool.execute("INSERT INTO `questions`(`question_id`, `question_body`, `pollId`) VALUES(:id, :body, :pollId)", {
			id: qObj.question_id,
			body: qObj.question_body,
			pollId: qObj.pollId,
		});

		return qObj.question_id;
	}

	static async getOne(id: string): Promise<QuestionRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `questions` WHERE `question_id` = :id", {
			id,
		})) as QuestionRecordResults;

		return results.length === 0 ? null : new QuestionRecord(results[0]);
	}

	static async getByPollOfOrigin(pollId: string): Promise<QuestionRecord[] | null> {
		const [results] = (await pool.execute("SELECT * FROM `questions` WHERE `pollId` = :pollId", {
			pollId,
		})) as QuestionRecordResults;

		return results.length === 0 ? null : results as QuestionRecord[];
	}

}