import React, {useState} from 'react';
import Spinner from 'react-native-loading-spinner-overlay';


const useLoader = () => {
    const [loader, setLoader] = useState(false);

    const Loader = () => {
        return (
            <Spinner visible={loader} />
        );
    }
    return  [
        setLoader,
        Loader
    ]
}

export default useLoader;