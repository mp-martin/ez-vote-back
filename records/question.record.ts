import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {QuestionEntity} from "../types";
import {v4 as uuid} from "uuid";

type QuestionRecordResults = [QuestionRecord[], FieldPacket[]]

export class QuestionRecord implements QuestionEntity {

	questionId: string;
	questionBody: string;
	questionType: string;
	pollId: string;

	constructor(obj: QuestionEntity) {
		if (!obj.questionBody) {
			throw new ValidationError("Content of the question needed!");
		}

		this.questionId = obj.questionId;
		this.questionBody = obj.questionBody;
		this.questionType = obj.questionType;
		this.pollId = obj.pollId;
	}

	static async insert(qObj: QuestionEntity): Promise<string> {
		if (!qObj.questionId) {
			qObj.questionId = uuid();
		}

		await pool.execute("INSERT INTO `questions`(`questionId`, `questionBody`, `questionType`, `pollId`) VALUES(:id, :body, :type, :pollId)", {
			id: qObj.questionId,
			body: qObj.questionBody,
			type: qObj.questionType,
			pollId: qObj.pollId,
		});

		return qObj.questionId;
	}

	static async getOne(id: string): Promise<QuestionRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `questions` WHERE `questionId` = :id", {
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