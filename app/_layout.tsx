import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import * as Location from 'expo-location';

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
