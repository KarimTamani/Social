import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../../components/Cards/Header";
import { AntDesign } from '@expo/vector-icons';
import { textFonts } from "../../design-system/font";
import PrimaryInput from "../../components/Inputs/PrimaryInput";
import SelectDropdown from 'react-native-select-dropdown';
import FormUploader from "../../components/Inputs/FormUploader"
import countries from "../../assets/countries.json";
import { Feather } from '@expo/vector-icons';
import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useContext } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
const papers = [
    "بطاقة تعريف", "رخصة قيادة"
];

const categories = [
    "موسيقى", "تصميم"
];
export default function VerifyAccount({ navigation }) {

    const themeContext = useContext(ThemeContext) ; 
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    return (
        <View style={styles.container}>
            <Header
                title={"طلب توثيق الحساب"}
                navigation = { navigation }
            />
            <ScrollView>
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
                        />
                        <PrimaryInput
                            placeholder={"الاسم الثاني"}
                            style={[styles.input, styles.rowInput]}

                        />
                    </View>
                    <PrimaryInput
                        placeholder={"اسم المستخدم"}
                        style={styles.input}

                    />
                    <Text style={styles.text}>
                        اختيار نوع الملف
                    </Text>
                    <View style={[styles.row, styles.uploadRow]}>

                        <FormUploader
                            placeholder={"ملف"}
                            style={styles.uploader}
                            noDisplay={true}
                        />
                        <SelectDropdown
                            data={papers}
                            defaultValueByIndex={0}
                            buttonStyle={styles.dropdown}
                            onSelect={(selectedItem, index) => {
                                console.log(selectedItem, index)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return <Text style={styles.dropdownText}>{selectedItem}</Text>

                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                        />

                    </View>
                    <Text style={styles.label}>
                        الخطوة التانية 2: تأكيد الشهرة

                    </Text>
                    <View style={styles.row}>

                        <View style={styles.col}>

                            <Text style={[styles.label, { marginBottom: 8 }]}>
                                دولة
                            </Text>
                            <SelectDropdown
                                data={countries}
                                defaultButtonText={"اختر بلدك"}
                                defaultValueByIndex={0}
                                buttonStyle={styles.dropdown}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return <Text style={styles.dropdownText}>{selectedItem.name}</Text>

                                    
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item.name
                                }}
                            />
                        </View>

                        <View style={styles.col}>
                            <Text style={[styles.label, { marginBottom: 8 }]}>
                                فئة
                            </Text>
                            <SelectDropdown
                                data={categories}
                                defaultButtonText={"اختر بلدك"}
                                buttonStyle={styles.dropdown}
                                
                                defaultValueByIndex={0}
                                onSelect={(selectedItem, index) => {
                                    console.log(selectedItem, index)
                                }}
                                buttonTextAfterSelection={(selectedItem, index) => {
                                    return <Text style={styles.dropdownText}>{selectedItem}</Text>
                                }}
                                rowTextForSelection={(item, index) => {
                                    return item
                                }}
                            />
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
                        rightContent = { 
                            <Feather name="link" style={styles.linkIcon} />
                        }
                    />
                    <PrimaryInput
                        style={styles.socialInput}
                        placeholder={"رابط مواقع التواصل الاجتماعي"}
                        rightContent = { 
                            <Feather name="link" style={styles.linkIcon} />
                        }
                    />
                    <PrimaryButton
                        style={styles.submit} 
                        title = { "إرسال" }
                    />
                </View>
            </ScrollView>

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
        marginHorizontal: 8
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
        marginHorizontal: 16
    } , 
    socialInput : { 
        marginBottom : 16 , 
        height : 52 ,  
        backgroundColor : "white" , 
        borderWidth : 1 , 
        borderColor : "#1A6ED855" , 
        borderRadius : 4 
    } , 
    linkIcon : { 
        color : "#666" , 
        fontSize : 24 , 
        paddingRight :  16 
    } , 
    submit : { 
        marginVertical : 56 , 
        
    }

})


const darkStyles = { 
    ...lightStyles , 
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },
    text: {
        fontFamily: textFonts.regular,
        lineHeight: 24,
        color: darkTheme.secondaryTextColor
    } , 
    label: {
        
        color: darkTheme.textColor , 
        fontFamily: textFonts.bold
    
    } , 
   
    dropdown: {
        ...lightStyles.dropdown , 
        borderColor: darkTheme.borderColor ,
        backgroudColor : darkTheme.secondaryBackgroundColor , 

    },
    dropdownText : { 
        backgroudColor : darkTheme.secondaryBackgroundColor , 
        color : darkTheme.textColor 
    }, 
    socialInput : { 
        marginBottom : 16 , 
        height : 52 ,  
        backgroundColor : darkTheme.secondaryBackgroundColor , 
        borderWidth : 1 , 
        borderColor : darkTheme.borderColor  , 
        borderRadius : 4 
    } , 
    
}

