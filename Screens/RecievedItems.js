import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem, Icon } from 'react-native-elements'
import { RFValue } from 'react-native-responsive-fontsize'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class RecievedBooks extends React.Component {
  constructor() {
    super()
    this.state = {
      userId: firebase.auth().currentUser.email,
      allItems: [],
    }
  }
  getAllRecievedItems = () => {
    db.collection("Recieved_Items").where("user_id", "==", this.state.userId).onSnapshot((snapshot) => {
      var items = []
      snapshot.docs.map((doc) => {
        var recieved = doc.data()
        recieved["Doc_Id"] = doc.id
        items.push(recieved)
      })
      this.setState({
        allItems: items
      })
    })
  }
  componentDidMount() {
    this.getAllRecievedItems()
  }
  renderItem = ({item, i}) => (
    <ListItem 
      key={i}
      title={item.book_name}
      subtitle={item.book_status}
      titleStyle= {{fontSize: 20, fontFamily: "Courier New"}}
      leftElement={<Icon 
        name="book"
        type="font-awesome"
        containerStyle={{marginRight: 20}}
      />}
      bottomDivider
    />
  )

  keyExtractor = (item, index) => index.toString()
  render() {
    return (
      <View style={styles.container}>
        <MyHeader title={"Recieved Items"}/>
        <View style={{flex: 1}}>
        {this.state.allBooks.length == 0 ? (
          <View style={{flex: 1}}>
            <Text style={styles.login}>No Items Recieved</Text>
          </View>
        ): (
          <FlatList 
            data={this.state.allItems}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
          />
        )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  login: {
    fontSize: RFValue(16),
    marginTop: 20,
    fontFamily: 'Courier New',
    fontWeight: 'bold'
  },
});
