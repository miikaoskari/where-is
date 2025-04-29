import { BottomBarAwareView } from "@/components/BottomBarAwareView";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function AllItemsMap() {
    return (
        <BottomBarAwareView>
            <MapView
                style={styles.map}
                initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
            />
        </BottomBarAwareView>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    }
});
