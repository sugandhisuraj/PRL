// import {NavigationActions} from 'react-navigation';
// import React from 'react';

let DRAWERNAV;

function setDrawerNav(navigatorRef) {
    console.log("NAV_REF - ", navigatorRef);
    DRAWERNAV = navigatorRef;
}

// function navigate(routeName, params) {
//   navigator.navigate(routeName, params);
// }

// add other navigation functions that you need and export them

export {DRAWERNAV, setDrawerNav};