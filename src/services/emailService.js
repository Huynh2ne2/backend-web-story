require('dotenv').config();
// const nodemailer = require("nodemailer");

import nodemailer from 'nodemailer';

let myCustomMethod = async (ctx) => {
    let cmd = await ctx.sendCommand(
        'AUTH PLAIN ' +
        Buffer.from(
            '\u0000' + ctx.auth.credentials.user + '\u0000' + ctx.auth.credentials.pass,
            'utf-8'
        ).toString('base64')
    );

    if (cmd.status < 200 || cmd.status >= 300) {
        throw new Error('Failed to authenticate user: ' + cmd.text);
    }
}


let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // use TLS
        auth: {
            type: 'custom',
            method: 'MY-CUSTOM-METHOD',
            user: 'danghuynh1526@gmail.com',
            pass: "zxsh ynxp bdzb zusr"
            // user: process.env.EMAIL_APP,
            // pass: process.env.EMAIL_APP_PASSWORD,
        },
        customAuth: {
            'MY-CUSTOM-METHOD': myCustomMethod
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    let info = await transporter.sendMail({
        from: '"Huỳnh nè 👻" <danghuynh1526@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Xác nhân email thay đổi password", // Subject line
        // html: getBodyHTMLEmail(dataSend),
        html: `
        <p>Click vào link bên dưới để xác thực email</p>
        <div>
        <a href="${dataSend.redirectLink}" target="_blank">Verify</a>
        </div>`
    });

}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Thay đổi password !</h3>
       <p>Vui lòng click vào đường link phía dưới để xác thực email</p> 
        
       <div>
       <a href="${dataSend.redirectLink}" target="_blank">Xác thực</a>
       </div>
        `
    }
    if (dataSend.language === 'en') {
        result = result = `
        <h3>Change password!</h3>
        <p>Please click on the link below to verify email</p>
        <div>
       <a href="${dataSend.redirectLink}" target="_blank">Verify</a>
       </div>
        `

    }
    return result;
}




module.exports = {
    sendSimpleEmail, getBodyHTMLEmail,
    myCustomMethod: myCustomMethod
}