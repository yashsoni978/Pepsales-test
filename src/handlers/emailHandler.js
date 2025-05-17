export const sendEmail = async (notification) => {
    try {
        
        console.log(`📧 Sending EMAIL to User:${notification.userId}`);
        console.log(`Subject: ${notification.message.subject || 'Notification'}`);
        console.log(`Message: ${typeof notification.message === 'string' ? notification.message : JSON.stringify(notification.message, null, 2)}`);

        notification.status = 'sent';
        notification.sentAt = new Date();
        await notification.save();

        console.log('✅ Email sent successfully');
    } catch (error) {
        console.error('❌ Email sending failed:', error);

        
        notification.status = 'failed';
        notification.error = error.message;
        await notification.save();

        
        throw error;
    }
};
