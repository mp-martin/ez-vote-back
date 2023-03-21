import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {UserEntity} from "../types";
import {v4 as uuid} from "uuid";

type UserRecordResults = [UserRecord[], FieldPacket[]]

export class UserRecord implements UserEntity {

	userId?: string;
	userName: string;
	userLogin: string;
	userPw: string;

	constructor(obj: UserEntity) {
		if (!obj.userName || !obj.userLogin || !obj.userPw) {
			throw new ValidationError("Make sure user name, login and password are provided!");
		}

		this.userId = obj.userId;
		this.userName = obj.userName;
		this.userLogin = obj.userLogin;
		this.userPw = obj.userPw;
	}

	static async insert(userObj: UserEntity): Promise<string> {
		if (!userObj.userId) {
			userObj.userId = uuid();
		}

		await pool.execute("INSERT INTO `users`(`userId`, `userName`, `userLogin`, `userPw`) VALUES(:id, :name, :login, :pw)", {
			id: userObj.userId,
			name: userObj.userName,
			login: userObj.userLogin,
			pw: userObj.userPw
		});

		return userObj.userId;
	}

	static async getOne(id: string): Promise<UserRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `users` WHERE `userId` = :id", {
			id,
		})) as UserRecordResults;

		return results.length === 0 ? null : new UserRecord(results[0]);
	}

}