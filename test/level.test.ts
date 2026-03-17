import levelData from '../firstlevel.json';

type LevelObject = {
  id: string;
  type: 'platform' | 'spike' | 'jump_pad' | 'coin' | 'goal';
  x: number;
  y: number;
  width?: number;
  height?: number;
  strength?: number;
};

type LevelJson = {
  format: string;
  level: {
    player: { spawn: { x: number; y: number }; mode: string };
    camera: { follow_player: boolean };
    objects: LevelObject[];
    theme?: Record<string, string>;
    music?: { track: string; offset_ms: number };
  };
};

test('firstlevel.json should be valid format and basic objects', () => {
  const data = levelData as LevelJson;

  expect(data.format).toBe('nicholas-platformer-level-v1');
  expect(data.level).toBeDefined();
  expect(data.level.player.spawn.x).toBeGreaterThanOrEqual(0);
  expect(data.level.player.spawn.y).toBeGreaterThanOrEqual(0);
  expect(data.level.camera.follow_player).toBe(true);
  expect(Array.isArray(data.level.objects)).toBe(true);

  const haveGoal = data.level.objects.some((obj) => obj.type === 'goal');
  const havePlatform = data.level.objects.some((obj) => obj.type === 'platform');
  const haveSpike = data.level.objects.some((obj) => obj.type === 'spike');

  expect(haveGoal).toBe(true);
  expect(havePlatform).toBe(true);
  expect(haveSpike).toBe(true);
});
