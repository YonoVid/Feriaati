export function replacer(key: string, value: any) {
    console.log(key);
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

export function reviver(key: string, value: any) {
    console.log(key);
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
