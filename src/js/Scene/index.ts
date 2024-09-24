import { Mesh, PlaneGeometry, Points, ShaderMaterial } from 'three';
import { lerp, NCallbacks, scoped, vevet } from '@anton.bobrov/vevet-init';
import { addEventListener, IAddEventListener } from 'vevet-dom';
import { TProps } from './types';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import simplexNoise from '../webgl/shaders/simplexNoise.glsl';

export class Scene {
  private get props() {
    return this._props;
  }

  private _mesh: Points | Mesh;

  private _geometry: PlaneGeometry;

  private _material: ShaderMaterial;

  private _callbacks: NCallbacks.IAddedCallback[] = [];

  private _listeners: IAddEventListener[] = [];

  private _x = { current: 0, target: 0 };

  private _y = { current: 0, target: 0 };

  constructor(private _props: TProps) {
    const {
      manager,
      width,
      height,
      depth: depthProp,
      manDiffuseMap,
      manDepthMap,
    } = _props;

    // create geometry
    this._geometry = new PlaneGeometry(width, height, 200, 200);

    // calculate depth
    const maxDepth = Math.round(
      Math.sqrt(width ** 2 + height ** 2) * depthProp,
    );

    // create shader material
    this._material = new ShaderMaterial({
      vertexShader,
      fragmentShader: simplexNoise + fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_aspect: { value: width / height },
        u_edge: { value: 0.5 },
        u_maxDepth: { value: maxDepth },
        u_manDiffuseMap: { value: manDiffuseMap },
        u_manDepthMap: { value: manDepthMap },
      },
      transparent: true,
    });

    // create mesh
    this._mesh = new Points(this._geometry, this._material);
    manager.scene.add(this._mesh);

    // render
    this._callbacks.push(manager.callbacks.add('render', () => this._render()));

    // mousemove
    this._listeners.push(
      addEventListener(window, 'mousemove', (event) => {
        this._x.target = scoped(event.clientX, [
          vevet.viewport.width / 2,
          vevet.viewport.width,
        ]);

        this._y.target = scoped(event.clientY, [
          vevet.viewport.height / 2,
          vevet.viewport.height,
        ]);
      }),
    );
  }

  /** Render the scene */
  private _render() {
    const { props, _x: x, _y: y, _mesh: mesh } = this;
    const { easeMultiplier } = this.props.manager;
    const { uniforms } = this._material;

    uniforms.u_time.value += 1 * easeMultiplier;

    const ease = easeMultiplier * 0.05;

    x.current = lerp(x.current, x.target, ease);

    y.current = lerp(y.current, y.target, ease);

    mesh.position.x = x.current * props.width * -0.1;
    mesh.position.y = y.current * props.height * 0.05;

    mesh.rotation.y = x.current * Math.PI * -0.1;
    mesh.rotation.x = y.current * Math.PI * -0.1;

    uniforms.u_edge.value = 1.0 - (x.current + 1) / 2;
  }

  /** Destroy the scene */
  public destroy() {
    this.props.manager.scene.remove(this._mesh);
    this._material.dispose();
    this._geometry.dispose();

    this._callbacks.forEach((callback) => callback.remove());
    this._listeners.forEach((event) => event.remove());
  }
}
