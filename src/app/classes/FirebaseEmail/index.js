import {
    emailSentCollection
} from '@PRLFirebase';
import EmailTemplates from './templates';

class FirebaseEmail extends EmailTemplates {


    sendMail = async (template) => {
        const sendMailResponse = await emailSentCollection.add(template);
        return sendMailResponse;
    }
}

export default new FirebaseEmail();

/*

const res = await emailSentCollection.add(
      {
        ccUids: ['kmk7EOvwrcWr2zvkD9cxlkd5r8O2'],
        emailType: 'PaymentConfirmation',
        template: {
          data: {
            event: 'Test Event',
            eventDate: '12/10/2021',
            itemsPaidFor: 'Demo Test',
            totalPayment: '1100',
            userName: 'Suraj Sugandhi'
          },
          name: "PaymentConfirmation"
        },
        timestamp: firebase.firestore.Timestamp.now(),
        toUids: ['Oe6IfjePvGb5Sy89m3ZTPwq9oHh1']
      }
    );
    console.log('ADDED - ', res.id);
  }
  */