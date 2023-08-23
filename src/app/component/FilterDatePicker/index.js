import React, { useEffect,memo, useState, useCallback, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Styles from './indexCss';

const TransformDate = (type, value) => {
    if(type == 'year') {
        return new Date(value).getFullYear();
    }else if(type == 'month') {
        let mon = new Date(value).getMonth()+1;
        if(mon < 10) {
            return `0${mon}`;
        }
        return mon;
    }else {
        let day = new Date(value).getDate();
        if(day < 10) {
            return `0${day}`;
        }
        return day;
    }
}
const FilterDatePicker = React.forwardRef((props, ref) => {

    const {
        renderDate = '',
        onDateSet = () => { },
        title = 'Add Title',
        containerStyle = {}
    } = props;
    const [datePickerVisibility, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(new Date());
    const [value, setValue] = useState({ date: '', month: '' });
    useImperativeHandle(ref, ()=>({
        reset: () => {
            setValue({ date: '', month: '' });
        }
    }));
    const handleConfirm = (selectedDate) => {
        switchDatePicker();
        const currentDate = selectedDate || date;
        setDate(currentDate); 
        let trndate = `${TransformDate('year', currentDate)}-${TransformDate('month', currentDate)}-${TransformDate('day', currentDate)}`;
        console.log('TRANDATE_5 -', trndate);
        let dateSet = new Date(trndate); 
        onDateSet(dateSet);
        let value = { date: '', month: '' };
        value.date = moment(currentDate).format('DD');
        value.month = moment(currentDate).format('MM');
        setValue(value);
    }
    const switchDatePicker = useCallback(() => setDatePickerVisibility(i => !i), []);
    useEffect(()=>{
        console.log('ON_RE_RENDER_DAT - ', renderDate);
        if (renderDate) {
            console.log('ONSELECT_RECIEVE - ', renderDate);
            try {
                let value = { date: '', month: '' };
                value.date = moment(renderDate).format('DD');
                value.month = moment(renderDate).format('MM');
                setValue(value);
                setDate(renderDate); 
            } catch (error) {
                console.log('INVALID_DATE - ', error);
                setValue('');
            }
        }else {
            setValue('');
        }
    }, []);
    return (
        <TouchableOpacity
            onPress={switchDatePicker}
            style={[Styles.containerStyle, containerStyle]}>
            <Text style={Styles.labelTextStyle}>
                {title}
            </Text>
            <View style={Styles.singleDateStyleContainer}>
                <Text style={Styles.dateTextStyle}>{value.date}</Text>
            </View>
            <Text style={Styles.slashTextStyle}>/</Text>
            <View style={Styles.singleDateStyleContainer}>
                <Text style={Styles.dateTextStyle}>{value.month}</Text>
            </View>
            <DateTimePickerModal
                isVisible={datePickerVisibility}
                value={date}
                mode={'date'}
                onConfirm={handleConfirm}
                onCancel={switchDatePicker}
                minimumDate={new Date(new Date().getFullYear(), 0, 1)}
                maximumDate={new Date(new Date().getFullYear(), 11, 31)}
            />
        </TouchableOpacity>
    );
});

export default memo(FilterDatePicker);
