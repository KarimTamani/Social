import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, I18nManager } from 'react-native';
import RootNavigation from './src/routes/RootNavigation';
import { useFonts, loadAsync } from "expo-font";
import * as Updates from "expo-updates"
import { useCallback, useEffect, useMemo, useState, memo } from 'react';
import ThemeContext from './src/providers/ThemeContext';
import darkTheme from './src/design-system/darkTheme';
import { ApolloProvider } from './src/providers/ApolloContext';
import { AuthProvider } from './src/providers/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventProvider from './src/providers/EventProvider';
import RealTimeProvider from './src/providers/RealTimeContext';
import NotificationProvider from './src/providers/NotificationProvider';
import TimeProvider from './src/providers/TimeProvider';

export default function App() {

  const [theme, setTheme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAuth, setUserAuth] = useState(null);

  const themeHandler = useMemo(() => ({
    toggleTheme: () => {

      const newTheme = theme == "light" ? "dark" : "light";
      setTheme(newTheme);

      AsyncStorage.setItem("theme", newTheme);

    },
    getTheme: () => {
      return theme;
    }
  }
  ));

  useEffect(() => {

    (async () => {

      if (I18nManager.isRTL) {
        I18nManager.forceRTL(false);
        I18nManager.allowRTL(false);
        return await Updates.reloadAsync();
      }
      /*
      await loadAsync({
        "Noto-Regular": require("./src/assets/fonts/NotoSansArabic-Regular.ttf"),
        "Noto-Medium": require("./src/assets/fonts/NotoSansArabic-Medium.ttf"),
        "Noto-SemiBold": require("./src/assets/fonts/NotoSansArabic-SemiBold.ttf"),
        "Noto-Bold": require("./src/assets/fonts/NotoSansArabic-Bold.ttf"),
      });
      */
      const storedTheme = await AsyncStorage.getItem("theme");

      if (storedTheme) {
        setTheme(storedTheme);
      } else
        setTheme("light");
      setIsLoading(false)
    })();

  }, [])


  const onAuthChange = useCallback((userAuth) => {
    setUserAuth(userAuth)
  }, []);

  if (isLoading && theme == null)
    return null;


  const renderApp = () => (
    <ThemeContext.Provider value={themeHandler} >
      <SafeAreaView style={styles.container}>
        <RootNavigation
          initialRouteName={"HomeNavigation"}
        >
        </RootNavigation>
        {
          theme == "light" && <StatusBar backgroundColor='white' style="dark" />
        }
        {
          theme == "dark" && <StatusBar backgroundColor={darkTheme.backgroudColor} style="light" />
        }
      </SafeAreaView>
    </ThemeContext.Provider>
  );


  return (
    <EventProvider>
      <AuthProvider onAuthChange={onAuthChange}>
        <ApolloProvider userAuth={userAuth}>
          <TimeProvider>
            {
              userAuth &&
              <RealTimeProvider userAuth={userAuth}>
                <NotificationProvider userAuth={userAuth}>

                  {

                    renderApp()
                  }
                </NotificationProvider>
              </RealTimeProvider>
            }
            {
              !userAuth &&
              renderApp()
            }
          </TimeProvider>
        </ApolloProvider>
      </AuthProvider>
    </EventProvider >

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
});
