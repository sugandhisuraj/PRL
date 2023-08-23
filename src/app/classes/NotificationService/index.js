import firebase from 'react-native-firebase';
import { Alert, Platform } from 'react-native';
class NotificationService {
    dispatchFcm = null;
    constructor(dispatchFcm) {
        this.createNotificationChannel();
        this.dispatchFcm = dispatchFcm;
    }
    fcmToken = '';
    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    getToken = async () => {
        if (Platform.OS == 'ios') {
            firebase.messaging().ios.registerForRemoteNotifications();
        }
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            this.fcmToken = fcmToken;
            if (this.dispatchFcm) {
                this.dispatchFcm(this.fcmToken);
            }
        }
    }
    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            console.log('FCM_TOKEN_REJECTED');
        }
    }
    showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }
    createNotificationChannel = () => {
        const channel = new firebase.notifications.Android.Channel(
            'channelId',
            'Channel Name',
            firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);
    };
    registerNotifications = async () => {

        this.notificationListener = firebase.notifications().onNotification(async (notification) => {
            const { title, body } = notification;
            console.log('RUN_WHEN_LOCAL_NOTIFICATION - ', notification);
            if (Platform.OS === 'android') {

                const localNotification = new firebase.notifications.Notification({
                    sound: 'default',
                    show_in_foreground: true,
                })
                    .setNotificationId(notification.notificationId)
                    .setTitle(notification.title)
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(notification.data)
                    .android.setChannelId('channelId') // e.g. the id you chose above
                    //.android.setLargeIcon('ic_launcher_round')
                    .android.setSmallIcon('ic_launcher')
                    //.android.setColor('#000000') // you can set a color here
                    .android.setPriority(firebase.notifications.Android.Priority.High);

                firebase.notifications()
                    .displayNotification(localNotification);

            } else if (Platform.OS === 'ios') {

                const localNotification = new firebase.notifications.Notification()
                    .setNotificationId(notification.notificationId)
                    .setTitle(notification.title)
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(notification.data)
                    .ios.setBadge(notification.ios.badge);

                firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error(err));

            }
            this.showAlert(title, body);
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            console.log('NOTIFICATION_RECIEVED_HERE_2');
            this.showAlert(title, body);
        });


        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) { 
            const { title, body } = notificationOpen.notification;
            console.log('RUN_WHEN_APP_CLOSE_13 - ', notificationOpen);
            setTimeout(()=>{
                this.showAlert(notificationOpen.notification._data.title,
                    notificationOpen.notification._data.body);
            }, 1000);
            // if (Platform.OS == 'ios') {
            //     this.showAlert(title, body);
            // }
        }
        this.messageListener = firebase.messaging().onMessage((message) => {
            console.log('NOTIFICATION_RECIEVED_HERE_4');
            console.log(message);
        });
    }
}

// class DemoClass {

// }
//let NotificationServiceExp = Platform.OS == 'android' ? NotificationService : DemoClass

export default NotificationService;