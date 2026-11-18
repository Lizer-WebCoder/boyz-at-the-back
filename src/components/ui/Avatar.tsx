import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, statusColors } from '../../lib/theme';
import { Status } from '../../types';

interface Props {
  uri?: string | null;
  inmateId?: string;
  size?: number;
  status?: Status;
  showStatus?: boolean;
}

export function Avatar({ uri, inmateId, size = 44, status, showStatus = true }: Props) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: colors.concrete }]}>
          <Text style={[styles.placeholderText, { fontSize: size * 0.32 }]}>
            {inmateId?.slice(0, 2) || '?'}
          </Text>
        </View>
      )}

      {/* Height chart accent */}
      <View style={styles.heightChart} />

      {showStatus && status && (
        <View
          style={[
            styles.dot,
            {
              backgroundColor: statusColors[status] || colors.muted,
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.11,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.orange,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.white,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  heightChart: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    borderWidth: 1.5,
    borderColor: colors.charcoal,
  },
});
