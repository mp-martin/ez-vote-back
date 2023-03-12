import express, {json, Request, Response} from "express";
import cors from "cors";
import "express-async-errors";
import {handleError, ValidationError} from "./utils/error";

const app = express();

app.use(cors({
	origin: "http://localhost:3000",
}));

app.use(json());

//Routes will go here

app.use(handleError);

app.listen(3001, "0.0.0.0", () => {
	console.log("Listening on port http://localhost:3001");
});
