import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInputProps, StyleSheet, TextInput } from "react-native";


export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedTextInput({
    lightColor,
    darkColor,
    ...rest
}: ThemedTextInputProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return (
        <TextInput
            style={[
                styles.input, 
                { color, borderColor: color }, 
            ]}
            placeholderTextColor={color}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
    },
});