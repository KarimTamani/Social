import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import Header from "../../components/Cards/Header";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import SelectDropdown from 'react-native-select-dropdown';
import FormUploader from "../../components/Inputs/FormUploader"

import { Feather } from '@expo/vector-icons';
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import * as yup from "yup";
import { AuthContext } from "../../providers/AuthContext";
import { Formik } from "formik";
import { errorStyle } from "../../design-system/errorStyle";
import { createRNUploadableFile } from "../../providers/MediaProvider";
import LoadingActivity from "../../components/Cards/post/loadingActivity";
import ValidationRequest from "../../components/Cards/ValidationRequest";
const papers = [
    "بطاقة تعريف", "رخصة قيادة", "جواز السفر"
];

const URL = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

const validationSchema = yup.object({
    name: yup.string().required("الإسم الأول مطلوب").min(3, "3 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
    lastname: yup.string().required("الاسم الثاني مطلوب").min(3, "3 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى"),
    username: yup.string().required("اسم المستخدم مطلوب").min(1, "1 أحرف على الأقل").max(56, "56 حرفًا كحد أقصى").matches(/^[a-z0-9_\.]+$/, "يجب أن يحتوي اسم المستخدم على أحرف وأرقام"),
    countryId: yup.number().required(),
    categoryId: yup.number().required(),
    fileType: yup.string().required().oneOf([papers]),
    media: yup.object().required("من فضلك قم بإرفاق الملف"),
    linkOne: yup.string().required("مطلوب url").matches(URL, "هناك مشكلة في عنوان url"),
    linkTwo: yup.string().notRequired().nullable().matches(URL, "هناك مشكلة في عنوان url"),
});

const WIDTH = Dimensions.get("screen").width;

export default function VerifyAccount({ navigation }) {

    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles;
    const [fetchingData, setFetchingData] = useState(true);
    const [pendingRequest, setPendingRequest] = useState(null)

    const [values, setValues] = useState(null)
    const [categories, setCategories] = useState([]);
    const [searchCountries, setSearchCountries] = useState([]);
    const [countries, setCountries] = useState([]);

    const client = useContext(ApolloContext);
    const auth = useContext(AuthContext);

    const [loading, setLoading] = useState(false);


    useEffect(() => {


        client.query({
            query:
                gql`
            query GetCategoriesAndCountries {
                getCategories {
                  id
                  name
                }
                getCountries {
                  id
                  name
                }
                getCurrentValidationRequest {
                    id
                    name
                    lastname
                    fileType
                    username
                    status
                    note
                  }
              
              }
            
            `
        }).then(response => {

            if (response && response.data) {
                setCountries(response.data.getCountries);
                setCategories(response.data.getCategories);
                setSearchCountries(response.data.getCountries);
                setPendingRequest(response.data.getCurrentValidationRequest);


            }
            setFetchingData(false);
        }).catch(error => {


            setFetchingData(false);
        });


        (async () => {

            var userAuth = await auth.getUserAuth();
            if (userAuth) {

                setValues({
                    name: userAuth.user.name,
                    lastname: userAuth.user.lastname,
                    username: userAuth.user.username
                });

            }

        })();
    }, [])


    const sendValidationRequest = useCallback((values) => {
        (async () => {
            await values.media;

            values.media = await createRNUploadableFile(values.media.uri);
            console.log(values)
            setLoading(true);

            client.mutate({
                mutation: gql`
    
                mutation CreateValidationRequest($validationRequestInput: ValidationRequestInput!) {
                    createValidationRequest(validationRequestInput: $validationRequestInput) {
                        id
                        name
                        lastname
                        fileType
                        status
                        note
                        username  
                    }
                }` ,
                variables: {
                    validationRequestInput: {
                        ...values
                    }
                }
            })
                .then(response => {
                    console.log(response);
                    setLoading(false);
                    if (response.data.createValidationRequest) {
                        console.log("created succefully");
                        setPendingRequest(response.data.createValidationRequest)
                    }

                })

                .catch(error => {
                    console.log(error);
                    setLoading(false);
                })
        })()


    }, []);



    const tryAgain = useCallback(() => {
        setLoading( true) ; 

        client.mutate({
            mutation: gql`
            mutation DeleteValidationRequest {
                deleteValidationRequest {
                  id
                }
            }` ,

        }).then(response => {
           
            if (response && response.data && response.data.deleteValidationRequest) {
                setPendingRequest(null);
            }
            setLoading(false) ; 
        }).catch(error => {
            console.log (error) ; 
            setLoading(false)
        })

    }, [pendingRequest])

    if (!values)
        return;

    return (
        <View style={styles.container}>
            <Header
                title={"طلب توثيق الحساب"}
                navigation={navigation}
            />
            {
                !fetchingData && !pendingRequest &&

                <ScrollView>

                    <Formik
                        initialValues={values}
                        onSubmit={sendValidationRequest}
                        validationSchema={validationSchema}
                    >

                        {
                            ({ handleChange, handleBlur, handleSubmit, setFieldTouched, validateField, setFieldValue, values, touched, errors, isValid }) => (



                                <View style={styles.content}>
                                    <Text style={styles.text}>
                                        تحتوي الحسابات المحققة على علامات تحديد زرقاء <AntDesign name="checkcircle" style={styles.blueIcon} /> تظهر بجوار اسمائها للإشارة الى ان ... قد قام بتاكيد انها تمثل الحضور الحقيقي للشخصيات العامة والشخصيات المشهورة والعلامات التجارية التي تمثلها

                                    </Text>
                                    <Text style={styles.label}>
                                        الخطوة الأولى 1: تأكيد الاسم
                                    </Text>
                                    <View style={styles.row}>
                                        <PrimaryInput
                                            placeholder={"الاسم الأول"}
                                            style={[styles.input, styles.rowInput]}
                                            onChange={handleChange("name")}
                                            onBlur={handleBlur("name")}
                                            value={values.name}
                                            error={touched.name && errors.name}
                                        />

                                        <PrimaryInput
                                            placeholder={"الاسم الثاني"}
                                            style={[styles.input, styles.rowInput]}
                                            onChange={handleChange("lastname")}
                                            onBlur={handleBlur("lastname")}
                                            value={values.lastname}
                                            error={touched.lastname && errors.lastname}
                                        />
                                    </View>
                                    {
                                        touched.name && errors.name &&
                                        <Text style={[errorStyle.error, { marginBottom: 8 }]}> {touched.name && errors.name}</Text>

                                    }
                                    {
                                        touched.lastname && errors.lastname &&
                                        <Text style={[errorStyle.error]}> {touched.lastname && errors.lastname}</Text>

                                    }
                                    <PrimaryInput
                                        placeholder={"اسم المستخدم"}
                                        style={styles.input}
                                        onChange={handleChange("username")}
                                        onBlur={handleBlur("username")}
                                        value={values.username}
                                        error={touched.username && errors.username}

                                    />
                                    {
                                        touched.username && errors.username &&
                                        <Text style={[errorStyle.error]}> {touched.username && errors.username}</Text>

                                    }

                                    <Text style={styles.text}>
                                        اختيار نوع الملف
                                    </Text>
                                    <View style={[styles.row, styles.uploadRow]}>

                                        <FormUploader
                                            placeholder={"ملف"}
                                            style={styles.uploader}
                                            noDisplay={false}
                                            oneImage={true}
                                            onChanges={(media) => {
                                                if (media && media.length > 0)
                                                    setFieldValue("media", media[0]);
                                            }}
                                        />
                                        <SelectDropdown
                                            data={papers}
                                            defaultButtonText={"اختر الملف"}
                                            buttonStyle={[styles.dropdown, { alignSelf: "flex-start", marginTop: 8 }, (touched.fileType && errors.fileType && errorStyle.errorInput)]}
                                            onSelect={(selectedItem, index) => {
                                                setFieldValue("fileType", selectedItem);
                                            }}
                                            onBlur={() => {
                                                setFieldTouched("fileType", true);
                                                validateField("fileType").then();
                                            }}
                                            buttonTextAfterSelection={(selectedItem, index) => {
                                                return <Text style={styles.dropdownText}>{selectedItem}</Text>

                                            }}
                                            rowTextForSelection={(item, index) => {
                                                return item
                                            }}
                                        />
                                    </View>
                                    {
                                        touched.fileType && errors.fileType &&
                                        <Text style={[errorStyle.error]}> {touched.fileType && errors.fileType && "الملف مطلوب"}</Text>
                                    }

                                    {
                                        touched.fileType && errors.media &&
                                        <Text style={[errorStyle.error]}> {touched.media && errors.media && "من فضلك قم بإرفاق الملف"}</Text>
                                    }
                                    <Text style={styles.label}>
                                        الخطوة التانية 2: تأكيد الشهرة

                                    </Text>
                                    <View style={{ marginHorizontal: -16 }}>

                                        <View style={styles.col}>

                                            <Text style={[styles.label, { marginBottom: 8 }]}>
                                                الدولة
                                            </Text>
                                            <SelectDropdown
                                                data={searchCountries}
                                                search={true}
                                                onChangeSearchInputText={(searchText) => {
                                                    setSearchCountries(countries.filter(country => country.name.includes(searchText.trim())))
                                                }}
                                                defaultButtonText={"اختر بلدك"}

                                                buttonStyle={[styles.dropdown, { width: WIDTH, marginHorizontal: 0 }, (touched.countryId && errors.countryId && errorStyle.errorInput)]}
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
                                                    return item.name
                                                }}
                                            />
                                            {
                                                touched.countryId && errors.countryId && <Text style={[errorStyle.error, { marginTop: 8 }]}> {touched.countryId && errors.countryId && "الدولة مطلوبة"}</Text>
                                            }
                                        </View>
                                        <View style={styles.col}>
                                            <Text style={[styles.label, { marginBottom: 8 }]}>
                                                الفئة
                                            </Text>
                                            <SelectDropdown
                                                data={categories}
                                                defaultButtonText={"اختر فئتك"}
                                                buttonStyle={[styles.dropdown, { width: WIDTH, marginHorizontal: 0 }, (touched.categoryId && errors.categoryId && errorStyle.errorInput)]}

                                                onSelect={(selectedItem, index) => {
                                                    setFieldValue("categoryId", selectedItem.id);
                                                }}
                                                onBlur={() => {

                                                    setFieldTouched("categoryId", true);
                                                    validateField("categoryId").then();

                                                }}
                                                buttonTextAfterSelection={(selectedItem, index) => {
                                                    return <Text style={styles.dropdownText}>{selectedItem.name}</Text>
                                                }}
                                                rowTextForSelection={(item, index) => {
                                                    return item.name
                                                }}
                                            />
                                            {
                                                touched.categoryId && errors.categoryId &&
                                                <Text style={[errorStyle.error, { marginTop: 8 }]}> {touched.categoryId && errors.categoryId && "الفئة مطلوبة"}</Text>
                                            }

                                        </View>

                                    </View>

                                    <Text style={styles.label}>
                                        الجمهور
                                    </Text>
                                    <Text style={[styles.text, { marginVertical: 8 }]}>
                                        يمكنك إضافة ما يصل إلى 2 من الحسابات على وسائل التواصل الاجتماعي تؤكد أن الحساب يحتوي على أكتر من 10.000 متابع , يصب في المصلحة العامة.
                                    </Text>

                                    <PrimaryInput
                                        style={styles.socialInput}
                                        placeholder={"رابط مواقع التواصل الاجتماعي"}
                                        rightContent={
                                            <Feather name="link" style={styles.linkIcon} />
                                        }
                                        onChange={handleChange("linkOne")}
                                        onBlur={handleBlur("linkOne")}
                                        value={values.linkOne}
                                        error={touched.linkOne && errors.linkOne}
                                    />
                                    {
                                        touched.linkOne && errors.linkOne &&
                                        <Text style={[errorStyle.error, { marginBottom: 8 }]}> {touched.linkOne && errors.linkOne}</Text>

                                    }

                                    <PrimaryInput
                                        style={styles.socialInput}
                                        placeholder={"رابط مواقع التواصل الاجتماعي"}
                                        rightContent={
                                            <Feather name="link" style={styles.linkIcon} />
                                        }
                                        onChange={handleChange("linkTwo")}
                                        onBlur={handleBlur("linkTwo")}
                                        value={values.linkTwo}
                                        error={touched.linkTwo && errors.linkTwo}
                                    />
                                    {
                                        touched.linkTwo && errors.linkTwo &&
                                        <Text style={[errorStyle.error, { marginBottom: 8 }]}> {touched.linkTwo && errors.linkTwo}</Text>
                                    }
                                    <PrimaryButton
                                        style={styles.submit}
                                        title={"إرسال"}
                                        onPress={handleSubmit}
                                        disabled={!isValid && !loading}

                                        loading={loading}

                                    />

                                </View>

                            )
                        }


                    </Formik>

                </ScrollView>

            }
            {
                fetchingData &&
                <LoadingActivity />

            }
            {

                !fetchingData && pendingRequest &&

                <ValidationRequest
                    validationRequest={pendingRequest}
                    tryAgain={tryAgain}
                    loading = { loading }
                />
            }
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    blueIcon: {
        color: "blue",
        fontSize: 14
    },
    text: {
        fontFamily: textFonts.regular,
        lineHeight: 24,
        color: "#666"
    },
    content: {
        padding: 16
    },
    label: {
        color: "#212121",
        fontFamily: textFonts.bold
    },
    row: {
        flexDirection: "row",

        marginHorizontal: -8,
        alignItems: "center"

    },
    rowInput: {
        flex: 1,
        marginHorizontal: 8
    },
    input: {
        marginVertical: 16,
        borderRadius: 4,
        height: 52,

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
        marginHorizontal: 8,

    },
    uploader: {
        marginHorizontal: 8,
        marginVertical: 0,
        flex: 1,
    },
    uploadRow: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 4,
        marginHorizontal: 0,
        marginBottom: 16
    },
    col: {
        flex: 1,
        marginVertical: 16,
        marginHorizontal: 16,

    },
    socialInput: {
        marginBottom: 16,
        height: 52,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#1A6ED855",
        borderRadius: 4
    },
    linkIcon: {
        color: "#666",
        fontSize: 24,
        paddingRight: 16
    },
    submit: {
        marginVertical: 56,

    }

})


const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    text: {
        fontFamily: textFonts.regular,
        lineHeight: 24,
        color: darkTheme.secondaryTextColor
    },
    label: {

        color: darkTheme.textColor,
        fontFamily: textFonts.bold

    },

    dropdown: {
        ...lightStyles.dropdown,
        borderColor: darkTheme.borderColor,
        backgroudColor: darkTheme.secondaryBackgroundColor,

    },
    dropdownText: {
        backgroudColor: darkTheme.secondaryBackgroundColor,
        color: darkTheme.textColor
    },
    socialInput: {
        marginBottom: 16,
        height: 52,
        backgroundColor: darkTheme.secondaryBackgroundColor,
        borderWidth: 1,
        borderColor: darkTheme.borderColor,
        borderRadius: 4
    },

}

