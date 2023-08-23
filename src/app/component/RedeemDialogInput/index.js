import React, { forwardRef, Fragment, memo, useCallback, useImperativeHandle, useState } from 'react';
import DialogInput from 'react-native-dialog-input';


const RedeemDialogInput = forwardRef((props, ref) => {
    const { 
        title = 'Redeem Event',
        message = 'Enter Your Invite code for unlock the Event',
        hintInput = 'Invite Code',
        submitInput = () => { },
        closeDialog = () => { }
    } = props;
    const [dialogVisible, setIsDialogVisible] = useState(false);
    const switchDialog = useCallback(() => setIsDialogVisible(s=>!s), []);
    useImperativeHandle(ref, () => ({
        showDialog: () => {
            switchDialog();
        }
    }));
    const switchMode = (mode, text) => {
        switchDialog();
        if (mode) {
            submitInput(text);
        }else {
            closeDialog();
        }
    }
    return (
        <Fragment>
            <DialogInput
                isDialogVisible={dialogVisible}
                title={title} 
                message={message}
                hintInput={hintInput}
                submitInput={(i) => switchMode(true,i)}
                closeDialog={() => switchMode(false)}>
            </DialogInput>
        </Fragment>
    );
});

export default (RedeemDialogInput);