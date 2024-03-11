import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Text, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as geolib from 'geolib';
import PlayerMarker from '../assets/player_marker.png';
import RedFlag from '../assets/Red_Flag.png';
import BlueFlag from '../assets/Blue_Flag.png';

const MapComponent = () => {
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [marker1, setMarker1] = useState(null);
    const [marker2, setMarker2] = useState(null);

    useEffect(() => {
        let isActive = true;

        const requestPermissionsAndWatchPosition = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }

                const initialLocation = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.BestForNavigation,
                });
                if (!isActive) return;

                setLocation(initialLocation.coords);
                setRegion({
                    latitude: initialLocation.coords.latitude,
                    longitude: initialLocation.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
                updateMarkers(initialLocation.coords);

                const subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 1000,
                        distanceInterval: 1,
                    },
                    (newLocation) => {
                        if (isActive) {
                            setLocation(newLocation.coords);
                            checkAndUpdateFlagsIfClose(newLocation.coords);
                        }
                    }
                );

                return () => subscription?.remove();
            } catch (error) {
                console.error(error);
                setErrorMsg('Failed to get location');
            }
        };

        requestPermissionsAndWatchPosition();

        return () => {
            isActive = false;
        };
    }, []);

    const updateMarkers = (coords) => {
        const bearing1 = Math.floor(Math.random() * 360);
        const bearing2 = (bearing1 + 180) % 360;

        const position1 = geolib.computeDestinationPoint(coords, 15, bearing1);
        const position2 = geolib.computeDestinationPoint(coords, 30, bearing2);

        setMarker1(position1);
        console.log(position1);
        setMarker2(position2);
    };

    const checkAndUpdateFlagsIfClose = (userCoords) => {
        const playerRadius = 5; // Adjust based on the player marker's estimated "coverage" area
        const flagRadius = 15; // Adjust based on the flag markers' estimated "coverage" area
        const totalOverlapDistance = playerRadius + flagRadius;

        if (marker1 && marker2) {
            const distanceToMarker1 = geolib.getDistance(
                { latitude: userCoords.latitude, longitude: userCoords.longitude },
                marker1
            );
            const distanceToMarker2 = geolib.getDistance(
                { latitude: userCoords.latitude, longitude: userCoords.longitude },
                marker2
            );

            if (distanceToMarker1 <= totalOverlapDistance) {
                console.log('Touched red flag');
                updateMarkers(userCoords);
            }

            if (distanceToMarker2 <= totalOverlapDistance) {
                console.log('Touched blue flag');
                updateMarkers(userCoords);
            }
        }
    };

    return (
        <View style={styles.container}>
            {region && (
                <MapView
                    style={styles.map}
                    region={region}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    rotateEnabled={true}
                    pitchEnabled={true}
                >
                    <Marker
                        coordinate={location ? {latitude: location.latitude, longitude: location.longitude} : undefined}
                        title="Your Location"
                        image={PlayerMarker}
                    />
                    {marker1 && (
                        <Marker
                            coordinate={{latitude: marker1.latitude, longitude: marker1.longitude}}
                            title="Position 1"
                            image={RedFlag}
                        />
                    )}
                    {marker2 && (
                        <Marker
                            coordinate={{latitude: marker2.latitude, longitude: marker2.longitude}}
                            title="Position 2"
                            image={BlueFlag}
                        />
                    )}
                </MapView>
            )}
            {errorMsg && <Text>{errorMsg}</Text>}
            <View style={styles.buttonContainer}>
                <Button
                    title="Update Flags"
                    onPress={() => location && updateMarkers(location)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        marginLeft: -50,
        zIndex: 10,
    },
});

export default MapComponent;
