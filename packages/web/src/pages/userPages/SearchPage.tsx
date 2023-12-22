import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
    Box,
    Card,
    Divider,
    Drawer,
    IconButton,
    Stack,
    styled,
    useTheme,
} from "@mui/material";

import { InstantSearch, Hits } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import algoliaInsights from "search-insights";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { IndexType } from "@feria-a-ti/common/model/indexTypes";

import SearchResultComponent from "@feria-a-ti/web/src/components/searchEngine/SearchResultComponent";
import CustomSearchBoxComponent from "@feria-a-ti/web/src/components/searchEngine/CustomSearchBoxComponent";
import CustomRangeSliderComponent from "@feria-a-ti/web/src/components/searchEngine/CustomRangeSliderComponent";
import CustomRefinementListComponent from "@feria-a-ti/web/src/components/searchEngine/CustomRefinementListComponent";
import CustomMenuSelectComponent from "@feria-a-ti/web/src/components/searchEngine/CustomMenuSelectComponent";

import { UserContext } from "@feria-a-ti/web/src/App";

import "../../App.css";

const searchClient = algoliasearch(
    "88L6KTFHAN",
    "13aac81f9fd4266e778405059612bf9e"
);

const searchIndex = "dev_feriaati";

const drawerWidthPercentage = 25;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
    open?: boolean;
}>(({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `${drawerWidthPercentage}%`,
    ...(!open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
}));

function SearchPage() {
    //Global UI context
    //const { setMessage } = useHeaderContext();
    //Global state variable
    const { authUser, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Theme reference
    const theme = useTheme();
    // Form variables
    const [canSubmit, setSubmitActive] = useState(true);

    const [open, setOpen] = useState(true);

    const handleDrawerState = (state = false) => {
        setOpen(state);
    };

    useEffect(() => {
        console.log("Start up");
        if (authUser != undefined) {
            console.log("init algolia insights");
            algoliaInsights("init", {
                appId: "88L6KTFHAN",
                apiKey: "13aac81f9fd4266e778405059612bf9e",
                userToken: authUser,
            });
        }
    }, [authUser]);

    const onClick = async (id: string, type: IndexType) => {
        setSubmitActive(false);
        console.log("GO TO SEARCH ITEM::", id, type);
        navigate("/productVendor", { state: { vendorId: id } });
    };

    function Hit(props: any) {
        return (
            <SearchResultComponent
                index={props.hit}
                canSubmit={canSubmit}
                onSubmit={(id: string, type: IndexType) => {
                    props.sendEvent("click", props.hit, "Hit Clicked");
                    onClick(id, type);
                }}
            />
        );
    }

    return (
        <>
            {type != "user" && <Navigate to="/session" replace={true} />}
            <Main open={open}>
                <Card
                    className="inputContainer"
                    color="primary"
                    sx={{
                        maxWidth: "80%",
                        alignContent: "center",
                        borderRadius: "2%",
                    }}
                >
                    <InstantSearch
                        indexName={searchIndex}
                        searchClient={searchClient}
                        future={{
                            preserveSharedStateOnUnmount: true,
                        }}
                        insights={true}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Drawer
                                variant="persistent"
                                sx={{
                                    width: `${drawerWidthPercentage}%`,
                                    flexShrink: 0,
                                    [`& .MuiDrawer-paper`]: {
                                        width: `${drawerWidthPercentage}%`,
                                        boxSizing: "border-box",
                                    },
                                }}
                                open={open}
                            >
                                <DrawerHeader
                                    sx={{
                                        height: "20vh",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        marginTop: "5%",
                                    }}
                                >
                                    <h2>Filtros</h2>
                                    <IconButton
                                        sx={{ flex: 1, width: "100%" }}
                                        onClick={() =>
                                            handleDrawerState(
                                                theme.direction === "ltr"
                                                    ? false
                                                    : true
                                            )
                                        }
                                    >
                                        {theme.direction === "ltr" ? (
                                            <ChevronLeftIcon />
                                        ) : (
                                            <ChevronRightIcon />
                                        )}
                                    </IconButton>
                                </DrawerHeader>
                                <Box sx={{ maxWidth: "100%" }}>
                                    <CustomRefinementListComponent attribute="type" />
                                    <Divider />
                                    <CustomRangeSliderComponent
                                        attribute={"price"}
                                    />
                                    <Divider />
                                    <CustomMenuSelectComponent
                                        attribute={"region"}
                                        type={"region"}
                                    />
                                    <Divider />
                                    <CustomMenuSelectComponent
                                        attribute={"commune"}
                                        type={"commune"}
                                    />
                                </Box>
                            </Drawer>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ flex: 1 }}>
                                <CustomSearchBoxComponent
                                    filterMenu={() => handleDrawerState(true)}
                                />
                            </Box>
                            <Stack
                                direction={"column"}
                                spacing={{ xs: 1, sm: 2, md: 4 }}
                                sx={{
                                    display: "flex",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    justifyContent: "center",
                                    alignContent: "center",
                                }}
                            >
                                <Hits hitComponent={Hit} />
                            </Stack>
                        </Box>
                    </InstantSearch>
                </Card>
            </Main>
        </>
    );
}
export default SearchPage;
