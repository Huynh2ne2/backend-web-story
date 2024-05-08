import express from "express";
import bodyParser from "body-parser";//hỗ trợ lấy các tham số từ client
// /user?id=7 để lấy được số 7 ra thì bắt buộc phải dùng thư viện body-parser
import connectDB from "./config/connectDB";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
// require('dotenv').config({path: './src/.env'});//giúp nó khai báo dotenv để chạy dòng "let port = process.env.PORT || 6969;"
import cors from 'cors';
import { configloginwithGoogle } from '../src/controllers/social/googleController';

// import PayOS from '@payos/node';
require('dotenv').config('.env')
//Nếu để file .env thì không cần khai báo path còn nếu nằm trong thư mục nào thì cần phải truyền đường path

// let payos = new PayOS('client_id', 'api-key', 'checksum-key');
let app = express();
app.use(cors({ origin: true }));

//config app

app.use(bodyParser.json({ limit: '200tb' }));
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRoutes(app);

connectDB();
configloginwithGoogle();

let port = process.env.PORT || 6969;
//Port == underfined => port = 6969

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port)
})

// app.post('/create-payment-link', async (req, res) => {
//     const order = {
//         amount: 10000,
//         description: 'Mì tôm',
//         orderCode: 10,
//         returnUrl: `${process.env.PORT} / success.html}`,
//         cancelUrl: `${process.env.PORT} / cancel.html}`,
//     }
//     const paymentLink = await payos.createPaymentLink(order);
//     res.redirect(303, paymentLink.checkoutUrl);
// })
