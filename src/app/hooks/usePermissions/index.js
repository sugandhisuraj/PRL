import Store from '@store';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Permissions, { PERMISSIONS, request, requestMultiple, requestNotifications, RESULTS } from 'react-native-permissions';

let listeners = [];
class PermissionModel {
    permissions = {}
    permissionAccessibility = [];
    constructor() {
        this.permissionAccessibility = [
            {
                title: 'Mic',
                value: ''
            },
            {
                title: 'Camera',
                value: ''
            },
            {
                title: 'Notifications',
                value: ''
            }
        ]
    }
    init = (auth) => {
        this.permissions = auth.userCol.permissions;
        return { ...this };
    }
    onPermissionChangeToValue = (index, value) => {
        let newPermissionAcc = [...this.permissionAccessibility];
        newPermissionAcc[index].value = value;
        this.permissionAccessibility = newPermissionAcc;
        return { ...this };
    }
}
const usePermissions = () => {

    const [permissions, setPermissions] = useState(() => new PermissionModel());
    
    useEffect(() => {
        setPermissions(permissions.init(Store.getState().auth));
    }, [Store.getState().auth]);

    const cameraPerm = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
    const microphonePerm = Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.MICROPHONE;

    useEffect(() => {
        Permissions.checkMultiple([cameraPerm, microphonePerm])
        .then(response => {
            console.log("camera, mic permissions => ", response);
            setPermissions(permissions.onPermissionChangeToValue(0, response[microphonePerm]).onPermissionChangeToValue(1, response[cameraPerm]));
        });

        Permissions.checkNotifications().then(({status, settings}) => {
            console.log("notification status => ", status);
            setPermissions(permissions.onPermissionChangeToValue(2, status));
        })
    }, []);

    const requestPermission = (index) => {
        if (index === 0) {
            request(microphonePerm).then(result => {
                console.log("request microphone result => ", result);
                setPermissions(permissions.onPermissionChangeToValue(0, result));
            });
        } else if (index === 1) {
            request(cameraPerm).then(result => {
                console.log("request camera result => ", result);
                setPermissions(permissions.onPermissionChangeToValue(1, result));
            });
        } else if (index === 2) {
            requestNotifications(['alert', 'badge', 'sound']).then(({status, settings}) => {
                setPermissions(permissions.onPermissionChangeToValue(2, status));
            })
        }
    }

    return {
        ...permissions,
        requestPermission
    };
}

export default usePermissions;