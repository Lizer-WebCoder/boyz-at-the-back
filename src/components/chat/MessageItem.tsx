import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Avatar } from '../ui/Avatar';
import { colors } from '../../lib/theme';
import { Message } from '../../types';

interface Props {
  message: Message;
  onLongPress?: (message: Message) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageItem({ message, onLongPress }: Props) {
  const author = message.author;
  const time = format(new Date(message.created_at), 'HH:mm');

  return (
    <TouchableOpacity
      style={styles.container}
      onLongPress={() => onLongPress?.(message)}
      activeOpacity={0.7}
      delayLongPress={280}
    >
      <Avatar
        uri={author?.avatar_url}
        inmateId={author?.inmate_id}
        status={author?.status}
        size={40}
      />

      <View style={styles.body}>
        <View style={styles.header}>
          <Text style={styles.displayName}>
            {author?.display_name || author?.username || 'Unknown Inmate'}
          </Text>
          <Text style={styles.inmateId}>#{author?.inmate_id || '?????'}</Text>
          <Text style={styles.time}>{time}</Text>
          {message.is_edited && (
            <Text style={styles.edited}>(Altered Evidence)</Text>
          )}
        </View>

        {message.content ? (
          <Text style={styles.content}>{message.content}</Text>
        ) : null}

        {message.reactions && message.reactions.length > 0 && (
          <View style={styles.reactions}>
            {message.reactions.map((r) => (
              <View key={r.emoji} style={styles.reactionChip}>
                <Text style={styles.reactionText}>
                  {r.emoji} {r.count}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 2,
  },
  displayName: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  inmateId: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: '600',
  },
  time: {
    color: colors.muted,
    fontSize: 11,
  },
  edited: {
    color: colors.muted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  content: {
    color: '#E8E8ED',
    fontSize: 15,
    lineHeight: 21,
  },
  reactions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  reactionChip: {
    backgroundColor: colors.concrete,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reactionText: {
    color: colors.white,
    fontSize: 12,
  },
});
