import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import Header from "../components/Cards/Header"
import { textFonts } from "../design-system/font";

import { useCallback, useContext } from "react";
import FormInput from "../components/Inputs/FormInput";
import FormUploader from "../components/Inputs/FormUploader";
import FormDatePicker from "../components/Inputs/FormDatePicker";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";


export default function WorkEditor({ navigation }) {

    var values = {
        title: "",
        description: "",
        date : "" , 
        category: "",
        keywords: "", 
        link : "" , 
    }

    const submit = useCallback((values) => {

    }, [])


    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                navigation={navigation}
            />
            <ScrollView style={styles.content}>
                <Formik
                    initialValues={values}
                    onSubmit={submit}
                >
                    {
                        ({ handleChange, handleBlur, handleSubmit, values }) => (
                            <View style={{ marginBottom: 16}}>


                                <FormInput
                                    value={values.title}
                                    handleBlur={handleBlur("title")}
                                    handleChange={handleChange("title")}
                                    label={"عنوان الخدمة"}
                                    placeholder={"عنوان"}
                                />
                               
                               

                                <FormDatePicker/>


                                <FormInput
                                    value={values.description}
                                    handleBlur={handleBlur("description")}
                                    handleChange={handleChange("description")}
                                    label={"وصف"}
                                    placeholder={"وصف"}
                                    multiline={true}
                                    numberOfLines={4}
                                />
                                <FormInput
                                    value={values.category}
                                    handleBlur={handleBlur("category")}
                                    handleChange={handleChange("category")}
                                    label={"فئة"}
                                    placeholder={"فئة"}
                                />
                                <FormInput
                                    value={values.keywords}
                                    handleBlur={handleBlur("keywords")}
                                    handleChange={handleChange("keywords")}
                                    label={"الكلمات الدالة"}
                                    placeholder={"الكلمات الدالة"}
                                />
                                  <FormInput
                                    value={values.link}
                                    handleBlur={handleBlur("link")}
                                    handleChange={handleChange("link")}
                                    label={"ربط"}
                                    placeholder={"ربط"}
                                />
                             
                             
                                <FormUploader />

                                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                                    <Text style={styles.buttonText}>
                                      حفظ
                                    </Text>
                                </TouchableOpacity>

                            </View>
                        )
                    }
                </Formik>
            </ScrollView>
        </View>

    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",


    },
    content: {
        padding: 16,
    },
    button : { 
        padding : 8 , 
        alignSelf : "center" , 
        width : 128  ,  
        backgroundColor :"#1A6ED8" , 
        alignItems : "center" , 
        borderRadius : 26  , 
        marginVertical : 56 
    } , 
    buttonText : { 
        color : "white" , 
        fontFamily : textFonts.semiBold
    }

}) ; 


const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor : darkTheme.backgroudColor

    },
} 