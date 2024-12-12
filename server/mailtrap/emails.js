import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates.js"
import { mailtrapClient, sender } from './mailtrapConfig.js'

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace(
                "{verificationCode}",
                verificationToken
            ), // This replaces the "verificationCode" in the template with the Token
            category: "Email Verification",
        })
        console.log('Email sent successfully', response);
    }catch(err){
        console.error(`Error sending verification ${err}`);
        throw new Error(`Error sending verification email: ${err}`)
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "dc8d565f-6aac-42f2-9678-52f944847de4",
            template_variables: {
                "name": name
            },
    });
    console.log("Welcome email sent successfully", response);
    }catch(err){
        throw new Error(`Error sending welcome email ${err}`)
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })
    }catch(err){
        console.error(`Error sending password reset email`, err);
        throw new Error(`Error sending password reset email: `, err);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];
    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset"
        })
    }catch(err){
        console.error(`Error sending password reset success email: ${err}`);

        throw new Error(`Error sending password success email ${err}`);
    }
}