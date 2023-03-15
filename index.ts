import express, {json} from "express";
import cors from "cors";
import "express-async-errors";
import {handleError} from "./utils/error";
import {pollRouter} from "./routers/poll";
import {userRouter} from "./routers/user";

const app = express();

app.use(cors({
	origin: "http://localhost:3000",
}));

app.use(json());

app.use("/poll", pollRouter);
app.use("/user", userRouter);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
	console.log("Listening on port http://localhost:3001");
});
