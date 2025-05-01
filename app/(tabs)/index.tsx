import { BottomBarAwareView } from "@/components/BottomBarAwareView";
import { ThemedText } from "@/components/ThemedText";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from "@/components/ThemedView";
import { getAllItems } from "@/database/database";
import { useFocusEffect, useRouter } from "expo-router";

interface Item {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function ListItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  async function fetchItems() {
    setIsRefreshing(true);
    try {
      const fetchedItems = await getAllItems();
      setItems(fetchedItems as Item[]);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchItems();
      return () => {};
    }, [])
  );

  const handleItemPress = (item: Item) => {
    router.push({
      pathname: "/(modals)/EditItem",
      params: { id: item.id }
    });
  };

  const handleAddItem = () => {
      router.push("/(modals)/AddNew");
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemedView lightColor="#FFFFFF" darkColor="#1C1C1E" style={{ flex: 1 }}>
      <BottomBarAwareView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          <View style={styles.topbarContainer}>
            <ThemedText type="title" style={styles.title}>
              Items
            </ThemedText>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddItem()}
            >
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
            onRefresh={fetchItems}
            refreshing={isRefreshing}
            renderItem={({ item, index }) => (
              <React.Fragment>
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleItemPress(item)}
                >
                  <ThemedText type="default" style={styles.item}>
                    {item.name}
                  </ThemedText>
                </TouchableOpacity>
                {index < filteredItems.length - 1 && (
                  <View style={styles.separator} />
                )}
              </React.Fragment>
            )}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={50}
          />
        </SafeAreaView>
      </BottomBarAwareView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    gap: 10,
  },
  containerflex: {
    flex: 1,
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
