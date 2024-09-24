import { PlaneGeometry, Points, ShaderMaterial } from 'three';
import { NCallbacks } from '@anton.bobrov/vevet-init';
import { TProps } from './types';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import simplexNoise from '../webgl/shaders/simplexNoise.glsl';

export class Background {
  private get props() {
    return this._props;
  }

  private _mesh: Points;

  private _geometry: PlaneGeometry;

  private _material: ShaderMaterial;

  private _callbacks: NCallbacks.IAddedCallback[] = [];

  constructor(private _props: TProps) {
    const { manager, width, height } = _props;

    // create geometry
    this._geometry = new PlaneGeometry(width, height, 500, 500);

    // create shader material
    this._material = new ShaderMaterial({
      vertexShader: simplexNoise + vertexShader,
      fragmentShader: simplexNoise + fragmentShader,
      uniforms: {
        u_time: { value: 0 },
      },
      transparent: true,
    });

    // create mesh
    this._mesh = new Points(this._geometry, this._material);
    manager.scene.add(this._mesh);

    // render
    this._callbacks.push(manager.callbacks.add('render', () => this._render()));
  }

  /** Render the scene */
  private _render() {
    const { easeMultiplier } = this.props.manager;
    const { uniforms } = this._material;

    uniforms.u_time.value += 1 * easeMultiplier;
  }

  /** Destroy the scene */
  public destroy() {
    this.props.manager.scene.remove(this._mesh);
    this._material.dispose();
    this._geometry.dispose();

    this._callbacks.forEach((event) => event.remove());
  }
}
