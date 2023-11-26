import algoliaInsights from "search-insights";

export const initAlgoliaInsights = (userId: string) => {
    algoliaInsights("init", {
        appId: "88L6KTFHAN",
        apiKey: "13aac81f9fd4266e778405059612bf9e",
        userToken: userId,
    });
};
