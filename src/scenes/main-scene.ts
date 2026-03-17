import Phaser from 'phaser';
import levelData from '../../firstlevel.json';

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
    theme?: { background?: string; ground?: string; accent?: string };
  };
};

const parseColor = (color: string | number | undefined, fallback: number): number => {
  if (typeof color === 'number') return color;
  if (!color || typeof window === 'undefined') return fallback;

  if (typeof color === 'string') {
    if (color.startsWith('#')) {
      return Number(`0x${color.slice(1)}`) || fallback;
    }
    if (color.startsWith('0x')) {
      return Number(color) || fallback;
    }

    const node = document.createElement('div');
    node.style.color = color;
    document.body.appendChild(node);
    const computed = getComputedStyle(node).color;
    document.body.removeChild(node);

    const rgba = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgba) {
      const r = Number(rgba[1]);
      const g = Number(rgba[2]);
      const b = Number(rgba[3]);
      return (r << 16) | (g << 8) | b;
    }
  }

  return fallback;
};

export class MainScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Image;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private restartKey?: Phaser.Input.Keyboard.Key;
  private spiked = false;
  private won = false;
  private coinsCollected = 0;
  private coinsText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // no assets yet; using simple geometry
  }

  create() {
    const level = (levelData as LevelJson).level;
    const theme = (levelData as any).level.theme ?? { background: '#1d1d1d', ground: '#0000ff', accent: '#00ff00' };

    const backgroundColor = parseColor(theme.background, 0x1d1d1d);
    const groundColor = parseColor(theme.ground, 0x0000ff);
    const accentColor = parseColor(theme.accent, 0x00ff00);

    this.cameras.main.setBackgroundColor(backgroundColor);

    this.add.text(20, 20, 'Sunset Dash', {
      fontSize: '24px',
      color: '#ffffff'
    }).setScrollFactor(0);

    this.coinsCollected = 0;
    this.coinsText = this.add.text(20, 50, `Coins: 0`, { fontSize: '18px', color: '#ffffff' }).setScrollFactor(0);

    const playerSpawn = level.player.spawn;
    this.player = this.physics.add.image(playerSpawn.x, playerSpawn.y, '').setDisplaySize(32, 32);
    this.player.setTint(accentColor);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.1);

    const platforms = this.physics.add.staticGroup();
    const spikes = this.physics.add.staticGroup();
    const jumpPads = this.physics.add.staticGroup();
    const coins = this.physics.add.staticGroup();
    let goalObject: Phaser.GameObjects.GameObject | null = null;

    let minX = playerSpawn.x;
    let minY = playerSpawn.y;
    let maxX = playerSpawn.x;
    let maxY = playerSpawn.y;

    const extendBounds = (x: number, y: number, w: number, h: number) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    };

    for (const obj of level.objects) {
      const w = obj.width ?? 32;
      const h = obj.height ?? 32;
      extendBounds(obj.x, obj.y, w, h);

      if (obj.type === 'platform') {
        const p = this.add.rectangle(obj.x + w / 2, obj.y + h / 2, w, h, groundColor);
        platforms.add(p, true);
      }

      if (obj.type === 'spike') {
        const s = this.add.polygon(obj.x + w / 2, obj.y + h / 2, [0, h, w / 2, 0, w, h], 0xff0000);
        spikes.add(s, true);
      }

      if (obj.type === 'jump_pad') {
        const jp = this.add.rectangle(obj.x + w / 2, obj.y + h / 2, w, h, 0x00ffff);
        jumpPads.add(jp, true);
      }

      if (obj.type === 'coin') {
        const coin = this.add.circle(obj.x, obj.y, 8, 0xffd700);
        this.physics.add.existing(coin, true);
        (coins as any).add(coin, true);
      }

      if (obj.type === 'goal') {
        const g = this.add.rectangle(obj.x + w / 2, obj.y + h / 2, w, h, 0xffff00);
        this.physics.add.existing(g, true);
        goalObject = g;
      }
    }

    this.physics.add.collider(this.player, platforms);
    this.physics.add.overlap(this.player, spikes, () => this.handleDeath(), undefined, this);
    this.physics.add.overlap(this.player, jumpPads, () => this.handleJumpPad(level.objects.find(o => o.type === 'jump_pad')?.strength ?? 1.1), undefined, this);
    this.physics.add.overlap(this.player, coins, (player, coin) => this.collectCoin(coin as any), undefined, this);

    if (goalObject) {
      this.physics.add.overlap(this.player, goalObject, () => this.handleGoal(), undefined, this);
    }

    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input unavailable');
    }

    this.cursors = keyboard.createCursorKeys();
    this.restartKey = keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    if (level.camera.follow_player) {
      const padding = 100;
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBounds(minX - padding, minY - padding, maxX - minX + 2 * padding, maxY - minY + 2 * padding);
      this.physics.world.setBounds(minX - padding, minY - padding, maxX - minX + 2 * padding, maxY - minY + 2 * padding);
    }
  }

  update() {
    if (!this.player || !this.cursors) return;
    if (this.spiked || this.won) {
      if (this.restartKey?.isDown) {
        this.scene.restart();
      }
      return;
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const speed = 180;

    if (this.cursors.left?.isDown) {
      body.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown) {
      body.setVelocityX(speed);
    } else {
      body.setVelocityX(0);
    }

    if ((this.cursors.up?.isDown || this.cursors.space?.isDown) && body.onFloor()) {
      body.setVelocityY(-360);
    }
  }

  private collectCoin(coin: Phaser.GameObjects.GameObject) {
    this.coinsCollected += 1;
    this.coinsText?.setText(`Coins: ${this.coinsCollected}`);
    coin.destroy();
  }

  private handleJumpPad(strength: number) {
    if (!this.player || this.spiked || this.won) return;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    body.setVelocityY(-360 * strength);
  }

  private handleDeath() {
    if (this.spiked || this.won) return;
    this.spiked = true;
    this.player?.setTint(0xff0000);
    this.add.text(200, 120, 'Dead! Press R to restart', { color: '#ffffff', fontSize: '22px' }).setScrollFactor(0);
  }

  private handleGoal() {
    if (this.spiked || this.won) return;
    this.won = true;
    this.player?.setTint(0x00ffff);
    this.add.text(200, 120, 'Goal! Press R to restart', { color: '#ffffff', fontSize: '22px' }).setScrollFactor(0);
  }
}

