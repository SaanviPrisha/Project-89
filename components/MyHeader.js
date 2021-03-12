import React from 'react';
import { StyleSheet } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements'
import db from '../config'
import 'firebase' from firebase

export default class MyHeader extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
      userId: firebase.auth().currentUser.email
    }
  }
  getNumberOfNotifications = () => {
    db.collection("All_Notifications").where("notification_status","==","unread").where("target_user_id","==",this.state.userId)
    .onSnapshot(snapshot => {
      var count = snapshot.docs.map(doc => doc.data())
      this.setState({
        count: count.length
      })
    })
  }
  componentDidMount() {
    this.getNumberOfNotifications()
  }
  render() {
    return (
      <Header 
        centerComponent={{
            text: this.props.title,
            style: {fontSize: 28, fontFamily: "Fantasy"}
        }}
        backgroundColor="#94ebaf"
        leftComponent={<Icon name="bars" type="font-awesome" onPress={() => {
          this.props.navigation.toggleDrawer()
        }}/>}
        rightComponent={<View><Icon name="bell" type="font-awesome" size={25} color={"black"}/>
      <Badge value={this.state.count} containerStyle={{position: "absolute", top:-4, right:-4}}/></View>
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
