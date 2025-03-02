├── app
│   ├── _layout.tsx            # Main layout for the app
│   ├── +not-found.tsx         # Handle 404 or not found screens
│   └── (tabs)                 # Tab-based navigation
│       ├── explore.tsx
│       ├── index.tsx
│       ├── _layout.tsx
│       ├── AddNew.tsx         # ➡ Screen for adding new items (R1.1, R2)
│       ├── ListItems.tsx      # ➡ Screen to list all items (R1.2, R3)
│       ├── ItemDetails.tsx    # ➡ View a single item (R3.6)
│       ├── Search.tsx         # ➡ Search feature (R6)
│       ├── UpdateItem.tsx     # ➡ Edit an item (R7)
│       ├── CameraScreen.tsx   # ➡ Take pictures of items (R8)
├── assets                     # Static assets like images and fonts
│   ├── fonts
│   ├── images
├── components                 # Reusable components
│   ├── Button.tsx             # Generic button component
│   ├── InputField.tsx         # Form inputs (name, description, etc.)
│   ├── ItemCard.tsx           # Component for rendering list items
│   ├── ItemList.tsx           # FlatList wrapper for listing items
│   ├── SearchBar.tsx          # Search input field
│   ├── PhotoPreview.tsx       # Preview taken photos before saving (R8.3)
│   ├── __tests__              # Unit tests for components
├── constants                  # Constants for colors, styles, and app config
│   ├── Colors.ts
├── database                   # Local storage or database integration
│   ├── database.ts            # AsyncStorage or SQLite for saving records (R4)
├── hooks                      # Custom hooks for reusable logic
│   ├── useColorScheme.ts
│   ├── useThemeColor.ts
│   ├── useDatabase.ts         # Hook to manage database interactions
│   ├── useSearch.ts           # Hook to handle search logic
├── navigation                 # Navigation setup
│   ├── StackNavigator.tsx     # Stack navigation for screens
│   ├── TabNavigator.tsx       # Tab navigation
├── store                      # State management (optional, Redux/Zustand)
│   ├── useItemsStore.ts       # Manage items globally
├── scripts
│   └── reset-project.js       # Reset project data (dev only)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # Project documentation