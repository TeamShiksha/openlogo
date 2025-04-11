import { signupHandler } from "./handlers/signuphandler";
import { signinHandler } from "./handlers/signinhandler";

const handlers = [...signupHandler, ...signinHandler];

export default handlers;
