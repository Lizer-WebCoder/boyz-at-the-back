import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useMessages } from '../../../src/hooks/useMessages';
import { MessageItem } from '../../../src/components/chat/MessageItem';
import { MessageInput } from '../../../src/components/chat/MessageInput';
import { colors } from '../../../src/lib/theme';
import { supabase } from '../../../src/lib/supabase';
import { useState } from 'react';

export default function ChannelScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { messages, loading, sendMessage } = useMessages(id || null);
  const [channelName, setChannelName] = useState('Cell Block');

  useEffect(() => {
    if (!id) return;
    supabase
      .from('channels')
      .select('name')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data?.name) setChannelName(data.name);
      });
  }, [id]);

  return (
    <>
      <Stack.Screen options={{ title: channelName }} />
      <View style={styles.container}>
        {loading && messages.length === 0 ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageItem message={item} />}
            contentContainerStyle={styles.list}
            inverted={false}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  No notes yet. Be the first to pass one through the bars.
                </Text>
              </View>
            }
          />
        )}

        <MessageInput onSend={sendMessage} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal,
  },
  list: {
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    textAlign: 'center',
    fontSize: 15,
  },
});
