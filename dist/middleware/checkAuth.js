"use strict";
/**
 * @author Santhosh Khan K
 * @date  09-10-2023
 * @description Authentication Methods
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuthUser = void 0;
const auth = require("basic-auth");
const ErrorMessage_1 = require("../helper/ErrorMessage");
let basicAuthUser = function (req, res, next) {
    var credentials = auth(req);
    console.log('credentials', credentials);
    if (!credentials || credentials.name != process.env.basicAuthUser || credentials.pass != process.env.basicAuthKey) {
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).json({
            success: false,
            statusCode: 499,
            message: ErrorMessage_1.clientError.token.unauthRoute,
        });
    }
    else {
        next();
    }
};
exports.basicAuthUser = basicAuthUser;
//# sourceMappingURL=checkAuth.js.map