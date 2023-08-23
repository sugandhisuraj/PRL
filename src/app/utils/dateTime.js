import moment from 'moment';

export const getFromToDate = (from, to) => {
    let fromm = new Date(from);
    let too = new Date(to);
    let fromDate =  moment(fromm).format('MMM DD');
    let toDate = moment(too).format('MMM DD');
    console.log(toDate);
    if(toDate == 'Invalid date' || fromDate == 'Invalid date') {
        return '';
    }
     
    return `From ${fromDate} To ${toDate}`;
}