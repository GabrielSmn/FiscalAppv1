import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';

export default function App() {
  const db = SQLite.openDatabase('photos.db');

    const [hasPermission, setHasPermission] = useState(null);
    const [camera, setCamera] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
  
    useEffect(() => {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY AUTOINCREMENT, uri TEXT);'
        );
      });
    }, []);
  
    const takePicture = async () => {
      if (camera) {
        const photo = await camera.takePictureAsync();
  
        setImageUri(photo.uri);
        setShowModal(true);
      }
    };
  
    const savePhoto = () => {
      db.transaction((tx) => {
        tx.executeSql('INSERT INTO photos (uri) VALUES (?);', [imageUri], (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            Alert.alert('Foto Salva', `A foto foi salva com sucesso.\n\nURI: ${imageUri}`);
            setIsSaving(false);
            closeModal()
          }
        });
      });
    };
  
    const closeModal = () => {
      setShowModal(false);
      setImageUri(null);
    };
  
    return (
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          ref={(ref) => setCamera(ref)}
        />
  
        {imageUri ? (
          <View style={styles.captureButtonsContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Ionicons name="camera" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
        )}
  
        <Modal visible={showModal} onRequestClose={closeModal}>
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.modalImage} resizeMode="contain" />
            )}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={32} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={savePhoto}>
              <Ionicons name="save" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  };
  
  const styles = {
    captureButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 50,
      padding: 16,
    },
    saveButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 50,
      padding: 16,
    },
    modalImage: {
      flex: 1,
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
    },
    captureButtonsContainer: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      flexDirection: 'row',
    },
  };
  