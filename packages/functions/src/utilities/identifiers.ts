export const generateContributorIdentifier = (data: {
    first: string;
    second: string;
    index?: number;
}): { user: string; identifier: string; password: string } => {
    const { first, second, index } = data;
    const name = first.trim().toLowerCase().split(" ");
    const surname = second.trim().toLowerCase().split(" ");
    let identifier = "";
    for (let i = 0; i < name.length; i++) {
        if (i != 0) {
            identifier += name[i]
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .charAt(0);
        } else {
            identifier +=
                name[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "_";
        }
    }

    for (let e = 0; e < surname.length; e++) {
        identifier += surname[e]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .charAt(0);
    }

    if (index != undefined && index != null && index != 0) {
        identifier += index.toString().padStart(2, "0");
    }

    return {
        user: identifier,
        identifier: identifier + "@feriaati.cl",
        password: (identifier + "0").padEnd(10, "0"),
    };
};
