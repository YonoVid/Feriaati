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
import { useHeaderContext } from "../HeaderLayout";
import CommentList from "../../components/commentList/CommentList";
import ProductVendorPage from "../../components/productPage/ProductVendorPage";

const UserVendorSelect = () => {
    //Global UI context
    const { setMessage, addProduct } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);

    // Selection of vendor
    const [selectedVendor, setSelectedVendor] = useState<VendorData | null>();
    const [productVendor, setProductVendor] =
        useState<ProductListCollectionData | null>();
    // Product stored data
    const [products, setProducts] = useState<Array<ProductData>>([]);

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorData[]>([]);
    useEffect(() => {
        getVendors();
    }, []);

    const loadVendor = (data: VendorData) => {
        const formatedData: ProductListFields = {
            idVendor: data.id as string,
        };
        const check = data.id != null && data.id != "";
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
                    loadProducts(data);
                }
            });
        }
    };

    const loadProducts = (data?: VendorData) => {
        const dataSource = data ? data : selectedVendor;
        const formatedData: ProductListFields = {
            idVendor: dataSource?.id as string,
        };
        const check = dataSource?.id != null && dataSource?.id != "";
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
            {selectedVendor ? (
                <>
                    <ProductVendorPage
                        addProduct={addProduct}
                        vendorId={selectedVendor.id}
                        vendorData={productVendor || {}}
                        products={products}
                        isEditable={false}
                    />
                    <CommentList
                        commentsVendor={selectedVendor.id}
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
                                            setSelectedVendor(vendor);
                                            loadVendor(vendor);
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
