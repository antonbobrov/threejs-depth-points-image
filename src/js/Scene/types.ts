import { Texture } from 'three';
import { WebglManager } from '../webgl/Manager';

export type TProps = {
  manager: WebglManager;
  width: number;
  height: number;
  depth: number;
  manDiffuseMap: Texture;
  manDepthMap: Texture;
};
