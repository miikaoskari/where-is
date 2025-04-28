import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInputProps, StyleSheet, TextInput } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    placeholderLightColor?: string;
    placeholderDarkColor?: string;
};

export function ThemedTextInput({
    lightColor,
    darkColor,
    placeholderLightColor,
    placeholderDarkColor,
    ...rest
}: ThemedTextInputProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    const placeholderColor = useThemeColor(
        { light: placeholderLightColor, dark: placeholderDarkColor },
        'text'
    );

    return (
        <TextInput
            style={[
                styles.input, 
                { color, backgroundColor: color, borderColor: color },
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