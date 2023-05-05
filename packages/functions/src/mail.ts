import * as sendGrid from "@sendgrid/mail";
//Set API Key to use service
sendGrid.setApiKey(process.env.SENDGRID_API_KEY as string);

/**
 * Function to send the verification code of a user
 * trying to register in the platform
 * @param username Name of user being created
 * @param email Email of user being created
 * @param code Verification code to activate account
 */
export const sendVerificationMail = (username: string, email: string, code: string) => {
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
        .catch((reason: any) =>
            console.log(reason, reason.body?.errors)
        );
};
