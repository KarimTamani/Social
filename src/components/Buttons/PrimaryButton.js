import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { textFonts } from "../../design-system/font";



export default function PrimaryButton({ onPress, title, style, outline = false, textStyle, disabled, loading = false }) {

    return (
        <TouchableOpacity style={[styles.button, outline && styles.outline, style, disabled && styles.disabled]} onPress={onPress} disabled={disabled || loading} >
            {
                !loading &&
                <Text style={[styles.buttonText, outline && styles.outlineText, textStyle]}>
                    {title}
                </Text>
            }
            {
                loading &&
                <ActivityIndicator
                    color={"#ffffff"}
                    size={26}
                />
            }
        </TouchableOpacity>
    )
}
;

const styles = StyleSheet.create({
    button: {
        padding: 8,



        backgroundColor: "#1A6ED8",
        alignItems: "center",
        borderRadius: 26,

    },
    disabled: {
        opacity: 0.5
    },
    buttonText: {
        color: "white",
        fontFamily: textFonts.semiBold
    },
    outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "#1A6ED8"
    },
    outlineText: {
        color: "#1A6ED8"
    }
})