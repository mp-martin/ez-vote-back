import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {genPassword, issueJwt, validPassword} from "../utils/auth-utils";
import {ValidationError} from "../utils/error";
import passport from "passport";

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
					const tokenObject = issueJwt(user);
					res.status(200).json({
						success: true,
						user,
						token: tokenObject.token,
						expires: tokenObject.expires
					});
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
				const jwt = issueJwt(newUser);
				res.json({
					success: true,
					user: newUser,
					token: jwt.token,
					expiresIn: jwt.expires
				});
			}

		} catch (e) {
			throw new ValidationError("Something went wrong when registering a new user");
		}

	})

	.get("/protected", passport.authenticate("jwt", {session: false}), async (req, res, next) => {
		res.status(200).json({success: true, message: "you are authorized!"});
	});


