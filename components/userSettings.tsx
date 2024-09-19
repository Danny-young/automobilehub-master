import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";


type SettingProps = {
    name: string;
    color: string;
    iconName: string;
    vectorName: 'FontAwesome5' | 'Ionicons' | 'MaterialIcons';
    size: number;
    onPress?: () => void; // Add this line
  };

const Settings = ({ name, iconName, vectorName, size, color, onPress }: SettingProps) => {

    const IconComponents = {
        FontAwesome5,
        Ionicons, 
        MaterialIcons// Corrected from 'Iconicons' to 'Ionicons'
    };

    const IconComponent = IconComponents[vectorName];
    
    return ( 
        <View style={{paddingVertical:10}}>
                 <TouchableOpacity style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:6}} onPress={onPress}>

<View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingBottom:6, gap:10}}>
<IconComponent name={iconName} size={size} color={color}/>
<Text style={{fontSize:15, fontWeight:'700', color: color}}>
 {name}
</Text>
</View>
<Ionicons size={28} name="arrow-forward-outline" color={color}/>
    

</TouchableOpacity>

        </View>
     );
}
 
export default Settings;