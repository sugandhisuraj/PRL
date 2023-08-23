
import {
    firebase
} from '@PRLFirebase';
 
class EmailTemplate {

    paymentConfirmation = ({
        event = 'Test',
        eventDate = 'Test',
        itemsPaidFor = 'Test',
        totalPayment = 'Test',
        userName = 'Test',
        toUids = ''
    }) => {
        return {
            ccUids: ['kmk7EOvwrcWr2zvkD9cxlkd5r8O2'],
            emailType: 'paymentConfirmation',
            template: {
                data: {
                    event: event,
                    eventDate: eventDate,
                    itemsPaidFor: itemsPaidFor,
                    totalPayment: totalPayment,
                    userName: userName,
                },
                name: "paymentConfirmation"
            },
            timestamp: firebase.firestore.Timestamp.now(),
            toUids: [toUids]
        };
    }

    feedBack = ({
        feedbackText = '',
        ccUids = ''
    }) => {
        return {
            ccUids: [ccUids],
            emailType: 'feedback',
            template: {
                data: {
                    feedbackText: feedbackText
                },
                name: "feedback"
            },
            timestamp: firebase.firestore.Timestamp.now(),
            toUids: ['kmk7EOvwrcWr2zvkD9cxlkd5r8O2']
        };
    }
}

export default EmailTemplate;