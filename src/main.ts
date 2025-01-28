import "./style.css";
import * as THREE from "three";
import { initEngine, useScene, useTick } from "./render/init";
import { setupLight } from "./shared/helpers/lightSetup";
import { useGridHelper } from "./shared/utils";
(async () => {
  await initEngine();

  setupLight();

  useGridHelper(20, 20);
  addPlan();
  addBox();
  // stylizedGrass();
})();

function addPlan() {
  const scene = useScene();
  const geometry = new THREE.PlaneGeometry(10, 10);
  const material = new THREE.MeshLambertMaterial({
    color: 0x3a5f0b
  });
  const plan = new THREE.Mesh(geometry, material);
  plan.receiveShadow = true;
  plan.rotation.x = -Math.PI / 2;
  scene.add(plan);
}

function addBox() {
  const scene = useScene();
  const geometry = new THREE.BoxGeometry(2, 1.5, 2);
  const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const box = new THREE.Mesh(geometry, material);
  box.castShadow = true;
  box.receiveShadow = true;
  box.position.y = 1.5 / 2;
  scene.add(box);
}

function stylizedGrass() {
  const scene = useScene();
  const grassBlade = new THREE.PlaneGeometry(0.05, 0.7);

  const bladeCount = 30000;
  const grassMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        uniform float time;
        varying vec2 vUv;

        void main() {
            vUv = uv;
            vec3 transformed = position;
            float scaleFactor = mix(1.0, 0.2, uv.y);
            transformed.x *= scaleFactor;
            transformed.z *= scaleFactor;
            transformed.x += sin(time + uv.y * 10.0) * 0.1;
            transformed = (instanceMatrix * vec4(transformed, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;

        void main() {
            vec3 color = mix(vec3(0.2, 0.8, 0.2), vec3(0.1, 0.5, 0.1), vUv.y);
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    uniforms: {
      time: { value: 0 }, // Uniform for animation
    },
    side: THREE.DoubleSide, // Render both sides of the grass blades
  });
  const instancedMesh = new THREE.InstancedMesh(
    grassBlade,
    grassMaterial,
    bladeCount
  );
  instancedMesh.castShadow = true; // Grass casts shadows
  instancedMesh.receiveShadow = true;

  useTick((data) => {
    grassMaterial.uniforms.time.value += data.deltaTime;
  });

  const dummy = new THREE.Object3D();

  for (let i = 0; i < bladeCount; i++) {
    dummy.position.set(
      (Math.random() - 0.5) * 10,
      0.3,
      (Math.random() - 0.5) * 10
    );
    dummy.rotation.y = Math.random() * Math.PI;
    // dummy.scale.setScalar(0.5 + Math.random() * 0.5);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }

  scene.add(instancedMesh);
}
