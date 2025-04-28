import { ViewProps, StyleSheet, View } from "react-native";
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

export type BottomBarAwareViewProps = ViewProps & {
};

export function BottomBarAwareView({
    ...rest
}: BottomBarAwareViewProps) {
    const bottom = useBottomTabOverflow();

    return (
        <View
            style={[
                styles.view,
                { paddingBottom: bottom }
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    view: {
        overflow: "hidden",
    },
});
