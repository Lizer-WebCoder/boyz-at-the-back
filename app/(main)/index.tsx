import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { useChannels } from '../../src/hooks/useChannels';
import { ChannelSidebar } from '../../src/components/channels/ChannelSidebar';
import { Avatar } from '../../src/components/ui/Avatar';
import { colors, statusLabels } from '../../src/lib/theme';
import { Channel } from '../../src/types';

export default function MainScreen() {
  const { profile, signOut } = useAuth();
  const { channelsByCategory, uncategorized, loading } = useChannels();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleSelect = (channel: Channel) => {
    setActiveId(channel.id);
    if (channel.type === 'text') {
      router.push(`/channel/${channel.id}`);
    } else {
      // Voice rooms coming soon
      alert('Payphones (voice) coming in next drop.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <ChannelSidebar
          channelsByCategory={channelsByCategory}
          uncategorized={uncategorized}
          activeChannelId={activeId}
          onSelectChannel={handleSelect}
        />

        {/* User footer */}
        <View style={styles.userBar}>
          <Avatar
            uri={profile?.avatar_url}
            inmateId={profile?.inmate_id}
            status={profile?.status}
            size={36}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {profile?.display_name || profile?.username || 'Inmate'}
            </Text>
            <Text style={styles.userStatus} numberOfLines={1}>
              {profile?.status
                ? statusLabels[profile.status]
                : 'On Parole'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => signOut()} style={styles.logout}>
            <Text style={styles.logoutText}>Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.main}>
        <Text style={styles.welcome}>Welcome to the facility.</Text>
        <Text style={styles.hint}>
          Select a Cell Block on the left to start passing notes.
        </Text>
        {profile && (
          <Text style={styles.inmateBadge}>
            Inmate #{profile.inmate_id}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.charcoal,
  },
  sidebar: {
    width: 280,
    backgroundColor: colors.charcoal,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal,
  },
  welcome: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  hint: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  inmateBadge: {
    marginTop: 24,
    color: colors.orange,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
  userBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.concrete,
    gap: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  userStatus: {
    color: colors.muted,
    fontSize: 11,
  },
  logout: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '600',
  },
});
