import "./style.css";
import * as THREE from "three";
import { initEngine, useScene, useTick } from "./render/init";
import { setupLight } from "./shared/helpers/lightSetup";
import { useGridHelper } from "./shared/utils";
import { Grass } from "./shared/helpers/Grass";
import { initSky } from "./shared/helpers/skySetup";
(async () => {
  await initEngine();
  const scene = useScene();

  setupLight();
  initSky();

  useGridHelper(20, 20);
  addPlan();
  addBox();

  const grass = new Grass();
  scene.add(grass.createMesh());
  useTick(({deltaTime}) => {
    grass.update(deltaTime);
  });
})();

function addPlan() {
  const scene = useScene();
  const geometry = new THREE.PlaneGeometry(20, 20);
  const material = new THREE.MeshLambertMaterial({
    color: 0x045604,
  });
  const plan = new THREE.Mesh(geometry, material);
  plan.receiveShadow = true;
  plan.rotation.x = -Math.PI / 2;
  scene.add(plan);
}

function addBox() {
  const scene = useScene();

  const geometry = new THREE.BoxGeometry(2, 2.5, 2);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const box = new THREE.Mesh(geometry, material);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.y = 2.5 / 2;
  scene.add(box);

  const geometry2 = new THREE.SphereGeometry(0.8, 32, 16);
  const material2 = new THREE.MeshPhongMaterial({ color: 0xf40056 });
  const box2 = new THREE.Mesh(geometry2, material2);
  box2.castShadow = true;
  box2.receiveShadow = true;
  box2.position.x = -2;
  box2.position.y = 0.5;
  scene.add(box2);
}