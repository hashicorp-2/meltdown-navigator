import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { ReactNode } from 'react';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-sky active:bg-sky/80',
    secondary: 'bg-sage active:bg-sage/80',
    outline: 'bg-transparent border-2 border-sky',
  };

  const textClasses = {
    primary: 'text-white font-semibold',
    secondary: 'text-deep font-semibold',
    outline: 'text-sky font-semibold',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      activeOpacity={0.7}
    >
      {loading ? (
        <View className="flex-row items-center gap-2">
          <ActivityIndicator size="small" color={variant === 'outline' ? '#7E9CCB' : '#FFFFFF'} />
          <Text className={textClasses[variant]}>Loading...</Text>
        </View>
      ) : (
        <Text className={textClasses[variant]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}


