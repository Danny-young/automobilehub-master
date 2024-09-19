import { View, Text, FlatList, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import { useSliders } from '@/api/slides'


export const defaultImage = "https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"

export default function Slider() {
 const {data: sliders, error, isLoading } = useSliders();
    
 if(isLoading) {
    return <ActivityIndicator/>;
 }

 if (error) {
    return <Text>Error: {error.message}</Text>;
 }

 interface Slide {
    slides_url: string;
    // Add other properties of a slide if they exist
  }
  
     return (
    <View>
         <FlatList
      data={sliders}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
            <View>
               <Image 
                source={{ uri: item.slides_url || defaultImage}}
                key={index}
                style={{ height: 200, width: 330, marginRight: 30, borderRadius: 200 }}
                resizeMode="cover" // Or "contain", "stretch", etc., depending on your need
/>
            </View>
     )}
     />
    </View>
    
  )
}