import * as sendGrid from "@sendgrid/mail";
//Set API Key to use service
//"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"
sendGrid.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Function to send the verification code of a user
 * trying to register in the platform
 * @param username Name of user being created
 * @param email Email of user being created
 * @param code Verification code to activate account
 */
export const sendVerificationMail = (
    username: string,
    email: string,
    code: string
) => {
    sendGrid
        .send({
            to: email, // Change to your recipient
            from: "feriaati@gmail.com", // Change to your verified sender
            text: "Message to register " + username,
            templateId: process.env.REGISTER_TEMPLATE_ID,
            dynamicTemplateData: {
                username: username,
                code: code,
            },
        })
        .catch((reason: any) => console.log(reason, reason.body?.errors));
};

export const sendRecoveryMail = (
    username: string,
    email: string,
    code: string
) => {
    sendGrid
        .send({
            to: email,
            from: "feriaati@gmail.com",
            text: " ",
            templateId: "d-4e7a9b52ff65492f9d702217d4e9f51d",
            dynamicTemplateData: {
                Codigo: code,
            },
        })
        .catch((reason: any) => console.log(reason, reason.body?.errors));
};
