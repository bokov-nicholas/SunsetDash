import Phaser from 'phaser';
import { MainScene } from './scenes/main-scene';
import { setupGmdControls } from './gmd-ui';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game',
  backgroundColor: '#1d1d1d',
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);

(window as any).game = game;

if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    setupGmdControls();
  });
}
