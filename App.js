import React from 'react';

import LoginView from './LoginView';
import SignupView from './SignupView';

import TodayView from './TodayView'
import ExercisesView from './ExercisesView'
import ProfileView from './ProfileView'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { TouchableOpacity, Image, View, Text } from 'react-native';
import ExerciseAdd from './ExerciseAdd';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: undefined,
      username: undefined
    }

    this.login = this.login.bind(this);
    this.revokeAccessToken = this.revokeAccessToken.bind(this);

    this.SignoutButton = this.SignoutButton.bind(this);

     }

  /**
   * Store the username and accessToken here so that it can be
   * passed down to each corresponding child view.
   */
  login(username, accessToken) {
    this.setState({
      username: username,
      accessToken: accessToken
    });
  }

  /**
   * Revokes the access token, effectively signing a user out of their session.
   */
  revokeAccessToken() {
    this.setState({
      accessToken: undefined
    });
  }

  /**
   * Defines a signout button... Your first TODO!
   */
  SignoutButton = () => {
    return <>
      <View style={{ flexDirection: 'row', marginRight: 25 }}>
        <TouchableOpacity onPress={this.revokeAccessToken}>
        <Entypo name="log-out" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </>
  }
  

  ExerciseNavigation = () => {
    let ExerciseStack = createStackNavigator();
    return <>
        <ExerciseStack.Navigator>
            <>
              <ExerciseStack.Screen
                name="ExerciseView"
                options={{
                  title: 'All My Exercises', 
                }}
              >
                {(props) => <ExercisesView {...props}   accessToken={this.state.accessToken}/>}
              </ExerciseStack.Screen>

              <ExerciseStack.Screen
                name="ExerciseAdd"
                options={{
                  title: 'Add my new Exercise',
                }}
              >
                {(props) => <ExerciseAdd {...props} accessToken={this.state.accessToken}/>}
              </ExerciseStack.Screen>
              
            </>
        </ExerciseStack.Navigator>
    </>
  }


   CreateTabNavigation = () => {
    const TabNavigation = createBottomTabNavigator(); 
    return (
      <TabNavigation.Navigator
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}>
        <TabNavigation.Screen
          name="Today"
          //component={TodayView}
          options={{
            tabBarLabel: 'Today',
            tabBarIcon: ({ focused, tintColor }) => {
              let iconName = `ios-cloud${focused ? '' : '-outline'}`;
              return <MaterialIcons name="today" size={25} color="black" />;
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        > 
        {(props) => <TodayView {...props} istodayView= {true}  username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken}/>}
        </TabNavigation.Screen>
        <TabNavigation.Screen
          name="Exercise"
          component={this.ExerciseNavigation}
          options={{
            tabBarLabel: 'Exercise',
            tabBarIcon: ({ focused, tintColor }) => {
              let iconName = `ios-cloud${focused ? '' : '-outline'}`;
              return <FontAwesome5 name="dumbbell" size={25} color="black" />;
              
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        >
            {/* {(props) => <ExercisesView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken}/>} */}
        </TabNavigation.Screen>

         <TabNavigation.Screen
          name="Profile"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ focused, tintColor }) => {
              return <AntDesign name="idcard" size={25} color="black" />;
            },
            tabBarOptions: {
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            },
            animationEnabled: true,
          }}
        >
            {(props) => <ProfileView {...props} username={this.state.username} accessToken={this.state.accessToken} revokeAccessToken={this.revokeAccessToken}/>}

             </TabNavigation.Screen>

      </TabNavigation.Navigator>
    );
  }
  
  
  /**
   * Note that there are many ways to do navigation and this is just one!
   * I chose this way as it is likely most familiar to us, passing props
   * to child components from the parent.
   * 
   * Other options may have included contexts, which store values above
   * (similar to this implementation), or route parameters which pass
   * values from view to view along the navigation route.
   * 
   * You are by no means bound to this implementation; choose what
   * works best for your design!
   */
  render() {

    // Our primary navigator between the pre and post auth views
    // This navigator switches which screens it navigates based on
    // the existent of an access token. In the authorized view,
    // which right now only consists of the profile, you will likely
    // need to specify another set of screens or navigator; e.g. a
    // list of tabs for the Today, Exercises, and Profile views.
    let AuthStack = createStackNavigator();

    return (
      <NavigationContainer>
        <AuthStack.Navigator>
          {!this.state.accessToken ? (
            <>
              <AuthStack.Screen
                name="SignIn"
                options={{
                  title: 'Fitness Tracker Welcome',
                }}
              >
                {(props) => <LoginView {...props} login={this.login} />}
              </AuthStack.Screen>

              <AuthStack.Screen
                name="SignUp"
                options={{
                  title: 'Fitness Tracker Signup',
                }}
              >
                {(props) => <SignupView {...props} />}
              </AuthStack.Screen>
            </>
          ) : (
              <>
                <AuthStack.Screen name="FitnessTracker"  component={this.CreateTabNavigation} options={{
                  headerLeft: this.SignoutButton
                }}>
                
                </AuthStack.Screen>
              </>

            )}
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
