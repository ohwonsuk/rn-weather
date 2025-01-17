import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";

const SCREEN_WIDTH = Dimensions.get("window").width;

const API_KEY = "f47e5f61ac1c885d01fb7bdcdc7db99b";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Atomsphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lighting",
};

const weather_name = {
  Clear: "맑음",
  Clouds: "구름",
  Atomsphere: "구름많음",
  Snow: "눈",
  Rain: "비",
  Drizzle: "이슬비",
  Thunderstorm: "폭풍우",
};

const koreaTimeDiff = 9 * 60 * 60 * 1000;

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { longitude, latitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].district);
    console.log(location);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json);
    console.log(json);
  };

  const date = new Date(days.dt * 1000).toLocaleString("en-US", {
    timeZone: "Asia/Seoul",
  });
  console.log("date", date);

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View>
        <Text>{date}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          <View style={styles.day}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.temp}>
                {parseFloat(days.main.temp).toFixed(1)}
              </Text>
              <Fontisto
                style={{ marginRight: 20 }}
                name={icons[days.weather[0].main]}
                size={68}
                color="white"
              />
            </View>
            <Text style={styles.description}>
              {weather_name[days.weather[0].main]}
            </Text>
            <Text style={styles.tinyText}>{days.weather[0].description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    marginHorizontal: 20,
    fontSize: 138,
    color: "white",
  },
  description: {
    marginTop: -30,
    marginLeft: -200,
    fontSize: 60,
    color: "white",
  },
  tinyText: {
    marginLeft: -250,
    fontSize: 20,
    color: "white",
  },
});
