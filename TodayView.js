import React from 'react';
import { Text, View } from 'react-native';


import { StyleSheet } from 'react-native';
import ExercisesView from './ExercisesView';
import { Card , Button} from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

class TodayView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activities:[],
            totalDuration:0
        }

         this.calculateDuration = this.calculateDuration.bind(this);

    }

    componentDidMount() {
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

              }); 
            }
            });

           

    }


    getActivity(){
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

       let activities = this.state.activities
       let activitiesToday = [];
        var today = new Date();
       let date= String(today.getDate());
       let year = String(today.getFullYear());
        let month = String(today.getMonth()+1);
        var todayinString = year + "-" + month + "-" + date;
         var totald = 0;
        return activities.map((value, index) => {
            let t = value.date;
            t = t.substring(0,10)
         if(t === todayinString){
            return(
            <Card key={value.id}>
            <Card.Title> {value.name}</Card.Title>
            <Text>{value.calories} kcal burned</Text>  
            <Text>{t} </Text>
            <Text>{value.duration} minutes</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            </View>
            </Card>
            )
         }
        
        })
        
        
    }
   
        calculateDuration(){   

            let activities = this.state.activities
             var today = new Date();
            let date= String(today.getDate());
            let year = String(today.getFullYear());
             let month = String(today.getMonth()+1);
             var todayinString = year + "-" + month + "-" + date;
              var totald = 0;
              
         for(let i = 0; i < activities.length; i++){
            
             if(activities[i].date === todayinString){
                 totald = totald + activities[i].duration;
             }
         }
         this.setState({
            totalDuration : totald
          });
             
        }

    render() {
        return (
        <View>
            <Text>My Exercise</Text>
            <Text>Total duration: {this.state.totalDuration}</Text>
            <Text>Goal Duration: 0</Text>
            <ScrollView>
               {this.getActivity()}
           </ScrollView>
        </View>
        )
    }
}

const styles = StyleSheet.create({
    
});

export default TodayView;