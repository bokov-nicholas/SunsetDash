import zlib from 'zlib';

export type LevelObjectType = 'platform' | 'spike' | 'jump_pad' | 'coin' | 'goal';

export type LevelObject = {
  id: string;
  type: LevelObjectType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  strength?: number;
};

export type LevelTheme = {
  background?: string;
  ground?: string;
  accent?: string;
};

export type LevelMetadata = {
  id?: string;
  name?: string;
  author?: string;
  notes?: string;
  theme?: LevelTheme;
  music?: { track?: string; offset_ms?: number };
};

export type LevelJson = {
  format: 'nicholas-platformer-level-v1';
  level: {
    id?: string;
    name?: string;
    author?: string;
    notes?: string;
    theme?: LevelTheme;
    music?: { track?: string; offset_ms?: number };
    player: { spawn: { x: number; y: number }; mode: string };
    camera: { follow_player: boolean };
    objects: LevelObject[];
  };
};

const GD_OBJECT_TYPE_MAP: Record<number, LevelObjectType> = {
  1: 'platform',
  8: 'spike',
  35: 'jump_pad',
  84: 'coin',
  36: 'goal',
};

/**
 * Parse a very small subset of GD-level object stream.
 * Supports object entries in the form: "<id>,<type>,<x>,<y>,<width>,<height>"
 * with objects separated by semicolon `;` (or commas vs enumerated segments).
 */
export function parseGdObjects(serialized: string): LevelObject[] {
  if (!serialized || typeof serialized !== 'string') return [];

  const objects: LevelObject[] = [];
  const entries = serialized
    .split(';')
    .map((row) => row.trim())
    .filter((row) => row.length > 0);

  for (let i = 0; i < entries.length; i += 1) {
    const tokens = entries[i].split(',').map((t) => t.trim());
    if (tokens.length < 4) continue;

    const typeId = Number(tokens[1]);
    const mappedType = GD_OBJECT_TYPE_MAP[typeId];
    if (!mappedType) continue;

    // Geometry Dash k4 object format is (y,x) for position in this import use-case.
    // Reverse to match our platformer coordinate mapping.
    const x = Number(tokens[3]);
    const y = Number(tokens[2]);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;

    const obj: LevelObject = {
      id: `gd_${i}_${typeId}`,
      type: mappedType,
      x,
      y,
    };

    if (tokens.length >= 6) {
      const width = Number(tokens[4]);
      const height = Number(tokens[5]);
      if (!Number.isNaN(width) && !Number.isNaN(height)) {
        obj.width = width * 5;
        obj.height = height * 5;
      }
    }

    // jump pad strength is optionally in token[6]
    if (mappedType === 'jump_pad' && tokens.length > 6) {
      const strength = Number(tokens[6]);
      if (!Number.isNaN(strength)) obj.strength = strength;
    }

    objects.push(obj);
  }

  return objects;
}

function base64UrlToUint8Array(encoded: string): Uint8Array {
  const normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');

  if (typeof atob !== 'undefined') {
    const binary = atob(normalized);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      arr[i] = binary.charCodeAt(i);
    }
    return arr;
  }

  // Node.js fallback
  if (typeof Buffer !== 'undefined') {
    const buf = Buffer.from(normalized, 'base64');
    return new Uint8Array(buf);
  }

  throw new Error('No base64 decode available');
}

async function decodeGdCompressedData(encoded: string): Promise<string> {
  if (!encoded) return '';

  const rawBytes = base64UrlToUint8Array(encoded);

  const nodeTry = () => {
    if (typeof window === 'undefined') {
      try {
        const out = zlib.inflateRawSync(rawBytes);
        return new TextDecoder('utf-8').decode(out);
      } catch {
        try {
          const out = zlib.inflateSync(rawBytes);
          return new TextDecoder('utf-8').decode(out);
        } catch {
          return null;
        }
      }
    }
    return null;
  };

  const nodeResult = nodeTry();
  if (nodeResult !== null) return nodeResult;

  const pakoFromWindow = (globalThis as any).pako;
  if (pakoFromWindow) {
    try {
      const out = pakoFromWindow.inflateRaw(rawBytes);
      return new TextDecoder('utf-8').decode(out);
    } catch {
      try {
        const out = pakoFromWindow.inflate(rawBytes);
        return new TextDecoder('utf-8').decode(out);
      } catch {
        // continue fallback
      }
    }
  }

  let pakoLib: any = (globalThis as any).pako;
  if (!pakoLib) {
    try {
      const m = await import('pako');
      pakoLib = (m as any).default ?? m;
    } catch {
      pakoLib = null;
    }
  }

  if (pakoLib) {
    try {
      const out = pakoLib.inflateRaw(rawBytes);
      return new TextDecoder('utf-8').decode(out);
    } catch {
      try {
        const out = pakoLib.inflate(rawBytes);
        return new TextDecoder('utf-8').decode(out);
      } catch {
        // continue fallback
      }
    }
  }

  if (typeof DecompressionStream !== 'undefined') {
    const ds = new DecompressionStream('deflate-raw');
    const blob = new Blob([rawBytes.buffer as ArrayBuffer]);
    const stream = blob.stream().pipeThrough(ds);
    const buffer = await new Response(stream).arrayBuffer();
    return new TextDecoder('utf-8').decode(buffer);
  }

  throw new Error('Unable to decode GD compressed data (k4 field)');
}

function decodeBase64Text(maybeBase64: string): string {
  if (!maybeBase64) return '';

  if (typeof atob !== 'undefined') {
    try {
      const decoded = atob(maybeBase64);
      return decoded;
    } catch {
      // fallback
    }
  }

  if (typeof Buffer !== 'undefined') {
    try {
      const decoded = Buffer.from(maybeBase64, 'base64').toString('utf8');
      if (/^[\x20-\x7e\n\r\t]*$/.test(decoded)) return decoded;
    } catch {
      // fallback
    }
  }

  return maybeBase64;
}

function parseGmdXml(xml: string): Record<string, string> {
  const kv: Record<string, string> = {};
  const keyRegex = /<k>([^<]*)<\/k>\s*(<i>([^<]*)<\/i>|<s>([^<]*)<\/s>)/g;
  let m: RegExpExecArray | null;
  while ((m = keyRegex.exec(xml))) {
    const key = m[1];
    const iValue = m[3];
    const sValue = m[4];
    if (iValue !== undefined) kv[key] = iValue;
    else if (sValue !== undefined) kv[key] = sValue;
  }
  return kv;
}

export async function convertGmdToLevelJson(gmdXml: string): Promise<LevelJson> {
  const keys = parseGmdXml(gmdXml);

  const name = keys['k2'] ?? 'Untitled';
  const rawDesc = keys['k3'] ?? '';
  const author = keys['k5'] ?? 'unknown';
  const levelId = keys['k1'] ?? undefined;

  const theme = {
    background: keys['k88'] ? rgbArrayToHex(keys['k88']) : '#000000',
    ground: keys['k19'] ? rgbArrayToHex(keys['k19']) : '#0000ff',
    accent: keys['k71'] ? rgbArrayToHex(keys['k71']) : '#00ff00',
  };

  const content = keys['k4'] ? await decodeGdCompressedData(keys['k4']) : '';

  const convertedObjects = parseGdObjects(content);

  const out: LevelJson = {
    format: 'nicholas-platformer-level-v1',
    level: {
      id: levelId,
      name,
      author,
      notes: decodeBase64Text(rawDesc),
      theme,
      music: {
        track: keys['k2'] ? `${name}-music` : undefined,
        offset_ms: 0,
      },
      player: {
        spawn: {
          x: 40,
          y: 260,
        },
        mode: 'cube',
      },
      camera: {
        follow_player: true,
      },
      objects: convertedObjects,
    },
  };

  return out;
}

function rgbArrayToHex(value: string): string {
  const nums = value.split(',').map((v) => Number(v.trim())).filter((n) => !Number.isNaN(n));
  if (nums.length >= 3) {
    const [r, g, b] = nums;
    const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
    return `#${[clamp(r), clamp(g), clamp(b)].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
  }
  return '#000000';
}
