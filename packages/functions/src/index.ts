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
} from "./buyer/buyerAccessFunctions";

export { vendorListUser, buyProductUser } from "./buyer/buyerFunctions";

export { getFactures } from "./buyer/buyerFactureFunctions";

export {
    addVendor,
    loginVendor,
    passRecoveryVendor,
    passUpdateVendor,
} from "./vendor/vendorAccessFunctions";

export { contributorList } from "./vendor/vendorContributorFunctions";

export { getVendorFactures, getResume } from "./vendor/vendorFactureFunctions";

export { checkPetitionVendor } from "./vendor/vendorFunctions";

export { adminLogin, productVendorList } from "./admin/adminFunctions";

export {
    updateProductList,
    deleteProductList,
} from "./admin/adminProductFunctions";

export {
    vendorList,
    vendorStateUpdate,
    registerVendorList,
    updateVendor,
    deleteVendor,
} from "./admin/adminVendorFunctions";

export {
    userList,
    userStateUpdate,
    updateUser,
    deleteUser,
} from "./admin/adminUserFunctions";

export {
    addProduct,
    deleteProduct,
    editProduct,
    listProduct,
    productListPagination,
    getProductVendor,
} from "./product/productFunctions";

export { productVendorUpdate } from "./product/productVendorFunctions";

export {
    getAccountUser,
    editAccountUser,
    logoutUser,
    updateUserFacture,
} from "./account/accountFunctions";

export {
    getAccountSubscription,
    setAccountSubscription,
} from "./account/accountSubscriptionFunctions";

export {
    addContributor,
    updateContributor,
    deleteContributor,
} from "./account/accountContributorFunctions";

export { editAccountVendor } from "./account/accountVendorFunctions";

export {
    getComments,
    reportComment,
    addComment,
} from "./comment/commentFunctions";

export {
    addProductIndex,
    editProductIndex,
    deleteProductIndex,
} from "./search/productSearch";

export {
    addProductVendorIndex,
    editProductVendorIndex,
    deleteProductVendorIndex,
} from "./search/productVendorSearch";
