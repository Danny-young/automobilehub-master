import { Text, View } from "react-native";
import { useAssets } from 'expo-asset';
import { Redirect } from "expo-router";
const Page = () => {


    const [assets] = useAssets([require('@/assets/videos/intro.mp4')]);


    return <Redirect href='/(auth)/'/>
}
 
export default Page;