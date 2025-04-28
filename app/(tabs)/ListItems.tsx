import { BottomBarAwareView } from "@/components/BottomBarAwareView";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListItems() {
    const [items, setItems] = useState([
        { key: 'Devin' },
        { key: 'Dan' },
        { key: 'Dominic' },
        { key: 'Jackson' },
        { key: 'James' },
        { key: 'Joel' },
        { key: 'John' },
        { key: 'Jillian' },
        { key: 'Jimmy' },
        { key: 'Julie' },
    ]);

    const handleItemPress = (item: { key: string }) => {
        Alert.alert("Item Info", `You selected: ${item.key}`);
    };

    const handleAddItem = () => {
        const newItemKey = `Item ${items.length + 1}`;
        setItems([...items, { key: newItemKey }]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <BottomBarAwareView>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.topbarContainer} >
                        <ThemedText type="title" style={styles.title}>Items</ThemedText>

                        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.card}>
                        {items.map((item, index) => (
                            <React.Fragment key={item.key}>
                                <TouchableOpacity
                                    style={styles.itemContainer}
                                    onPress={() => handleItemPress(item)}
                                >
                                    <Text style={styles.item}>{item.key}</Text>
                                </TouchableOpacity>
                                {index < items.length - 1 && <View style={styles.separator} />}
                            </React.Fragment>
                        ))}
                    </View>
                </ScrollView>
            </BottomBarAwareView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EFEFF4",
    },
    scrollContent: {
        padding: 20,
        gap: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
    },
    itemContainer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    item: {
        fontSize: 17,
        fontWeight: "500",
        color: "#1C1C1E",
    },
    separator: {
        height: 1,
        backgroundColor: "#E0E0E0",
        marginHorizontal: 20,
    },
    title: {
        justifyContent: "flex-start",
    },
    addButton: {
        borderRadius: 30,
        justifyContent: "flex-end",
    },
    addButtonText: {
        fontSize: 30,
        color: "#000000",
        fontWeight: "bold",
    },
    topbarContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});
