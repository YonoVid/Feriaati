export function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: "Map",
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

export function reviver(key, value) {
    if (typeof value === "object" && value !== null) {
        if (value.dataType === "Map") {
            return new Map(value.value);
        }
    }
    return value;
}

export const saveToLocal = (key, value) =>
    localStorage.setItem(key, JSON.stringify(value, replacer));
export const getFromLocal = (key) =>
    JSON.parse(localStorage.getItem(key), reviver);
