import * as THREE from 'three'
import { useScene } from '../../render/init';

export function useGridHelper(size: number, divisions: number, scene?: THREE.Scene) {
  if (!scene) {
    scene = useScene()
  }
  const gridHelper = new THREE.GridHelper( size, divisions );
  scene.add( gridHelper );
}