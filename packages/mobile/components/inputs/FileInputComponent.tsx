import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from "react";
import {
    Controller,
    FieldError,
    FieldValues,
    PathValue,
    UseControllerProps,
    UseFormSetValue,
} from "react-hook-form";
import { Image, Text, StyleSheet, Keyboard, View } from "react-native";
import { Avatar, Button } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import * as ExpoImageManipulator from "expo-image-manipulator";

import { colors } from "@feria-a-ti/common/theme/base";
import { Path } from "react-router-dom";
import React from "react";

interface Props<T> extends UseControllerProps<T> {
    label: string;
    icon: string;
    type: "image";
    defaultPreview?: string;
    error: FieldError | undefined;
    setData: Dispatch<SetStateAction<string | ArrayBuffer>>;
    setIsLoading?: Dispatch<SetStateAction<boolean>>;
}

const FileInputComponent = <T extends FieldValues>({
    name,
    label,
    icon,
    control,
    rules,
    error,
    defaultPreview,
    setIsLoading,
    setData,
}: Props<T>) => {
    //const { name, label, control, rules, error } = props;
    const [shownValue, setShownValue] = useState("");
    const [preview, setPreview] = useState(defaultPreview || "");
    const labelText = label != null ? label : name;

    const handleDocumentSelection = (onChange?: (...event: any[]) => void) => {
        setIsLoading(true);
        try {
            console.log("OPEN FILE EXPLORER");
            const response = DocumentPicker.getDocumentAsync({
                type: "image/*",
                multiple: false,
                copyToCacheDirectory: false,
            }).then((response) => {
                if (response.type === "success") {
                    let imageAction = [];
                    if (response["size"] / 1024 ** 2 > 1) {
                        Image.getSize(response["uri"], (width, height) => {
                            console.log(width, "x", height);
                            imageAction.push(
                                height > width
                                    ? { height: 1500 }
                                    : { width: 1500 }
                            );
                        });
                    }
                    setShownValue(response["name"]);
                    onChange && onChange(response["name"]);
                    console.log(response);
                    console.log(response.size);
                    ExpoImageManipulator.manipulateAsync(
                        response["uri"],
                        imageAction,
                        { compress: 0.75, base64: true }
                    )
                        .then((value) => {
                            setData(value.base64);
                            setPreview(value.uri);
                            console.log(value.base64 != null);
                            console.log(value.width);
                        })
                        .finally(() => setIsLoading(false));
                }
            });
        } catch (err) {
            console.warn(err);
        }
    };

    useEffect(() => console.log("PREVIEW EXISTS::", defaultPreview != null));

    return (
        <>
            <View style={{ flexDirection: "row" }}>
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <Button
                            style={{ flex: 1 }}
                            mode="elevated"
                            icon={icon}
                            onPress={() => {
                                handleDocumentSelection(onChange);
                            }}
                        >
                            {(value &&
                                (value.length > 25
                                    ? value.substring(0, 25) + "..."
                                    : value)) ||
                                labelText}
                        </Button>
                    )}
                />
                {preview !== "" ? (
                    <Avatar.Image size={32} source={{ uri: preview }} />
                ) : (
                    <Avatar.Icon size={32} icon="image" />
                )}
            </View>
            {error && <Text>{error?.message || "ERROR"}</Text>}
        </>
    );
};

const styles = StyleSheet.create({
    labelWrapper: {
        alignItems: "center",
        marginTop: "-2%",
        flexDirection: "row",
    },
    label: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        alignSelf: "flex-start",
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 15,
        paddingHorizontal: "5%",
        borderRadius: 10,
    },
    input: {
        color: colors.primaryShadow,
        backgroundColor: colors.light,
        borderColor: colors.primary,
        paddingHorizontal: 10,
        marginTop: "2%",
        height: 40,
        marginHorizontal: 0,
        borderRadius: 50,
    },
});

export default FileInputComponent;
