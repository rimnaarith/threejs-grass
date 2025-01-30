import { EventEmitter } from 'events';
import { useCamera, useRenderer, useScene, useStats, useComposer } from '../init';

// animation params
type Frame = XRFrame | null

export type TickData = {
  timestamp: number
  timeDiff: number
  fps: number
  frame: Frame
  deltaTime: number;
}

const localTickData: TickData = {
  timestamp: 0,
  timeDiff: 0,
  fps: 0,
  frame: null,
  deltaTime: 0
}

export class TickManager extends EventEmitter {
  timestamp: number;
  timeDiff: number;
  frame: Frame;
  lastTimestamp: number;
  deltaTime: number;
  fps: number;

  constructor({ timestamp, timeDiff, frame, deltaTime } = localTickData) {
    super();
    this.timestamp = timestamp;
    this.timeDiff = timeDiff;
    this.frame = frame;
    this.lastTimestamp = 0;
    this.fps = 0;
    this.deltaTime = deltaTime;
  }
  startLoop() {
    const renderer = useRenderer();
    const composer = useComposer();
    const scene = useScene()
    const camera = useCamera()
    const stats = useStats()

    if (!renderer) {
      throw new Error("Updating Frame Failed : Uninitialized Renderer");
    }

    const animate = (timestamp: number, frame: Frame) => {
      const now = performance.now();
      this.timestamp = timestamp ?? now;
      this.timeDiff = timestamp - this.lastTimestamp;

      const timeDiffCapped = Math.min(Math.max(this.timeDiff, 0), 100);

      // performance tracker start
      this.fps = 1000 / this.timeDiff;
      this.deltaTime = timeDiffCapped / 1000;
      this.lastTimestamp = this.timestamp;

      composer.render();
      this.tick(timestamp, timeDiffCapped, this.fps, frame, this.deltaTime);

      stats.update();
    };

    renderer.setAnimationLoop(animate);
  }

  tick(timestamp: number, timeDiff: number, fps: number, frame: Frame, deltaTime: number) {
    localTickData.timestamp = timestamp;
    localTickData.frame = frame;
    localTickData.timeDiff = timeDiff;
    localTickData.fps = fps;
    localTickData.deltaTime = deltaTime;
    this.emit('tick', localTickData);
  }
}