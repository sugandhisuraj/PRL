import React, { useRef, useState, useEffect } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import {
    SelectOptions,
    FilterModel,
    FilterDropdown,
    FilterDatePicker
} from '@component';

import { getWp } from '@utils';
import Styles from './indexCss';
import AntDesign from 'react-native-vector-icons/AntDesign';

AntDesign.loadFont();

const FilterSideBar = (props) => {

    const [categories, setCategories] = useState(props.categories);
    const [subCategories, setSubCategories] = useState(props.subCategories);
    const [genres, setGenres] = useState(props.genres);
    const [contestTypes, setContestTypes] = useState(props.contestTypes);

    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(-1);
    const [selectedSubCategoryIndex, setSelectedSubCategoryIndex] = useState(-1);
    const [selectedGenreIndex, setSelectedGenreIndex] = useState(-1);
    const [selectedContestType, setSelectedContestType] = useState("");

    const selectCategory = (categoryIndex) => {
        if (selectedCategoryIndex !== -1) {
            categories[selectedCategoryIndex].isSelected = false;
        }
        setSelectedCategoryIndex(categoryIndex);
        categories[categoryIndex].isSelected = true;
        setCategories([...categories]);

        props.onCategorySelected(categories[categoryIndex]);
    };

    const selectSubCategory = (idx) => {
        if (selectedSubCategoryIndex !== -1) {
            subCategories[selectedSubCategoryIndex].isSelected = false;
        }
        subCategories[idx].isSelected = true;
        setSelectedSubCategoryIndex(idx);
        setSubCategories([...subCategories]);

        props.onSubCategorySelected(subCategories[idx]);
    };

    const selectGenre = (idx) => {
        if (selectedGenreIndex !== -1) {
            genres[selectedGenreIndex].isSelected = false;
        }

        genres[idx].isSelected = true;
        setSelectedGenreIndex(idx);
        setGenres([...genres]);

        props.onGenreSelected(genres[idx]);
    };

    useEffect(() => {
        setCategories(props.categories);
        setSubCategories(props.subCategories);
        setGenres(props.genres);
        setContestTypes(props.contestTypes);
    }, [props]);

    const {
        filterVisible = false,
        setIsFilterVisible = () => { }
    } = props;

    const refs = useRef({
        to: useRef(),
        from: useRef(),
        contestType: useRef()
    });
    const clearFilter = () => {
        if (selectedCategoryIndex !== -1) {
            categories[selectedCategoryIndex].isSelected = false;
        }
        setCategories([...categories]);
        setSelectedCategoryIndex(-1);

        if (selectedSubCategoryIndex !== -1) {
            subCategories[selectedSubCategoryIndex].isSelected = false;
        }
        setSubCategories([...subCategories]);
        setSelectedSubCategoryIndex(-1);

        if (selectedGenreIndex !== -1) {
            genres[selectedGenreIndex].isSelected = false;
        }
        setGenres([...genres]);
        setSelectedGenreIndex(-1);

        setSelectedContestType("");

        // refs.current.to.current.reset();
        // refs.current.from.current.reset();

        props.onCleared();
        refs.current.contestType.current.reset();
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
                    options={categories}
                    onOptionsPress={(item, index) => {
                        console.log('ONPRESS_TEST_1_ ', JSON.stringify(item), index);
                        selectCategory(index);
                    }}
                />
                <SelectOptions
                    containerStyle={Styles.containerCategoryStyle}
                    title={'Sub Category'}
                    options={subCategories}
                    onOptionsPress={(item, index) => {
                        selectSubCategory(index);
                    }}
                />
                <SelectOptions
                    containerStyle={Styles.containerCategoryStyle}
                    title={'Genre'}
                    options={genres}
                    onOptionsPress={(item, index) => {
                        selectGenre(index);
                    }}
                />

                <FilterDropdown
                    ref={refs.current.contestType}
                    width={getWp(240)}
                    height={35}
                    items={contestTypes}
                    placeholder={selectedContestType === "" ? 'Select Contest Type' : selectedContestType}
                    label={'Contest Type'}
                    rootContainerStyle={Styles.genreDropDownContainer}
                    onSelect={ selectedContestType => {
                        setSelectedContestType(selectedContestType.value);
                        props.onContestTypeSelected(selectedContestType.value);
                    }}
                />
                <Text style={Styles.dateLabelStyle}>Date</Text>
                <FilterDatePicker
                    renderDate={new Date()}
                    ref={refs.current.from}
                    title={'From'}
                    containerStyle={Styles.fromDatePickerContainer}
                    onDateSet={fromDate => {
                    }}
                />

                <FilterDatePicker
                    renderDate={new Date()}
                    ref={refs.current.to}
                    title={'To'}
                    containerStyle={Styles.fromDatePickerContainer}
                    onDateSet={toDate => {
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