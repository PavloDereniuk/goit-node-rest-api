import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const {META_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "kapitoshkooo@meta.ua",
        pass: META_PASSWORD
    }
}

const transport = nodemailer.createTransport(nodemailerConfig);

const standartEmail = {
    to: "yogaw58928@fkcod.com",
    from: "kapitoshkooo@meta.ua",
    subject: "Test email",
    html: "<p><strong>Test email</strong> from locatlhost:3000</p>"
};



export { transport, standartEmail };

