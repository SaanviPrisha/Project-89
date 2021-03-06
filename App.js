import React from 'react';
import { Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import LoginScreen from './Screens/SignUpLoginScreen'
import ExchangeScreen from './Screens/ExchangeScreen'
import HomeScreen from './Screens/HomeScreen'
import SettingScreen from './Screens/SettingScreen'
import DonationDetails from './Screens/DetailsScreen'
import MyDonations from './Screens/DonationScreen'
import Notification from './Screens/Notification'
import RecievedItems from './Screens/RecievedItems'


export default class App extends React.Component {
  render() {
    return (
        <Container />
    );
  }
}

const Tab = createBottomTabNavigator({
    Exchange: {screen: ExchangeScreen},
    Home: {screen: HomeScreen},
  }, {
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: () => {
        var routeName = navigation.state.routeName
        if(routeName == "Exchange") {
          return(
            <Image style={{width: 40,height: 40}}source={require('./assets/Donate.png')}></Image>
          )
        } else if(routeName == "Home") {
          return(
            <Image style={{width: 40,height: 40}} source={require('./assets/Request.png')}></Image>
          )
        }
      }
    }) 
  }

)

const Stack = createStackNavigator({
  Donate: {screen: ExchangeScreen,
  navigationOptions: {
    headerShown: false
  }},
  Details: { screen: RecieverDetails}
})
const Drawer = createDrawerNavigator({
    Home: {screen: Tab, drawerIcon: <Icon name="home" type="fontawesome5"/>},
    Settings: { screen: SettingScreen, drawerIcon: <Icon name="settings" type="fontawesome5"/> },
    Donations: { screen: MyDonations, drawerIcon: <Icon name="gift" type="font-awesome"/> },
    Notification: { screen: Notification, drawerIcon: <Icon name="bell" type="font-awesome"/> },
    Recieved_Items: { screen: RecievedItems, drawerIcon: <Icon name="bell" type="font-awesome"/> }
},{
  contentComponent: Sidebar
  },{
  initialRouteName: 'Home'
  }
)
const Switch = createSwitchNavigator({
    LoginScreen: {screen: LoginScreen},
    drawerNavigation: {screen: Drawer}
})
const Container = createAppContainer(Switch)
