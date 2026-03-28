import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Svg, { G, Circle, Ellipse } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

// A single paw print centred at 0,0 (fits in a ~24×24 box)
function PawPrint({
  x,
  y,
  size,
  angle,
  color,
}: {
  x: number;
  y: number;
  size: number;
  angle: number;
  color: string;
}) {
  const s = size / 24;
  return (
    <G
      transform={`translate(${x},${y}) rotate(${angle}) scale(${s})`}
      origin="0,0"
    >
      {/* Central pad */}
      <Ellipse cx={0} cy={6} rx={6} ry={5} fill={color} />
      {/* Four toe pads */}
      <Circle cx={-7} cy={-2} r={3} fill={color} />
      <Circle cx={-3} cy={-7} r={2.5} fill={color} />
      <Circle cx={3} cy={-7} r={2.5} fill={color} />
      <Circle cx={7} cy={-2} r={3} fill={color} />
    </G>
  );
}

interface Props {
  opacity?: number;
  color?: string;
}

// Grid of paw prints scattered across the full screen
const PAWS: Array<{ x: number; y: number; size: number; angle: number }> = [
  { x: 30,  y: 60,  size: 36, angle: -15 },
  { x: 130, y: 30,  size: 28, angle: 20  },
  { x: 240, y: 80,  size: 32, angle: -5  },
  { x: 340, y: 45,  size: 24, angle: 30  },
  { x: 70,  y: 180, size: 20, angle: -30 },
  { x: 190, y: 155, size: 40, angle: 10  },
  { x: 310, y: 190, size: 26, angle: -20 },
  { x: 50,  y: 310, size: 30, angle: 25  },
  { x: 150, y: 280, size: 22, angle: -10 },
  { x: 280, y: 320, size: 36, angle: 15  },
  { x: 370, y: 260, size: 20, angle: -35 },
  { x: 20,  y: 430, size: 28, angle: 5   },
  { x: 120, y: 410, size: 34, angle: -25 },
  { x: 230, y: 460, size: 22, angle: 20  },
  { x: 350, y: 390, size: 30, angle: -10 },
  { x: 80,  y: 550, size: 24, angle: 30  },
  { x: 200, y: 590, size: 38, angle: -15 },
  { x: 320, y: 530, size: 26, angle: 10  },
  { x: 60,  y: 680, size: 32, angle: -20 },
  { x: 160, y: 720, size: 20, angle: 25  },
  { x: 270, y: 660, size: 36, angle: -5  },
  { x: 380, y: 700, size: 24, angle: 15  },
  { x: 40,  y: 810, size: 28, angle: -30 },
  { x: 140, y: 850, size: 34, angle: 10  },
  { x: 260, y: 790, size: 22, angle: -15 },
  { x: 360, y: 830, size: 30, angle: 20  },
];

export default function PawBackground({ opacity = 0.07, color = "#8B5A2B" }: Props) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%">
        {PAWS.map((p, i) => (
          <PawPrint key={i} {...p} color={color} />
        ))}
      </Svg>
    </View>
  );
}
