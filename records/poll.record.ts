import { pool } from "../utils/db";
import { ValidationError } from "../utils/error";
import {FieldPacket} from "mysql2";
import {PollEntity} from "../types";
import {v4 as uuid} from "uuid";


type PollRecordResults = [PollRecord[], FieldPacket[]]

export class PollRecord implements PollEntity {

	id?: string;
	title: string;
	owner: string | null;
	createdAt?: Date;

	constructor(obj: PollEntity) {
		if (!obj.title) {
			throw new ValidationError("Title of the poll is needed!");
		}

		this.id = obj.id;
		this.title = obj.title;
		this.owner = obj.owner;
		this.createdAt = obj.createdAt;
	}

	async insert(): Promise<string> {
		if (!this.id) {
			this.id = uuid();
		}

		await pool.execute("INSERT INTO `polls`(`id`, `title`, `owner`) VALUES(:id, :title, :owner)", {
			id: this.id,
			title: this.title,
			owner: this.owner,
		});

		return this.id;
	}



	static async listAll(): Promise<PollRecord[]> {
		const [results] = (await pool.execute("SELECT * FROM `polls` ORDER BY `createdAt` ASC")) as PollRecordResults;
		return results.map((obj) => new PollRecord(obj));
	}

	static async getOne(id: number): Promise<PollRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `polls` WHERE `id` = :id", {
			id,
		})) as PollRecordResults;
		return results.length === 0 ? null : new PollRecord(results[0]);
	}

	// async update(): Promise<void> {
	// 	await pool.execute("UPDATE `children` SET `name` = :name, `giftId` = :giftId WHERE `id` = :id", {
	// 		id: this.id,
	// 		name: this.name,
	// 		giftId: this.giftId,
	// 	});
	// }
}

// (async () => {
// 	console.log(await PollRecord.getOne(1));
// })();

const testObj: PollEntity = {title: "xyz", owner: null};
const testRecord = new PollRecord(testObj);

(async () => {
	console.log(await testRecord.insert());
})();
