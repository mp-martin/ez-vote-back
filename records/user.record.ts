import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {UserEntity} from "../types";
import {v4 as uuid} from "uuid";

type UserRecordResults = [UserRecord[], FieldPacket[]]

export class UserRecord implements UserEntity {

	user_id?: string;
	user_name: string;
	user_login: string;
	user_pw: string;

	constructor(obj: UserEntity) {
		if (!obj.user_name || !obj.user_login || !obj.user_pw) {
			throw new ValidationError("Make sure user name, login and password are provided!");
		}

		this.user_id = obj.user_id;
		this.user_name = obj.user_name;
		this.user_login = obj.user_login;
		this.user_pw = obj.user_pw;
	}

	static async insert(userObj: UserEntity): Promise<string> {
		if (!userObj.user_id) {
			userObj.user_id = uuid();
		}

		await pool.execute("INSERT INTO `users`(`user_id`, `user_name`, `user_login`, `user_pw`) VALUES(:id, :name, :login, :pw)", {
			id: userObj.user_id,
			name: userObj.user_name,
			login: userObj.user_login,
			pw: userObj.user_pw
		});

		return userObj.user_id;
	}

	static async getOne(id: string): Promise<UserRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `users` WHERE `user_id` = :id", {
			id,
		})) as UserRecordResults;

		return results.length === 0 ? null : new UserRecord(results[0]);
	}

}