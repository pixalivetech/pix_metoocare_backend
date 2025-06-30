  import { validationResult } from "express-validator";
  import { clientError, errorMessage } from "../helper/ErrorMessage";
  import { response,generateOrderNumber,generateTrackingNumber,generateInvoiceNumber,generateInvoice,getCouponAmount ,removeOrderFromUserPage,generateOrderId} from "../helper/commonResponseHandler";
  import { Order,OrderDocument } from "../model/order.model";
  import { Coupon} from "../model/coupon.model";
  import {Users} from "../model/users.model";
  import {Product,ProductDocument} from "../model/product.model";
  import {DateTime} from 'luxon'
  import { saveNotification } from "../controller/notification.controller";
  import { Cashfree } from "cashfree-pg"; 
  import * as dotenv from 'dotenv';
  // Configure Cashfree credentials
  Cashfree.XClientId = process.env.ClientId;
  Cashfree.XClientSecret = process.env.ClientSecret;
  Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;


  var activity = "Order";

  /** 
   *  @author Santhosh Khan K
   *  @date   14-10-2023
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @description This Function is used to save Order
   * */




  export let saveOrder = async (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      try {
        const orderDetails: OrderDocument = req.body;
        const { couponCode, userId } = orderDetails;

        const orderNumber = generateOrderNumber();
        orderDetails.orderNumber = orderNumber; 

        orderDetails.products.forEach(product => {
                  const trackingNumber = generateTrackingNumber();
                  product.trackingNumber = trackingNumber;
                });

        if (couponCode) {
          const existingCouponUsage = await Coupon.findOne({ userId, couponCode });

          if (existingCouponUsage) {
            if (!res.headersSent) {
          response(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, errorMessage.fieldValidation, 'Coupon code has already been used by the user');
            }
          }

          if (couponCode.length >= 4) {
            const lastFourDigits = couponCode.slice(-4);
            const discountPerProduct = parseInt(lastFourDigits) / orderDetails.products.length;

            orderDetails.products.forEach((product) => {
              product.discountedPrice -= discountPerProduct;
            });
          }
        }

        let totalPrice = orderDetails.products.reduce((total, product) => total + product.discountedPrice, 0);
        orderDetails.deliveryCharges = totalPrice >= 499 ? 0 : 50;
        orderDetails.totalAmount = totalPrice + orderDetails.deliveryCharges;

        const currentTime = DateTime.utc().setZone('Asia/Kolkata');
        orderDetails.orderPlacedOn = currentTime.toISO();
        const invoiceNumber = generateInvoiceNumber();
        orderDetails.invoiceNumber = invoiceNumber.toString();

        const invoice = await generateInvoice(orderDetails, invoiceNumber);

          // Update product quantities in the database
          for (const product of orderDetails.products) {
            const existingProduct = await Product.findById(product.productId);
    
            if (existingProduct) {
              existingProduct.quantity -= product.quantity;
              await existingProduct.save();
            }
          }

        orderDetails.products.forEach((product) => {
          product.invoice = invoice.toString();
        });

        const createData = new Order(orderDetails);
        const insertedData = await createData.save();

        if (couponCode) {
          const newCouponUsage = new Coupon({ userId, couponCode });
          await newCouponUsage.save();
        }

        if (!res.headersSent) {
          response(req, res, activity, 'Level-2', 'Save-Order', true, 200, { insertedData, invoiceNumber }, clientError.success.savedSuccessfully);
        }
      } catch (err) {
        if (!res.headersSent) {
        response(req, res, activity, 'Level-3', 'Save-Order', false, 500, {}, errorMessage.internalServer, err.message);
        }
      }
    } else {
      if (!res.headersSent) {
      response(req, res, activity, 'Level-3', 'Save-Order', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
      }
    }
  };

  /**
   *  
   *  @author Santhosh Khan K
   *  @date   14-10-2023
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @description This Function is used to get all orders
   * */

  export let getAllOrder = async (req, res, next) => {
      try{
          const orderDetails = await Order.find({isDeleted: false}).sort({modifiedOn: -1}).populate({path: 'products.panelId', select: 'companyName',}).populate({path: 'products.companyId', select: 'companyName',});
          response(req, res, activity, 'Level-2', 'Get-All-Order', true, 200, orderDetails, clientError.success.fetchedSuccessfully);
      }
      catch (err: any) {
          response(req, res, activity, 'Level-3', 'Get-All-Order', false, 500, {}, errorMessage.internalServer, err.message);
      }
  }

  /**
   * 
   * @author Santhosh Khan K
   * @date   14-10-2023
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @description This Function is used to delete order
   * */

  export let deleteOrder = async (req, res, next) => {
      try{
          let {modifiedOn,modifiedBy} = req.body;
          const order = await Order.findOneAndUpdate({ _id: req.query._id }, {
              $set: {
                  isDeleted: true,
                  modifiedOn: modifiedOn,
                  modifiedBy: modifiedBy
              }
          });
          response(req, res, activity, 'Level-2', 'Delete-Order', true, 200, order, clientError.success.deleteSuccess);
      }
      catch (err: any) {
          response(req, res, activity, 'Level-3', 'Delete-Order', false, 500, {}, errorMessage.internalServer, err.message);
      }
  }

  /**
   * 
   * @author Santhosh Khan K
   * @date   14-10-2023
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @description This Function is used to update order
   * */

  export let updateOrder = async (req, res, next) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
          try {
              const orderDetails: OrderDocument = req.body;
              const updateData = await Order.findOneAndUpdate({ _id: req.body._id }, {
                  $set: {
                      modifiedOn: orderDetails.modifiedOn,
                      modifiedBy: orderDetails.modifiedBy
                  }
              });
              response(req, res, activity, 'Level-2', 'Update-Order', true, 200, updateData, clientError.success.updateSuccess);
          }
          catch (err: any) {
              response(req, res, activity, 'Level-3', 'Update-Order', false, 500, {}, errorMessage.internalServer, err.message);
          }
      } else {
          response(req, res, activity, 'Level-3', 'Update-Order', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
      }
  }

  /**
   * 
   * @author Santhosh Khan K
   * @date   14-10-2023
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @description This Function is used to get order
   * */

  export let getSingleOrder = async (req, res, next) => {
      try{
          const orderDetails = await Order.findOne({ _id: req.query._id })
          response(req, res, activity, 'Level-2', 'Get-Order', true, 200, orderDetails, clientError.success.fetchedSuccessfully);
      }
      catch (err: any) {
          response(req, res, activity, 'Level-3', 'Get-Order', false, 500, {}, errorMessage.internalServer, err.message);
      }
  }

  /**
   * 
   * @author Santhosh Khan K
   * @date   26-10-2023
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @description This Function is used to cancel order
   * */


  export let cancelOrReturnOrder = async (req, res, next) => {

    const { orderNumber, trackingNumber, productStatus } = req.body;
  
    if (!orderNumber || !trackingNumber || !productStatus) {
      response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Please provide orderNumber, trackingNumber, and action');
      return;
    }
  
    try {
      const order = await Order.findOne({ orderNumber });
  
      if (!order) {
        response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 404, {}, errorMessage, 'Order not found');
        return;
      }
  
      const product = order.products.find((product) => product.trackingNumber === trackingNumber);
  
      if (!product) {
        response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 404, {}, errorMessage, 'Product not found');
        return;
      }
  
      // Check if the order is already canceled or returned
      if (product.productStatus === 'canceled') {
        response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Order already canceled');
        return;
      }
  
      // Perform the specified action
      if (productStatus === 'cancel') {
        if (product.canceled) {
          // If the return order is completed, disallow canceling
          response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Cannot cancel a returned order');
          return;
        } else {
          // If no return is initiated, allow direct cancellation
          product.productStatus = 'canceled';
          product.canceled = true;
        }
      } else if (productStatus === 'return') {
        // Check if the order is canceled before allowing a return
        if (product.canceled) {
          response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Cannot initiate return for a canceled order');
          return;
        }else if (product.returned) {
          response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Cannot initiate return for a returned order');
        }
        else {
          product.productStatus = 'returned';
          product.returned = true;
        }
      } else {
        response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 400, {}, errorMessage, 'Invalid action');
        return;
      }
  
      await order.save();
  
      response(req, res, activity, 'Level-3', 'Cancel-Return-Order', true, 200, order, clientError.success.updateSuccess);

    } catch (err) {

      response(req, res, activity, 'Level-3', 'Cancel-Return-Order', false, 500, {}, errorMessage.internalServer, err.message);

    }

  };


  /**
   *  
   *  @author Santhosh Khan K
   *  @date   26-10-2023
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @description This Function is used to track order
   * */

  export let trackOrderNumber = async (req, res, next) => {
      try {
        const { orderNumber } = req.body;
        const order = await Order.findOne({ orderNumber});
    
        if (!order) {
        response(req, res, activity, 'Level-3', 'Track-Order', false, 404, {}, errorMessage, 'Order not found');
        }
        response(req, res, activity, 'Level-2', 'Track-Order', true, 200, order, clientError.success.fetchedSuccessfully);
      } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Track-Order', false, 500, {}, errorMessage.internalServer, err.message);
      }
    };
    

    /**
   *  
   *  @author Santhosh Khan K
   *  @date   26-10-2023
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @description This Function is used to track order
   * */

  export let trackTrakingNumber = async (req, res, next) => {
      try {
        const { trackingNumber } = req.body;
        const order = await Order.findOne({ trackingNumber });
    
        if (!order) {
        response(req, res, activity, 'Level-3', 'Track-Order', false, 404, {}, errorMessage, 'Order not found');
        }
        response(req, res, activity, 'Level-2', 'Track-Order', true, 200, order, clientError.success.fetchedSuccessfully);
      } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Track-Order', false, 500, {}, errorMessage.internalServer, err.message);
      }
    };

    /**
   * @author Santhosh Khan K
   * @date   27-10-2023
   * @param {Object} req 
   * @param {Object} res 
   * @param {Function} next  
   * @description This Function is used to get Filtered Order
   */

  export let getFilteredOrder = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ status: 1 })
        if(req.body.panelId){
            andList.push({panelId:req.body.panelId})
        }
        if(req.body.userId){
            andList.push({userId:req.body.userId})
        }
        if (req.body.orderNumber) {
            andList.push({ orderNumber: { orderNumber: req.body.orderNumber } })
        }
        if (req.body.trackingNumber) {
            andList.push({ trackingNumber: req.body.trackingNumber })
        }
        if (req.body.orderStatus) {
            andList.push({ orderStatus: req.body.orderStatus })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const orderList = await Order.find().sort({ createdAt: -1 }).limit(limit).skip(page);
        const orderCount = await Order.find().count()
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { orderList, orderCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };


    /**
   *  
   *  @author Santhosh Khan K
   *  @date   30-10-2023
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @description This Function is used to update order status
   * */

    export const updateOrderStatus = async (req, res, next) => {
      try {
          const { orderId, newStatus } = req.body;
          const order = await Order.findOneAndUpdate(
              { 'products._id': orderId },
              { $set: { 'products.$.orderStatus': newStatus } },
              { new: true }
          );
          if (!order) {
              response(req, res, activity, 'Level-3', 'Update-Order-Status', false, 404, {}, errorMessage.internalServer, 'Order not found');
          }
          response(req, res, activity, 'Level-2', 'Update-Order-Status', true, 200, order, clientError.success.updateSuccess);
      } catch (err) {
          response(req, res, activity, 'Level-3', 'Update-Order-Status', false, 500, {}, errorMessage.internalServer, err.message);
      }
  };


    /**
   *  
   *  @author Santhosh Khan K
   *  @date   21-11-2023
   *  @param {Object} req
   *  @param {Object} res
   *  @param {Function} next
   *  @description This Function is used to update order payment status
   * */

  export let updateOrderPaymentStatus = async (req, res, next) => {
    try {
      const { orderId, newStatus } = req.body;
      const order = await Order.findByIdAndUpdate(orderId, { paymentStatus: newStatus }, { new: true });

      if (!order) {
      response(req, res, activity, 'Level-3', 'Update-Order-Payment-Status', false, 404, {}, errorMessage.internalServer, 'Order not found');
      }

      response(req, res, activity, 'Level-2', 'Update-Order-Payment-Status', true, 200, order, clientError.success.updateSuccess);
    } catch (err:any) {
      response(req, res, activity, 'Level-3', 'Update-Order-Payment-Status', false, 500, {}, errorMessage.internalServer, err.message);
    }
  };



  export const paymentOrder = async (req, res, next) => {
    try {
        const orderId = req.body._id; // Get orderId from request body

        // Fetch order details from database
        const order = await Order.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if the order amount exceeds the maximum allowed by Cashfree
        // const maxOrderAmount = 15000; // Example: Maximum order amount allowed by Cashfree
        const orderAmount = parseFloat(order.totalAmount); // Convert order amount to number
        // if (orderAmount > maxOrderAmount) {
        //     return res.status(400).json({ message: "Order amount exceeds maximum allowed" });
        // }

        const return_url = process.env.Return_Url;
       
        const paymentRequest = {
            order_amount: orderAmount, // Use orderAmount which is a number
            order_currency: "INR",
            order_id: await generateOrderId(), // Generate order ID
            customer_details: {
                customer_id: order.userId.toString(), // Convert ObjectId to string
                customer_phone: order.ShippingAddress[0].mobileNumber,
                customer_name: order.ShippingAddress[0].name,
                customer_email: order.ShippingAddress[0].email
            },
            order_meta: {
                return_url: return_url,
                // notify_url: notify_url
            },
            order_note: ""
        };

        const response = await Cashfree.PGCreateOrder("2023-08-01", paymentRequest);
       
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: "Failed to initiate payment", error: error.response.data });
    }
};
// Function to handle payment response
export const verifyPayment = async (req, res, next) => {
    try {
        const orderId = req.query.orderId;

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        const response = await Cashfree.PGOrderFetchPayments("2023-08-01", orderId);

        console.log("Response data:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error('Error handling payment response:', error);
        res.status(500).json({ message: 'Failed to handle payment response', error: error.message });
    }
};