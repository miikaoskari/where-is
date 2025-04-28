import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInputProps, StyleSheet, TextInput } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    textLightColor?: string;
    textDarkColor?: string;
    placeholderLightColor?: string;
    placeholderDarkColor?: string;
};

export function ThemedTextInput({
    lightColor = "#F2F2F2",
    darkColor = "#2C2C2C",
    textLightColor = "#000000",
    textDarkColor = "#FFFFFF",
    placeholderLightColor = "#888888",
    placeholderDarkColor = "#CCCCCC",
    ...rest
}: ThemedTextInputProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const textColor = useThemeColor({ light: textLightColor, dark: textDarkColor }, 'text');
    const placeholderColor = useThemeColor(
        { light: placeholderLightColor, dark: placeholderDarkColor },
        'text'
    );

    return (
        <TextInput
            style={[
                styles.input, 
                { color: textColor, backgroundColor: color, borderColor: color },
            ]}
            placeholderTextColor={placeholderColor}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#E0E0E0",
    },
});