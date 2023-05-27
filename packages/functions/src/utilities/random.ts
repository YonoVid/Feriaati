export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const getRandomIntString = (
    max: number,
    fixedLength: boolean = true
) => {
    let number = getRandomInt(999999);
    return number
        .toString()
        .padStart((fixedLength ? number : max).toString().length, "0");
};
