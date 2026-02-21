import * as THREE from 'three';

/**
 * Advanced FBOParticles
 * High-performance GPGPU particle system with manual rotation and theme-aware coloring.
 */

class FBOParticles {
    constructor() {
        this.container = document.getElementById('hero-animation-container');
        if (!this.container) return;

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight || 600;

        // Settings
        this.size = 256;
        this.totalParticles = this.size * this.size;

        // Interaction
        this.mouse = new THREE.Vector2();
        this.targetRotation = new THREE.Vector2();
        this.currentRotation = new THREE.Vector2();
        this.isMouseDown = false;

        this.init();
    }

    async init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 100);
        this.camera.position.z = 2.5;

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0); // Ensure transparency
        this.container.appendChild(this.renderer.domElement);

        await this.loadAssets();
        this.initFBO();
        this.addEventListeners();
        this.observeTheme();
        this.animate();
    }

    async loadAssets() {
        const loader = new THREE.TextureLoader();
        return new Promise(resolve => {
            loader.load('assets/favicon.png', (texture) => {
                this.faviconTexture = texture;
                this.processFavicon(texture);
                resolve();
            });
        });
    }

    getThemeColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            return {
                primary: new THREE.Color('#00ffff'), // Bright Neon Cyan
                secondary: new THREE.Color('#bd00ff'), // Deep Electric Purple
                accent: new THREE.Color('#ffffff')   // Pure White
            };
        } else {
            return {
                primary: new THREE.Color('#7c3aed'), // Vivid Violet
                secondary: new THREE.Color('#06b6d4'), // Bright Cyan
                accent: new THREE.Color('#f97316')   // Vibrant Orange
            };
        }
    }

    processFavicon(texture) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.size;
        canvas.height = this.size;
        ctx.drawImage(texture.image, 0, 0, this.size, this.size);

        const imageData = ctx.getImageData(0, 0, this.size, this.size);
        const data = imageData.data;

        this.targetData = new Float32Array(this.totalParticles * 4);
        this.colorData = new Float32Array(this.totalParticles * 4);

        const theme = this.getThemeColors();
        const colors = [theme.primary, theme.secondary, theme.accent];

        for (let i = 0; i < this.totalParticles; i++) {
            const a = data[i * 4 + 3];

            const x = ((i % this.size) / this.size - 0.5) * 2;
            const y = (0.5 - Math.floor(i / this.size) / this.size) * 2;

            if (a > 50) {
                this.targetData[i * 4] = x * 1.2;
                this.targetData[i * 4 + 1] = y * 1.2;
                this.targetData[i * 4 + 2] = (Math.random() - 0.5) * 0.1;
                this.targetData[i * 4 + 3] = a / 255;
            } else {
                const radius = 2.0 + Math.random() * 2.0;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                this.targetData[i * 4] = radius * Math.sin(phi) * Math.cos(theta);
                this.targetData[i * 4 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                this.targetData[i * 4 + 2] = radius * Math.cos(phi);
                this.targetData[i * 4 + 3] = 0.0;
            }
        }

        this.targetTexture = new THREE.DataTexture(this.targetData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);
        this.colorTexture = new THREE.DataTexture(this.colorData, this.size, this.size, THREE.RGBAFormat, THREE.FloatType);

        this.updateColors();
        this.targetTexture.needsUpdate = true;
    }

    updateColors() {
        if (!this.faviconTexture) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.size;
        canvas.height = this.size;
        ctx.drawImage(this.faviconTexture.image, 0, 0, this.size, this.size);
        const imageData = ctx.getImageData(0, 0, this.size, this.size);
        const data = imageData.data;

        const theme = this.getThemeColors();
        const colors = [theme.primary, theme.secondary, theme.accent];
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Cyan and Violet for light theme white edges
        const cyan = new THREE.Color('#0891b2');
        const violet = new THREE.Color('#8b5cf6');

        for (let i = 0; i < this.totalParticles; i++) {
            const r = data[i * 4] / 255;
            const g = data[i * 4 + 1] / 255;
            const b = data[i * 4 + 2] / 255;
            const a = data[i * 4 + 3];

            if (a > 50) {
                if (isDark) {
                    // Dark theme: Pure and bright
                    this.colorData[i * 4] = r * 1.5;
                    this.colorData[i * 4 + 1] = g * 1.5;
                    this.colorData[i * 4 + 2] = b * 1.5;
                } else {
                    // Light theme: "COFFEE CREWS" specific palette
                    const yFactor = 1.0 - (Math.floor(i / this.size) / this.size); // 0 (bottom) to 1 (top)

                    if (yFactor > 0.6) {
                        // "COFFEE" Part: Deep Purple / Black
                        this.colorData[i * 4] = 0.1;   // R
                        this.colorData[i * 4 + 1] = 0.05; // G
                        this.colorData[i * 4 + 2] = 0.25; // B
                    } else {
                        // "CREWS" Part: Vivid Purple to Blue Gradient
                        const mixFactor = (yFactor / 0.6); // Normalize 0-0.6 to 0-1
                        const colorA = new THREE.Color('#3b82f6'); // Bright Blue
                        const colorB = new THREE.Color('#9333ea'); // Vivid Purple
                        const finalColor = colorA.clone().lerp(colorB, mixFactor);

                        this.colorData[i * 4] = finalColor.r * 1.5;
                        this.colorData[i * 4 + 1] = finalColor.g * 1.5;
                        this.colorData[i * 4 + 2] = finalColor.b * 1.5;
                    }
                }
                this.colorData[i * 4 + 3] = 1.0;
            } else {
                const c = colors[Math.floor(Math.random() * colors.length)];
                this.colorData[i * 4] = c.r;
                this.colorData[i * 4 + 1] = c.g;
                this.colorData[i * 4 + 2] = c.b;
                this.colorData[i * 4 + 3] = 0.0; // Hide nebula
            }
        }
        this.colorTexture.needsUpdate = true;
    }

    initFBO() {
        const simVS = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const simFS = `
            uniform sampler2D tCurr;
            uniform sampler2D tTarget;
            uniform float uTime;
            varying vec2 vUv;

            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

            float snoise(vec3 v) {
                const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
                vec3 i  = floor(v + dot(v, C.yyy) );
                vec3 x0 = v - i + dot(i, C.xxx) ;
                vec3 g = step(x0.yzx, x0.xyz);
                vec3 l = 1.0 - g;
                vec3 i1 = min( g.xyz, l.zxy );
                vec3 i2 = max( g.xyz, l.zxy );
                vec3 x1 = x0 - i1 + C.xxx;
                vec3 x2 = x0 - i2 + C.yyy;
                vec3 x3 = x0 - D.yyy;
                i = mod289(i);
                vec4 p = permute( permute( permute(
                            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                        + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                        + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                float n_ = 0.142857142857;
                vec3 ns = n_ * D.wyz - D.xzx;
                vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
                vec4 x_ = floor(j * ns.z);
                vec4 y_ = floor(j - 7.0 * x_ );
                vec4 x = x_ *ns.x + ns.yyyy;
                vec4 y = y_ *ns.x + ns.yyyy;
                vec4 h = 1.0 - abs(x) - abs(y);
                vec4 b0 = vec4( x.xy, y.xy );
                vec4 b1 = vec4( x.zw, y.zw );
                vec4 s0 = floor(b0)*2.0 + 1.0;
                vec4 s1 = floor(b1)*2.0 + 1.0;
                vec4 sh = -step(h, vec4(0.0));
                vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
                vec3 p0 = vec3(a0.xy,h.x);
                vec3 p1 = vec3(a0.zw,h.y);
                vec3 p2 = vec3(a1.xy,h.z);
                vec3 p3 = vec3(a1.zw,h.w);
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
                vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                m = m * m;
                return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
            }

            void main() {
                vec4 pos = texture2D(tCurr, vUv);
                vec4 target = texture2D(tTarget, vUv);
                vec3 dir = target.xyz - pos.xyz;
                pos.xyz += dir * 0.015 * (1.0 + target.w * 3.0);
                float n = snoise(pos.xyz * 0.4 + uTime * 0.1);
                pos.x += cos(n * 6.28) * 0.001;
                pos.y += sin(n * 6.28) * 0.001;
                pos.z += sin(n * 3.14) * 0.001;
                gl_FragColor = vec4(pos.xyz, 1.0);
            }
        `;

        this.rtA = new THREE.WebGLRenderTarget(this.size, this.size, {
            type: THREE.FloatType,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat
        });
        this.rtB = this.rtA.clone();

        this.simScene = new THREE.Scene();
        this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.simMaterial = new THREE.ShaderMaterial({
            uniforms: { tCurr: { value: null }, tTarget: { value: this.targetTexture }, uTime: { value: 0 } },
            vertexShader: simVS,
            fragmentShader: simFS
        });

        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.simMaterial);
        this.simScene.add(plane);
        this.renderer.setRenderTarget(this.rtA);
        this.renderer.render(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshBasicMaterial({ map: this.targetTexture })), this.simCamera);
        this.renderer.setRenderTarget(null);

        const geometry = new THREE.BufferGeometry();
        const uvs = new Float32Array(this.totalParticles * 2);
        for (let i = 0; i < this.totalParticles; i++) {
            uvs[i * 2] = (i % this.size) / this.size;
            uvs[i * 2 + 1] = Math.floor(i / this.size) / this.size;
        }
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.totalParticles * 3), 3));

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tPos: { value: null },
                tColor: { value: this.colorTexture },
                uTime: { value: 0 },
                uIsDark: { value: document.documentElement.getAttribute('data-theme') === 'dark' ? 1.0 : 0.0 }
            },
            vertexShader: `
                uniform sampler2D tPos;
                uniform sampler2D tColor;
                uniform float uTime;
                uniform float uIsDark;
                varying vec4 vColor;
                void main() {
                    vec4 pos = texture2D(tPos, uv);
                    vColor = texture2D(tColor, uv);
                    vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);
                    float pulse = 1.0 + sin(uTime * 3.0 + uv.x * 50.0) * 0.3;
                    
                    // Thicker edges for light theme (uIsDark == 0.0)
                    float thickness = (uIsDark < 0.5) ? 2.5 : 1.2;
                    gl_PointSize = (thickness + pulse) * (3.5 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec4 vColor;
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    
                    // High-intensity core for ultra-vibrancy
                    float intensity = pow(1.0 - d * 2.0, 1.3);
                    gl_FragColor = vec4(vColor.rgb * 1.8, intensity * vColor.a);
                }
            `,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
        });

        this.points = new THREE.Points(geometry, this.particleMaterial);
        this.scene.add(this.points);
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.width = this.container.offsetWidth;
            this.height = this.container.offsetHeight || 600;
            this.renderer.setSize(this.width, this.height);
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
        });

        const onMove = (x, y) => {
            if (this.isMouseDown) {
                const dx = x - this.lastMouseX;
                const dy = y - this.lastMouseY;
                this.targetRotation.y += dx * 0.01;
                this.targetRotation.x += dy * 0.01;
                this.lastMouseX = x;
                this.lastMouseY = y;
            }
        };

        this.container.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.lastMouseX = e.clientX;
            this.lastMouseY = e.clientY;
        });

        window.addEventListener('mouseup', () => this.isMouseDown = false);
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));

        this.container.addEventListener('touchstart', (e) => {
            this.isMouseDown = true;
            this.lastMouseX = e.touches[0].clientX;
            this.lastMouseY = e.touches[0].clientY;
        });
        this.container.addEventListener('touchend', () => this.isMouseDown = false);
        this.container.addEventListener('touchmove', (e) => onMove(e.touches[0].clientX, e.touches[0].clientY));
    }

    observeTheme() {
        const observer = new MutationObserver(() => this.updateColors());
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        const uTime = performance.now() * 0.001;

        this.simMaterial.uniforms.uTime.value = uTime;
        this.simMaterial.uniforms.tCurr.value = this.rtA.texture;
        this.renderer.setRenderTarget(this.rtB);
        this.renderer.render(this.simScene, this.simCamera);
        const tmp = this.rtA; this.rtA = this.rtB; this.rtB = tmp;

        this.particleMaterial.uniforms.tPos.value = this.rtA.texture;
        this.particleMaterial.uniforms.uTime.value = uTime;
        this.particleMaterial.uniforms.uIsDark.value = document.documentElement.getAttribute('data-theme') === 'dark' ? 1.0 : 0.0;

        // Smooth rotation
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.1;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.1;

        this.points.rotation.x = this.currentRotation.x;
        this.points.rotation.y = this.currentRotation.y + uTime * 0.1; // Base rotation + manual

        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FBOParticles();
});
