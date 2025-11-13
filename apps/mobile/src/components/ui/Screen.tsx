import { PropsWithChildren } from 'react';
import { View, ViewProps } from 'react-native';
import { Edge, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export type ScreenProps = PropsWithChildren<
  ViewProps & {
    edges?: Edge[];
  }
>;

export function Screen({ children, style, edges = ['top', 'bottom'], ...rest }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ flex: 1 }, style]} {...rest}>
      <SafeAreaView
        edges={edges}
        style={{
          flex: 1,
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
        }}
      >
        {children}
      </SafeAreaView>
    </View>
  );
}





