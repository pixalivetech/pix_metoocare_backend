"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderId = exports.sentEmail = exports.getDoctorEmailAddress = exports.getUserEmailAddress = exports.removeOrderFromUserPage = exports.generateCouponCode = exports.generateTicketNumber = exports.getCouponAmount = exports.notifyDoctor = exports.generateTrackingNumber = exports.generateInvoiceNumber = exports.generateInvoice = exports.generateOrderNumber = exports.sendReferralCode = exports.sendEmailOtp = exports.sendOtp = exports.generate = exports.sendEmail = exports.response = void 0;
const logs_controller_1 = require("../controller/logs.controller");
const logs_model_1 = require("../model/logs.model");
var nodemailer = require('nodemailer');
const axios_1 = require("axios");
const doctor_model_1 = require("../model/doctor.model");
const users_model_1 = require("../model/users.model");
const crypto = require("crypto"); // Use * as to import the entire crypto module
/**
 * @param res {Function} Response
 * @param success {Boolean} Http Status Code for the response
 * @param result {Object/Array} Result for the Response
 * @param message {string} Primary message for the response
 * @param extendedMessage {Object} Detailed Message for the error Message
 * @function commonResponse {Function} Used for Handling the Common Response
 **/
let response = function (req, res, activity, level, method, success, statusCode, result, message, extendedMessage) {
    const LogsData = new logs_model_1.Logs();
    let date = new Date();
    LogsData.activity = activity;
    var trusted_proxies = ['177.144.11.100', '177.144.11.101'];
    LogsData.userId = (req.body.loginId) ? req.body.loginId : '';
    LogsData.url = req.baseurl;
    LogsData.time = date.getTime();
    LogsData.date = date;
    LogsData.level = level;
    LogsData.description = message;
    LogsData.method = method;
    LogsData.processStatus = (statusCode === 200) ? true : false;
    (0, logs_controller_1.saveLog)(LogsData);
    res.status(statusCode);
    return res.json({
        success: success,
        result: result || '',
        message: message || '',
        extendedMessage: extendedMessage || '',
        statusCode: statusCode
    });
};
exports.response = response;
const sendEmail = async (req, email, subject, text) => {
    var sender = nodemailer.createTransport({
        service: 'outlook',
        port: 587, //587
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@Pixalive.me',
            pass: 'Pale2468'
        }
    });
    var composemail = {
        from: 'info@Pixalive.me',
        to: email,
        subject: subject,
        text: text
    };
    await sender.sendMail(composemail, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Mail send successfully' + info.response);
        }
    });
};
exports.sendEmail = sendEmail;
/**
 * @author Santhosh Khan K
 * @date 09-10-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to generate random code
 */
function generate(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}
exports.generate = generate;
/**
* @author Santhosh Khan K
* @date 09-10-2023
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @description This Function is used to send otp on user registration
*/
const sendOtp = async (mobileNumber, otp) => {
    const url = 'https://2factor.in/API/V1/2372fa0e-5edd-11eb-8153-0200cd936042/SMS/+91' + mobileNumber + '/' + otp;
    try {
        const response = await axios_1.default.get(url);
    }
    catch (exception) {
        process.stderr.write(`ERROR received from ${url}: ${exception}\n`);
    }
};
exports.sendOtp = sendOtp;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kaaviyan98@gmail.com',
        pass: 'owxfvclfwqwdlhpf',
    },
});
let sendEmailOtp = async (email, otp) => {
    if (!email) {
        throw new Error("email is not register");
    }
    const mailOptions = {
        from: 'pixalivetech@gmail.com',
        to: email,
        subject: 'Email Verification OTP',
        text: `Your verification OTP: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendEmailOtp = sendEmailOtp;
let sendReferralCode = async (email, referralCode) => {
    if (!email) {
        throw new Error("email is not register");
    }
    const mailOptions = {
        from: 'pixaliveadearns@gmail.com',
        to: email,
        subject: 'join with us',
        text: `use my referral code: ${referralCode}`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendReferralCode = sendReferralCode;
/**
*
*  @author Santhosh Khan K
*  @date   25-10-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to generate order number
* */
function generateOrderNumber() {
    const timestampPart = Date.now().toString(36).slice(-6).toUpperCase(); // Generate a timestamp-based part of the order number    
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Generate a random part of the order number
    const orderNumber = `ORD-${timestampPart}-${randomPart}`; // Combine the timestamp and random parts with a prefix
    return orderNumber;
}
exports.generateOrderNumber = generateOrderNumber;
/**
*
*  @author Santhosh Khan K
*  @date   09-12-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to generate invoice
* */
async function generateInvoice(orderDetails, invoiceNumber) {
    let invoiceContent = 'Invoice\n\n';
    invoiceContent += 'Products:\n';
    for (const product of orderDetails.products) {
        invoiceContent += `- ${product.name} x ${product.quantity}: $${product.discountedPrice * product.quantity}\n`;
    }
    const total = orderDetails.products.reduce((acc, product) => acc + product.discountedPrice * product.quantity, 0);
    invoiceContent += `\nTotal: $${total}`;
    const pdfFilePath = await generatePDFInvoice(invoiceContent);
    return pdfFilePath;
}
exports.generateInvoice = generateInvoice;
async function generatePDFInvoice(content) {
    const pdfFilePath = 'path_to_generated_invoice.pdf'; // Replace with actual file path
    return pdfFilePath;
}
/**
*
*  @author Santhosh Khan K
*  @date   12-12-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to generate invoice number
* */
function generateInvoiceNumber() {
    const invoicePrefix = 'INV';
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    const timestamp = Date.now();
    return `${invoicePrefix}-${timestamp}-${randomNumber}`;
}
exports.generateInvoiceNumber = generateInvoiceNumber;
/**
 *
 *  @author Santhosh Khan K
 *  @date   27-10-2023
 *  @param {Object} req
 *  @param {Object} res
 *  @param {Function} next
 *  @description This Function is used to generate tracking number
 * */
function generateTrackingNumber() {
    // You can use a combination of timestamps, random numbers, or other unique identifiers
    // Here's a basic example using a timestamp and a random number
    const timestamp = Date.now().toString(); // Get current timestamp
    const randomNum = Math.floor(Math.random() * 1000); // Generate a random number
    return `TN-${timestamp}-${randomNum}`;
}
exports.generateTrackingNumber = generateTrackingNumber;
/**
*
*  @author Santhosh Khan K
*  @date   27-11-2023
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to notify doctor
* */
const notifyDoctor = async (doctor, question, userId) => {
    try {
        await axios_1.default.post(`DOCTOR_API_ENDPOINT/${doctor.doctorId}/notify`, {
            question,
            userId,
        });
        console.log(`Notifying Doctor ${doctor.doctorName} about the new question.`);
    }
    catch (error) {
        console.error(`Failed to notify Doctor ${doctor.doctorName}:`, error);
        throw new Error(`Failed to notify Doctor ${doctor.doctorName}: ${error.message}`);
    }
};
exports.notifyDoctor = notifyDoctor;
async function getCouponAmount(couponCode) {
    try {
        const response = await axios_1.default.get(`https://yourapi.com/coupons/${couponCode}`);
        const couponDetails = response.data;
        if (couponDetails && couponDetails.discountAmount) {
            return couponDetails.discountAmount;
        }
        else {
            return 0;
        }
    }
    catch (error) {
        console.error('Error fetching coupon details:', error);
        throw new Error('Unable to fetch coupon details');
    }
}
exports.getCouponAmount = getCouponAmount;
/**
*
*  @author Santhosh Khan K
*  @date   03-01-2024
*  @param {Object} req
*  @param {Object} res
*  @param {Function} next
*  @description This Function is used to generate ticket number
* */
let ticketCounter = 1;
function generateTicketNumber() {
    const ticketNumber = `pix-${padNumber(ticketCounter, 3)}`;
    ticketCounter++;
    return ticketNumber;
}
exports.generateTicketNumber = generateTicketNumber;
function padNumber(number, length) {
    let str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
/**
 * @author Santhosh Khan K
 * @date   04-12-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to generate coupon code.
 */
const generateCouponCode = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const offerAmount = Math.floor(Math.random() * (30 - 10 + 1)) + 10; // Random number between 10 and 30
    const couponCode = `OFFER_${year}${month}${day}_${offerAmount}RS`; // Example: OFFER_20231214_20RS
    return couponCode;
};
exports.generateCouponCode = generateCouponCode;
function removeOrderFromUserPage(order) {
    // Implement logic to remove order from user's page here
    // This function will depend on how orders are managed in your application
    // For instance, if orders are stored in a database or cache, you'll remove it from there
    console.log('Removing order from user page:', order._id);
}
exports.removeOrderFromUserPage = removeOrderFromUserPage;
async function getUserEmailAddress(userId) {
    // Your logic to retrieve user email address based on userId
    // Example: Assuming you have a User model with an email field
    const user = await users_model_1.Users.findById(userId);
    return user.email;
}
exports.getUserEmailAddress = getUserEmailAddress;
// Function to retrieve doctor email address based on doctorId
async function getDoctorEmailAddress(doctorId) {
    // Your logic to retrieve doctor email address based on doctorId
    // Example: Assuming you have a Doctor model with an email field
    const doctor = await doctor_model_1.Doctor.findById(doctorId);
    return doctor.email;
}
exports.getDoctorEmailAddress = getDoctorEmailAddress;
// Function to send email using nodemailer
async function sentEmail(to, subject, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pixaliveadearns@gmail.com',
            pass: 'tcqkdycouumvjrac',
        }
    });
    const mailOptions = {
        from: 'pixaliveadearns@gmail.com',
        to,
        subject,
        text: message,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    }
    catch (error) {
        console.error(`Error sending email to ${to}: ${error.message}`);
        throw error;
    }
}
exports.sentEmail = sentEmail;
async function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.substr(0, 12);
}
exports.generateOrderId = generateOrderId;
//# sourceMappingURL=commonResponseHandler.js.map