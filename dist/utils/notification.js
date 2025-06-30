"use strict";
// notification-utils.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyUser = void 0;
const axios_1 = require("axios");
const notifyUser = async (userId, message, senderId) => {
    // Replace the following line with the actual API endpoint and key for your notification service
    const notificationApiEndpoint = 'https://your-notification-service-api.com/send';
    try {
        const notificationPayload = {
            userId,
            message,
            senderId,
        };
        // Send a POST request to the notification service
        const response = await axios_1.default.post(notificationApiEndpoint, notificationPayload);
        // Check the response and handle accordingly
        if (response.status === 200 && response.data.success) {
            console.log(`Notification sent successfully to user ${userId} from sender ${senderId}`);
        }
        else {
            console.error(`Failed to send notification: ${response.data.message}`);
        }
    }
    catch (error) {
        console.error('Error sending notification:', error.message);
        throw error; // You can handle the error according to your needs
    }
};
exports.notifyUser = notifyUser;
//# sourceMappingURL=notification.js.map