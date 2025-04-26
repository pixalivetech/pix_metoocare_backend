import {Router} from 'express';
import {paymentOrder,verifyPayment }from '../controller/payment.controller';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
const router:Router=Router();



router.post('/payment', // initiate payment
    basicAuthUser,
    // checkSession,
    checkRequestBodyParams('_id'),
    paymentOrder
);

router.get('/verify', // handle payment response
    basicAuthUser,
     //checkSession
    checkQuery('orderId'),
    verifyPayment,
   
);


export default router;
