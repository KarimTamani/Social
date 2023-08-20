import { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from "react-native";
import PrimaryInput from "../components/Inputs/PrimaryInput";
import { Ionicons } from '@expo/vector-icons';
import { textFonts } from "../design-system/font";
import FormDatePicker from "../components/Inputs/FormDatePicker";
import SelectDropdown from 'react-native-select-dropdown';

import PrimaryButton from "../components/Buttons/PrimaryButton";
import { Formik } from "formik";
import { errorStyle } from "../design-system/errorStyle";
import * as yup from "yup";
import { ApolloContext } from "../providers/ApolloContext";
import { gql } from "@apollo/client";

import { AuthContext } from "../providers/AuthContext";
import ThemeContext from "../providers/ThemeContext";
import darkTheme from "../design-system/darkTheme";

const genders = [{ label: "ذكر", value: true }, { label: "أنثى", value: false }];

export default function Signup({ navigation }) {
    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const signUpSchema = yup.object({
        name: yup.string().required("الإسم الأول مطلوب").min(3, "3 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
        lastname: yup.string().required("الاسم الثاني مطلوب").min(3, "3 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
        email: yup.string().email("البريد الإلكتروني غير صحيح").required("البريد الالكتروني مطلوب"),
        password: yup.string().required("كلمة المرور مطلوبة").min(6, "6 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
        confirmPassword: yup.string().required("تأكيد كلمة المرور هو حقل مطلوب").min(6, "6 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى").oneOf([yup.ref('password'), null], 'كلمة السر غير متطابقة'),
        username: yup.string().required("اسم المستخدم مطلوب").min(1, "1 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى").matches(/^[a-z0-9_\.]+$/, "يجب أن يحتوي اسم المستخدم على أحرف وأرقام")
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
        gender: yup.boolean().required(),
        birthday: yup.date().required(), 
      
    });

    var values = {
        name: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        birthday: "",
        gender: null,
        countryId: null
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [countries, setCountries] = useState([]);
    const [searchCountries, setSearchCountries] = useState([]);
    const [error, setError] = useState(null);

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    const goLogin = useCallback(() => {
        navigation.navigate("Login");
    }, []);

    const createAccount = useCallback((values) => {
        setError(null);
        setLoading(true);

        client.mutate({
            mutation: gql`
            mutation SIGNUP($user: UserInput) {
                SignUp(user: $user) {
                  user {
                    id
                    name
                    lastname
                    username
                    birthday
                    gender
                    isValid
                    email
                  }
                  token
                }
              }
            ` ,
            variables: {
                user: values
            }
        }).then(async response => {

            if (response && response.data) {
                navigation.navigate("SendEmailConfirmation", {
                    email: response.data.SignUp.user.email
                });
            }

            setLoading(false);
        }).catch(error => {
            setError("حدث خطأ ، ربما تم استخدام هذا البريد الإلكتروني في حساب آخر ، جرب حسابًا آخر")
            setLoading(false);
        })

    }, []);

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
    }, [])

    return (
        <ScrollView>
            <View style={styles.container}>

                <Text style={styles.title}>
                    انشاء حساب جديد
                </Text>
                <Formik
                    initialValues={values}
                    onSubmit={createAccount}
                    validationSchema={signUpSchema}
                >
                    {
                        ({ handleChange, handleBlur, handleSubmit, setFieldTouched, validateField, setFieldValue, values, touched, errors, isValid }) => (
                            <View style={styles.form}>
                                <View style={styles.row}>

                                    <View style={styles.rowInput}>
                                        <PrimaryInput
                                            placeholder={"الاسم الثاني"}
                                            style={[styles.input]}
                                            onChange={handleChange("lastname")}
                                            onBlur={handleBlur("lastname")}
                                            error={touched.lastname && errors.lastname}
                                        />

                                        <Text style={errorStyle.error}> {touched.lastname && errors.lastname}</Text>

                                    </View>

                                    <View style={styles.rowInput}>

                                        <PrimaryInput
                                            placeholder={"الاسم الأول"}
                                            style={[styles.input]}

                                            onChange={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            error={touched.name && errors.name}
                                        />
                                        <Text style={errorStyle.error}> {touched.name && errors.name}</Text>
                                    </View>


                                </View>
                                <PrimaryInput
                                    placeholder={"البريد الإلكتروني"}
                                    style={styles.input}


                                    onChange={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    error={touched.email && errors.email}

                                />
                                <Text style={errorStyle.error}> {touched.email && errors.email}</Text>

                                <PrimaryInput
                                    placeholder={"اسم المستخدم"}
                                    style={styles.input}


                                    onChange={handleChange("username")}
                                    onBlur={handleBlur("username")}
                                    error={touched.username && errors.username}
                                />
                                <Text style={errorStyle.error}> {touched.username && errors.username}</Text>
                                <PrimaryInput
                                    placeholder={"كلمة المرور"}
                                    style={styles.input}

                                    inputStyle={styles.inputStyle}
                                    secure={!showPassword}
                                    onChange={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    error={touched.password && errors.password}

                                    leftContent={
                                        <TouchableOpacity style={styles.showButton} onPress={() => setShowPassword(!showPassword)}>
                                            {
                                                !showPassword && <Ionicons name="eye-off" size={24} color="#666" />

                                            }
                                            {
                                                showPassword && <Ionicons name="eye-sharp" size={24} color="#45f248" />

                                            }
                                        </TouchableOpacity>
                                    }
                                />
                                <Text style={errorStyle.error}> {touched.password && errors.password}</Text>

                                <PrimaryInput

                                    placeholder={"تأكيد كلمة المرور"}
                                    style={styles.input}
                                    inputStyle={styles.inputStyle}
                                    secure={!showConfirmPassword}
                                    onChange={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    error={touched.confirmPassword && errors.confirmPassword}

                                    leftContent={
                                        <TouchableOpacity style={styles.showButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {
                                                !showConfirmPassword && <Ionicons name="eye-off" size={24} color="#666" />
                                            }
                                            {
                                                showConfirmPassword && <Ionicons name="eye-sharp" size={24} color="#45f248" />
                                            }
                                        </TouchableOpacity>
                                    }
                                />
                                <Text style={errorStyle.error}> {touched.confirmPassword && errors.confirmPassword}</Text>

                                <View style={styles.row} >
                                    <View style={styles.rowInput}>
                                        <Text style={styles.label}>
                                            جنس
                                        </Text>
                                        <SelectDropdown
                                            data={genders}
                                            defaultButtonText={"اختر جنسك"}
                                            buttonStyle={{ ...styles.dropdown, ...(touched.gender && errors.gender && errorStyle.errorInput) }}
                                            onSelect={(selectedItem, index) => {
                                                setFieldValue("gender", selectedItem.value);
                                            }}
                                            onBlur={() => {
                                                setFieldTouched("gender", true);
                                                validateField("gender").then();

                                            }}

                                            buttonTextAfterSelection={(selectedItem, index) => {

                                                return <Text style={styles.dropdownText}>{selectedItem.label}</Text>
                                            }}
                                            rowTextForSelection={(item, index) => {

                                                return <Text style={styles.dropdownText}>{item.label}</Text>
                                            }}
                                            buttonTextStyle={styles.dropDownButtonText}
                                        />
                                        <Text style={[errorStyle.error, { marginTop: 8 }]}> {touched.gender && errors.gender && "الجنس مطلوب"}</Text>

                                    </View>
                                    <View style={styles.rowInput}>
                                        <FormDatePicker
                                            label={"تاريخ الميلاد"}
                                            inputStyle={touched.birthday && errors.birthday && errorStyle.errorInput}
                                            onBlur={() => {

                                                setFieldTouched("birthday", true);
                                                validateField("birthday").then();

                                            }}
                                            onChange={(date) => {
                                                setFieldValue("birthday", date);
                                            }}
                                        />
                                        <Text style={[errorStyle.error, { marginTop: -8 }]}> {touched.birthday && errors.birthday && "تاريخ الميلاد مطلوب"}</Text>

                                    </View>


                                </View>
                                <View style={{ alignItems: "flex-end" }}>
                                    <Text style={styles.label}>
                                        دولة
                                    </Text>
                                    <SelectDropdown
                                        data={searchCountries}
                                        search={true}
                                        onChangeSearchInputText={(searchText) => {
                                            setSearchCountries(countries.filter(country => country.name.includes(searchText.trim())))
                                        }}

                                        defaultButtonText={"اختر بلدك"}
                                        buttonStyle={{ ...styles.dropdown, ...(touched.countryId && errors.countryId && errorStyle.errorInput) }}
                                        onSelect={(selectedItem, index) => {
                                            setFieldValue("countryId", selectedItem.id);
                                        }}
                                        onBlur={() => {

                                            setFieldTouched("countryId", true);
                                            validateField("countryId").then();

                                        }}
                                        buttonTextAfterSelection={(selectedItem, index) => {
                                            return <Text style={styles.dropdownText}>{selectedItem.name}</Text>
                                        }}
                                        rowTextForSelection={(item, index) => {
                                            return <Text style={styles.dropdownText}>{item.name}</Text>
                                        }}
                                        buttonTextStyle={styles.dropDownButtonText}
                                    />
                                    <Text style={[errorStyle.error, { marginTop: 8 }]}> {touched.countryId && errors.countryId && "الدولة مطلوبة"}</Text>

                                </View>

                                <PrimaryButton
                                    title={"إنشاء حساب"}
                                    style={styles.signUpButton}
                                    onPress={handleSubmit}
                                    disabled={!isValid}
                                    loading={loading}
                                />
                                {
                                    error &&
                                    <Text style={[errorStyle.errorMessage, { marginVertical: 16 }]}>
                                        {error}
                                    </Text>
                                }

                                <Text style={styles.text}>
                                    لديك حساب <Text onPress={goLogin} style={styles.redClickable}>
                                        تسجيل الدخول

                                    </Text>
                                </Text>
                                <Text style={[styles.text, styles.footerText]}>
                                    بالنقر على "‏إنشاء حساب‏"، فإنك توافق على ‏الشروط‏ و‏سياسة الخصوصية‏ و‏سياسة ملفات تعريف الارتباط‏. </Text>
                            </View>
                        )

                    }
                </Formik>

            </View >
        </ScrollView>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
        paddingTop: 86
    },
    input: {
        marginVertical: 16,
        borderRadius: 4,
        height: 52,

    },
    title: {
        fontFamily: textFonts.bold,
        fontWeight: "bold",
        fontSize: 18
    },
    row: {
        flexDirection: "row",
        marginHorizontal: -8

    },
    rowInput: {
        flex: 1,
        marginHorizontal: 8
    },
    showButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        borderRightColor: "#ddd",
        borderRightWidth: 1
    },
    inputStyle: {
        height: 52
    },
    label: {
        fontFamily: textFonts.medium,
        marginBottom: 16,
        fontSize: 14,

    },
    dropdown: {
        borderColor: "#ccc",
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        maxWidth: "100%",
        textAlign: "right",
        backgroundColor: "rgba(0,0,0,0.02)",
        width: 360

    },
    signUpButton: {
        marginVertical: 16,
        marginTop: 32
    },
    text: {
        color: "#212121",
        textAlign: "center",
        fontFamily: textFonts.regular,

    },
    redClickable: {
        color: "#ff0000",
        fontFamily: textFonts.medium
    },
    footerText: {
        color: "#666",
        textAlign: "right",
        lineHeight: 24,
        fontSize: 12,
        marginTop: 16
    },
    dropdownText: {
        fontFamily: textFonts.regular
    },
    dropDownButtonText: {
        color: "#212121",
        fontFamily: textFonts.regular,
        lineHeight: 28
    }
});
const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor,
        padding: 16,
        paddingTop: 86
    },
    title: {
        fontFamily: textFonts.bold,
        fontWeight: "bold",
        fontSize: 18,
        color: darkTheme.textColor
    }, showButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        borderRightColor: darkTheme.borderColor,
        borderRightWidth: 1
    },
    label: {
        fontFamily: textFonts.medium,
        marginBottom: 16,
        fontSize: 14,
        color: darkTheme.textColor

    },
    dropdown: {
        borderColor: darkTheme.borderColor,
        padding: 12,
        fontFamily: textFonts.regular,
        borderWidth: 1,
        borderRadius: 8,
        textAlignVertical: "top",
        maxWidth: "100%",
        textAlign: "right",
        backgroundColor: darkTheme.secondaryBackgroundColor,
        width: 360

    },
    dropDownButtonText: {
        color: darkTheme.textColor,
        fontFamily: textFonts.regular,
        lineHeight: 28
    },
    text: {
        color: darkTheme.textColor,
        textAlign: "center",
        fontFamily: textFonts.regular,

    },
    footerText: {
        color: darkTheme.secondaryTextColor,
        textAlign: "right",
        lineHeight: 24,
        fontSize: 12,
        marginTop: 16
    },
}