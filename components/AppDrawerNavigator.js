import { createDrawerNavigator } from 'react-navigation-drawer';

import { AppTabNavigator } from './AppTabNavigator';
import SettingScreen from '../screens/SettingScreen';
import MyBartersScreen from '../screens/MyBartersScreen';
import CustomSideBarMenu from './CustomSideBarMenu';
import NotificationsScreen from '../screens/NotificationsScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen';

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen: AppTabNavigator
    },
    MyBarters: {
        screen: MyBartersScreen
    },
    Notifications: {
        screen: NotificationsScreen
    },
    Settings: {
        screen: SettingScreen
    },
    MyReceivedItems: {
        screen: MyReceivedItemsScreen
    }
},
    {
        contentComponent: CustomSideBarMenu
    },
    {
        initialRouteName: 'Home'
    })
