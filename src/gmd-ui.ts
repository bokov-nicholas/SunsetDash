import { convertGmdToLevelJson, LevelJson } from './gmd-importer';

export function setupGmdControls() {
  const fileInput = document.getElementById('gmd-file-input') as HTMLInputElement | null;
  const convertButton = document.getElementById('convert-to-json') as HTMLButtonElement | null;
  const downloadButton = document.getElementById('download-json') as HTMLButtonElement | null;
  const status = document.getElementById('control-status') as HTMLDivElement | null;
  let latestJson: LevelJson | null = null;

  const setStatus = (msg: string, isError = false) => {
    if (!status) return;
    status.textContent = msg;
    status.style.color = isError ? '#ff8080' : '#c8ffc8';
  };

  const readFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') return reject(new Error('Invalid file content')); 
        resolve(reader.result);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  convertButton?.addEventListener('click', async () => {
    if (!fileInput?.files?.length) {
      setStatus('Select a .gmd file first.', true);
      return;
    }

    try {
      setStatus('Converting .gmd...');
      const raw = await readFile(fileInput.files[0]);
      const converted = await convertGmdToLevelJson(raw);
      latestJson = converted;

      (window as any).__sunsetdash_level_data = converted;
      setStatus('Converted and loaded to game. Press Play/refresh if running.');

      // Rerender by reloading scene if available
      const game = (window as any).game;
      if (game && game.scene) {
        const scene = game.scene.getScene('MainScene');
        if (scene) {
          scene.scene.restart();
        }
      }
    } catch (error) {
      console.error(error);
      setStatus('Error converting .gmd: ' + (error as Error).message, true);
    }
  });

  downloadButton?.addEventListener('click', () => {
    if (!latestJson) {
      setStatus('No converted level available. Convert first.', true);
      return;
    }

    const blob = new Blob([JSON.stringify(latestJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${latestJson.level.name ?? 'sunsetdash-level'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('JSON download started.');
  });
}
