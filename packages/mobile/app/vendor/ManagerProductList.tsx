import React, { ReactNode, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import {
    ProductData,
    ProductListCollectionData,
} from "@feria-a-ti/common/model/functionsTypes";
import {
    DayTimeRange,
    UpdateProductVendorFields,
} from "@feria-a-ti/common/model/fields/updateFields";

import { editProductList } from "@feria-a-ti/common/functions/vendor/manageProductsFunctions";

import ProductVendorUpdateForm from "@feria-a-ti/mobile/components/forms/ProductVendorUpdateForm";

import { useAppContext } from "@feria-a-ti/mobile/app/AppContext";
import { ProductVendorPage } from "./ProductVendorPage";

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
    const { emailUser, authToken, checkSession, setMessage } = useAppContext();
    // Navigation
    const { navigation } = props;
    //Page stored data

    // Form related variables;
    const [imageData, setImageData] = useState<string>("");

    const [updateVendorPage, setUpdateVendorPage] = useState(false);

    const onEditVendor = (data: UpdateProductVendorFields) => {
        const formatedData: UpdateProductVendorFields = {
            email: emailUser,
            token: authToken as string,
            productVendorId: productVendor?.vendorId as string,
            image:
                imageData && imageData != null && imageData != ""
                    ? imageData
                    : productVendor?.image,
            contactPhone: data.contactPhone as string,
            contactEmail: data.contactEmail as string,
            serviceTime: data.serviceTime as DayTimeRange,
        };

        editProductList({ formatedData, setCanSubmit, setMessage }, () => {
            setProductEditable(null);
            loadVendor();
            setImageData("");
            setUpdateVendorPage(false);
        });
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
