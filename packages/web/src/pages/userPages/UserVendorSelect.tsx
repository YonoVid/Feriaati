import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { List, ListItem, ListItemText, Card, Divider } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ProductData,
    ResponseData,
    VendorCollectionData,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductListFields } from "@feria-a-ti/common/model/productAddFormProps";
import ProductList from "@feria-a-ti/web/src/components/productList/ProductList";

import { UserContext } from "@feria-a-ti/web/src/App";
import { useHeaderContext } from "../HeaderLayout";

const UserVendorSelect = () => {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { type } = useContext(UserContext);

    // Selection of vendor
    const [selectedVendor, setSelectedVendor] =
        useState<VendorCollectionData | null>();
    // Product stored data
    const [products, setProducts] = useState<Array<ProductData>>([]);

    // Data of vendors stored
    const [vendors, setVendors] = useState<VendorCollectionData[]>([]);
    useEffect(() => {
        getVendors();
    }, []);

    const loadProducts = (data?: VendorCollectionData) => {
        const dataSource = data ? data : selectedVendor;
        const formatedData: ProductListFields = {
            idVendor: dataSource?.email as string,
        };
        const check = dataSource?.email != null && dataSource?.email != "";
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
                if (msg !== "") {
                    setMessage({ msg, isError: error });
                }
            });
        }
    };

    const getVendors = async () => {
        try {
            const vendors = httpsCallable(functions, "vendorList");
            const response = await vendors();
            const vendorsData = response.data as VendorCollectionData[];
            setVendors(vendorsData);
        } catch (error) {
            console.error("Error al obtener los vendedores:", error);
        }
    };

    return (
        <>
            {type !== "user" && <Navigate to="/login" replace={true} />}
            {selectedVendor ? (
                <ProductList isEditable={false} label="" products={products} />
            ) : (
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
                        {vendors.map((vendor) => (
                            <ListItem
                                component="button"
                                disablePadding
                                key={vendor.email}
                                onClick={() => {
                                    setSelectedVendor(vendor);
                                    loadProducts(vendor);
                                }}
                            >
                                <ListItemText primary={vendor.enterpriseName} />
                                <Divider />
                            </ListItem>
                        ))}
                    </List>
                </Card>
            )}
        </>
    );
};

export default UserVendorSelect;
