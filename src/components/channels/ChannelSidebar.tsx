import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../lib/theme';
import { Channel, Category } from '../../types';

interface Props {
  channelsByCategory: (Category & { channels: Channel[] })[];
  uncategorized: Channel[];
  activeChannelId: string | null;
  onSelectChannel: (channel: Channel) => void;
}

export function ChannelSidebar({
  channelsByCategory,
  uncategorized,
  activeChannelId,
  onSelectChannel,
}: Props) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderChannel = (channel: Channel) => {
    const isActive = channel.id === activeChannelId;
    const icon = channel.type === 'voice' ? 'call' : 'chatbubble';

    return (
      <TouchableOpacity
        key={channel.id}
        style={[styles.channelRow, isActive && styles.channelActive]}
        onPress={() => onSelectChannel(channel)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={icon as any}
          size={16}
          color={isActive ? colors.orange : colors.muted}
          style={{ marginRight: 8 }}
        />
        <Text
          style={[styles.channelName, isActive && styles.channelNameActive]}
          numberOfLines={1}
        >
          {channel.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.serverName}>BOYZ AT THE BACK</Text>
        <Text style={styles.serverSub}>Maximum Security Facility</Text>
      </View>

      {channelsByCategory.map((cat) => (
        <View key={cat.id} style={styles.category}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggle(cat.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={collapsed[cat.id] ? 'chevron-forward' : 'chevron-down'}
              size={14}
              color={colors.muted}
            />
            <Text style={styles.categoryName}>{cat.name.toUpperCase()}</Text>
          </TouchableOpacity>

          {!collapsed[cat.id] && cat.channels.map(renderChannel)}
        </View>
      ))}

      {uncategorized.length > 0 && (
        <View style={styles.category}>
          <Text style={[styles.categoryName, { marginLeft: 12, marginBottom: 6 }]}>
            UNASSIGNED
          </Text>
          {uncategorized.map(renderChannel)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal,
  },
  header: {
    padding: 16,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serverName: {
    color: colors.orange,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1.2,
  },
  serverSub: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  category: {
    marginTop: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  categoryName: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  channelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    borderRadius: 6,
  },
  channelActive: {
    backgroundColor: colors.concrete,
  },
  channelName: {
    color: colors.muted,
    fontSize: 14,
    flex: 1,
  },
  channelNameActive: {
    color: colors.white,
    fontWeight: '600',
  },
});
