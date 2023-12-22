import {
    ProductFactureData,
    ProductListCollectionData,
    ProductUnit,
} from "../model/functionsTypes";
import { ShoppingCartItem } from "../model/props/shoppingCartProps";
import { BUYERROR } from "../model/users/buyTypes";

export type FormatFactureData = {
    buyError: BUYERROR;
    priceTotal: number;
    productPetition: { [id: string]: ProductFactureData[] };
    vendorData: { [id: string]: ProductListCollectionData };
};

export const formatFacture = (
    products: Map<
        string,
        {
            vendor: ProductListCollectionData;
            products: Map<string, ShoppingCartItem>;
        }
    >,
    vendorCheck: BUYERROR
): FormatFactureData => {
    let newTotal = 0;
    let newVendorCheck: BUYERROR = vendorCheck;
    let lastVendorMap: {
        vendor: ProductListCollectionData;
        products: Map<string, ShoppingCartItem>;
    };
    const newProductPetition: { [id: string]: ProductFactureData[] } = {};
    const newVendorData: { [id: string]: ProductListCollectionData } = {};

    console.log("SUBMIT BUYING PETITION");
    console.log(products);
    products.forEach((vendorMap, key) => {
        if (
            newVendorCheck != BUYERROR.REGION &&
            lastVendorMap != null &&
            lastVendorMap != undefined
        ) {
            if (vendorMap.vendor.region != lastVendorMap.vendor.region) {
                newVendorCheck = BUYERROR.REGION;
            } else if (
                newVendorCheck != BUYERROR.COMMUNE &&
                vendorMap.vendor.commune != lastVendorMap.vendor.commune
            ) {
                newVendorCheck = BUYERROR.COMMUNE;
            }
        }

        lastVendorMap = vendorMap;
        newVendorData[key] = vendorMap.vendor;

        vendorMap.products.forEach((product) => {
            const { id, value, quantity } = product;

            let finalPrice = value.price;
            if (
                value.discount != undefined &&
                value.discount != null &&
                value.promotion != undefined &&
                value.promotion != null &&
                value?.discount != "none"
            ) {
                finalPrice -=
                    value.discount == "percentage"
                        ? (finalPrice * value.promotion) / 100
                        : value.promotion;
            }

            const unitLabel =
                "(" +
                (value.unitType === ProductUnit.GRAM
                    ? value.unit + "gr."
                    : value.unitType === ProductUnit.KILOGRAM
                    ? "kg."
                    : "unidad") +
                ")";

            newProductPetition[id.vendorId] = [
                {
                    id: id.productId,
                    name: product.value.name + unitLabel,
                    quantity: quantity,
                    subtotal: finalPrice * quantity,
                },
                ...(newProductPetition[product.id.vendorId] || []),
            ];
            newTotal += finalPrice * quantity;
        });
    });

    return {
        buyError: newVendorCheck,
        priceTotal: newTotal,
        productPetition: newProductPetition,
        vendorData: newVendorData,
    };
};
