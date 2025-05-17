export const sendSMS = async (notification) => {
    try {
        console.log(`Sending SMS to User:${notification.userId}`);

        // Instead of logging the object directly:
        console.log(`Message: ${JSON.stringify(notification.message)}`);

        // Simulate async delay
        await new Promise((resolve) => setTimeout(resolve, 700));

        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();

        console.log('SMS sent successfully');
    } catch (error) {
        console.error('SMS sending failed:', error);

        notification.status = 'failed';
        notification.error = error.message;
        await notification.save();

        throw error;
    }
};
