import { BottomBarAwareView } from "@/components/BottomBarAwareView";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from "@/components/ThemedView";

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
    const [searchQuery, setSearchQuery] = useState("");

    const handleItemPress = (item: { key: string }) => {
        Alert.alert("Item Info", `You selected: ${item.key}`);
    };

    const handleAddItem = () => {
        const newItemKey = `Item ${items.length + 1}`;
        setItems([...items, { key: newItemKey }]);
    };

    const filteredItems = items.filter(item =>
        item.key.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <ThemedView lightColor="#FFFFFF" darkColor="#1C1C1E" style={styles.container}>
            <SafeAreaView style={styles.container}>
                <BottomBarAwareView>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        <View style={styles.topbarContainer} >
                            <ThemedText type="title" style={styles.title}>Items</ThemedText>

                            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <ThemedTextInput
                            placeholder="Item Name"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <FlashList
                            data={filteredItems}
                            renderItem={({ item, index }) => (
                                <React.Fragment>
                                    <TouchableOpacity
                                        style={styles.itemContainer}
                                        onPress={() => handleItemPress(item)}
                                    >
                                        <ThemedText type="default" style={styles.item}>{item.key}</ThemedText>
                                    </TouchableOpacity>
                                    {index < filteredItems.length - 1 && <View style={styles.separator} />}
                                </React.Fragment>
                            )}
                            keyExtractor={(item) => item.key}
                            estimatedItemSize={50}
                            contentContainerStyle={styles.scrollContent}
                        />
                    </ScrollView>
                </BottomBarAwareView>
            </SafeAreaView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 12,
        gap: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        overflow: "hidden",
    },
    itemContainer: {
        paddingVertical: 16,
    },
    item: {
        fontSize: 17,
        fontWeight: "500",
    },
    separator: {
        height: 1,
        backgroundColor: "#E0E0E0",
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
        color: "#007AFF",
        fontWeight: "bold",
    },
    topbarContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
});
