import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { textFonts } from "../../../design-system/font";
import InfoInput from "./InfoInput";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Formik } from "formik";
import * as yup from "yup";
import { ApolloContext } from "../../../providers/ApolloContext";
import { gql } from "@apollo/client";
import { errorStyle } from "../../../design-system/errorStyle";
import SelectDropdown from 'react-native-select-dropdown';
import darkTheme from "../../../design-system/darkTheme";
import ThemeContext from "../../../providers/ThemeContext";




const URL =/(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export default function ProfileInfoForm({ onSubmit, user ,loading }) {
    const [catgeory, setCategory] = useState("صانع المحتوى");
    const client = useContext(ApolloContext);



    const editSchema = yup.object({
        name: yup.string().required("الإسم الأول مطلوب").min(3, "3 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
        lastname: yup.string().required("الاسم الثاني مطلوب").min(3, "3 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
        username: yup.string().required("اسم المستخدم مطلوب").max(56, "56 حرفًا كحد أقصى").matches(/^[a-z0-9_\.]+$/, "يجب أن يحتوي اسم المستخدم على أحرف وأرقام")
            .test("username-taken", "اسم المستخدم هذا مأخوذ", (value) => {
                if (value) {
                    return new Promise((resolve, reject) => {
                        client.query({
                            query: gql`
                            query ($username : String!) { 
                                checkUsername (username : $username) 
                            }
                        ` ,
                            variables: {
                                username: value
                            }
                        }).then(response => {
                            resolve(response.data.checkUsername);
                        })
                    })
                } else
                    return true;
            }),
        countryId: yup.number().required(),
        state : yup.string().notRequired().nullable().min(2, "2 أحرف على الأقل").max(255, "255 حرفًا كحد أقصى"),  
        bio: yup.string().notRequired().nullable().min(10, "10 أحرف على الأقل").max(255, "255 حرفًا كحد أقصى"),
        facebook: yup.string().notRequired().nullable().matches(URL, "هناك مشكلة في عنوان url"),
        twitter: yup.string().notRequired().nullable().matches(URL, "هناك مشكلة في عنوان url"),
        snapshot: yup.string().notRequired().nullable().matches(URL, "هناك مشكلة في عنوان url"),
        instagram: yup.string().notRequired().nullable().matches(URL, "هناك مشكلة في عنوان url"),
    });


    var values = {
        name: user.name,
        lastname: user.lastname,
        countryId: user.country?.id,
        username: user.username,
        bio: user.bio,
        state : user.state , 
        facebook: user.socialMedia?.facebook || null,
        twitter: user.socialMedia?.twitter || null,
        snapshot: user.socialMedia?.snapshot || null,
        instagram: user.socialMedia?.instagram || null,

    }



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;

    const openCategoryPicker = useCallback(() => {
        console.log("open category picker")
    }, []);


    const [countries, setCountries] = useState([]);
    const [searchCountries, setSearchCountries] = useState([]);
    const dropDownRef = useRef();



    useEffect(() => {

        client.query({
            query: gql`
                { 
                    getCountries { 
                        id name 
                    }
                }
            
            `
        }).then((response) => {

            setCountries(response.data.getCountries);
            setSearchCountries(response.data.getCountries);
        });

    }, []);


    const openDropDown = useCallback(() => {
        dropDownRef.current?.openDropdown()

    }, []);



    return (
        <View style={styles.container}>
            <Formik
                initialValues={values}
                validationSchema={editSchema}
                onSubmit={onSubmit}

            >
                {
                    ({ handleChange, handleBlur, handleSubmit, setFieldTouched, validateField, setFieldValue, values, touched, errors, isValid }) => (
                        <View>

                            <InfoInput
                                value={values.name}
                                label={"الاسم الأول"}
                                onChangeText={handleChange("name")}
                                onBlur={() => {
                                    setFieldTouched("name", true);
                                    validateField("name").then();

                                }}
                                errorText={
                                    touched.name && errors.name &&
                                    <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.name && errors.name}</Text>

                                }

                            />
                            <InfoInput
                                value={values.lastname}
                                label={"الاسم الثاني"}
                                onChangeText={handleChange("lastname")}
                                onBlur={() => {
                                    setFieldTouched("lastname", true);
                                    validateField("lastname").then();
                                }}
                                errorText={
                                    touched.lastname && errors.lastname &&
                                    <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.lastname && errors.lastname}</Text>

                                }

                            />
                            <InfoInput
                                value={values.username}
                                label={"اسم االمستخدم"}

                                onChangeText={handleChange("username")}
                                onBlur={() => {
                                    setFieldTouched("username", true);
                                    validateField("username").then();

                                }}

                                errorText={
                                    touched.username && errors.username &&
                                    <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.username && errors.username}</Text>

                                }

                            />
                            {
                                user.isProfessional &&
                                <InfoInput
                                    value={catgeory}
                                    label={
                                        <Text>
                                            <Entypo name="chevron-down" size={16} color="#1A6ED8" /> الفئة
                                        </Text>
                                    }
                                    onPress={openCategoryPicker}
                                />
                            }
                            <InfoInput
                                value={values.bio}
                                label={"السيرة الذاتية"}
                                onChangeText={handleChange("bio")}
                                onBlur={() => {
                                    setFieldTouched("bio", true);
                                    validateField("bio").then();

                                }}
                                multiline={true}
                                errorText={
                                    touched.bio && errors.bio &&
                                    <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.bio && errors.bio}</Text>

                                }


                            />
                            <TouchableOpacity style={styles.infoInput} onPress={openDropDown}>
                                <Text style={styles.label}>
                                    <AntDesign name="search1" size={16} color="#1A6ED8" /> البلد
                                </Text>
                                {
                                    searchCountries.length > 0 &&
                                    <SelectDropdown
                                        defaultValue={user.country}
                                        ref={dropDownRef}
                                        data={searchCountries}
                                        search={true}
                                        onChangeSearchInputText={(searchText) => {
                                            setSearchCountries(countries.filter(country => country.name.includes(searchText.trim())))
                                        }}

                                        defaultButtonText={"اختر بلدك"}
                                        buttonStyle={{ ...styles.value, ...(touched.countryId && errors.countryId && errorStyle.errorInput) }}
                                        onSelect={(selectedItem, index) => {
                                            setFieldValue("countryId", selectedItem.id);
                                        }}
                                        onBlur={() => {

                                            setFieldTouched("countryId", true);
                                            validateField("countryId").then();

                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return <Text style={styles.countryText}>{selectedItem.name}</Text>
                                        }}
                                        buttonTextStyle={styles.countryText}
                                        rowTextForSelection={(item, index) => {
                                            return item.name
                                        }}
                                    />
                                }

                            </TouchableOpacity>
                            <InfoInput
                                value={values.state}
                                label={"المقاطعة"}

                                onChangeText={handleChange("state")}
                                onBlur={() => {
                                    setFieldTouched("state", true);
                                    validateField("state").then();

                                }}

                                errorText={
                                    touched.state && errors.state &&
                                    <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.state && errors.state}</Text>

                                }

                            />


                            <InfoInput
                                label={"روابط التطبيقات"}
                                social
                                socialMediaValues={
                                    values
                                }

                                socialhandlers={{
                                    facebook: {
                                        onBlur: handleBlur("facebook"),
                                        onChange: handleChange("facebook")
                                    },
                                    twitter: {
                                        onBlur: handleBlur("twitter"),
                                        onChange: handleChange("twitter")
                                    },
                                    snapshot: {
                                        onBlur: handleBlur("snapshot"),
                                        onChange: handleChange("snapshot")
                                    },
                                    instagram: {
                                        onBlur: handleBlur("instagram"),
                                        onChange: handleChange("instagram")
                                    },
                                }}
                                socialMediaErrors={{
                                    facebook: (
                                        touched.facebook && errors.facebook &&
                                        <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.facebook && errors.facebook}</Text>
                                    ),
                                    twitter: (
                                        touched.twitter && errors.twitter &&
                                        <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.twitter && errors.twitter}</Text>
                                    ),
                                    snapshot: (
                                        touched.snapshot && errors.snapshot &&
                                        <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.snapshot && errors.snapshot}</Text>
                                    ),
                                    instagram: (
                                        touched.instagram && errors.instagram &&
                                        <Text style={[errorStyle.error, { marginTop: 4 }]}> {touched.instagram && errors.instagram}</Text>
                                    ),


                                }}
                            />


                            <TouchableOpacity style={[styles.button, !isValid && { opacity: 0.5 }]} onPress={handleSubmit} disabled={!isValid || loading}>
                                {
                                    !loading &&
                                    <Text style={styles.buttonText}>
                                        <MaterialCommunityIcons name="note-check-outline" size={16} color="white" />  حفظ
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
                        </View>

                    )


                }
            </Formik>
        </View>
    )
};


const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16
    },
    button: {
        padding: 8,
        alignSelf: "center",
        width: 128,
        backgroundColor: "#1A6ED8",
        alignItems: "center",
        borderRadius: 26,
        marginVertical: 56
    },
    buttonText: {
        color: "white",
        fontFamily: textFonts.bold
    },

    row: {
        flexDirection: "row",

        marginHorizontal: -8

    },
    rowInput: {
        flex: 1,
        marginHorizontal: 8
    },
    infoInput: {
        borderBottomColor: "#eee",
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 16
    },
    label: {
        color: "#1A6ED8",
        fontFamily: textFonts.regular,
        fontSize: 16,
        textAlign: "right"

    },
    value: {

        height: 32,
        width: "100%",
        textAlignVertical: "right",
        backgroundColor: "transparent"


    }
    ,
    countryText: {
        color: "#666",
        textAlign: "right",
        fontSize: 14,
        fontFamily: textFonts.regular,



        marginHorizontal: -8

    }

}) ; 


const darkStyles = {
    ...lightStyles , 
    infoInput: {
        borderBottomColor: darkTheme.borderColor,
        borderBottomWidth: 1,
        paddingBottom: 8,
        marginBottom: 16
    },

}