import * as THREE from "three";
export class Grass {
  grassBlade: THREE.BufferGeometry;
  grassMaterial: THREE.Material;
  mesh: THREE.Mesh;
  private uniforms = {
    time: { value: 0 },
    windStrength: { value: 0.1 },
    windSpeed: { value: 3.5 },
  }
  constructor() {
    this.grassBlade = this.createGrassBlade();
    this.grassMaterial = this.createGrassMaterial();
    this.mesh = new THREE.Mesh(this.grassBlade, this.grassMaterial);
  }

  private createGrassBlade() {
    const grassBladeGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, 0, 0, 0.1, 0.5, 0, -0.1, 0.5, 0]);
    const indices = new Uint16Array([0, 1, 2]);
    grassBladeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );
    grassBladeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
    return grassBladeGeometry;
  }
  private createGrassMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
            uniform float time;
            uniform float windStrength;
            uniform float windSpeed;
            
            varying float vHeight;
    
            void main() {
                // Apply instance transformation
                vec3 transformed = (instanceMatrix * vec4(position, 1.0)).xyz;
                
                // Wind displacement calculation
                float windWave = sin(time * windSpeed + transformed.y * 5.0) * windStrength;
                float horizontalDisplacement = windWave * (1.0 - transformed.y); // Less displacement at base
                
                // Apply wind displacement
                transformed.x += horizontalDisplacement;
                transformed.z += horizontalDisplacement * 0.3;
    
                // Output final position
                gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
                
                // Pass height to fragment shader for color gradient
                vHeight = position.y;
            }
        `,
      fragmentShader: `
            varying float vHeight;
            
            void main() {
                // Create gradient from tip to base
                vec3 baseColor = vec3(0.0, 0.5, 0.0);
                vec3 tipColor = vec3(0.2, 0.8, 0.2);
                vec3 finalColor = mix(baseColor, tipColor, vHeight);
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
      side: THREE.DoubleSide,
    });
  }
  public update(deltaTime: number) {
    this.uniforms.time.value += deltaTime;
  }
  public createMesh(instanceCount = 10000) {
    const grassMesh = new THREE.InstancedMesh(this.grassBlade, this.grassMaterial, instanceCount);
    grassMesh.receiveShadow = true;
    grassMesh.rotation.x = Math.PI;
    grassMesh.position.y = 0.5;
    const dummy = new THREE.Object3D();
    const positions = [];
    // Set random positions and rotations
    for (let i = 0; i < instanceCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 10,
        0,
        (Math.random() - 0.5) * 10
      );
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.setScalar(0.8 + Math.random() * 0.5);
      dummy.position.y = -dummy.scale.y / 2 + 0.5;
      dummy.updateMatrix();
      grassMesh.setMatrixAt(i, dummy.matrix);
      positions.push(dummy.position.clone());
    }
    grassMesh.instanceMatrix.needsUpdate = true;
    return grassMesh;
  }
}