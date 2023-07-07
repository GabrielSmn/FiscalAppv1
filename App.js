import { Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Camera } from 'expo-camera'
import React, { useState,useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons'

export default function App() {
  const camRef = useRef(null);
  const [type,setType]=useState(Camera.Constants.Type.back)
  const [hasPermission, setHaspermission ]=useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open,setOpen]= useState(false);

  useEffect(()=>{
    (async()=> {
      const {status}= await Camera.requestCameraPermissionsAsync();
      setHaspermission(status==='granted')
    })();
  },[]);
  if(hasPermission===null){return <View/>}
  if(hasPermission==='false'){return <Text>Acesso negado!</Text>}

  async function takePicture(){
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      console.log(data)
      setOpen(true)
      setCapturedPhoto(data.uri)
    } 

  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera 
      style={{flex:1}}
      type={type}
      ref={camRef}
      >
      </Camera>
     <TouchableOpacity style={styles.button} onPress={takePicture}>
    <FontAwesome name='camera' size={23} color ="#FF0000"></FontAwesome>
     </TouchableOpacity>


     {capturedPhoto &&

     <Modal
     animationType='slide'
     transparent={false}
     visible={open}
     >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: '20' }}>
        <TouchableOpacity style={{margin:10}} onPress={()=>setOpen(false)}>
          <FontAwesome name='window-close' size={50}color='#121212'/>

        </TouchableOpacity>

        <Image
        style={{width:'100%',height:300,borderRadius:20}}
        source={{uri:capturedPhoto}}
        />
          
      </View>
      
      </Modal>}
      
 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
  }
});