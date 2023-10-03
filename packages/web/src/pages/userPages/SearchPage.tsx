import { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Link,
    Stack,
    Typography,
} from "@mui/material";

import { InstantSearch, Highlight, Hits, SearchBox } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";
import {
    Environment,
    IntegrationApiKeys,
    IntegrationCommerceCodes,
    Options,
    WebpayPlus,
} from "transbank-sdk";

import { colors } from "@feria-a-ti/common/theme/base";

import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";
import SearchResultComponent from "../../components/searchEngine/SearchResultComponent";
import { IndexType } from "@feria-a-ti/common/model/indexTypes";

const searchClient = algoliasearch(
    "88L6KTFHAN",
    "13aac81f9fd4266e778405059612bf9e"
);

const searchIndex = "dev_feriaati";

function SearchPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { authToken, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Text input
    const [searchString, setSearchString] = useState("search");
    // Form variables
    const [canSubmit, setSubmitActive] = useState(true);

    const [response, setResponse] = useState<any>();

    const onClick = async (id: string, type: IndexType) => {
        setSubmitActive(false);
        console.log("GO TO SEARCH ITEM::", id, type);

        const amount = 1000;
        const buyOrder = "1234567890";
        const sessionId = authToken + "-1234567890";
        const returnUrl = window.location.href;

        const tx = new WebpayPlus.Transaction(
            new Options(
                IntegrationCommerceCodes.WEBPAY_PLUS,
                IntegrationApiKeys.WEBPAY,
                "/api" //Environment.Integration
            )
        );
        tx.create(buyOrder, sessionId, amount, returnUrl)
            .then((newResponse) => {
                setResponse(newResponse);
                console.log(newResponse);
            })
            .finally(() => setSubmitActive(true));
    };

    function Hit(props: any) {
        return (
            <SearchResultComponent
                index={props.hit}
                canSubmit={canSubmit}
                onSubmit={onClick}
            />
        );
    }

    return (
        <>
            {type != "user" && <Navigate to="/session" replace={true} />}
            {response != undefined && response != null && (
                <form method="post" action={response.url}>
                    <input
                        type="hidden"
                        name="token_ws"
                        value={response.token}
                    />
                    <input type="submit" value="Ir a pagar" />
                </form>
            )}
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
                >
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                        <Box sx={{ flex: 1 }}>
                            <SearchBox />
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
        </>
    );
}
export default SearchPage;
