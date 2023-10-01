import { useContext, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";

import { Button, Link } from "@mui/material";

import { InstantSearch, Highlight, Hits, SearchBox } from "react-instantsearch";
import algoliasearch from "algoliasearch/lite";

import { functions } from "@feria-a-ti/common/firebase";
import {
    ResponseData,
    UserToken,
} from "@feria-a-ti/common/model/functionsTypes";
import { UserContext } from "@feria-a-ti/web/src/App";

import { useHeaderContext } from "../HeaderLayout";
import "../../App.css";

const searchClient = algoliasearch(
    "88L6KTFHAN",
    "13aac81f9fd4266e778405059612bf9e"
);

const searchIndex = "dev_feriaati";

function SearchPage() {
    //Global UI context
    const { setMessage } = useHeaderContext();
    //Global state variable
    const { setSession, type } = useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();
    // Text input
    const [searchString, setSearchString] = useState("search");
    // Form variables
    const [canSubmit, setSubmitActive] = useState(true);

    const onSubmit = (data: FieldValues) => {
        setSubmitActive(false);
        console.log("SUBMIT FORM");
        const formatedData: any = {
            text: searchString,
        };
        const check = true;
        if (check) {
            const search = httpsCallable(functions, "searchTest");
            search(formatedData)
                .then((result) => {
                    const { msg, error, extra } =
                        result.data as ResponseData<UserToken>;
                    console.log(result);
                    setSubmitActive(true);
                    //setIsLogged(result.data as any);
                    if (msg !== "") {
                        setMessage({ msg, isError: error });
                    }
                })
                .finally(() => setSubmitActive(true));
        }
    };

    function Hit(props: any) {
        return (
            <div>
                <img src={props.hit.image} alt={props.hit.name} />
                <div className="hit-name">
                    <Highlight attribute="name" hit={props.hit} />
                </div>
                <div className="hit-description">
                    <Highlight attribute="description" hit={props.hit} />
                </div>
                <div className="hit-price">${props.hit.price}</div>
            </div>
        );
    }

    return (
        <>
            {type != "user" && <Navigate to="/session" replace={true} />}
            <Button onClick={onSubmit}>Prueba</Button>
            <div className="ais-InstantSearch">
                <h1>React InstantSearch e-commerce demo</h1>
                <InstantSearch
                    indexName={searchIndex}
                    searchClient={searchClient}
                >
                    <div className="right-panel">
                        <SearchBox />
                        <Hits hitComponent={Hit} />
                    </div>
                </InstantSearch>
            </div>
        </>
    );
}
export default SearchPage;
