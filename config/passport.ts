import {Strategy as JwtStrategy} from "passport-jwt";
import {ExtractJwt} from "passport-jwt";
import path from "path";
import fs from "fs";
import {PassportStatic} from "passport";
import {UserRecord} from "../records/user.record";

const pathToKey = path.join(__dirname, "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToKey, "utf8");

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: PUB_KEY,
	algorithms: ["RS256"]
};

const strategy = new JwtStrategy(options, async (payload, done) => {
	try {
		const user = await UserRecord.getOne(payload.sub);
		if (user) {
			return done(null, user);
		} else {
			done(null, false);
		}
	} catch (e) {
		done(e, false);
	}
});

export default (passport: PassportStatic) => {
	passport.use(strategy);
};