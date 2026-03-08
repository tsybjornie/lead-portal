import type { MaterialEntry, MotifEntry } from './core';
import { STONE_NAMES } from './naturalStone';
import { WOOD_SPECIES } from './woodSpecies';
import { TILE_MATERIALS } from './tilesBasic';
import { WORLD_MOTIFS } from './motifs';

// ── UTILITY FUNCTIONS ──

export function getMotifRegions(): string[] {
    return [...new Set(WORLD_MOTIFS.map(m => m.region.trim()))];
}

export function searchMaterials(query: string): {
    stones: MaterialEntry[];
    woods: MaterialEntry[];
    tiles: MaterialEntry[];
    motifs: MotifEntry[];
} {
    const q = query.toLowerCase();
    return {
        stones: STONE_NAMES.filter(s => s.name.toLowerCase().includes(q) || s.origin?.toLowerCase().includes(q) || s.characteristics?.toLowerCase().includes(q)),
        woods: WOOD_SPECIES.filter(w => w.name.toLowerCase().includes(q) || w.origin?.toLowerCase().includes(q) || w.characteristics?.toLowerCase().includes(q)),
        tiles: TILE_MATERIALS.filter(t => t.name.toLowerCase().includes(q) || t.origin?.toLowerCase().includes(q) || t.characteristics?.toLowerCase().includes(q)),
        motifs: WORLD_MOTIFS.filter(m => m.name.toLowerCase().includes(q) || m.origin.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)),
    };
}
