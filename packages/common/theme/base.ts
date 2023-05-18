import { ThemeOptions } from "@mui/material/styles";

type ColorsProps = {
    primary: string;
    primaryShadow: string;
    secondary: string;
    secondaryShadow: string;
    light: string;
};

export const colors: ColorsProps = {
    primary: "#89B056",
    primaryShadow: "#405228",
    secondary: "#FFA3A3",
    secondaryShadow: "##D04E4E",
    light: "#EEEAE0",
};

export const themeOptions: ThemeOptions = {
    palette: {
        mode: "light",
        primary: {
            main: "#f97777",
            contrastText: "#fafbfa",
        },
        secondary: {
            main: "#89B056",
            contrastText: "#EEEAE0",
        },
        background: {
            default: "#f5e3cd",
            paper: "#f9f6f5",
        },
        text: {
            primary: "rgba(49,61,39,0.87)",
            secondary: "rgba(58,67,59,0.6)",
        },
    },
};
