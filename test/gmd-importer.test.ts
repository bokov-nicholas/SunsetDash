import { convertGmdToLevelJson, parseGdObjects } from '../src/gmd-importer';

const sampleGmd = `
<d>
  <k>kCEK</k><i>4</i>
  <k>k1</k><i>12345678</i>
  <k>k2</k><s>Test Level</s>
  <k>k3</k><s>VGVzdCBub3RlcyBmb3IgdGVzdA==</s>
  <k>k4</k><s>eJwrVkrOhwYAEPTBIw==</s>
  <k>k5</k><s>test-author</s>
  <k>k88</k><s>100,160,220</s>
  <k>k19</k><s>40,40,40</s>
  <k>k71</k><s>80,80,200</s>
</d>
`;

describe('GMD importer', () => {
  test('parseGdObjects supports simple object sequences', () => {
    const serialized = '1,1,0,100,300,20,40;2,8,400,280,20,20;3,35,600,290,30,10,1.2;4,84,800,260;5,36,920,240,40,60';
    const objects = parseGdObjects(serialized);

    expect(objects).toHaveLength(5);
    expect(objects[0].type).toBe('platform');
    expect(objects[1].type).toBe('spike');
    expect(objects[2].type).toBe('jump_pad');
    expect(objects[3].type).toBe('coin');
    expect(objects[4].type).toBe('goal');
    expect(objects[2].strength).toBeCloseTo(1.2);

    // x/y are reversed in this importer mapping, and dimensions are scaled 5x.
    expect(objects[0].x).toBe(100); // token2=0, token3=100 -> x=100
    expect(objects[0].y).toBe(0);
    expect(objects[0].width).toBe(300 * 5);
    expect(objects[0].height).toBe(20 * 5);
  });

  test('convertGmdToLevelJson preserves metadata and decodes theme', async () => {
    const converted = await convertGmdToLevelJson(sampleGmd);
    expect(converted.format).toBe('nicholas-platformer-level-v1');
    expect(converted.level.name).toBe('Test Level');
    expect(converted.level.author).toBe('test-author');
    expect(converted.level.notes).toBe('Test notes for test');
    expect(converted.level.theme?.background).toBe('#64a0dc');
    expect(converted.level.theme?.ground).toBe('#282828');
    expect(converted.level.theme?.accent).toBe('#5050c8');
  });

  test('convertGmdToLevelJson decodes compressed object stream from k4 field', async () => {
    const objectData = '1,1,0,100,300,20,40;2,8,400,280,20,20;3,35,600,290,30,10,1.2;4,84,800,260;5,36,920,240,40,60';
    const compressed = Buffer.from(require('zlib').deflateRawSync(Buffer.from(objectData, 'utf8'))).toString('base64');

    const gmd = `\n<d>\n  <k>k4</k><s>${compressed}</s>\n</d>`;
    const converted = await convertGmdToLevelJson(gmd);

    expect(converted.level.objects).toHaveLength(5);
    expect(converted.level.objects[0].type).toBe('platform');
    expect(converted.level.objects[4].type).toBe('goal');
    expect(converted.level.objects[2].strength).toBeCloseTo(1.2);
  });
});
