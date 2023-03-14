import { pool } from "../utils/db";
import { ValidationError } from "../utils/error";
import {FieldPacket} from "mysql2";
import {PollEntity, PollModel} from "../types";
// import {v4 as uuid} from "uuid";


type PollRecordResults = [PollRecord[], FieldPacket[]]

export class PollRecord implements PollEntity {

	poll_id?: string;
	poll_title: string;
	poll_owner?: string | null;
	question_body: string;
	answer_body: string;
	votes: number;

	constructor(obj: PollEntity) {
		if (!obj.poll_title) {
			throw new ValidationError("Title of the poll is needed!");
		}

		this.poll_id = obj.poll_id;
		this.poll_title = obj.poll_title;
		this.poll_owner = obj.poll_owner;
		this.question_body = obj.question_body;
		this.answer_body = obj.answer_body;
		this.votes = obj.votes;
	}

	// async insert(): Promise<string> {
	// 	if (!this.poll_id) {
	// 		this.poll_id = uuid();
	// 	}
	//
	// 	await pool.execute("INSERT INTO `polls`(`id`, `title`, `owner`) VALUES(:id, :title, :owner)", {
	// 		id: this.id,
	// 		title: this.title,
	// 		owner: this.owner,
	// 	});
	//
	// 	return this.id;
	// }


	// **** THIS MIGHT BE NEEDED FOR LATER *** //

	// static async listAll(): Promise<any> {
	// 	const [results] = (await pool.execute("SELECT `polls`.`poll_id`, `polls`.`poll_title`, `polls`.`poll_owner`, `questions`.`question_body`, `answers`.`answer_body`, `answers`.`votes` FROM `polls` JOIN `questions` ON `questions`.`pollId` = `polls`.`poll_id` JOIN `answers` ON `answers`.`questionId` = `questions`.`question_id`"));
	// 	return results;
	// }

	static async getOne(id: string): Promise<PollModel> {
		const [results] = (await pool.execute("SELECT `polls`.`poll_id`, `polls`.`poll_title`, `polls`.`poll_owner`, `questions`.`question_body`, `answers`.`answer_body`, `answers`.`votes` FROM `polls` JOIN `questions` ON `questions`.`pollId` = `polls`.`poll_id` JOIN `answers` ON `answers`.`questionId` = `questions`.`question_id` WHERE `poll_id` = :id", {
			id,
		})) as PollRecordResults;


		const finalModel: PollModel = {
			title: "",
			questions: [],
		};

		//@TODO: figure out a method to merge results into a single object
		results.forEach(result => {
			finalModel.title = result.poll_title;
			finalModel.questions.push({
				body: result.question_body,
				answers: [result.answer_body, result.votes]
			});
		});

		return finalModel;

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

// const testObj: PollEntity = {title: "xyz", owner: null};
// const testRecord = new PollRecord(testObj);

(async () => {
	console.log(await PollRecord.getOne("2"));
})();
