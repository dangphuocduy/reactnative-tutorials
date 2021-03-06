import React, { Component } from 'react';
import {
  Alert,
  View, Text, TextInput, Button,
  Platform, StyleSheet,
  Keyboard, KeyboardAvoidingView,
  ScrollView, FlatList, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';

import firebase from 'react-native-firebase';
import Moment from 'moment';
import MainContainer from '../../components/MainContainer';

export default class AuthWithPhoneNumberScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: '',
      verificationCode: null,
      confirmResult: null,
      loading: true
    }
  }

  componentDidMount() {
    this.authSubscription = firebase.auth().onAuthStateChanged((user) => {
      this.setState({
        loading: false,
        user,
      });
    });
  }

  /**
    * Don't forget to stop listening for authentication state changes
    * when the component unmounts.
    */
  componentWillUnmount() {
    this.authSubscription();
  }

  // LOGIN WITH PHONE NUMBER
  onPressLoginWithPhoneNumberButton = () => {
    const { phoneNumber } = this.state;
    firebase.auth().signInWithPhoneNumber(phoneNumber)
      .then((confirmResult) => {
        // This means that the SMS has been sent to the user
        // You need to:
        //   1) Save the `confirmResult` object to use later
        this.setState({ confirmResult });
        //   2) Hide the phone number form
        //   3) Show the verification code form
      })
      .catch((error) => {
        const { code, message } = error;
        Alert.alert('Login failed', message);
      });
  }


  onPressVerificationCodeButton = () => {
    const { confirmResult, verificationCode } = this.state;
    confirmResult.confirm(verificationCode)
      .then((user) => {
        // If you need to do anything with the user, do it here
        // The user will be logged in automatically by the
        // `onAuthStateChanged` listener we set up in App.js earlier
      })
      .catch((error) => {
        const { code, message } = error;
        Alert.alert('Login failed', message);
        // For details of error codes, see the docs
        // The message contains the default Firebase string
        // representation of the error
      });
  }

  onPressLogoutButton = () => {

    firebase.auth().signOut()
      .then((user) => {
        console.log(user);

      })
      .catch((error) => {
        const { code, message } = error;
        console.log(message);
      });
  }

  render() {
    // The application is initialising
    if (this.state.loading) {
      return null;
    };
    // The user is an Object, so they're logged in
    if (this.state.user) {
      return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.header}>
              Firebase Authentication
            </Text>
            <View style={{ height: 8 }}></View>
            <Text style={styles.title}>
              Log in using phone number
            </Text>
          </View>
          <View style={styles.middleContainer}>

          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={this.onPressLogoutButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  Log out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.header}>
            Firebase Authentication
            </Text>
          <View style={{ height: 8 }}></View>
          <Text style={styles.title}>
            Log in using phone number
            </Text>
        </View>
        <View style={styles.middleContainer}>
          {
            !this.state.confirmResult &&
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={"Phone number"}
                autoFocus={true}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType={'phone-pad'}
                onChangeText={(text) => { this.setState({ phoneNumber: '+84' + text }) }}
              />
            </View>
          }
          <View style={{ height: 30 }}></View>
          <View style={{ height: 30 }}>
            <Text>{this.state.phoneNumber}</Text>
          </View>
          {
            this.state.confirmResult &&
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={"Verification Code"}
                autoCapitalize='none'
                autoCorrect={false}
                keyboardType={'default'}
                onChangeText={(text) => { this.setState({ verificationCode: text }) }}
              />
            </View>
          }

        </View>
        <View style={styles.bottomContainer}>
          {
            !this.state.confirmResult &&
            <TouchableOpacity style={styles.buttonContainer} onPress={this.onPressLoginWithPhoneNumberButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  Login with phone number
                </Text>
              </View>
            </TouchableOpacity>
          }

          {
            this.state.confirmResult &&
            <TouchableOpacity style={styles.buttonContainer} onPress={this.onPressVerificationCodeButton}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>
                  Verify
                </Text>
              </View>
            </TouchableOpacity>
          }
        </View>
      </KeyboardAvoidingView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  middleContainer: {
    flex: 3,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  bottomContainer: {
    flex: 2,
    width: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end'
  },

  logoText: {
    fontSize: 32,
    fontWeight: '700',
  },
  header: {
    color: '#000000',
    fontSize: 20,
  },

  title: {
    fontSize: 14,
  },

  link: {
    fontSize: 14,
    color: '#0984e3',
    alignSelf: 'center',
  },

  disabledTextInputContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dfe6e9',
    width: '90%',
    height: 32
  },

  textInputContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#0984e3',
    width: '90%',
    height: 48
  },

  textInput: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
    width: 200,
    height: 48,
  },

  buttonContainer: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 16,
  },

  button: {
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#0984e3',
    height: 40
  },
  buttonText: {
    color: '#ffffff',
  }


});