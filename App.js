import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import * as Bluetooth from "expo-bluetooth";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState("");

  async function scan() {
    await Bluetooth.requestPermissionsAsync();
    await Bluetooth.startScan();
    Bluetooth.onDeviceFound((device) => {
      setDevices((prev) => [...prev, device]);
    });
  }

  async function connect(address) {
    const result = await Bluetooth.connect(address);
    if (result) setConnected(true);

    Bluetooth.onDataReceived((value) => {
      setData(value);
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>KDR Emap</Text>
      <Button title="Scan Bluetooth (ELM327)" onPress={scan} />

      {devices.map((d, i) => (
        <Button
          key={i}
          title={`Connect to: ${d.name}`}
          onPress={() => connect(d.address)}
        />
      ))}

      {connected ? <Text style={styles.ok}>Connected!</Text> : null}

      <Text style={styles.data}>{data}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 30, fontWeight: "bold", marginBottom: 20 },
  ok: { color: "green", fontWeight: "bold", margin: 10 },
  data: { backgroundColor: "#000", color: "#0f0", padding: 10, marginTop: 20 }
});
