import { View, Text } from 'react-native';

interface StressDialProps {
  value: number;
  label?: string;
}

const SEGMENTS = 5;

export function StressDial({ value, label = 'Stress' }: StressDialProps) {
  const clampedValue = Math.min(Math.max(value, 0), SEGMENTS);
  const percentage = clampedValue / SEGMENTS;

  return (
    <View className="items-center justify-center">
      <View className="relative h-44 w-44 items-center justify-center rounded-full bg-indigo-50">
        {/* Outer ring with progress indicator */}
        <View className="absolute h-44 w-44 items-center justify-center">
          <View className="absolute h-44 w-44 rounded-full border-8 border-slate-200" />
          <View
            className="absolute h-44 w-44 rounded-full border-8 border-indigo-500"
            style={{
              borderColor: '#6366F1',
              borderTopColor: 'transparent',
              borderRightColor: percentage > 0.5 ? '#6366F1' : 'transparent',
              borderBottomColor: percentage > 0.75 ? '#6366F1' : 'transparent',
              borderLeftColor: percentage > 0.25 ? '#6366F1' : 'transparent',
              transform: [{ rotate: `${-90 + percentage * 360}deg` }],
            }}
          />
        </View>
        <View className="z-10 h-28 w-28 items-center justify-center rounded-full bg-white shadow-sm">
          <Text className="text-xs uppercase tracking-wider text-indigo-400">{label}</Text>
          <Text className="text-3xl font-semibold text-indigo-600">{clampedValue}</Text>
          <Text className="text-sm text-slate-400">/5</Text>
        </View>
      </View>
      <View className="mt-2 flex-row items-center gap-2">
        <View className="h-2 w-2 rounded-full bg-indigo-400" />
        <Text className="text-sm text-indigo-600">High awareness mode</Text>
      </View>
    </View>
  );
}

