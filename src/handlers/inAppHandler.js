export const sendInApp = async (notification) => {
  try {
    console.log(`Sending IN-APP notification to User:${notification.userId}`);
    console.log(`Title: ${notification.message.title}`);
    console.log(`Body: ${notification.message.body}`);

    // Simulate async delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    console.log('In-app notification sent successfully');
  } catch (error) {
    console.error('In-app notification failed:', error);

    notification.status = 'failed';
    notification.error = error.message;
    await notification.save();

    throw error;
  }
};
