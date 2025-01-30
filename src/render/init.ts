import * as THREE from 'three';
import {GUI} from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js';
import { TickManager, type TickData } from './controllers/tickManager';

let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  gui: dat.GUI,
  stats: Stats,
  renderWidth: number,
  renderHeight: number,
  renderAspectRatio: number,
  controls: OrbitControls,
  loader: GLTFLoader;

const renderTickManager = new TickManager();
export const initEngine = async () => {
  loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath( '/libs/draco/gltf/' );
  loader.setDRACOLoader(dracoLoader);
  dracoLoader.preload();

  scene = new THREE.Scene();

  renderWidth = window.innerWidth;
  renderHeight = window.innerHeight;
  renderAspectRatio = renderWidth / renderHeight;

  camera = new THREE.PerspectiveCamera(75, renderAspectRatio, 0.1, 100);
  camera.position.set(-1, 1, 5);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(renderWidth, renderHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // shadow
  renderer.shadowMap.enabled = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  //@ts-ignore
  renderer.physicallyCorrectLights = true;

  await setupEnvMap()
  addOrbitControls()
  const container = document.createElement('div');
  container.id = '_r3d'
  container.appendChild(renderer.domElement);
  document.body.appendChild(container)

  stats = new Stats();
  document.body.appendChild(stats.dom)

  gui = new GUI();
  gui.domElement.parentElement!.style.zIndex = '10000'
  window.addEventListener(
    'resize',
    () => {
      renderWidth = window.innerWidth
      renderHeight = window.innerHeight
      renderAspectRatio = renderWidth / renderHeight

      renderer.setPixelRatio(window.devicePixelRatio)

      camera.aspect = renderAspectRatio
      camera.updateProjectionMatrix()

      renderer.setSize(renderWidth, renderHeight)
    },
    false
  );
  renderTickManager.startLoop()
}
const setupEnvMap = async () => {
  const pmremGenerator = new PMREMGenerator(renderer);
  return new Promise<boolean>(resolve => {
    new RGBELoader()
      .setDataType(THREE.HalfFloatType)
      .setPath('hdr/')
      .load('spaichingen_hill_1k.hdr', 
      (texture) => {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        // scene.background = envMap;
        scene.environment = envMap;
  
        texture.dispose();
        pmremGenerator.dispose();

        resolve(true);
      },
      undefined,
      (err) => {
        console.error('RGBELoader error: ', err);
        resolve(false);
      });
  })
}
const addOrbitControls = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
}

export const useScene = () => scene;
export const useCamera = () => camera;
export const useRenderer = () => renderer;
export const useRenderSize = () => ({ width: renderWidth, height: renderHeight });
export const useControls = () => controls;
export const useLoader = () => loader;
export const useStats = () => stats;
export const useGui = () => gui;
export const useTick = (fn: (_: TickData) => void) => {
  if (renderTickManager) {
    const _tick = (e: TickData) => {
      fn(e)
    }
    renderTickManager.on('tick', _tick);
  }
}