import React, { ReactNode, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { httpsCallable } from "@firebase/functions";

import { functions } from "@feria-a-ti/common/firebase";

import {
    ProductData,
    ProductListCollectionData,
    ResponseData,
    userType,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    DayTimeRange,
    UpdateProductVendorFields,
} from "@feria-a-ti/common/model/fields/updateFields";
import { checkProductVendorUpdate } from "@feria-a-ti/common/check/checkProductVendorUpdate";

import ProductAddForm from "@feria-a-ti/mobile/components/forms/ProductAddForm";

import { ProductVendorPage } from "./ProductVendorPage";
import { useAppContext } from "../AppContext";
import ProductVendorUpdateForm from "../../components/forms/ProductVendorUpdateForm";

export interface ManagerProductListProps {
    navigation: NavigationProp<ParamListBase>;
    productVendor: ProductListCollectionData | undefined;
    products: ProductData[];
    canSubmit: boolean;
    isEditable: boolean;
    setCanSubmit: React.Dispatch<React.SetStateAction<boolean>>;
    setProductEditable: React.Dispatch<
        React.SetStateAction<ProductData | null>
    >;
    loadProducts: () => void;
    loadVendor: () => void;
    onDelete: (id: string) => void;
    children: ReactNode;
}

export const ManagerProductList = (props: ManagerProductListProps) => {
    const {
        productVendor,
        products,
        loadProducts,
        loadVendor,
        setProductEditable,
        canSubmit,
        isEditable,
        setCanSubmit,
        onDelete,
        children,
    } = props;
    // Context variables
    const { type, authToken, checkSession, setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    //Page stored data

    // Form related variables;
    const [imageData, setImageData] = useState<string>("");

    const [updateVendorPage, setUpdateVendorPage] = useState(false);

    const onEditVendor = (data: UpdateProductVendorFields) => {
        const formatedData: UpdateProductVendorFields = {
            tokenVendor: authToken as string,
            productVendorId: productVendor?.vendorId as string,
            image:
                imageData && imageData != null && imageData != ""
                    ? imageData
                    : productVendor?.image,
            contactPhone: data.contactPhone as string,
            contactEmail: data.contactEmail as string,
            serviceTime: data.serviceTime as DayTimeRange,
        };
        const check = checkProductVendorUpdate(formatedData);
        console.log("SUBMIT FORM ON EDIT VENDOR::", check);
        if (check) {
            setCanSubmit(false);
            console.log("DATA FORM ON EDIT VENDOR::", formatedData);
            // setCanSubmit(false);
            const editProduct = httpsCallable<
                UpdateProductVendorFields,
                ResponseData<string>
            >(functions, "productVendorUpdate");
            editProduct(formatedData)
                .then((result) => {
                    const { msg, error } = result.data as ResponseData<string>;
                    console.log(result.data);
                    //setIsLogged(result.data as any);
                    if (!error) {
                        setProductEditable(null);
                        loadVendor();
                        setImageData("");
                        setUpdateVendorPage(false);
                    }
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setCanSubmit(true));
        }
    };

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.innerContainer}
            >
                {!updateVendorPage ? (
                    <>
                        <ProductVendorPage
                            vendorId={productVendor?.vendorId || "null"}
                            vendorData={productVendor || {}}
                            products={products}
                            isEditable={isEditable}
                            onAdd={() =>
                                navigation.navigate("managerAddProduct")
                            }
                            onEdit={(data: ProductData | null) => {
                                setProductEditable(data);
                            }}
                            onUpdatePage={() => setUpdateVendorPage(true)}
                            onReload={() => loadProducts()}
                            onDelete={onDelete}
                        />
                        {children}
                    </>
                ) : (
                    <ProductVendorUpdateForm
                        imageData={productVendor.image}
                        canSubmit={canSubmit}
                        buttonLabel="Actualizar local"
                        editedVendor={productVendor}
                        setImageData={setImageData}
                        onSubmit={onEditVendor}
                        onCancel={() => {
                            setUpdateVendorPage(false);
                            setImageData("");
                        }}
                    />
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexGrow: 1,
        alignContent: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: "#EEEAE0",
    },
});
