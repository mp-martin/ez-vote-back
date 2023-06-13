import {pool} from "../utils/db";
import {ValidationError} from "../utils/error";
import {FieldPacket} from "mysql2";
import {UserEntity} from "../types";
import {v4 as uuid} from "uuid";

type UserRecordResults = [UserRecord[], FieldPacket[]]

export class UserRecord implements UserEntity {

	userId?: string;
	userLogin: string;
	userHash: string;
	userSalt: string;

	constructor(obj: UserEntity) {
		if (!obj.userLogin || !obj.userHash || !obj.userSalt) {
			throw new ValidationError("Make sure user login, hash and salt are provided!");
		}

		this.userId = obj.userId;
		this.userLogin = obj.userLogin;
		this.userHash = obj.userHash;
		this.userSalt = obj.userSalt;
	}

	static async insert(userObj: UserEntity): Promise<string> {
		if (!userObj.userId) {
			userObj.userId = uuid();
		}

		await pool.execute("INSERT INTO `users`(`userId`, `userLogin`,`userHash`, `userSalt`) VALUES(:id, :login, :hash, :salt)", {
			id: userObj.userId,
			login: userObj.userLogin,
			hash: userObj.userHash,
			salt: userObj.userSalt,
		});

		return userObj.userId;
	}

	static async getOne(id: string): Promise<UserRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `users` WHERE `userId` = :id", {
			id,
		})) as UserRecordResults;

		return results.length === 0 ? null : new UserRecord(results[0]);
	}

	static async getOneByLogin(login: string): Promise<UserRecord | null> {
		const [results] = (await pool.execute("SELECT * FROM `users` WHERE `userLogin` = :login", {
			login,
		})) as UserRecordResults;

		return results.length === 0 ? null : new UserRecord(results[0]);
	}

}