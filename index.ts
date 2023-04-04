import express, {json, Router} from "express";
import cors from "cors";
import "express-async-errors";
import {handleError} from "./utils/error";
import {pollRouter} from "./routers/poll";
import {userRouter} from "./routers/user";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
	origin: "http://localhost:3000",
	credentials: true
}));

app.use(json());
app.use(cookieParser());

const router = Router();

router.use("/poll", pollRouter);
router.use("/user", userRouter);
app.use("/api", router);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
	console.log("Listening on port http://localhost:3001");
});
