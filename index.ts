import express, {json, Router} from "express";
import cors from "cors";
import "express-async-errors";
import rateLimit from "express-rate-limit";
import {handleError} from "./utils/error";
import {pollRouter} from "./routers/poll";
import {userRouter} from "./routers/user";
import cookieParser from "cookie-parser";
import {config} from "./config/config";

const app = express();

app.use(cors({
	origin: config.corsOrigin,
	credentials: true
}));

app.use(json());
app.use(rateLimit({
	windowMs: 5 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
}));

app.use(cookieParser());

const router = Router();

router.use("/poll", pollRouter);
router.use("/user", userRouter);
app.use("/api", router);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
	console.log("Listening on port http://localhost:3001");
});
