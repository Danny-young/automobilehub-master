import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av'
import { Link, Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors';

export default function Auth() {

  const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);
 
 
 
 return(
  
 <View style={styles.container}>
        
         
      {assets && (
        <Video
          resizeMode={ResizeMode.COVER}
          isMuted
          isLooping
          shouldPlay
          source={{ uri: assets[0].uri }}
          style={styles.video}
        />
      )}
      <View style={{ marginTop: 320, padding: 20,  /* backgroundColor: 'black',  opacity:0.9 */  }}>
        <Text style={styles.header}>carconnect</Text>
        <Text style={styles.header}>hub</Text>
       {/*  <Text style={styles.header}>Ready to make driving easier?</Text> */}
      </View>
     
      <View style={styles.buttons}>
        <Link
          href={'/(auth)/login'}
          style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.dark }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: '500' }}>Log in</Text>
          </TouchableOpacity>
        </Link>
        <Link
          href={'/(auth)/signup'}
          style={[defaultStyles.pillButton, { flex: 1, backgroundColor: '#fff' }]}
          asChild>
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: '500' }}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
      {/* </SignedOut> */}
    </View>
 
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    fontSize: 36,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: 'white',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
  },
});