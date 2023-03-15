import {Router} from "express";
import {UserRecord} from "../records/user.record";

export const userRouter = Router();

userRouter

	.post("/", async (req, res) => {
		const userData: UserRecord = req.body;
		await UserRecord.insert(userData);
	})

	.get("/:id", async (req, res) => {
		const userId = req.params.id;
		const user = await UserRecord.getOne(userId);

		res.json({
			user,
		});
	});


