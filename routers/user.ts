import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {genPassword, issueJwt, validPassword} from "../utils/auth-utils";
import {ValidationError} from "../utils/error";
import passport from "passport";
import {AuthPositiveResponse} from "../types";

export const userRouter = Router();

userRouter

	.post("/login", async (req, res, next) => {
		try {
			const user = await UserRecord.getOneByLogin(req.body.userLogin);
			if (!user) {
				res.status(401).json({
					success: false,
					reason: "wrong username or password"
				});

			}
			if (user) {
				const isValid = validPassword(req.body.userPassword, user.userHash, user.userSalt);

				if (isValid) {
					const {userId, userLogin} = user;
					const tokenObject = issueJwt({userId, userLogin});
					res.status(200).json({
						success: true,
						user: {userId, userLogin},
						token: tokenObject.token,
						expires: tokenObject.expires
					} as AuthPositiveResponse);
				} else {
					res.status(401).json({
						success: false,
						reason: "wrong username or password"
					});
				}
			}

		} catch (e) {
			throw new Error(e);
		}

	})

	.post("/register", async (req, res, next) => {
		const {userLogin} = req.body;
		const nameCheck = await UserRecord.getOneByLogin(userLogin);
		if (nameCheck) {
			return res.status(401).json({
				success: false,
				reason: "that user name is already taken"
			});}
		const saltHash = genPassword(req.body.userPassword);
		const userSalt = saltHash.salt;
		const userHash = saltHash.hash;

		const userToReg = new UserRecord({
			userLogin,
			userSalt,
			userHash
		});

		try {
			const newUserId = await UserRecord.insert(userToReg);
			const newUser = await UserRecord.getOne(newUserId);
			if (newUser) {
				const {userId, userLogin} = newUser;
				const jwt = issueJwt({userId, userLogin});
				res.json({
					success: true,
					user: {userId, userLogin},
					token: jwt.token,
					expires: jwt.expires
				} as AuthPositiveResponse);
			}

		} catch (e) {
			throw new ValidationError("Something went wrong when registering a new user");
		}

	})

	.get("/protected", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
		console.log(req.user);
		res.status(200).json({success: true, message: "you are authorized!"});
	});


