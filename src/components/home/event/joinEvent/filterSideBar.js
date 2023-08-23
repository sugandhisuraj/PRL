import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, ScrollView,Button } from 'react-native';
import { useDispatch, useSelector, connect } from 'react-redux';

import {
    SelectOptions,
    FilterModel,
    FilterDropdown,
    FilterDatePicker
} from '@component';
import {
    updateViewEventModel
} from '../../../../store/actions';
import { getWp, wp } from '@utils';
import Styles from './indexCss';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
    eventCategoriesCollection,
    eventSubCategoriesCollection,
    eventGenreTypesCollection,
    eventContestFeesCollection,
    contestTypesCollection
} from "../../../../firebase";
import { transformFirebaseValues } from "@utils";
AntDesign.loadFont();

const FilterSideBar = (props) => {
    const {
        filterVisible = false,
        setIsFilterVisible = () => { }
    } = props;

    const dispatch = useDispatch();
    const viewEventModel = useSelector(state => state.event.viewEventModel);

    const setViewEventModel = useCallback((payload) => dispatch(updateViewEventModel(payload)), []);
    const refs = useRef({
        to: useRef(),
        from: useRef(),
        contestType: useRef()
    });
    const clearFilter = () => {
        refs.current.to.current.reset();
        refs.current.from.current.reset();
        refs.current.contestType.current.reset();
        setViewEventModel(viewEventModel.clearFilter());
    };

    return (
        <FilterModel isVisible={filterVisible} setIsModalVisible={setIsFilterVisible}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ height: '120%' }}
                style={Styles.sidebarContainer}>
                <TouchableOpacity onPress={setIsFilterVisible} style={Styles.backTouchContainer}>
                    <AntDesign
                        name={'right'}
                        style={Styles.closeModalStyle}
                    />
                    <TouchableOpacity onPress={clearFilter}>
                        <Text style={Styles.crearTextStyle}>Clear</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
                <SelectOptions
                    containerStyle={Styles.containerCategoryStyle}
                    title={'Category'}
                    options={viewEventModel.category}
                    onOptionsPress={(item, index) => {
                        console.log('ONPRESS_TEST_1_ ', JSON.stringify(item), index);
                        setViewEventModel(viewEventModel.onOptionsPress(item, index, 'category'));

                    }}
                />
                <SelectOptions
                    containerStyle={Styles.containerCategoryStyle}
                    title={'Sub Category'}
                    options={viewEventModel.subCategory}
                    onOptionsPress={(item, index) => {
                        setViewEventModel(viewEventModel.onOptionsPress(item, index, 'subcategory'));

                    }}
                />
                <SelectOptions
                    containerStyle={Styles.containerCategoryStyle}
                    title={'Genre'}
                    options={viewEventModel.genre}
                    onOptionsPress={(item, index) => {
                        setViewEventModel(viewEventModel.onOptionsPress(item, index, 'genre'));
                    }}
                />

                <FilterDropdown
                    ref={refs.current.contestType}
                    width={getWp(240)}
                    height={35}
                    items={viewEventModel.contestType}
                    placeholder={viewEventModel?.selectedContestType?.contestType ?
                        viewEventModel?.selectedContestType?.contestType :
                        'Select Contest Type'}
                    label={'Contest Type'}
                    rootContainerStyle={Styles.genreDropDownContainer}
                    onSelect={selectedContestType => {
                        setViewEventModel(viewEventModel.onOptionsPress(selectedContestType, 0, 'contesttype'));
                    }}
                />
                <Text style={Styles.dateLabelStyle}>Date</Text>
                <FilterDatePicker
                    renderDate={viewEventModel.fromDate}
                    ref={refs.current.from}
                    title={'From'}
                    containerStyle={Styles.fromDatePickerContainer}
                    onDateSet={fromDate => {
                        setViewEventModel(viewEventModel.update('fromDate', fromDate));
                    }}
                />

                <FilterDatePicker
                    renderDate={viewEventModel.toDate}
                    ref={refs.current.to}
                    title={'To'}
                    containerStyle={Styles.fromDatePickerContainer}
                    onDateSet={toDate => {
                        setViewEventModel(viewEventModel.update('toDate', toDate));
                    }}
                />
              <TouchableOpacity onPress={setIsFilterVisible} style={Styles.DoneButtonTouch}>
              <Text style={Styles.DoneButtonStyle}>Done</Text>
              </TouchableOpacity>
            </ScrollView>
        </FilterModel>
    );
}

export default connect()(FilterSideBar);