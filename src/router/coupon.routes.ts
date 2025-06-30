import { Router } from "express";
import { createCoupon,useCoupon,applyCoupon} from "../controller/coupon.controller";
import { checkRequestBodyParams, checkQuery } from "../middleware/Validators";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
const router: Router = Router();



router.post('/createCoupon', // create chat message for user
    basicAuthUser, 
    checkSession,
    checkQuery('companyId'), 
    createCoupon
);

router.post('/applyCoupon',
    basicAuthUser,
    checkSession,
    applyCoupon
);

router.post('/useCoupon', 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('code'),
    checkRequestBodyParams('userId'),
    useCoupon
    );


export default router;