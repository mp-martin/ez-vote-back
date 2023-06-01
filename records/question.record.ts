import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {QuestionEntity} from "../types";
import {v4 as uuid} from "uuid";

type QuestionRecordResults = [QuestionRecord[], FieldPacket[]]

export class QuestionRecord implements QuestionEntity {

	questionId: string;
	questionTitle: string;
	questionType: string;
	pollId: string;
	qNo: number;

	constructor(obj: QuestionEntity) {
		if (!obj.questionTitle) {
			throw new ValidationError("Content of the question needed!");
		}

		this.questionId = obj.questionId;
		this.questionTitle = obj.questionTitle;
		this.questionType = obj.questionType;
		this.pollId = obj.pollId;
		this.qNo = obj.qNo;
	}

	static async insert(obj: QuestionEntity): Promise<string> {
		if (!obj.questionId) {
			obj.questionId = uuid();
		}

		await pool.execute("INSERT INTO `questions`(`questionId`, `questionBody`, `questionType`, `pollId`, `qNo`) VALUES(:id, :body, :type, :pollId, :qNo)", {
			id: obj.questionId,
			body: obj.questionTitle,
			type: obj.questionType,
			pollId: obj.pollId,
			qNo: obj.qNo
		});

		return obj.questionId;
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