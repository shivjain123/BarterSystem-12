import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';

import MyHeader from '../components/MyHeader';

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            userId: firebase.auth().currentUser.email,
            userName: "",
            receiverId: this.props.navigation.getParam("details")["email_Id"],
            exchangeId: this.props.navigation.getParam('details')["exchange_id"],
            itemName: this.props.navigation.getParam("details")["item_name"],
            description: this.props.navigation.getParam("details")["description"],
            itemValue: this.props.navigation.getParam("details")["item_value"],
            receiverName: '',
            receiverContact: '',
            receiverAddress: '',
            receiverRequestDocId: ''
        }
    }

    getUserDetails = async (userId) => {
        db.collection("users").where('emailId', '==', userId).get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.data().first_name);
                    this.setState({
                        userName: doc.data().first_name + " " + doc.data().last_name
                    })
                })
            })
    }

    getReceiverDetails = async () => {
        console.log(this.state.receiverId);
        db.collection('users').where('emailId', '==', this.state.receiverId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({
                        receiverName: doc.data().first_name,
                        receiverContact: doc.data().mobile_number,
                        receiverAddress: doc.data().address,
                    })
                })
            });

        db.collection('exchange_requests').where('exchange_id', '==', this.state.exchangeId).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.setState({ 
                        receiverRequestDocId: doc.id 
                    })
                })
            })
    }

    updateBarterStatus = async () => {
        db.collection('all_Barters').add({
            "item_name": this.state.itemName,
            "exchange_id": this.state.exchangeId,
            "requested_by": this.state.receiverName,
            "donor_id": this.state.userId,
            "request_status": "Donor Interested"
        })
    }

    addNotification = () => {
        console.log("in the function ", this.state.rec)
        var message = this.state.userName + " has shown interest in exchanging the item"
        db.collection("all_notifications").add({
            "targeted_user_id": this.state.receiverId,
            "donor_id": this.state.userId,
            "exchangeId": this.state.exchangeId,
            "item_name": this.state.itemName,
            "date": firebase.firestore.FieldValue.serverTimestamp(),
            "notification_status": "unread",
            "message": message
        })
    }

    componentDidMount() {
        this.getReceiverDetails()
        this.getUserDetails(this.state.userId)
    }

    render(){
        return(
            <View style={styles.container}>
            <View style={{ flex: 0.1 }}>
                <MyHeader
                    leftComponent={<Icon name='arrow-left' type='feather' color='#696969' onPress={() => this.props.navigation.goBack()} />}
                    centerComponent={{ text: "Exchange Items"}}
                />
            </View>
                <View style={{ flex: 0.3 }}>
                    <Card
                        title={"Item Information"}
                        titleStyle={{ fontSize: 20 }}
                    >
                        <Card >
                            <Text style={{ fontWeight: 'bold' }}>Name : {this.state.itemName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Reason : {this.state.description}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Price : {this.state.itemValue}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={{ flex: 0.3 }}>
                    <Card
                        title={"Reciever Information"}
                        titleStyle={{ fontSize: 20 }}
                    >
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Name: {this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Contact: {this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{ fontWeight: 'bold' }}>Address: {this.state.receiverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={styles.buttonContainer}>
                    {
                        this.state.recieverId !== this.state.userId
                            ? (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        this.updateBarterStatus();
                                        this.addNotification();
                                        this.props.navigation.navigate('MyBarters');
                                    }}>
                                    <Text>I want to Exchange</Text>
                                </TouchableOpacity>
                            )
                            : null
                    }
                </View>
            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'orange',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 16
    }
})