// External Imports
import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { View, Text, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

// Internal Imports
import styles from "./indexCss";
import ModalDropdown from "../ModalDropDown";
import Feather from "react-native-vector-icons/Feather";
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";
import { Keyboard } from "react-native";
Feather.loadFont();

const PreviewFilterDropdown = forwardRef((props, refs) => {
  const {
    items,
    onSelect,
    placeholder,
    width,
    height,
    containerStyle = {},
    dropdownContainer = {},
    showBorders = true,
    dropdownStyle = {},
  } = props;
  const [resetD, setresetD] = useState(undefined);
  const [expanded, setExpanded] = useState(false);
  const dropdownRef = useRef();

  useImperativeHandle(refs, () => ({
    reset: () => {
      setresetD(placeholder);
      setTimeout(() => {
        dropdownRef.current.resetButton(placeholder);
        setTimeout(() => {
          setresetD(undefined);
        }, 500);
      }, 200);
    },
  }));

  const renderButtonText = (rowData) => {
    if (resetD) {
      return placeholder;
    }
    return rowData?.value;
  };

  const renderDropdownItem = (rowData) => {
    return (
      <View style={styles.dropdownItemContainer}>
        <Text style={styles.dropdownText}>{rowData?.value}</Text>
      </View>
    );
  };

  const toggleIcon = () => {
    setExpanded(!expanded);
    dropdownRef.current.show();
  };

  return (
    <View
      style={[
        styles.container,
        containerStyle,
        width && { width },
        height && { height },
        !showBorders && { borderWidth: 0 },
      ]}
    >
      <ModalDropdown
        ref={dropdownRef}
        style={[styles.dropdownContainer, dropdownContainer]}
        textStyle={styles.dropdownSelectedText}
        dropdownStyle={[
          styles.dropdown,
          dropdownStyle,
          width && { width: width * 0.9 },
        ]}
        defaultValue={placeholder}
        options={items}
        renderButtonText={renderButtonText}
        renderRow={renderDropdownItem.bind(this)}
        onSelect={(index) => onSelect(items[index])}
        onDropdownWillShow={() => {
          Keyboard.dismiss();
          setExpanded(true);
        }}
        onDropdownWillHide={() => setExpanded(false)}
      />
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          toggleIcon();
        }}
      >
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={getWp(20)}
        />
      </TouchableOpacity>
    </View>
  );
});

PreviewFilterDropdown.propTypes = {
  items: PropTypes.array.isRequired,
  selectedValue: PropTypes.object,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
};

PreviewFilterDropdown.defaultProps = {
  items: [],
  selectedValue: null,
  placeholder: "",
  onSelect: () => {},
};

export default PreviewFilterDropdown;
