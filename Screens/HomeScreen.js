import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class HomeScreen extends React.Component {
    constructor() {
        super()
        this.state = {
            itemName: "",
            reason: "",
            description: "",
            userId: firebase.auth().currentUser.email,
            itemRequestActive: false,
            requestId: '',
            requestedItemName: '',
            itemStatus: '',
            docId: '',
            username: '',
            price: 0,
        }
    }
    requestItem = async () => {
      var rID = Math.random().toString(36).substring(7)
      db.collection("Requested_items").add({
        user_id: this.state.userId,
        itemName: this.state.itemName,
        description: this.state.description,
        reason: this.state.reason,
        request_id: rID,
        item_status: "Requested"
      })
      alert("Item was requested succesfully!")
      await this.getItemRequest()
      db.collection("Users").where("email_id","==",this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach(doc => {
          var data = doc.data()
          db.collection("Users").doc(doc.id).update({
            item_request_active: true
          })
        });
      })
    }
    getItemRequest = () => {
      db.collection("Users").where("email_id","==",this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach(doc => {
          var data = doc.data()
          this.setState({
            itemRequestActive: data.book_request_active,
            username: data.first_name + " " + data.last_name
          })
        });
      })
    }
    getItemInfo = () => {
      db.collection("Requested_items").where("user_id","==",this.state.userId).get().then((snapshot) => {
        snapshot.forEach(doc => {
          var data = doc.data()
          if(data.book_status != "Recieved") {
            this.setState({
              requestId: data.request_id,
              requestedItemName: data.book_name,
              itemStatus: data.book_status,
              docId: doc.id
            })
          }
        })
      })
    }
    updateItemStatus = () => {
      db.collection("Requested_items").doc(this.state.docId).update({
        book_status: "Recieved"
      })
      db.collection("Users").where("email_id","==",this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach(doc => {
          var data = doc.data()
          db.collection("Users").doc(doc.id).update({
            item_request_active: false
          })
        });
      })
    }
    sendNotification = async () => {
      var targetUserID = ""
      await db.collection("All_Notifications").where("request_id","==",this.state.requestId).get().then(snapshot => {
        shapshot.forEach(doc => {
          var data = doc.data()
          targetUserID = data.donor_id
        })
      })
      db.collection("All_Notifications").add({
        book_name: this.state.requestItemName,
        date: firebase.firestore.FieldValue.serverTimestamp(),
        message: this.state.username + " has recieved the book " + this.state.requestItemName + ".",
        target_user_id: targetUserID,
        notificationStatus: "unread"
      })
    }
    recievedBook = (bookName) => {
      db.collection("Recieved_Books").add({
        user_id: this.state.userId,
        book_name: bookName,
        request_id: this.state.requestId,
        bookStatus: "recieved"
      })
    }
    componentDidMount() {
      this.getBookRequest()
      this.getBookInfo()
    }
    render() {
        return (
            <View style={styles.container}>
                <MyHeader
                    title="Request"
                ></MyHeader>
                <View styles={styles.center}>
                    <TextInput
                        placeholder={'Name of the Item'}
                        style={styles.textInput1}
                        onChangeText={(text) => {
                        this.setState({
                            bookName: text
                        });}}>
                    </TextInput>
                    <TextInput
                        placeholder={'Description of Item'}
                        style={styles.textInput2}
                        multiline={true}
                        onChangeText={(text) => {
                        this.setState({
                            description: text
                        });}}>
                    </TextInput>
                    <TextInput
                        placeholder={'Price'}
                        style={styles.textInput1}
                        onChangeText={(text) => {
                        this.setState({
                            value: text
                        });}}>
                    </TextInput>
                    <TextInput
                        placeholder={'Reason of Request'}
                        style={styles.textInput2}
                        multiline={true}
                        onChangeText={(text) => {
                        this.setState({
                            reason: text
                        });}}>
                    </TextInput>
                    <TouchableOpacity onPress={() => {
                      this.requestItem()
                    }} style={styles.RequestButton}>
                        <Text style={styles.login}>Request</Text>
                    </TouchableOpacity>
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
  center: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignText: 'center',
    alignSelf: 'center',
    alignContent: 'center'
  },
  textInput1: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    width: '30%',
    height: 50,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: RFValue(20),
    marginTop: 200,
    marginLeft: 30,
  },
  textInput2: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    width: '30%',
    height: 70,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: RFValue(20),
    marginTop: 30,
    marginLeft: 30,
  },
  RequestButton: {
    marginTop: 10,
    backgroundColor: '#94ebaf',
    width: 100,
    height: 50,
    alignText: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  requestButton1: {
    marginTop: 10,
    backgroundColor: '#94ebaf',
    width: 150,
    height: 50,
    borderRadius: 5,
    alignText: 'center'
  },
  login: {
    fontSize: RFValue(16),
    marginTop: 20,
    fontFamily: 'Courier New',
    fontWeight: 'bold'
  },
  login1: {
    marginTop: 20,
    fontSize: RFValue(22),
    fontFamily: 'Georgia',
  },
});
