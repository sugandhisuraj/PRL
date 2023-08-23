import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardStatus = () => {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const handler = status => setIsKeyboardOpen(status);
    useEffect(() => {
        let keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => handler(true));
        let keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => handler(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }
    }, []);

    return isKeyboardOpen;
}

export default useKeyboardStatus;