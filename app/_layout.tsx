import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
const LOCATION_TASK_NAME = "background-location-task";

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState(String);

  useEffect(() => {
    // 位置情報の権限をリクエスト
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('位置情報の取得の許可が必要です');
        return;
      }

      // 位置情報を取得
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = '位置情報を取得中...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `緯度: ${location.coords.latitude}, 経度: ${location.coords.longitude}`;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{text}</Text>
      <Button
        title="再取得"
        onPress={async () => {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        }}
      />
    </View>
  );
}
type LocationData = {
    locations: Array<{
      coords: {
        latitude: number;
        longitude: number;
        altitude?: number;
        speed?: number;
        accuracy?: number;
      };
      timestamp: number;
    }>;
  };

// バックグラウンドタスクの定義
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      const { locations } = data as LocationData;
      console.log("バックグラウンド位置情報:", locations);
    }
  });
  
  // バックグラウンド位置情報の取得を開始
  const startBackgroundLocation = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      console.error("バックグラウンド位置情報の権限がありません");
      return;
    }
  
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 10, // 10メートルごとに更新
      deferredUpdatesInterval: 60000, // 1分ごとにバッチで送信
    });
  }