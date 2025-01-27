import './style.css'
import { initEngine } from './render/init';
import { setupLight } from './shared/helpers/lightSetup';
(async () => {
  await initEngine();

  setupLight()
})();
