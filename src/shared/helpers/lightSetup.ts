import * as THREE from 'three'
import { useScene } from '../../render/init'

export function setupLight() {
  const scene = useScene()

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1);
	hemiLight.position.set( 0, 100, 100 );
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
	dirLight.position.set(4, 4, 4);
  dirLight.lookAt(0, 0, 0);
	dirLight.castShadow = true;
	dirLight.shadow.mapSize.width = 4096;
  dirLight.shadow.mapSize.height = 4096;
  dirLight.shadow.camera.near = 2;
  dirLight.shadow.camera.far = 15;
	scene.add( dirLight );
}