import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { TrendingItems } from "@algolia/recommend-react";
import recommend from "@algolia/recommend";

import LoadingOverlay from "react-loading-overlay-ts";

import { Card } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";

import { functions } from "@feria-a-ti/common/firebase"; // Importa la configuración de Firebase, incluyendo las funciones
import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
} from "@feria-a-ti/common/model/functionsTypes";
import { ProductListFields } from "@feria-a-ti/common/model/props/productAddFormProps";

import ProductVendorPage from "@feria-a-ti/web/src/components/productPage/ProductVendorPage";
import CommentList from "@feria-a-ti/web/src/components/commentList/CommentList";
import TrendingResultComponent from "@feria-a-ti/web/src/components/searchEngine/TrendingResultComponent";

import { useHeaderContext } from "../HeaderFunction";
import { UserContext } from "@feria-a-ti/web/src/App";
import { IndexType } from "@feria-a-ti/common/model/indexTypes";
import { messagesCode } from "@feria-a-ti/common/constants/errors";

const recommendClient = recommend(
    "88L6KTFHAN",
    "13aac81f9fd4266e778405059612bf9e"
);
const indexName = "dev_feriaati";

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

    // Page data
    const [canSubmit, setCanSubmit] = useState<boolean>(true);

    // Data of vendors stored
    //const [vendors, setVendors] = useState<VendorData[]>([]);

    useEffect(() => {
        console.log("HISTORY STATE VALUE::", history.state);
        if (history.state.usr != null || history.state.usr != null) {
            loadVendor(history.state.usr.vendorId);
            history.replaceState({}, "");
        }
        // else {
        //     getVendors();
        // }
    }, []);

    const loadVendor = (vendorId: string) => {
        setCanSubmit(false);

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
            getProductVendor(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    setProductVendor(extra);
                    //setIsLogged(result.data as any);
                    if (error && msg !== "") {
                        setMessage({ msg, isError: error });
                    } else {
                        loadProducts(extra.id);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                    setCanSubmit(true);
                })
                .finally(() => {
                    setCanSubmit(true);
                });
        }
    };

    const loadProducts = (id: string) => {
        setCanSubmit(false);

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
            addProduct(formatedData)
                .then((result) => {
                    const { msg, error, extra } = result.data;
                    console.log(result.data);

                    setProducts(extra);
                    //setIsLogged(result.data as any);
                    if (error && msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setMessage({ msg: messagesCode["ERR00"], isError: error });
                    setCanSubmit(true);
                })
                .finally(() => {
                    setCanSubmit(true);
                });
        }
    };

    // const getVendors = async () => {
    //     try {
    //         const vendors = httpsCallable<string, ResponseData<VendorData[]>>(
    //             functions,
    //             "vendorListUser"
    //         );
    //         vendors(authToken).then((response) => {
    //             const { error, extra } = response.data;
    //             if (!error) {
    //                 const vendorsData = extra as VendorData[];
    //                 setVendors(vendorsData);
    //             }
    //         });
    //     } catch (error) {
    //         console.error("Error al obtener los vendedores:", error);
    //     }
    // };

    const TrendingItem = (value: { item: any }) => {
        return (
            <pre>
                <TrendingResultComponent
                    item={value.item}
                    canSubmit={true}
                    onSubmit={(id: string, type: IndexType) => {
                        console.log("TYPE::", type, "VENDOR::", id);
                        loadVendor(id);
                        window.scrollTo(0, 0);
                    }}
                />
            </pre>
        );
    };

    return (
        <>
            {type !== "user" && <Navigate to="/login" replace={true} />}
            <LoadingOverlay
                active={!canSubmit}
                spinner
                text="Cargando datos..."
            >
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
                                maxWidth: "80%",
                                alignContent: "center",
                                borderRadius: "10%",
                            }}
                        >
                            <TrendingItems
                                recommendClient={recommendClient}
                                indexName={indexName}
                                itemComponent={TrendingItem}
                                headerComponent={() => {
                                    return <h2>Productos recomendados</h2>;
                                }}
                            />
                            {/* <h1 style={{ maxWidth: "100%" }}>
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
                        </List> */}
                        </Card>
                    </>
                )}
            </LoadingOverlay>
        </>
    );
};

export default UserVendorSelect;
