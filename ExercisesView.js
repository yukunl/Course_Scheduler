import React from 'react';
import { Text, Button, View } from 'react-native';
import {
    Alert,
    Modal,
    TouchableHighlight, TextInput
  } from "react-native";
import { StyleSheet } from 'react-native';
import { Card } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker';

class ExercisesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            activities: [],
            modalVisible: false,
            mname:"",
            mcalories: 0,
            mduration: 0,
            mdate:""
        }
        this.handleAdd = this.handleAdd.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.exerciseEdit = this.exerciseEdit.bind(this);

    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }

    async componentDidMount() {  
         this.setState({token: this.props.accessToken})
         
         await fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
             }
          })
            .then(res => res.json())
            .then(res => {
              if(res.message === "Token is missing!" || res.message ===  "Token is invalid!"){
                  alert(res.message)
              }else{
              this.setState({
                activities : res.activities
              }); }
            });

            this.focusListener = this.props.navigation.addListener('focus', async() => {
                await fetch('https://mysqlcs639.cs.wisc.edu/activities/', {
                    method: 'GET',
                    headers: {'x-access-token': this.props.accessToken},
                })
                .then((res) => res.json())
                .then((res) => {
                    this.setState({
                        activities : res.activities
                      });
                });
            });
    }

    
    
    handleAdd(){
        this.props.navigation.navigate('ExerciseAdd');
      }
    
     exerciseEdit(currentId){
        
        let updatedExercise = {}; 
        if(this.state.mname !== ""){
            updatedExercise.name = this.state.mname;
        }
        if(this.state.mcalories !== 0){
            updatedExercise.calories = this.state.mcalories;
        }
        if(this.state.mduration !== 0){
            updatedExercise.duration = this.state.mduration;
        }
        if(this.state.mdate !== ""){
            updatedExercise.date = this.state.mdate;
        }
        
        fetch('https://mysqlcs639.cs.wisc.edu/activities/' + currentId, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken,
            },
            body: JSON.stringify(updatedExercise)
        })
        .then((res) => res.json())
        .then((res) => {
        })
        .catch((error) => {
            alert("Oh no! Could not update")
        });


         fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token': this.props.accessToken
             }
          })
            .then(res => res.json())
            .then(res => {
              if(res.message === "Token is missing!" || res.message ===  "Token is invalid!"){
                  alert(res.message)
              }else{
              this.setState({
                activities : res.activities
              }); }
            });

    }


    async handleDelete(currentId){
      await fetch('https://mysqlcs639.cs.wisc.edu/activities/' + currentId,  {
        method: 'DELETE',
        headers: {'x-access-token': this.props.accessToken}
          })
            .then(res => res.json())
            .then(res => {
                if (res.message === "Activity deleted!") {
                                        } else {
                       alert(JSON.stringify(res.message));
                    //   alert(this.state.token)
                     // alert( currentId)
                    }

            });

            await fetch('https://mysqlcs639.cs.wisc.edu/activities', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'x-access-token': this.props.accessToken
                 }
              })
                .then(res => res.json())
                .then(res => {
                  if(res.message === "Token is missing!" || res.message ===  "Token is invalid!"){
                      alert(res.message)
                  }else{
                  this.setState({
                    activities : res.activities
                  }); }
                });
    }

     
    
    getActivity(){
        let activities = this.state.activities;
        const { modalVisible } = this.state;
        return activities.map((value, index) => {
            return(
            <Card key={value.id}>
            <Card.Title> {value.name}</Card.Title>
            <Text>{value.calories} kcal burned</Text>  
            <Text>{value.date} </Text>
            <Text>{value.duration} minutes</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Button style={styles.openButton} title="Delete" onPress={() =>this.handleDelete(value.id)}/>
           
            <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Editing ... </Text>
              
       
        <Text>Exercise Name</Text>
        <TextInput style={styles.input}
          placeholderTextColor="#992a20"
          onChangeText={ (name) => this.setState({ mname: name })}
          defaultValue={value.name}
          autoCapitalize="none" />
         <Text>Exercise Calories Burnt</Text>
        <TextInput style={styles.input}
          underlineColorAndroid="blue"
          placeholderTextColor="#992a20"
          onChangeText={ (cal) => this.setState({ mcalories: cal })}
          defaultValue={String(value.calories)}
          autoCapitalize="none" />
          <Text>Duration</Text>
        <TextInput style={styles.input}
          underlineColorAndroid="blue"
          placeholderTextColor="#992a20"
          onChangeText={ (dur) => this.setState({ mduration: dur })}
          defaultValue={String(value.duration)}
          autoCapitalize="none" />
          <DatePicker   confirmBtnText="Set"
                        cancelBtnText="Cancel"
                        date={this.state.date}   
                        mode="date" 
                        defaultValue={value.date}
                        onDateChange={date => {
                            this.setState({ mdate: date });
                        }}
                    />

              
              <Button title="Update" onPress={() => {this.exerciseEdit(value.id);
                  this.setModalVisible(!modalVisible);
                }}></Button>
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2F96F3" }}
                onPress={() => {
                  this.setModalVisible(!modalVisible);
                }}
              > 
                <Text style={styles.textStyle}>cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Edit</Text>
        </TouchableHighlight>
      </View>
      </View>

            </Card>
            )
        })
        
    }
    render() {
        return (
       <>
       <ScrollView>
         {this.getActivity()}
         <Button  style={styles.buttonInline} title="Add new Exercise" onPress={this.handleAdd} />

       </ScrollView>
       </>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 5,
        padding: 10
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
   
  });

export default ExercisesView;