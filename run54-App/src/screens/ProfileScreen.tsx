import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { saveProfile, getProfile } from '../services/ProfileService';

type Profile = {
  name: string;
  weight: number;
  units: 'km' | 'mi';
};

const ProfileScreen = () => {
  const [profile, setProfile] = useState<Profile>({ name: '', weight: 70, units: 'km' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    await saveProfile(profile);
    alert('Profile saved!');
  };

  if (loading) return <View style={styles.container}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile & Settings</Text>
      <Text>Name:</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={(name) => setProfile({ ...profile, name })}
        placeholder="Enter your name"
      />
      <Text>Weight (kg):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={profile.weight.toString()}
        onChangeText={(weight) => setProfile({ ...profile, weight: parseInt(weight, 10) || 0 })}
        placeholder="Enter your weight"
      />
      <Text>Units:</Text>
      <View style={styles.unitRow}>
        <Button
          title="Kilometers"
          color={profile.units === 'km' ? '#007AFF' : '#ccc'}
          onPress={() => setProfile({ ...profile, units: 'km' })}
        />
        <Button
          title="Miles"
          color={profile.units === 'mi' ? '#007AFF' : '#ccc'}
          onPress={() => setProfile({ ...profile, units: 'mi' })}
        />
      </View>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8, marginBottom: 16 },
  unitRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
});

export default ProfileScreen;