import * as SQLite from 'expo-sqlite';

async function initDatabase() {
    const db = await SQLite.openDatabaseAsync('whereis');

    await db.execAsync(`
    create table if not exists items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );

    create table if not exists photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        photo_uri TEXT NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    );

    create table if not exists locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    );
    `)
}

async function createItem(name: string, description: string, photoUri?: string, latitude?: number, longitude?: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    const result = await db.runAsync(
        'INSERT INTO items (name, description) VALUES (?, ?)',
        name,
        description
    );

    const itemId = result.lastInsertRowId;

    if (photoUri) {
        await createItemPhoto(itemId, photoUri);
    }

    if (latitude !== undefined && longitude !== undefined) {
        await createItemLocation(itemId, latitude, longitude);
    }
    return result.lastInsertRowId;
}

async function getItemById(id: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    return await db.getFirstAsync('SELECT * FROM items WHERE id = ?', id);
}

async function updateItem(id: number, name: string, description: string, photoUri?: string, latitude?: number, longitude?: number ) {
    const db = await SQLite.openDatabaseAsync('whereis');
    const result = await db.runAsync(
        'UPDATE items SET name = ?, description = ? WHERE id = ?',
        name,
        description,
        id
    );

    const itemId = result.lastInsertRowId;

    if (photoUri) {
        await updateItemPhoto(itemId, photoUri);
    }

    if (latitude !== undefined && longitude !== undefined) {
        await updateItemLocation(itemId, latitude, longitude);
    }

}

async function deleteItem(id: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    await db.runAsync('DELETE FROM items WHERE id = ?', id);
}

async function createItemPhoto(itemId: number, photoUri: string) {
    const db = await SQLite.openDatabaseAsync('whereis');
    const result = await db.runAsync(
        'INSERT INTO photos (item_id, photo_uri) VALUES (?, ?)',
        itemId,
        photoUri
    );
    return result.lastInsertRowId;
}

async function getItemPhotosByItemId(itemId: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    return await db.getAllAsync('SELECT * FROM photos WHERE item_id = ?', itemId);
}

async function updateItemPhoto(itemId: number, photoUri: string) {
    const db = await SQLite.openDatabaseAsync('whereis');
    const photo = await db.getFirstAsync('SELECT * FROM photos AND item_id = ?', itemId);
    if (!photo) {
        throw new Error('Photo not found or does not belong to the specified item.');
    }
    await db.runAsync(
        'UPDATE photos SET photo_uri = ? WHERE item_id = ?',
        photoUri,
        itemId
    );
}

async function createItemLocation(itemId: number, latitude: number, longitude: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    const result = await db.runAsync(
        'INSERT INTO locations (item_id, latitude, longitude) VALUES (?, ?, ?)',
        itemId,
        latitude,
        longitude
    );
    return result.lastInsertRowId;
}

async function getItemLocationsByItemId(itemId: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    return await db.getAllAsync('SELECT * FROM locations WHERE item_id = ?', itemId);
}

async function updateItemLocation(itemId: number, latitude: number, longitude: number) {
    const db = await SQLite.openDatabaseAsync('whereis');
    const location = await db.getFirstAsync('SELECT * FROM locations WHERE item_id = ?', itemId);
    if (!location) {
        throw new Error('Location not found or does not belong to the specified item.');
    }
    await db.runAsync(
        'UPDATE locations SET latitude = ?, longitude = ?',
        latitude,
        longitude,
    );
}

// Export CRUD functions
export {
    initDatabase,
    createItem,
    getItemById,
    updateItem,
    deleteItem,
    createItemPhoto,
    getItemPhotosByItemId,
    updateItemPhoto,
    createItemLocation,
    getItemLocationsByItemId,
    updateItemLocation,
};
