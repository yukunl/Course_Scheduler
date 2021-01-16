import React from 'react';
import { Text,Button, View } from 'react-native';
import {
    Alert,
    Modal,
    TouchableHighlight, TextInput
  } from "react-native";
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-datepicker';


class ExerciseAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            calories: 0,
            duration: 0,
            date:""
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.addExercise = this.addExercise.bind(this);

    }

    componentDidMount() {
    

    }

    

   async addExercise(){
        await fetch('https://mysqlcs639.cs.wisc.edu/activities', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                "x-access-token": this.props.accessToken
             },
            body: JSON.stringify({
                name : this.state.name,
                date : this.state.date,
                calories :this.state.calories, 
                duration : this.state.duration
            })
          })
            .then(res => res.json())
            .then(res => {
              if (res.message === "Activity created!") {
                this.props.navigation.navigate('ExerciseView');
                alert(JSON.stringify(res.message));
              } else {
                alert(JSON.stringify(res.message));
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
                    // activities : res.activities
                  }); }
                });
    }

    handleCancel() {
        this.props.navigation.navigate('ExerciseView');
      }


    render() {
        return (
        <>
        <View>
        <Text> Add My New Exercise</Text>
        <Text>Exercise Name</Text>
        <TextInput style={styles.input}
          placeholder="Running"
          placeholderTextColor="#992a20"
          onChangeText={ (name) => this.setState({ name: name })}
          value={this.state.name}
          autoCapitalize="none" />
         <Text>Exercise Calories Burnt</Text>
        <TextInput style={styles.input}
          underlineColorAndroid="blue"
          placeholder="100 kcal"
          placeholderTextColor="#992a20"
          onChangeText={ (cal) => this.setState({ calories: cal })}
          value={this.state.calories}
          autoCapitalize="none" />
          <Text>Duration</Text>
        <TextInput style={styles.input}
          underlineColorAndroid="blue"
          placeholder="50"
          placeholderTextColor="#992a20"
          onChangeText={ (dur) => this.setState({ duration: dur })}
          value={this.state.duration}
          autoCapitalize="none" />
          <DatePicker style={styles.dateBox} 
                       placeholder="01-01-2020"
                        confirmBtnText="Set"
                        cancelBtnText="Cancel"
                        date={this.state.date}   mode="date" 
                        //useNativeDriver = 'false'
                        onDateChange={date => {
                            this.setState({ date: date });
                        }}
                    />
        
        <Button color="#942a21" style={styles.buttonInline} title="add" onPress={() => this.addExercise()} />
        <Button color="#942a21" style={styles.buttonInline} title="Return Home" onPress={this.handleCancel} />
        </View>
        
        </>
        );
    }
}

const styles = StyleSheet.create({

    input: {
        width: 200,
        padding: 10,
        margin: 5,
        height: 40,
        borderColor: '#c9392c',
        borderWidth: 1
      }
   
  });

export default ExerciseAdd;