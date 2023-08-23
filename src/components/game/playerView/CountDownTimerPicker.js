import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text
} from "react-native";
import SoundPlayer from 'react-native-sound-player';
import AudioSession from 'react-native-audio-session';

const CountDownTimerPicker = (props) => {

    const [direction, setDirection] = useState(props.direction ?? 0);
    const [start, setStart] = useState(props.startValue);
    const [timer, setTimer] = useState('');
    const [timeDetailsValue, setTimeDetailsValue] = useState('');

    const [stopTimerCounting, setStopTimerCounting] = useState(props.stopTimerCounting);

    const intervalRef = useRef();

    const zeroNumberPad = (number, places) => {
        return String(number).padStart(places, '0');
    }

    useEffect(() => {
        setStopTimerCounting(props.stopTimerCounting);
    }, [props.stopTimerCounting]);

    let startTime;

    useEffect(() => {

        if (intervalRef?.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        startTime = new Date().getTime();
        intervalFunc();
        intervalRef.current = setInterval(intervalFunc, 100);

    }, [start]);

    const intervalFunc = () => {

        const timeDiff = new Date().getTime() - startTime;
        const diffInSecond = timeDiff / 1000;

        setTimeDetailsValue(diffInSecond);

        if (start !== 0) {
            if (diffInSecond >= start) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;

                props.onCompleted();
            }
        }

        let timerValue = 0;
        if (direction === 0) {
            timerValue = start - (diffInSecond | 0);
        } else {
            timerValue = diffInSecond | 0;

            if (stopTimerCounting) {
                if (timerValue >= stopTimerCounting) {
                    timerValue = stopTimerCounting;

                    console.log("should play Go sound");
                    try {

                        AudioSession.setCategory('Playback', 'MixWithOthers').then(() => {
                            SoundPlayer.playSoundFile("beep_go", 'mp3');

                            SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
                                AudioSession.setMode('VoiceChat').then(() => {
                                    console.log("Changed to voice chat mode again");
                                }).catch(err => {
                                    console.log("Failed to change to voice chat mode again");
                                });
                            });
                        }).catch(err => {
                            console.log("Failed to change to playback category");
                        })
                        
                        
                    } catch (e) {
                        console.log('Cannot play the sound file', e);
                    }

                    clearInterval(intervalRef.current);
                    intervalRef.current = null;

                    props.onCompleted();
                }
            }
        }

        setTimer(timerValue);

        if (props.timerChanged) {
            props.timerChanged(Math.round(diffInSecond * 10) / 10);
        }

    }

    useEffect(() => {
        setStart(props.startValue);
    }, [props.startValue]);

    useEffect(() => {
        setDirection(props.direction ?? 0);
    }, [props.direction]);

    useEffect(() => {
        return () => {
            if (intervalRef?.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (timer !== '') {
            if ((props.showMinutes === undefined || props.showMinutes === false)) {
                if (direction === 0) {
                    console.log('TIMER => ', timer);

                    let soundFileName = "beep_go";

                    if (timer > 0) {
                        soundFileName = "beep_countdown";
                    }

                    try {
                        // AudioSession.setActive(true);
                        
                        
                        AudioSession.currentCategory().then(category => {
                            console.log("Current category => ", category);
                            AudioSession.currentMode().then(mode => {
                                console.log("Current mode => ", mode);

                                SoundPlayer.playSoundFile(soundFileName, 'mp3');

                                SoundPlayer.addEventListener('FinishedPlaying', ({success}) => {
                                    console.log("finished playing");
                                    // AudioSession.setActive(false);

                                    AudioSession.setCategory('PlayAndRecord').then(() => {
                                        console.log("Successfully back  for category");
                                        AudioSession.setMode('VideoChat').then(() => {
                                            console.log("Successfully back  for mode");
                                        }).catch(err => {
                                            console.log("Not available to get back for mode", err);
                                        })
                                    }).catch(err => {
                                        console.log("Not available to get back for category", err);
                                    })
                                    // AudioSession.currentCategory().then(category => {
                                    //     console.log("Current category after playing => ", category);
                                    // });

                                    // AudioSession.currentMode().then(currentMode => {
                                    //     console.log("Current mode after playing => ", currentMode);
                                    // });
                                });
                            })
                            
                            

                            
                        }).catch(err => {
                            console.log("Failed to change to playback category");
                        })

                        // SoundPlayer.playSoundFile(soundFileName, 'mp3');
                    } catch (e) {
                        console.log('Cannot play the sound file', e);
                    }
                }
            }
        }
    }, [timer]);

    const showingTimeText = () => {
        if (true === props.showMinutes) {
            const minute = timer / 60 | 0;
            const second = zeroNumberPad(timer % 60, 2);
            const uSecond = (timeDetailsValue - timer).toFixed(1);
            const uSecString = `${uSecond}`;
            // return `${timer / 60 | 0}:${zeroNumberPad(timer % 60, 2)}`;
            return `${minute}:${second}${uSecString.substring(1)}`
        } else {
            if (direction === 1) {
                return `${timeDetailsValue.toFixed(1)}`;
            } else {
                if (timer > 0) {
                    return `${timer}`;
                } else {
                    return 'GO';
                }
            }
        }
    }
    
    return (
        <View style={[{
            height: 40,
            borderRadius: 20,
            backgroundColor: props.backgroundColor ?? 'red',
            justifyContent: 'center',
            alignItems: 'center'
        }, !(props.showMinutes !== undefined && props.showMinutes === true) && {width: 40}]}>
            <Text style={[{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
            }, direction === 1 && {
                width: 65,
            }]}>
                { showingTimeText() }
            </Text>
        </View>
    );
};

export default CountDownTimerPicker;