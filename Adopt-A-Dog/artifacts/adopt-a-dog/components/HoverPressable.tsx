import React, { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface Props extends Omit<PressableProps, "style"> {
  style?:
    | StyleProp<ViewStyle>
    | ((state: { pressed: boolean; hovered: boolean }) => StyleProp<ViewStyle>);
  liftAmount?: number;
  children?: React.ReactNode;
}

export default function HoverPressable({
  style,
  liftAmount = 3,
  children,
  ...props
}: Props) {
  const [hovered, setHovered] = useState(false);
  const lift = useRef(new Animated.Value(0)).current;

  const onHoverIn = () => {
    setHovered(true);
    Animated.spring(lift, {
      toValue: -liftAmount,
      useNativeDriver: true,
      speed: 28,
      bounciness: 5,
    }).start();
  };

  const onHoverOut = () => {
    setHovered(false);
    Animated.spring(lift, {
      toValue: 0,
      useNativeDriver: true,
      speed: 28,
      bounciness: 5,
    }).start();
  };

  const isWeb = Platform.OS === "web";

  return (
    <Animated.View
      style={{
        transform: [{ translateY: lift }],
      }}
    >
      <Pressable
        {...props}
        {...(isWeb ? { onHoverIn, onHoverOut } : {})}
        style={({ pressed }) =>
          typeof style === "function" ? style({ pressed, hovered }) : style
        }
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
