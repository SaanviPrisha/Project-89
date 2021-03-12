import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer'
import { Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import * as Permissons from 'expo-permissions'
import db from '../Config'
import firebase from 'firebase'

export default class Sidebar extends React.Component {
  constructor() {
    super()
    this.state = {
      image: '#',
      userId: firebase.auth().currentUser.email,
      username: ''
    }
  }
  selectPicture = async () => {
    const { cancel, uri } = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality: 1
     })
     if(!cancel) {
       this.uploadImage(uri,this.state.userId)
     } 
  }
  uploadImage = async (uri,email) => {
    var response = await fetch(uri)
    var blob = await response.blob()
    var ref = firebase.storage().ref().child("user_profiles/" + email)
    return( ref.put(blob).then(response => {
      this.fetchImage(email)
    }) )
  }
  fetchImage = (email) => {
    var ref = firebase.storage().ref().child("user_profiles/" + email)
    ref.getDownloadURL().then(uri => {
      this.setState({
        image: uri
      })
    }).catch(error => {
      this.setState({
        image: '#'
      })
    })
  }
  getUserDetails = () => {
    db.collection("Users").where("email_id","==",this.state.userId).get()
      .then((snapshot) => {
        snapshot.forEach(doc => {
          var data = doc.data()
          this.setState({
            username: data.first_name + " " + data.last_name,
          })
        });
      })
  }
  componentDidMount() {
    this.fetchImage(this.state.userId)
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Avatar 
            rounded
            showEditButton
            source = {{uri: this.state.image }}
            size = "medium"
            containerStyle = {styles.avatar}
            onPress = {() => {
              this.selectPicture()
            }}
          />
         <Text style={styles.login}>{this.state.username}</Text>
        </View>
        <View style={styles.center}>
            <DrawerItems 
                {...this.props}
            />
        </View>
        <View style={{flex: 0.2}}>
            <TouchableOpacity style={styles.button} onPress={() => {
                firebase.auth().signOut()
                this.props.navigation.navigate("LoginScreen")
            }}>
                <Text style={styles.text}>Logout</Text>
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
    flex: 0.8,
  },
  button: {
    width: '100%',
    height: 40,
    backgroundColor: "#94ebaf",
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 15, 
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  avatar: {
    width: '40%',
    height: '20%',
    margin: 20,
    borderRadius: 30,
    alignSelf: 'center'
  },
  login: {
    fontSize: 15, 
    fontWeight: 'bold',
    alignSelf: 'center',
    marginTop: 10
  }
});
