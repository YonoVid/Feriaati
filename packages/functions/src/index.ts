import * as dotenv from "dotenv";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const serviceAccount = require("./feria-a-ti-2dcf0f12c71a.json");

//Setup dotenv data
dotenv.config({ path: __dirname + "/.env" });
//Setup firebase configuration
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://feria-a-ti.appspot.com",
    ...functions.config().firebase,
});

export {
    addUser,
    confirmRegister,
    login,
    passRecovery,
    passUpdate,
} from "./buyer/buyerFunctions";

export {
    addVendor,
    loginVendor,
    passRecoveryVendor,
    passUpdateVendor,
} from "./vendor/vendorFunctions";
export {
    adminLogin,
    vendorList,
    vendorStateUpdate,
} from "./admin/adminFunctions";

export {
    addProduct,
    deleteProduct,
    editProduct,
    listProduct,
    productListPagination,
    getProductVendor,
} from "./product/productFunctions";
