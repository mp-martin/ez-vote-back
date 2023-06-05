import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {PollEntity} from "../types";
import {v4 as uuid} from "uuid";

type PollRecordResults = [PollRecord[], FieldPacket[]]

export class PollRecord implements PollEntity {

	pollId?: string;
	pollTitle: string;
	pollOwner?: string | null;

	constructor(obj: PollEntity) {
		if (!obj.pollTitle) {
			throw new ValidationError("Title of the poll is needed!");
		}

		this.pollId = obj.pollId;
		this.pollTitle = obj.pollTitle;
		this.pollOwner = obj.pollOwner ?? null;
	}

	static async insert(pollObj: PollEntity): Promise<string> {
		if (!pollObj.pollId) {
			pollObj.pollId = uuid();
		}

		await pool.execute("INSERT INTO `polls`(`pollId`, `pollTitle`, `pollOwner`) VALUES(:id, :title, :owner)", {
			id: pollObj.pollId,
			title: pollObj.pollTitle,
			owner: pollObj.pollOwner,
		});

		return pollObj.pollId;
	}

	static async getOne(id: string): Promise<PollRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `polls` WHERE `pollId` = :id", {
			id,
		})) as PollRecordResults;

		return results.length === 0 ? null : new PollRecord(results[0]);
	}

	static async getByOwner(ownerId: string): Promise<PollRecord[] | null> {
		const [results] = (await pool.execute("SELECT * FROM `polls` WHERE `pollOwner` = :ownerId", {
			ownerId,
		})) as PollRecordResults;

		return results.length === 0 ? null : results as PollRecord[];
	}

}