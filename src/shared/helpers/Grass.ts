import * as THREE from 'three';
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export class Grass {
  grassBlade: THREE.BufferGeometry;
  grassMaterial: THREE.Material;
  grass: THREE.Mesh;

  constructor() {
    this.grassBlade = this.createGrassBlade();
    this.grassMaterial = this.createGrassMaterial();
    this.grass = new THREE.Mesh(this.grassBlade, this.grassMaterial);
  }

  private createGrassBlade() {
    const bladeGeometry = new THREE.PlaneGeometry(0.1, 1);
    bladeGeometry.translate(0, 0.5, 0);

    const blades = [];
    for (let i = 0; i < 4; i++) {
      const rotatedBlade = bladeGeometry.clone();
      rotatedBlade.rotateY((i * Math.PI) / 2); // Rotate 90° around Y-axis
      blades.push(rotatedBlade);
    }
    return mergeGeometries(blades);
  }
  private createGrassMaterial() {
    return new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
    });
  }
}