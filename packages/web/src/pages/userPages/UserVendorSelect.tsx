import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { List, ListItem, ListItemText, Card, Divider } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
    VendorData,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductListFields } from "@feria-a-ti/common/model/props/productAddFormProps";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderFunction";
import CommentList from "@feria-a-ti/web/src/components/commentList/CommentList";
import ProductVendorPage from "@feria-a-ti/web/src/components/productPage/ProductVendorPage";

const UserVendorSelect = () => {
    //Global UI context
    const { setMessage, addProduct } = useHeaderContext();
    //Global state variable
    const { authToken, emailUser, type } = useContext(UserContext);

    // Selection of vendor
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>();
    const [productVendor, setProductVendor] =
        useState<ProductListCollectionData | null>();
    // Product stored data
    const [products, setProducts] = useState<Array<ProductData>>([]);

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorData[]>([]);
    useEffect(() => {
        console.log("HISTORY STATE VALUE::", history.state);
        if (history.state.usr != null || history.state.usr != null) {
            loadVendor(history.state.usr.vendorId);
            history.replaceState({}, "");
        } else {
            getVendors();
        }
    }, []);

    const loadVendor = (vendorId: string) => {
        setSelectedVendorId(vendorId);
        const formatedData: ProductListFields = {
            token: authToken as string,
            email: emailUser as string,
            idProducts: vendorId as string,
        };
        const check = vendorId != null && vendorId != "";
        console.log("SUBMIT FORM LOAD VENDOR::", check);
        if (check) {
            const getProductVendor = httpsCallable<
                ProductListFields,
                ResponseData<ProductListCollectionData>
            >(functions, "getProductVendor");
            getProductVendor(formatedData).then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                setProductVendor(extra);
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    setMessage({ msg, isError: error });
                } else {
                    loadProducts(extra.id);
                }
            });
        }
    };

    const loadProducts = (id: string) => {
        const dataSource = id ? id : (selectedVendorId as string);
        const formatedData: ProductListFields = {
            token: authToken as string,
            email: emailUser as string,
            idProducts: id as string,
        };
        const check = id != null && id != "";
        console.log("SUBMIT FORM::", check, dataSource);
        if (check) {
            const addProduct = httpsCallable<
                ProductListFields,
                ResponseData<ProductData[]>
            >(functions, "listProduct");
            addProduct(formatedData).then((result) => {
                const { msg, error, extra } = result.data;
                console.log(result.data);

                setProducts(extra);
                //setIsLogged(result.data as any);
                if (error && msg !== "") {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

    const getVendors = async () => {
        try {
            const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
                functions,
                "vendorListUser"
            );
            vendors(authToken).then((response) => {
                const { error, extra } = response.data;
                if (!error) {
                    const vendorsData = extra as VendorData[];
                    setVendors(vendorsData);
                }
            });
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    return (
        <>
            {type !== "user" && <Navigate to="/login" replace={true} />}
            {selectedVendorId ? (
                <>
                    <ProductVendorPage
                        addProduct={(value) => {
                            console.log("ADD TO CART::", value.id);
                            productVendor != null &&
                                addProduct(value, productVendor);
                        }}
                        vendorId={selectedVendorId}
                        vendorData={productVendor || {}}
                        products={products}
                        isEditable={false}
                    />
                    <CommentList
                        commentsVendor={selectedVendorId}
                        isUser={true}
                    />
                </>
            ) : (
                <>
                    <Card
                        className="inputContainer"
                        color="secondary"
                        sx={{
                            maxWidth: "50%",
                            alignContent: "center",
                            borderRadius: "10%",
                        }}
                    >
                        <h1 style={{ maxWidth: "100%" }}>
                            {"Lista de Vendedores"}
                        </h1>
                        <List>
                            {vendors &&
                                vendors.map((vendor) => (
                                    <ListItem
                                        component="button"
                                        disablePadding
                                        key={vendor.id}
                                        onClick={() => {
                                            loadVendor(vendor.id);
                                        }}
                                    >
                                        <ListItemText
                                            primary={vendor.enterpriseName}
                                        />
                                        <Divider />
                                    </ListItem>
                                ))}
                        </List>
                    </Card>
                </>
            )}
        </>
    );
};

export default UserVendorSelect;
