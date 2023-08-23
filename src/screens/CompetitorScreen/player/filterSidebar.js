import React, { useCallback, } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useDispatch, useSelector, connect } from 'react-redux';

import {
    SelectOptions,
    FilterModel,
    FilterDropdown,
    FilterDatePicker,
    SelectOptionsDropDown
} from '@component';
import {
    updateViewEventModel
} from '../../../store/actions';
import { getWp, wp } from '@utils';
import Styles from './indexCss';
import AntDesign from 'react-native-vector-icons/AntDesign';

AntDesign.loadFont();

const PlayerFilterSidebar = (props) => {
    const {
        playerModel,
        filterVisible = false,
        setIsFilterVisible = () => { },
        setPlayerModel
    } = props;
    const dispatch = useDispatch();
    const viewEventModel = useSelector(state => state.event.viewEventModel);
    // const setViewEventModel = useCallback((payload) => dispatch(updateViewEventModel(payload)), []);
    const clearFilter = () => {
        setPlayerModel(playerModel.clearFilter());
    }
    return (
        <FilterModel
            setIsModalVisible={setIsFilterVisible}
            isVisible={filterVisible}>
            <View
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ height: '120%' }}
                style={Styles.sidebarContainer}>

                <View style={Styles.clearContainer}>
                    <TouchableOpacity onPress={setIsFilterVisible} style={Styles.backTouchContainer}>
                        <AntDesign
                            name={'right'}
                            style={Styles.closeModalStyle}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={clearFilter}>
                        <Text style={Styles.createFilterTextStyle}>Clear</Text>
                    </TouchableOpacity>
                </View>

                <SelectOptions
                    containerStyle={Styles.containerCategoryStyle}
                    title={'Events'}
                    keyProp={'eventName'}
                    options={playerModel.events || []}
                    onOptionsPress={(item, index) => {
                        setPlayerModel(playerModel.onOptionsPress(item, index, 'selectedEvent'));
                    }}
                    scrollEnabled
                />
                <SelectOptionsDropDown
                    containerStyle={Styles.genreDropDownContainer}
                    title={'Contest'}
                    keyProp={'contestType'}
                    options={viewEventModel.contestType || []}
                    onOptionsPress={(item, index) => {
                        setPlayerModel(playerModel.onOptionsPress(item, 0, 'selectedContest'));
                    }}
                    scrollEnabled
                    customSelection={{
                        selectedItem: playerModel?.selectedContest?.contestType || '',
                        optionKey: 'contestType'
                    }}
                />
                <TouchableOpacity onPress={setIsFilterVisible} style={Styles.DoneButtonTouch}>
              <Text style={Styles.DoneButtonStyle}>Done</Text>
              </TouchableOpacity>
                {/* <FilterDropdown
                    width={getWp(240)}
                    height={35}
                    items={viewEventModel.contestType}
                    placeholder={'Select Contest'}
                    label={'Contest'}
                    rootContainerStyle={Styles.genreDropDownContainer}
                    onSelect={selectedContestType => {
                        setViewEventModel(viewEventModel.onOptionsPress(selectedContestType, 0, 'contesttype'));
                    }}
                />  */}
            </View>
        </FilterModel>
    );
}

export default connect()(PlayerFilterSidebar);