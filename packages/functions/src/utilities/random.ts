export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const getRandomIntString = (
    max: number,
    fixedLength: boolean = true
) => {
    let number = getRandomInt(max);
    return number
        .toString()
        .padStart((fixedLength ? max : number).toString().length, "0");
};
