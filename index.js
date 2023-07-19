//import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';
import App from './App';
import { PushNotificationConfig } from './src/providers/NotificationProvider';
import { registerRootComponent } from 'expo';
import { NotificationNavigator } from './src/routes/NotificationNavigator';


 
try {
  
    AppRegistry.registerComponent('main', () => App);
    PushNotificationConfig(NotificationNavigator);

} catch (error) {
   
    registerRootComponent(App);

} 
 
 
 
 
 

 
//registerRootComponent(App);
