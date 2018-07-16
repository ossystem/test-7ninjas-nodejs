const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');

const Orders = require('../models/order');


const createHtmlReport = () => {
    return new Promise(async(resolve, reject) => {
        try {
            const orders = await Orders.createOrdersSet()
            let numberOfSoldProducts = 0;
            let moneyGained = 0;
            const products = [];
            orders.forEach( order => {
                numberOfSoldProducts+=order.qty;
                moneyGained += order.qty*order.product.price;
                const productObject = {
                    name: order.product.name,
                    qty: order.qty
                };

                const obj = products.find(function (obj) { return obj.name === order.product.name; });
                if ( !obj ) {
                    products.push(productObject);
                } else {
                    obj.qty+=order.qty;
                }
            });
            const maxProductSold = products.reduce(function(prev, current) {
                return (prev.qty > current.qty) ? prev : current
            });
            console.log(maxProductSold);
            resolve(`
                Number of sold products ${numberOfSoldProducts} pcs.</br> 
                Money gained ${moneyGained} ninjollars</br>
                Product which was best selling  yesterday ${maxProductSold.name}
            `)
        } catch (err) {
            reject(err);
        }
        
    });
}

const createPdfReport = (html) => {
    return new Promise( async(resolve, reject) => {
        const options = { format: 'Letter' };
        try {
            const folder = path.join(__dirname, '..', 'reports');
            const fileName = `report_${Date.now()}.pdf`;
            pdf.create(html, options).toFile(`${folder}/${fileName}`, (err, res) => {
                if (err) {
                    return reject(err)
                }
                resolve(fileName)
            });
        } catch (error) {
            console.log(error);
            reject(error);
        }
        
    });  
};

module.exports = {
    verifyToken: (req, res, next) => {
        const bearer = req.headers['authorization'];
        if (!bearer) return next('forbidden');
        const token = bearer.split(' ')[1];
        if (!token) return next('forbidden');
        req.token = token;
        jwt.verify(req.token, 'secret_key', (err, userData) => {
            if (err) return next(err.message);
            next();
        });
    },

    sendMailToCustomer: (product, price, userEmail, userName) => {
        nodemailer.createTestAccount((err, account) => {
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, 
                auth: {
                    user: account.user, 
                    pass: account.pass 
                }
            });
            const html = `<b>Hello ${userName}!</b></br> You have bought a ${product} for ${price} ninjollars`
            const mailOptions = {
                from: 'test_project_service@gmail.com', 
                to: userEmail, 
                subject: 'List of orders',  
                html
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        });    
     },

    sendMailToAdmin: async() => {
        try {
            const html = await createHtmlReport();
            const fileName = await createPdfReport(html);
            const filePath = path.join(__dirname, '..', 'reports', fileName);
        
            nodemailer.createTestAccount((err, account) => {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false, 
                    auth: {
                        user: account.user, 
                        pass: account.pass 
                    }
                });
                const html = ''
                const mailOptions = {
                    from: 'test_project_service@gmail.com', 
                    to: 'admin_test_project@gmail.com', 
                    subject: 'Orders report',  
                    html,
                    attachments: [
                        {
                            fileName,
                            path: filePath
                        }
                    ]
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            });
        } catch (error) {
           console.log(error)
        }
         
    }
};