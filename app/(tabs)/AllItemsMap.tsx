import { BottomBarAwareView } from "@/components/BottomBarAwareView";
import { getAllItems, getItemLocationByItemId } from "@/database/database";
import { useState, useCallback, useRef } from "react";
import { StyleSheet, Alert } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { ThemedText } from "@/components/ThemedText";
import { useFocusEffect } from "expo-router";

interface Item {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface Location {
  id: number;
  item_id: number;
  latitude: number;
  longitude: number;
}

interface ItemWithLocation {
    id: number;
    name: string;
    description?: string;
    latitude: number;
    longitude: number;
}

export default function AllItemsMap() {
    const [locations, setLocations] = useState<ItemWithLocation[]>([]);
    const [region, setRegion] = useState<Region>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [isLoading, setIsLoading] = useState(false);
    const mapRef = useRef<MapView>(null);

    const calculateRegion = (items: ItemWithLocation[]): Region => {
        if (items.length === 0) {
            return region;
        }
        
        if (items.length === 1) {
            return {
                latitude: items[0].latitude,
                longitude: items[0].longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
        }
        
        let minLat = items[0].latitude;
        let maxLat = items[0].latitude;
        let minLng = items[0].longitude;
        let maxLng = items[0].longitude;
        
        items.forEach(item => {
            minLat = Math.min(minLat, item.latitude);
            maxLat = Math.max(maxLat, item.latitude);
            minLng = Math.min(minLng, item.longitude);
            maxLng = Math.max(maxLng, item.longitude);
        });
        
        // calculate the center
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const latDelta = (maxLat - minLat) * 1.2;
        const lngDelta = (maxLng - minLng) * 1.2;
        const minDelta = 0.01;
        
        return {
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: Math.max(latDelta, minDelta),
            longitudeDelta: Math.max(lngDelta, minDelta),
        };
    };

    useFocusEffect(
        useCallback(() => {
            const fetchLocations = async () => {
                setIsLoading(true);
                try {
                    const items = await getAllItems() as Item[];
                    const itemsWithLocations: ItemWithLocation[] = [];
                    
                    for (const item of items) {
                        const location = await getItemLocationByItemId(item.id) as Location | null;
                        if (location) {
                            itemsWithLocations.push({
                                id: item.id,
                                name: item.name,
                                description: item.description,
                                latitude: location.latitude,
                                longitude: location.longitude,
                            });
                        }
                    }
                    
                    setLocations(itemsWithLocations);
                    
                    if (itemsWithLocations.length > 0) {
                        const newRegion = calculateRegion(itemsWithLocations);
                        setRegion(newRegion);
                        
                        setTimeout(() => {
                            mapRef.current?.animateToRegion(newRegion, 1000);
                        }, 100);
                    }
                } catch (error) {
                    console.error("Error fetching locations:", error);
                    Alert.alert("Error", "Failed to load item locations");
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchLocations();
        }, [])
    );

    const handleRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
    };

    return (
        <BottomBarAwareView>
            <MapView
                ref={mapRef}
                style={styles.map}
                region={region}
                onRegionChangeComplete={handleRegionChange}
            >
                {locations.map(item => (
                    <Marker
                        key={item.id}
                        coordinate={{
                            latitude: item.latitude,
                            longitude: item.longitude,
                        }}
                        title={item.name}
                        description={item.description}
                    />
                ))}
            </MapView>
            {isLoading && (
                <ThemedText
                    style={styles.loadingText}
                >
                    Loading locations...
                </ThemedText>
            )}
        </BottomBarAwareView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    },
    loadingText: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 10,
        borderRadius: 5,
    }
});
