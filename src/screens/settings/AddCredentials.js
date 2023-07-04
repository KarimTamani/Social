import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Header from "../../components/Cards/Header";
import PrimaryInput from "../../components/Inputs/PrimaryInput";


import PrimaryButton from "../../components/Buttons/PrimaryButton";
import { useCallback, useContext, useEffect, useState } from "react";
import ThemeContext from "../../providers/ThemeContext";
import darkTheme from "../../design-system/darkTheme";
import { ApolloContext } from "../../providers/ApolloContext";
import { gql } from "@apollo/client";
import SelectDropdown from 'react-native-select-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { errorStyle } from "../../design-system/errorStyle";
import { event } from "../../providers/EventProvider";

const WIDTH = Dimensions.get("screen").width
export default function AddCredentials({ navigation, route }) {

    const user = route?.params?.user
    const client = useContext(ApolloContext);
    const [countries, setCountries] = useState([])
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [searchCountries, setSearchCountries] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [phoneError, setPhoneError] = useState();
    const [passwordError, setPasswordError] = useState();


    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        client.query({
            query: gql`
            query GetCountries {
                getCountries {
                  id
                  name
                  dialCode 
                }
            }`
        }).then(response => {

            if (response && response.data) {

                  
                var countries = response.data.getCountries;

                setCountries(countries);
                setSearchCountries(countries);

            
                if ( user.phone)
                var userCountry = countries.find(c => user?.phone.includes(c.dialCode));
                if (userCountry)  { 
                    setSelectedCountry(userCountry) ;
                 
                    setPhone( user.phone.replace(userCountry.dialCode , "") ) ;  
                    return ; 
                } 
                userCountry = countries.find(c => c.id == user?.country?.id);
                if (userCountry)
                    setSelectedCountry(userCountry);
                else
                    setSelectedCountry(countries[0]);

            }
        })
    }, [])


    useEffect(() => {
        setError(false) ; 
        if (!selectedCountry || !phone)
            return;
        var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        setPhoneError(!regex.test(selectedCountry?.dialCode + phone));

    }, [selectedCountry, phone]);

    useEffect(() => {
        setError(false) ; 
        if (!password)
            return;
        setPasswordError(password.trim().length < 6 || password.trim().length > 56 || password.includes(" "))
    }, [password])



    const themeContext = useContext(ThemeContext);
    const styles = themeContext.getTheme() == "light" ? lightStyles : darkStyles

    

    const addPhoneNumber = useCallback(() => { 
 
        var internationalPhoneNumber = selectedCountry?.dialCode + phone ; 
        setError(false) ; 
        setLoading(true) ; 
      
        client.mutate({
            mutation : gql`
            mutation AddPhoneNumber($phone: String!, $password: String!) {
                addPhoneNumber(phone: $phone, password: $password) {
                    id 
                    phone
                }
            }
                        `, 
            variables : { 
                phone : internationalPhoneNumber , 
                password : password 
            }
        }).then(response => { 
            setLoading(false) ; 
             
            if (response) { 
               
                event.emit("edit-profile") ; 
                setPassword(null) ; 
                setError(false) ; 
                setPasswordError(false) ; 
                setShowPassword( false )  ;
                navigation.navigate("MyProfile")
            }
            else 
                setError(true) ; 

        }).catch(err => {  
            setLoading(false) ; 
            setError(true) ; 
        } )

    } , [selectedCountry , phone , password ])


    return (
        <View style={styles.container}>
            <Header
                title={"اضافة رقم الهاتف"}
                navigation={navigation}
            />
            <View style={styles.form}>
                <View style={styles.phoneInput}>

                    <PrimaryInput
                        placeholder={"رقم الهاتف"}
                        style={styles.input}
                        phone={true}
                        onChange={setPhone}
                        error={phoneError}
                        value={phone }

                    />

                    <SelectDropdown
                        data={searchCountries}
                        search={true}
                        onChangeSearchInputText={(searchText) => {
                            setSearchCountries(countries.filter(country => country.name.includes(searchText.trim())))
                        }}
                        dropdownStyle={styles.dropdownStyle}
                        searchInputStyle={styles.searchInputStyle}
                        defaultButtonText={selectedCountry?.dialCode}
                        buttonStyle={styles.dropdown}
                        onSelect={(selectedItem, index) => {

                            setSelectedCountry(selectedItem);
                            //         setFieldValue("countryId", selectedItem.id);
                        }}

                        buttonTextAfterSelection={(selectedItem, index) => {
                            return <Text style={styles.dropdownText}>{selectedItem.dialCode}</Text>
                        }}
                        rowTextForSelection={(item, index) => {
                            return <Text style={styles.dropdownText}>{item.name}</Text>
                        }}
                        buttonTextStyle={styles.dropDownButtonText}
                    />

                </View>
                {
                    phoneError &&
                    <Text style={[errorStyle.error, styles.error]}>
                        رقم الهاتف غير صحيح
                    </Text>
                }
                <PrimaryInput
                    placeholder={"كلمة المرور"}
                    style={styles.passwordInput}
                    inputStyle={styles.inputStyle}
                    secure={!showPassword}
                    onChange={setPassword}
                    value={password}
                    error={passwordError}



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
                {
                    passwordError &&

                    <Text style={[errorStyle.error, styles.error]}> كلمة السر تكون بين 6 - 56 وخالية من الفراغات </Text>

                }
                <PrimaryButton
                    title={"إرسال"}
                    style={styles.sendButton}
                    disabled={!password || !selectedCountry || !phone || phoneError || passwordError}
                    loading={loading}
                    onPress={ addPhoneNumber}
                />
                {
                    error &&
                    <Text style={[errorStyle.errorMessage, { marginVertical: 16 }]}>
                       حدث خطأ ، من فضلك تأكد من رقم الهاتف و كلمة السر
                    </Text>
                }
            </View>
        </View>
    )
};

const lightStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    input: {
        marginVertical: 16,

        height: 52,

        flex: 1,
        borderRadius: 0


    },
    form: {
        padding: 16
    },
    icon: {
        fontSize: 20,
        color: "#666",
        paddingLeft: 16,
    },
    sendButton: {
        marginVertical: 56
    },

    dropdown: {
        width: 64,
        backgroundColor: "#eee",

        height: 52,


    },
    dropdownStyle: {

        width: WIDTH - 32
    },
    searchInputStyle: {
        width: WIDTH - 32

    },

    dropDownButtonText: {

        flex: 1,
        width: "100%",
        position: "absolute",
        textAlign: "right",

    },
    phoneInput: {
        flexDirection: "row-reverse",
        alignItems: "center",
        height: 56
    },


    passwordInput: {
        marginTop: 16,
        borderRadius: 0,
        height: 52,

    },
    showButton: {

        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        borderRightColor: "#ddd",
        borderRightWidth: 1
    },

    error: {
        marginTop: 4
    }
})

const darkStyles = {
    ...lightStyles,
    container: {
        flex: 1,
        backgroundColor: darkTheme.backgroudColor
    },

    dropdown: {
        width: 64,
        backgroundColor: darkTheme.secondaryBackgroundColor,

        height: 52,


    },
    dropDownButtonText: {

        flex: 1,
        width: "100%",
        position: "absolute",
        color: darkTheme.textColor,
        fontSize: 14,


    }

}