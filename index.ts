import express, {json, Request, Response} from "express";
import cors from "cors";
import "express-async-errors";
import {handleError, ValidationError} from "./utils/error";
import {pollRouter} from "./routers/poll";

const app = express();

app.use(cors({
	origin: "http://localhost:3000",
}));

app.use(json());

app.use("/poll", pollRouter);

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
	console.log("Listening on port http://localhost:3001");
});
