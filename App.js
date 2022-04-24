import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Fontisto } from '@expo/vector-icons';

import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';

const { width:SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = "613ad0b348347b3203a36baffa6866d3";

const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Atmosphere : "fog",
  Snow : "snow",
  Rain : "rain",
  Drizzle : "umbrella",
  Thunderstorm : "ligthning"
};


export default function App() {
  const [city,setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok,setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude}, {useGoogleMaps:false});
    setCity(location[0].city);
    const res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await res.json();
    setDays(json.daily); 
  };
  useEffect(()=>{
    getWeather();
  },[]);

  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      {ok ? (
        <>
          <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
          </View>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weather}>
            {days.length === 0 ? (
              <View  style={styles.day}>
                <ActivityIndicator color="white" size="large"/>
              </View>  
            ) : ( 
              days.map((day,i)=>
                <View key={i} style={styles.day}>
                  <View style={{flexDirection:"row",alignItems:"center", justifyContent:"space-between"}}>
                    <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                    <Fontisto name={icons[day.weather[0].main]} size={60} color="white"/>
                  </View>                  
                  <Text style={styles.desc}>{day.weather[0].main}</Text>
                  <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                </View>
              )          
            )}
          </ScrollView>
        </>
      ):(
        <View style={styles.notOk}>
          <Text style={{color:"white", fontSize:20}}>😭 제발 허락해줘 내 날씨가 무너졌어</Text>
        </View>
      )}      
    </View>     
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1, 
    backgroundColor:"teal"
  },
  city: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName: {
    color: "white",
    fontSize:50,
    fontWeight:"500",
  },
  weather:{

  },
  day: {
    width: SCREEN_WIDTH,
    padding: 20,
  },
  temp: {
    color: "white",
    marginTop:50,
    fontSize:120,    
  },
  desc: {
    color: "white",
    marginTop:-10,
    fontSize:40,
  },
  tinyText : {
    color:"white",
    fontSize:20,
  },
  notOk: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  }
});