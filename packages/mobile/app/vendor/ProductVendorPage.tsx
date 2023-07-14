import React, { useState } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";

import { ProductData } from "@feria-a-ti/common/model/functionsTypes";
import { ProductVendorPageProps } from "@feria-a-ti/common/model/props/productVendorPageProps";

import { ProductList } from "@feria-a-ti/mobile/components/productList/ProductList";
import { regionCode, regionCommune } from "@feria-a-ti/common/constants/form";
import { colors } from "@feria-a-ti/common/theme/base";

export const ProductVendorPage = (props: ProductVendorPageProps) => {
    const {
        vendorData,
        products,
        isEditable,
        addProduct,
        onAdd,
        onReload,
        onEdit,
        onDelete,
        onUpdatePage,
    } = props;
    const {
        enterpriseName,
        street,
        streetNumber,
        commune,
        region,
        serviceTime,
        contact,
        image,
    } = vendorData;

    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.innerContainer}
        >
            <Card style={styles.containerVendor}>
                <Card.Title
                    titleStyle={{ ...styles.title }}
                    title={enterpriseName}
                    subtitle={
                        "Ubicación de local: " + street + " " + streetNumber
                    }
                />
                <Card.Cover
                    style={{ height: "25%", maxHeight: "25%" }}
                    resizeMode="cover"
                    source={{ uri: image }}
                />
                <Card.Content>
                    {expanded && (
                        <>
                            <Text style={{ flex: 6 }}>
                                Dirección de local:
                                {street + " " + streetNumber}
                            </Text>
                            <Text style={{ flex: 6 }}>
                                Zona de atención:
                                {(region ? regionCode[region - 1][1] : "") +
                                    ", " +
                                    (region && commune
                                        ? regionCommune[region].find(
                                              (el: string | number[]) =>
                                                  el[0] === commune
                                          )[1]
                                        : "")}
                            </Text>
                            <Text style={{ flex: 6 }}>
                                Horario de atención:
                                {serviceTime &&
                                serviceTime &&
                                serviceTime != null
                                    ? (serviceTime?.start.hours
                                          .toString()
                                          .padStart(2, "0") +
                                          ":" +
                                          serviceTime?.start.minutes
                                              .toString()
                                              .padStart(2, "0") || "") +
                                      "-" +
                                      (serviceTime?.end.hours
                                          .toString()
                                          .padStart(2, "0") +
                                          ":" +
                                          serviceTime?.end.minutes
                                              .toString()
                                              .padStart(2, "0") || "")
                                    : ":"}
                            </Text>
                            <Text style={{ flex: 6 }}>
                                Método de contacto:
                                {(contact &&
                                    contact?.phone + "-" + contact?.email) ||
                                    "-"}
                            </Text>
                        </>
                    )}
                </Card.Content>
                <Card.Actions>
                    <IconButton
                        icon={expanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        onPress={() => handleExpandClick()}
                    />
                    {isEditable && onUpdatePage && (
                        <Button
                            mode="contained-tonal"
                            onPress={() => onUpdatePage()}
                        >
                            {"Actualizar datos de local"}
                        </Button>
                    )}
                </Card.Actions>
            </Card>
            <ProductList
                label="Productos"
                products={products}
                isEditable={isEditable || false}
                addProduct={addProduct}
                onAdd={onAdd}
                onEdit={onEdit}
                onReload={onReload}
                onDelete={onDelete}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        marginVertical: 20,
        paddingVertical: 10,
        textAlign: "center",
        color: colors.primaryShadow,
        fontSize: 30,
        fontWeight: "bold",
        borderRadius: 4,
    },
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
    containerVendor: {
        flexGrow: 1,
        flex: 1,
        padding: 10,
        paddingBottom: 25,
        backgroundColor: colors.secondary,
        borderRadius: 30,
    },
});
