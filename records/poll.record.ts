import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {PollEntity} from "../types";
import {v4 as uuid} from "uuid";

type PollRecordResults = [PollRecord[], FieldPacket[]]

export class PollRecord implements PollEntity {

	poll_id?: string;
	poll_title: string;
	poll_owner?: string | null;

	constructor(obj: PollEntity) {
		if (!obj.poll_title) {
			throw new ValidationError("Title of the poll is needed!");
		}

		this.poll_id = obj.poll_id;
		this.poll_title = obj.poll_title;
		this.poll_owner = obj.poll_owner;
	}

	async insert(): Promise<string> {
		if (!this.poll_id) {
			this.poll_id = uuid();
		}

		await pool.execute("INSERT INTO `polls`(`poll_id`, `poll_title`, `poll_owner`) VALUES(:id, :title, :owner)", {
			id: this.poll_id,
			title: this.poll_title,
			owner: this.poll_owner,
		});

		return this.poll_id;
	}

	static async getOne(id: string): Promise<PollRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `polls` WHERE `poll_id` = :id", {
			id,
		})) as PollRecordResults;

		return results.length === 0 ? null : new PollRecord(results[0]);
	}

	static async getByOwner(ownerId: string): Promise<PollRecord[] | null> {
		const [results] = (await pool.execute("SELECT * FROM `polls` WHERE `poll_owner` = :ownerId", {
			ownerId,
		})) as PollRecordResults;

		return results.length === 0 ? null : results as PollRecord[];
	}

}