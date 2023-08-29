import { useCallback, useContext, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity, Modal, TouchableOpacityBase } from "react-native";

import darkTheme from "../../design-system/darkTheme";
import { textFonts } from "../../design-system/font";
import ThemeContext from "../../providers/ThemeContext";
import DatePicker from '../../libs/react-native-modern-datepicker';


export default function FormDatePicker({ onChange, label = "تاريخ", placeholder = "تاريخ", style, onBlur , inputStyle , value = "" }) {

    const [date, setDate] = useState(value);
    const [showCalendar, setShowCalendar] = useState(false);


    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles


    const toggleCalendar = useCallback(() => {
        setShowCalendar(!showCalendar);
        if (showCalendar)
            onBlur && onBlur();

    }, [showCalendar, onBlur]);

    const onDayChange = useCallback((date) => {
        setDate(date);
        onChange(date);
    }, [])


    return (
        <View style={[styles.inputRow, style]}>

            <Text style={styles.label}>
                {label}
            </Text>

            <TouchableOpacity onPress={toggleCalendar}>
                <TextInput

                    editable={false}
                    style={[styles.input , inputStyle]}
                    value={date}
                    placeholder={placeholder}
                    placeholderTextColor={themeContext.getTheme() == "light" ? "#212121" : darkTheme.textColor}
                />
            </TouchableOpacity>



            {

                showCalendar &&
                <Modal
                    transparent
                    animationType="fade"
                    onRequestClose={toggleCalendar}
                >
                    <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={toggleCalendar}>
                        <View style={styles.calendarContainer}>


                            <DatePicker

                                mode="calendar"
                                minimumDate={"1900-01-01"}
                                onSelectedChange={onDayChange}
                            />

                        </View>
                    </TouchableOpacity>
                </Modal>
            }

        </View>
    )
};



const lightStyles = StyleSheet.create({

    inputRow: {
        marginBottom: 16,
    },
    label: {
        fontFamily: textFonts.medium,
        marginBottom: 16,
        fontSize: 14
    },
    input: {
        borderColor: "#ccc",
        padding: 8,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        width: 128,
        color: "#212121",
        alignSelf: "flex-end",
        textAlign: "right",

        backgroundColor: "rgba(0,0,0,0.02)"
    },
    modalBackground: {
        backgroundColor: "rgba(0,0,0,.1)",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16
    },
    calendarContainer: {
        backgroundColor: "white",
        width: "100%",
        padding: 8,
        borderRadius: 8
    }
});

const darkStyles = {
    ...lightStyles,

    label: {
        fontFamily: textFonts.medium,
        marginBottom: 16,
        fontSize: 14,
        color: darkTheme.textColor,
    },

    input: {
        borderColor: darkTheme.borderColor,
        padding: 8,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        width: 128,
        alignSelf: "flex-end",
        textAlign: "right",

        backgroundColor: darkTheme.secondaryBackgroundColor,
        color: darkTheme.textColor,

    },
}