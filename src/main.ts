import './style.css'
import * as THREE from 'three'
import { initEngine, useScene } from './render/init';
import { setupLight } from './shared/helpers/lightSetup';
import { useGridHelper } from './shared/utils'
(async () => {
  await initEngine();

  setupLight()

  useGridHelper(20, 20)
  addPlan()
  
})();


function addPlan() {
  const scene = useScene()
  const geometry = new THREE.PlaneGeometry(8, 8); 
  const material = new THREE.MeshPhongMaterial( {color: 0x00ff00, side: THREE.DoubleSide} ); 
  const plan = new THREE.Mesh( geometry, material );
  plan.rotation.x = -Math.PI / 2
  scene.add(plan);
}
