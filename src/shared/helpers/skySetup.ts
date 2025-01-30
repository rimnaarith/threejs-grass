import * as THREE from "three";
import { useGui, useScene } from "../../render/init";
import { Sky } from 'three/addons/objects/Sky.js';

export function initSky() {
  const scene = useScene();
  // Add Sky
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  const sun = new THREE.Vector3();

  /// GUI

  const effectController = {
    turbidity: 16.1,
    rayleigh: 0.284,
    mieCoefficient: 0,
    mieDirectionalG: 0.547,
    elevation: 5.4,
    azimuth: 40.2,
  };

  function guiChanged() {
    const uniforms = sky.material.uniforms;
    uniforms["turbidity"].value = effectController.turbidity;
    uniforms["rayleigh"].value = effectController.rayleigh;
    uniforms["mieCoefficient"].value = effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms["sunPosition"].value.copy(sun);
  }

  const gui = useGui();
  const skyGui = gui.addFolder("Sky");
  skyGui
    .add(effectController, "turbidity", 0.0, 20.0, 0.1)
    .onChange(guiChanged);
  skyGui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
  skyGui
    .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
    .onChange(guiChanged);
  skyGui
    .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
    .onChange(guiChanged);
  skyGui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
  skyGui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);

  guiChanged();
}
