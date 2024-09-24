import { loadImage, vevet } from '@anton.bobrov/vevet-init';
import { Texture } from 'three';
import { WebglManager } from './webgl/Manager';
import { Scene } from './Scene';
import { Background } from './Background';

const managerContainer = document.getElementById('scene') as HTMLElement;

const manager = new WebglManager(managerContainer, {
  rendererProps: {
    dpr: vevet.viewport.lowerDesktopDpr,
    antialias: true,
  },
});

manager.play();

const images = [loadImage('man.jpg'), loadImage('man_depth.png')];

const background = new Background({
  manager,
  width: 5000,
  height: 5000,
});

// eslint-disable-next-line no-console
console.log(background);

Promise.all(images)
  .then((data) => {
    const manDiffuseMap = new Texture(data[0]);
    manDiffuseMap.needsUpdate = true;

    const manDepthMap = new Texture(data[1]);
    manDepthMap.needsUpdate = true;

    const scene = new Scene({
      manager,
      width: 403,
      height: 944,
      depth: 0.75,
      manDiffuseMap,
      manDepthMap,
    });

    // eslint-disable-next-line no-console
    console.log(scene);
  })
  .catch(() => {});
