import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';

// --- Configuration ---
const WIDTH = 256; // Texture width for simulation (256x256 = 65k particles)
const CONTAINER_ID = 'hero-animation-container';

// --- Shaders ---

const fragmentSimulationShader = `
    uniform sampler2D texturePosition;
    uniform sampler2D textureOriginal; // Target positions
    uniform vec3 mousePos;
    uniform float iTime;
    
    void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec4 pos = texture2D(texturePosition, uv);
        vec4 original = texture2D(textureOriginal, uv);
        
        vec3 target = original.xyz;
        vec3 current = pos.xyz;
        
        // Force 1: Attraction to Home (Target)
        vec3 homeForce = (target - current) * 0.03; // Smooth return
        
        // Force 2: Mouse Repulsion
        vec3 dir = current - mousePos;
        float dist = length(dir);
        vec3 repulse = vec3(0.0);
        if(dist < 2.0 && dist > 0.0) {
            float strength = (2.0 - dist) / 2.0;
            repulse = normalize(dir) * strength * 0.5;
        }
        
        // Force 3: Noise/Movement
        vec3 noiseOffset = vec3(
            sin(current.y * 5.0 + iTime) * 0.002,
            cos(current.x * 5.0 + iTime) * 0.002,
            sin(current.z * 5.0 + iTime) * 0.002
        );
        
        // Combine forces
        // Use velocity-based integration or simple position blending
        // Here we use simple position blending for stability
        
        vec3 velocity = (homeForce + repulse + noiseOffset);
        
        // Damping 
        // For simple FBO position update without velocity texture, we just add displacement
        // but we must ensure it doesn't drift.
        // The homeForce pulls it back.
        
        current += velocity;
        
        gl_FragColor = vec4(current, 1.0);
    }
`;

const vertexShader = `
    uniform sampler2D texturePosition;
    uniform sampler2D textureOriginal;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
        vec4 posInfo = texture2D(texturePosition, position.xy); // Read pos from FBO
        vec3 pos = posInfo.xyz;
        
        // Read original color/info if needed, for now just use position for interaction
        vec4 original = texture2D(textureOriginal, position.xy);
        
        // Calculate size based on depth or mouse interaction could go here
        gl_PointSize = 2.0 * (10.0 / -mvPosition.z); // Perspective sizing? 
        // Simple sizing for now
        gl_PointSize = 2.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        
        // Dynamic Color based on position
        vColor = vec3(0.2, 0.8, 1.0); // Cyan base
        
        // Fade out if far from original (optional)
        float dist = distance(pos, original.xyz);
        vAlpha = 1.0 - smoothstep(0.0, 5.0, dist);
    }
`;

const fragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
        // Circular soft particle
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        if (dist > 0.5) discard;
        
        float alpha = 0.8 - dist * 1.6; // Soft edge
        
        gl_FragColor = vec4(vColor, alpha * vAlpha);
    }
`;

// --- Scene Setup ---
const container = document.getElementById(CONTAINER_ID);

if (!container) {
    console.error(`Container not found: ${CONTAINER_ID}`);
} else {
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Adjust camera based on container aspect ratio if possible, but usually window for full screen bg
// If container is small, use container size
const width = container ? container.clientWidth : window.innerWidth;
const height = container ? container.clientHeight : window.innerHeight;

camera.aspect = width / height;
camera.updateProjectionMatrix();

camera.position.z = 20; // Zoom out a bit
camera.position.y = 0;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
if (container) container.appendChild(renderer.domElement);


// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

// --- Load Image & Process Data ---
const imageLoader = new THREE.ImageLoader();
imageLoader.load('assets/favicon.png', function (image) {
    console.log("FBO: Favicon loaded successfully", image.width, image.height);
    initSimulation(image);
}, undefined, function (err) {
    console.error("FBO: Failed to load favicon", err);
});

let gpuCompute;
let positionVariable;
let particleUniforms;
let particles;

function initSimulation(image) {
    // 1. Get Valid Pixels from Image
    const canvas = document.createElement('canvas');
    canvas.width = 128; // Resize for sampling
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = [];

    for (let i = 0; i < imgData.data.length; i += 4) {
        const r = imgData.data[i];
        const g = imgData.data[i + 1];
        const b = imgData.data[i + 2];
        const a = imgData.data[i + 3];

        if (a > 50) { // Threshold
            const index = i / 4;
            const x = (index % canvas.width) / canvas.width;
            const y = 1.0 - (Math.floor(index / canvas.width) / canvas.height); // Flip Y

            // Map to scene coordinates (-4 to 4)
            const sceneX = (x - 0.5) * 8;
            const sceneY = (y - 0.5) * 8;

            pixels.push({
                x: sceneX,
                y: sceneY,
                z: 0,
                r: r / 255,
                g: g / 255,
                b: b / 255
            });
        }
    }

    // 2. Setup GPU Compute
    gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
    if (!renderer.capabilities.isWebGL2) {
        gpuCompute.setDataType(THREE.HalfFloatType);
    }

    const dtPosition = gpuCompute.createTexture();
    const dtOriginal = gpuCompute.createTexture(); // Store target positions

    fillTextures(dtPosition, dtOriginal, pixels);

    positionVariable = gpuCompute.addVariable("texturePosition", fragmentSimulationShader, dtPosition);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable]);

    positionVariable.material.uniforms = {
        textureOriginal: { value: dtOriginal },
        mousePos: { value: new THREE.Vector3(1000, 1000, 1000) },
        iTime: { value: 0.0 }
    };

    const error = gpuCompute.init();
    if (error !== null) {
        console.error(error);
    }

    // 3. Setup Particle System
    const geometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(WIDTH * WIDTH * 3);
    const uvs = new Float32Array(WIDTH * WIDTH * 2);
    const colors = new Float32Array(WIDTH * WIDTH * 3);

    let p = 0;
    let c = 0;
    const len = pixels.length;

    for (let j = 0; j < WIDTH; j++) {
        for (let i = 0; i < WIDTH; i++) {
            uvs[p++] = i / (WIDTH - 1);
            uvs[p++] = j / (WIDTH - 1);

            // Assign color from pixel data
            const pixelIndex = (j * WIDTH + i) % len;
            const pixel = pixels[Math.floor(pixelIndex)]; // Math.floor just in case

            if (pixel) {
                // Boost color if too dark (assuming additive blending on dark bg)
                const brightness = pixel.r + pixel.g + pixel.b;
                if (brightness < 0.5) {
                    colors[c++] = 0.0; // Force Cyan/Blue for dark pixels
                    colors[c++] = 0.8;
                    colors[c++] = 1.0;
                } else {
                    colors[c++] = pixel.r;
                    colors[c++] = pixel.g;
                    colors[c++] = pixel.b;
                }
            } else {
                colors[c++] = 0; colors[c++] = 1; colors[c++] = 1;
            }
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


    particleUniforms = {
        texturePosition: { value: null },
        textureOriginal: { value: dtOriginal }
    };

    const material = new THREE.ShaderMaterial({
        uniforms: particleUniforms,
        vertexShader: `
            uniform sampler2D texturePosition;
            attribute vec3 color;
            varying vec3 vColor;
            
            void main() {
                vec4 posInfo = texture2D(texturePosition, uv); 
                vec3 pos = posInfo.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = 4.0;
                
                vColor = color;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            void main() {
                 vec2 center = gl_PointCoord - 0.5;
                 if (length(center) > 0.5) discard;
                 gl_FragColor = vec4(vColor, 0.8);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    animate();
}

function fillTextures(texturePosition, textureOriginal, validPixels) {
    const posArray = texturePosition.image.data;
    const orgArray = textureOriginal.image.data;
    const len = validPixels.length;

    for (let k = 0, kl = posArray.length; k < kl; k += 4) {
        let i = Math.floor(k / 4);

        // If we have more particles than pixels, reuse pixels randomly or loop
        let pixel = validPixels[i % len];

        // Targets
        orgArray[k + 0] = pixel.x;
        orgArray[k + 1] = pixel.y;
        orgArray[k + 2] = pixel.z;
        orgArray[k + 3] = 1.0;

        // Current Positions (Start randomized slightly)
        posArray[k + 0] = pixel.x + (Math.random() - 0.5) * 5.0;
        posArray[k + 1] = pixel.y + (Math.random() - 0.5) * 5.0;
        posArray[k + 2] = pixel.z + (Math.random() - 0.5) * 5.0;
        posArray[k + 3] = 1.0;
    }
}

// --- Interaction ---
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const targetVec = new THREE.Vector3();

// container.addEventListener('mousemove', onPointerMove);

document.addEventListener('mousemove', (event) => {
    // Normalizing mouse to -1 to 1 for Raycaster
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Raycast to find point on Z=0 plane
    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, targetVec);

    if (positionVariable) {
        positionVariable.material.uniforms.mousePos.value.copy(targetVec);
    }
});


// --- Animation Loop ---
function animate() {
    requestAnimationFrame(animate);

    // controls.update();

    const time = performance.now() * 0.001;
    if (positionVariable) {
        positionVariable.material.uniforms.iTime.value = time;

        gpuCompute.compute();

        // Update particle material with new positions
        particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
    }

    renderer.render(scene, camera);
}

// --- Resize ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
