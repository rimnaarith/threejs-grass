import * as THREE from 'three'
import { useScene } from '../../render/init'

export function setupLight() {
  const scene = useScene()

  const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1);
	hemiLight.position.set( 0, 100, 100 );
	scene.add( hemiLight );

	const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
	dirLight.position.set( 11, 10, 10 );
  dirLight.lookAt(0, 0, 0);
	dirLight.castShadow = true;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 75;
	dirLight.shadow.camera.top = 5;
	scene.add( dirLight );
}