import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import fs from "fs";
import path from "path";
import {UserRecord} from "../records/user.record";

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

export function validPassword(password: string, hash: string, salt: string) {
	const hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
	return hash === hashVerify;
}

export function genPassword(password: string) {
	const salt = crypto.randomBytes(32).toString("hex");
	const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");

	return {
		salt: salt,
		hash: genHash
	};
}

export function issueJwt(user: UserRecord) {
	const _id = user.userId;
	const expiresIn = "1d";
	const payload = {
		sub: _id,
		iat: Date.now()
	};

	const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {expiresIn: expiresIn, algorithm: "RS256"});

	return {
		token: "Bearer " + signedToken,
		expires: expiresIn
	};
}