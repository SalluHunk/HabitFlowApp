import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../theme';

interface Cell { date: string; done?: boolean; count?: number }

interface Props {
  cells: Cell[];
  color?: string;
  maxCount?: number;
  cellSize?: number;
  gap?: number;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}

function colorWithAlpha(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function HeatmapGrid({ cells, color = Colors.primary, maxCount, cellSize = 14, gap = 3 }: Props) {
  const max = maxCount ?? (cells.length === 0 ? 1 : Math.max(1, ...cells.map(c => c.count ?? (c.done ? 1 : 0))));

  const getCellColor = (cell: Cell) => {
    if (cell.done !== undefined) return cell.done ? color : Colors.border;
    const cnt = cell.count ?? 0;
    if (cnt === 0) return Colors.border;
    const ratio = cnt / max;
    if (ratio < 0.25) return colorWithAlpha(color, 0.3);
    if (ratio < 0.5)  return colorWithAlpha(color, 0.55);
    if (ratio < 0.75) return colorWithAlpha(color, 0.8);
    return color;
  };

  // 7 rows of cells + 6 gaps between them
  const gridHeight = 7 * cellSize + 6 * gap;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.grid, { gap, maxHeight: gridHeight }]}>
        {cells.map((cell, i) => (
          <View
            key={i}
            style={[
              styles.cell,
              {
                width: cellSize,
                height: cellSize,
                backgroundColor: getCellColor(cell),
              },
            ]}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  cell: {
    borderRadius: 3,
  },
});
