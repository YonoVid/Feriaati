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

export const themePaperLight = {
    colors: {
        primary: "rgb(166, 56, 60)",
        onPrimary: "rgb(255, 255, 255)",
        primaryContainer: "rgb(255, 218, 216)",
        onPrimaryContainer: "rgb(65, 0, 7)",
        secondary: "rgb(69, 104, 18)",
        onSecondary: "rgb(255, 255, 255)",
        secondaryContainer: "rgb(197, 240, 139)",
        onSecondaryContainer: "rgb(16, 32, 0)",
        tertiary: "rgb(127, 86, 0)",
        onTertiary: "rgb(255, 255, 255)",
        tertiaryContainer: "rgb(255, 221, 174)",
        onTertiaryContainer: "rgb(40, 24, 0)",
        error: "rgb(186, 26, 26)",
        onError: "rgb(255, 255, 255)",
        errorContainer: "rgb(255, 218, 214)",
        onErrorContainer: "rgb(65, 0, 2)",
        background: "rgb(255, 251, 255)",
        onBackground: "rgb(32, 26, 26)",
        surface: "rgb(255, 251, 255)",
        onSurface: "rgb(32, 26, 26)",
        surfaceVariant: "rgb(244, 221, 220)",
        onSurfaceVariant: "rgb(82, 67, 66)",
        outline: "rgb(133, 115, 114)",
        outlineVariant: "rgb(215, 193, 192)",
        shadow: "rgb(0, 0, 0)",
        scrim: "rgb(0, 0, 0)",
        inverseSurface: "rgb(54, 47, 46)",
        inverseOnSurface: "rgb(251, 238, 237)",
        inversePrimary: "rgb(255, 179, 177)",
        elevation: {
            level0: "transparent",
            level1: "rgb(251, 241, 245)",
            level2: "rgb(248, 235, 239)",
            level3: "rgb(245, 230, 234)",
            level4: "rgb(244, 228, 232)",
            level5: "rgb(243, 224, 228)",
        },
        surfaceDisabled: "rgba(32, 26, 26, 0.12)",
        onSurfaceDisabled: "rgba(32, 26, 26, 0.38)",
        backdrop: "rgba(59, 45, 44, 0.4)",
    },
};
