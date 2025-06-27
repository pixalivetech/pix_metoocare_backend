
import { generateOrderId} from "../helper/commonResponseHandler";
import { Order,OrderDocument } from "../model/order.model";
import { Cashfree } from "cashfree-pg"; 
import {PaymentOrder,PaymentDocument} from "../model/payment.model";

 Cashfree.XClientId = process.env.ClientId1;
  Cashfree.XClientSecret = process.env.ClientSecret1;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;


var activity = "Payment";


export const paymentOrder = async (req, res, next) => {
    try {
      const orderId = req.body._id;
      const order = await Order.findOne({ _id: orderId });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      const orderAmount = parseFloat(order.totalAmount);
      const return_url = process.env.Return_Url1;
  
      const paymentRequest = {
        order_amount: orderAmount,
        order_currency: "INR",
        order_id: await generateOrderId(),
        customer_details: {
          customer_id: order.userId.toString(),
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
  
      const newPaymentOrder = new PaymentOrder({
        orderId,
        orderAmount,
        orderCurrency: "INR",
        customerId: order.userId.toString(),
        customerPhone: order.ShippingAddress[0].mobileNumber,
        customerName: order.ShippingAddress[0].name,
        customerEmail: order.ShippingAddress[0].email,
        returnUrl: return_url,
        orderNote: ""
      });
  
      await newPaymentOrder.save();
      res.json(response.data);
    } catch (error) {
      console.error("Error initiating payment:", error);
      res.status(500).json({ message: "Failed to initiate payment", error: error.message });
    }
  };
  
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