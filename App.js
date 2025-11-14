import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

export default function App() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);

  const scanDevices = () => {
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) return;

      if (device && device.name && !devices.find(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });
  };

  const connectToDevice = async (device) => {
    try {
      const dev = await manager.connectToDevice(device.id);
      await dev.discoverAllServicesAndCharacteristics();
      setConnectedDevice(dev);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.title}>KDR Emap</Text>

      <Button title="Scan Bluetooth (ELM327)" onPress={scanDevices} />

      {devices.map((d) => (
        <Button
          key={d.id}
          title={`Connect to: ${d.name}`}
          onPress={() => connectToDevice(d)}
        />
      ))}

      {connectedDevice ? (
        <Text style={styles.ok}>Connected to {connectedDevice.name}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 32, fontWeight: "bold", marginVertical: 20 },
  ok: { color: "green", marginTop: 20, fontSize: 18 }
});
