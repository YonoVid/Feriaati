import { regionCommune } from "./constants/form";

export function replacer(_key: string, value: any) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

export function reviver(_key: string, value: any) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
}

export function numberWithCommas(x: number) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(",");
}

export const saveToLocal = (key: string, value: any) =>
    localStorage.setItem(key, JSON.stringify(value, replacer));
export const getFromLocal = (key: string) =>
    JSON.parse(localStorage.getItem(key) as string, reviver);

export const getCommune = (
    key: string
): { region: number; commune: number } => {
    const returnCommune = { region: -1, commune: -1 };

    Object.entries(regionCommune).forEach(
        (value: [string, Array<[number, string]>]) => {
            const findValue = value[1].find(
                (test: [number, string]) => test[1] === key
            );
            console.log("FIND VALUE (" + value[0] + ")::", findValue);
            if (findValue && findValue != null) {
                returnCommune.region = +value[0];
                returnCommune.commune = findValue[0];
            }
        }
    );
    //If not found return error codes
    return returnCommune;
};
