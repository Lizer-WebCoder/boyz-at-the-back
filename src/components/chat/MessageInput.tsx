import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../lib/theme';

interface Props {
  onSend: (text: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, disabled, placeholder }: Props) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!text.trim() || disabled || sending) return;
    setSending(true);
    try {
      await onSend(text.trim());
      setText('');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder || 'Pass a note through the bars...'}
        placeholderTextColor={colors.muted}
        value={text}
        onChangeText={setText}
        multiline
        editable={!disabled && !sending}
        maxLength={2000}
      />
      <TouchableOpacity
        style={[
          styles.button,
          (disabled || !text.trim() || sending) && styles.buttonDisabled,
        ]}
        onPress={handleSend}
        disabled={disabled || !text.trim() || sending}
        activeOpacity={0.8}
      >
        {sending ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <Text style={styles.buttonText}>Smuggle</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 16,
    backgroundColor: colors.concrete,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: colors.charcoal,
    color: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    maxHeight: 120,
    fontSize: 15,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.orange,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 88,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
