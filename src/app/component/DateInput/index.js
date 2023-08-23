import React, { useEffect, useState, memo, useImperativeHandle, forwardRef } from 'react';
import { Text, View, TouchableOpacity, Keyboard } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Styles from './indexCss';

const DateInput = forwardRef((props, refs) => {
    const {
        onDateSet = () => { },
        title,
        onSelectedDate = '',
        maximumDate = null,
        minimumDate = null,
        firstCallCb = () => true,
        dateTextStyle = {},
        dateTouchContainer = {}
    } = props;
    const [datePickerVisibility, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(new Date());
    const [value, setValue] = useState('');
    const handleConfirm = (selectedDate) => {
        if (firstCallCb()) {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            onDateSet(moment(currentDate).format('YYYY-MM-DD'));
            var val = moment(currentDate).format('DD MMMM YYYY');
            setValue(val);
            hideDatePicker();
        } else {
            hideDatePicker();
        }

        // setTimeout(()=>{
        //     if (firstCallCb()) {

        //     }
        // }, 200);
    }
    useImperativeHandle(refs, () => ({
        reset: () => {
            setValue('');
        }
    }));
    const hideDatePicker = () => setDatePickerVisibility(false);
    useEffect(() => {
        if (onSelectedDate || onSelectedDate.length > 0) {
            console.log('ONSELECT_RECIEVE - ', onSelectedDate);
            try {
                var val = moment(onSelectedDate).format('DD MMMM YYYY');
                setValue(val);
            } catch (error) {
                console.log('INVALID_DATE - ', error);
                setValue('');
            }
        } else {
            setValue('');
        }

    }, [onSelectedDate]);
    return (
        <View>
            <TouchableOpacity
                style={[Styles.dateTouchContainer, dateTouchContainer]}
                onPress={() => {
                    Keyboard.dismiss();
                    setDatePickerVisibility(true)
                }}>
                <Text style={[Styles.textStyle, dateTextStyle]}>{value ? value : title}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={datePickerVisibility}
                value={date}
                mode={'date'}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker} 
                maximumDate={
                    maximumDate ? new Date(maximumDate) :
                        new Date(new Date().getFullYear() + 4, 11, 31)}
                minimumDate={minimumDate ? new Date(minimumDate) : new Date()}
 
            />
        </View>
    );
});
export default DateInput;