


import {
    firebase,
    notificationsCloudCollection,
    gameScheduleCollection
} from '@PRLFirebase';
let currentTm = new Date().getTime();
const notificationWelcomeTemplate = {
    data: {
        title: 'Title - Inject',
        body: 'Body - Inject', 
         
    },
    notifyTemplateName: `welcome`,
    userID: [`dqrTf2dcvTTPjeuLSGB5HeBYMhg1`],
     
    //userToken: [`dErVdeH-UDc:APA91bG-QNL8eWvpTezl6jfCbq1-wemM0fslXPivy2-BeyRMwvJprLqUalSHCOwNWvGb_q3OPbyav6U1OjCDLxdy9-m-R7CHk2GjZU0M3H3e14wpIaLT23vZluACw6yqo-hE9f_yWX7i`],
    notifyType: 'welcome',
    createdAt: new Date() 
};


class NotificationTemplates {

    welcome = () => {
        return {
            ...notificationWelcomeTemplate
        };
    }
} 

class FirebaseNotificationTriggers extends NotificationTemplates{

    sentWelcomeNotification = async (doc) => {
        const sendWelcomeNotificationResponse = await notificationsCloudCollection.add(doc);
        return sendWelcomeNotificationResponse.id;
    }

    addDataToGameSchedule = async () => {
        let data = {
            player1ID: 'dqrTf2dcvTTPjeuLSGB5HeBYMhg1',
            player2ID: '7LDnATx253RW7zEfoNb87LfJxru1' ,
            eventID:1615980125999,
            contestID: 1616862842646,
            createdAt: new Date(),
            gameDescription: 'HELLOW WORLD'

        }
        const res = await gameScheduleCollection.add(data);
        console.log("GAME_SCHEDULE_RECORD - ", res.id);
    }
}

export default new FirebaseNotificationTriggers();