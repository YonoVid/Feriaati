import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

//Setup dotenv data
dotenv.config({ path: __dirname + "/.env" });
//Setup firebase configuration
admin.initializeApp(functions.config().firebase);

export {
    addUser,
    confirmRegister,
    login,
    passRecovery,
    passUpdate,
} from "./buyer/buyerFunctions";

export { addVendor } from "./vendor/vendorFunctions";
