// app/(tabs)/index.tsx

import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HomeScreen } from '../../screens';
export default function Home() {
  const [UseName,setUserName] = useState('');
  const [Password ,setPassword]= useState('');
  
  const Login = () => {
    alert(`usr: ${UseName}`)
    setPassword('')
    setUserName('')
  }
  
  const singin = async () => {
    const ryp = await fetch('');
    const dtJson = await ryp.json();

  }
  return (
    
    <View style= {Styles.scrinAll}>
      
      <Text style={Styles.titel}>Log In To Shalehe</Text>
      <HomeScreen name={UseName} />
      <TextInput style={Styles.textInput} placeholder='Enter UserName' onChangeText={setUserName}></TextInput>
      <TextInput style={Styles.textInput} placeholder='Enter Password' onChangeText={setPassword} secureTextEntry ></TextInput>
      <TouchableOpacity style={Styles.button} onPress={Login}>
        <Text style={Styles.textButton}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const Styles=StyleSheet.create({
  scrinAll:{
    flexGrow:1,
    justifyContent:'center',
    backgroundColor:'#ffffff'
  },
  titel:{
    fontSize:30,
    color:'#000000',
    fontWeight:'bold',
    alignSelf:'center',
    marginBottom:16
  },
  textInput :{
    borderRadius:10,
    borderWidth:0.2,
    borderColor:'#242323',
    marginBottom:16,
    height:48,
    width:"90%",
    alignSelf:'center',
    paddingHorizontal:12,
  },
  button:{
    
    marginBottom:16,
    backgroundColor:'#247cff',
    borderRadius:35,
    
    width:'75%',
    height:48,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    alignContent :'center'
    },
  textButton:{
     alignSelf:'center',
     
     color:'#ffffff',
     fontSize:16,
     fontWeight:'bold',

  }
});
