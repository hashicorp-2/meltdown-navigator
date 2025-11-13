import { TextInput, TextInputProps, View, Text } from 'react-native';

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export function TextArea({ label, error, className = '', ...props }: TextAreaProps) {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="mb-2 text-sm font-medium text-deep">{label}</Text>
      )}
      <TextInput
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className={`rounded-lg border-2 px-4 py-3 text-base text-deep min-h-[100px] ${
          error ? 'border-danger' : 'border-surface-alt bg-white'
        }`}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text className="mt-1 text-sm text-danger">{error}</Text>
      )}
    </View>
  );
}


