"use client";
import {
  useRef, useMemo, useState, useEffect, Suspense,
  Component, ErrorInfo, ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Sparkles,
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

class CanvasErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError(_error: Error) {
    return { crashed: true };
  }
  componentDidCatch(_error: Error, _info: ErrorInfo) {}
  render() {
    return this.state.crashed ? this.props.fallback : this.props.children;
  }
}

if (typeof console !== "undefined") {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

const getScrollProgress = () => {
  if (typeof window === "undefined") return 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  return Math.max(0, Math.min(1, window.scrollY / maxScroll));
};

// ─── SCROLL FADE ──────────────────────────────────────────────────────────────
function smoothFade(p: number, inAt: number, outAt: number, w = 0.04) {
  if (p < inAt - w) return 0;
  if (p < inAt) return (p - (inAt - w)) / w;
  if (p <= outAt) return 1;
  if (p <= outAt + w) return 1 - (p - outAt) / w;
  return 0;
}

// ─── CINEMATIC ZONES ─────────────────────────────────────────────────────────
const ZONES = [
  { bg: "#04040C", fog: "#02020A", fogD: 0.001,  ambient: "#3E48FF" },
  { bg: "#0E0030", fog: "#080020", fogD: 0.004,  ambient: "#9945FF" },
  { bg: "#001C22", fog: "#001016", fogD: 0.0035, ambient: "#00FFB2" },
  { bg: "#1C0500", fog: "#120300", fogD: 0.003,  ambient: "#FF7000" },
  { bg: "#0A0018", fog: "#060010", fogD: 0.0025, ambient: "#FF2D78" },
];

function lerpZone(progress: number) {
  const segment = progress * (ZONES.length - 1);
  const idx = Math.min(Math.floor(segment), ZONES.length - 2);
  const t = segment - idx;
  const a = ZONES[idx];
  const b = ZONES[idx + 1];
  return {
    bg: new THREE.Color(a.bg).lerp(new THREE.Color(b.bg), t),
    fog: new THREE.Color(a.fog).lerp(new THREE.Color(b.fog), t),
    fogD: a.fogD + (b.fogD - a.fogD) * t,
    ambient: new THREE.Color(a.ambient).lerp(new THREE.Color(b.ambient), t),
  };
}

function AtmosphericSystem({ ambientRef }: { ambientRef: React.RefObject<THREE.AmbientLight | null> }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(ZONES[0].bg);
    scene.fog = new THREE.FogExp2(ZONES[0].fog, ZONES[0].fogD);
    return () => { scene.background = null; scene.fog = null; };
  }, [scene]);
  useFrame(() => {
    const z = lerpZone(getScrollProgress());
    if (scene.background instanceof THREE.Color) scene.background.copy(z.bg);
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(z.fog);
      scene.fog.density = z.fogD;
    }
    if (ambientRef.current) ambientRef.current.color.copy(z.ambient);
  });
  return null;
}

// ─── SEQ_01 PHILOSOPHY: ATOMIC ORBITAL ───────────────────────────────────────
function PhilosophyAtom() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const nucleus = useRef<THREE.Mesh>(null);
  const eRef0 = useRef<THREE.Mesh>(null);
  const eRef1 = useRef<THREE.Mesh>(null);
  const eRef2 = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const IN = 0.07, OUT = 0.32;

  const electronPositions = useMemo(() => [
    { radius: 1.2, speed: 2.1, offset: 0 },
    { radius: 1.5, speed: 1.6, offset: Math.PI },
    { radius: 1.85, speed: 1.1, offset: Math.PI * 0.7 },
  ], []);

  useFrame((_s, delta) => {
    if (!groupRef.current) return;
    t.current += delta;
    const fade = smoothFade(getScrollProgress(), IN, OUT);
    groupRef.current.scale.setScalar(fade * 3.2);

    if (ring1.current) ring1.current.rotation.x += delta * 0.45;
    if (ring2.current) ring2.current.rotation.y += delta * 0.65;
    if (ring3.current) ring3.current.rotation.z += delta * 0.28;
    if (nucleus.current) {
      nucleus.current.rotation.y += delta * 0.9;
      nucleus.current.rotation.x += delta * 0.45;
    }

    const electronRefs = [eRef0, eRef1, eRef2];
    electronPositions.forEach((ep, i) => {
      const ref = electronRefs[i];
      if (!ref.current) return;
      const angle = t.current * ep.speed + ep.offset;
      ref.current.position.set(
        Math.cos(angle) * ep.radius,
        Math.sin(angle) * ep.radius * 0.5,
        Math.sin(angle * 0.7) * ep.radius * 0.3,
      );
    });
  });

  return (
    <group ref={groupRef} position={[9, 2, 1]}>
      <pointLight color="#00FFB2" intensity={4} distance={10} decay={2} />

      {/* Nucleus */}
      <mesh ref={nucleus}>
        <dodecahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#00FFB2" emissive="#00FFB2" emissiveIntensity={1.4} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#00FFB2" emissive="#00FFB2" emissiveIntensity={0.9} transparent opacity={0.7} />
      </mesh>

      {/* Orbital rings */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.2, 0.013, 12, 56]} />
        <meshStandardMaterial color="#00FFB2" emissive="#00FFB2" emissiveIntensity={0.9} transparent opacity={0.8} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.01, 12, 56]} />
        <meshStandardMaterial color="#00FFB2" emissive="#00FFB2" emissiveIntensity={0.6} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1.85, 0.008, 12, 56]} />
        <meshStandardMaterial color="#00FFB2" emissive="#00FFB2" emissiveIntensity={0.4} transparent opacity={0.45} />
      </mesh>

      {/* Electrons */}
      <mesh ref={eRef0}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#ffffff" emissive="#00FFB2" emissiveIntensity={1.8} /></mesh>
      <mesh ref={eRef1}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#ffffff" emissive="#00FFB2" emissiveIntensity={1.8} /></mesh>
      <mesh ref={eRef2}><sphereGeometry args={[0.07, 8, 8]} /><meshStandardMaterial color="#ffffff" emissive="#00FFB2" emissiveIntensity={1.8} /></mesh>
    </group>
  );
}

// ─── SEQ_03 EDUCATION: MATH SURFACE ───────────────────────────────────────────
function EducationKnot() {
  const groupRef = useRef<THREE.Group>(null);
  const knotRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const IN = 0.42, OUT = 0.55;

  useFrame((_s, delta) => {
    if (!groupRef.current) return;
    t.current += delta;
    const fade = smoothFade(getScrollProgress(), IN, OUT);
    groupRef.current.scale.setScalar(fade * 2.6);

    if (knotRef.current) {
      knotRef.current.rotation.y += delta * 0.35;
      knotRef.current.rotation.x += delta * 0.18;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.2;
      wireRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[8, -1, 1]}>
      <pointLight color="#9945FF" intensity={6} distance={10} decay={2} />

      {/* Main knot */}
      <mesh ref={knotRef}>
        <torusKnotGeometry args={[0.8, 0.22, 128, 16, 2, 3]} />
        <meshStandardMaterial
          color="#6a10c0"
          emissive="#9945FF"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef}>
        <torusKnotGeometry args={[0.82, 0.23, 96, 12, 2, 3]} />
        <meshStandardMaterial
          color="#9945FF"
          emissive="#9945FF"
          emissiveIntensity={0.9}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outer glow sphere */}
      <mesh>
        <sphereGeometry args={[1.4, 16, 16]} />
        <meshStandardMaterial
          color="#9945FF"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          emissive="#9945FF"
          emissiveIntensity={0.3}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── SEQ_05 ARSENAL: MULTI-RING TECH ORB ──────────────────────────────────────
function ArsenalOrb() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const rRef0 = useRef<THREE.Mesh>(null);
  const rRef1 = useRef<THREE.Mesh>(null);
  const rRef2 = useRef<THREE.Mesh>(null);
  const rRef3 = useRef<THREE.Mesh>(null);
  const sRef0 = useRef<THREE.Mesh>(null);
  const sRef1 = useRef<THREE.Mesh>(null);
  const sRef2 = useRef<THREE.Mesh>(null);
  const ringRefs = [rRef0, rRef1, rRef2, rRef3];
  const satelliteRefs = [sRef0, sRef1, sRef2];
  const t = useRef(0);
  const IN = 0.63, OUT = 0.76;

  const rings = useMemo(() => [
    { r: 1.1, tube: 0.014, speed: 0.8,  axis: [1, 0, 0] as [number,number,number] },
    { r: 1.4, tube: 0.011, speed: -0.6, axis: [0, 1, 0] as [number,number,number] },
    { r: 1.7, tube: 0.009, speed: 0.45, axis: [0.7, 0.7, 0] as [number,number,number] },
    { r: 2.0, tube: 0.007, speed: -0.3, axis: [0, 0.5, 0.87] as [number,number,number] },
  ], []);

  useFrame((_s, delta) => {
    if (!groupRef.current) return;
    t.current += delta;
    const fade = smoothFade(getScrollProgress(), IN, OUT);
    groupRef.current.scale.setScalar(fade * 3.0);
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.6;
      coreRef.current.rotation.x += delta * 0.3;
    }
    ringRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const axis = new THREE.Vector3(...rings[i].axis).normalize();
      ref.current.rotateOnWorldAxis(axis, delta * rings[i].speed);
    });
    satelliteRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const angle = t.current * 0.9 + (i * Math.PI * 2) / 3;
      ref.current.position.set(
        Math.cos(angle) * 1.55,
        Math.sin(angle * 0.6) * 0.5,
        Math.sin(angle) * 1.55,
      );
    });
  });

  return (
    <group ref={groupRef} position={[-9, 1, 1]}>
      <pointLight color="#00FFB2" intensity={5} distance={12} decay={2} />

      {/* Core sphere */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial
          color="#00b8cc"
          emissive="#00FFB2"
          emissiveIntensity={0.7}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Orbital rings */}
      {rings.map((ring, i) => (
        <mesh key={i} ref={ringRefs[i]}>
          <torusGeometry args={[ring.r, ring.tube, 12, 64]} />
          <meshStandardMaterial
            color="#00FFB2"
            emissive="#00FFB2"
            emissiveIntensity={0.7 - i * 0.12}
            transparent
            opacity={0.85 - i * 0.1}
          />
        </mesh>
      ))}

      {/* Satellite nodes */}
      <mesh ref={sRef0}><octahedronGeometry args={[0.09, 0]} /><meshStandardMaterial color="#FF7000" emissive="#FF7000" emissiveIntensity={1.2} /></mesh>
      <mesh ref={sRef1}><octahedronGeometry args={[0.09, 0]} /><meshStandardMaterial color="#FF7000" emissive="#FF7000" emissiveIntensity={1.2} /></mesh>
      <mesh ref={sRef2}><octahedronGeometry args={[0.09, 0]} /><meshStandardMaterial color="#FF7000" emissive="#FF7000" emissiveIntensity={1.2} /></mesh>
    </group>
  );
}

// ─── CONQUEROR'S HALO ────────────────────────────────────────────────────────
function ConquerorsHalo() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_s, delta) => {
    if (!ringRef.current) return;
    const p = getScrollProgress();
    ringRef.current.rotation.z -= delta * (0.02 + p * 0.2);
    ringRef.current.rotation.x = THREE.MathUtils.lerp(
      ringRef.current.rotation.x,
      Math.PI / 2.5 + p * Math.PI,
      0.05,
    );
  });
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
      <torusGeometry args={[14, 0.02, 32, 100]} />
      <meshStandardMaterial color="#FF2D78" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

// ─── STAR FIELD ──────────────────────────────────────────────────────────────
function InteractiveAbyss() {
  const ref = useRef<THREE.Points>(null);
  const particleCount = 7000;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const palettes: [number, number, number][] = [
      [1, 1, 1],
      [0, 1, 0.698],
      [0.6, 0.271, 1],
      [1, 0.439, 0],
      [1, 0.176, 0.471],
    ];
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 150;
      const p = palettes[Math.floor(Math.random() * palettes.length)];
      col[i * 3]     = p[0];
      col[i * 3 + 1] = p[1];
      col[i * 3 + 2] = p[2];
    }
    return [pos, col];
  }, []);

  const { pointer, viewport } = useThree();

  useFrame((_s, delta) => {
    if (!ref.current) return;
    const progress = getScrollProgress();
    const warpSpeed = 0.5 + progress * 10;
    const mouseX = (pointer.x * viewport.width) / 2;
    const mouseY = (pointer.y * viewport.height) / 2;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx + 2] += warpSpeed * delta * 15;
      if (pos[idx + 2] > 20) pos[idx + 2] = -120;
      const dx = pos[idx] - mouseX;
      const dy = pos[idx + 1] - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 12) {
        const force = (12 - dist) / 12;
        pos[idx]     += dx * force * delta * 10;
        pos[idx + 1] += dy * force * delta * 10;
      }
      pos[idx]     = THREE.MathUtils.lerp(pos[idx],     positions[idx],     0.02);
      pos[idx + 1] = THREE.MathUtils.lerp(pos[idx + 1], positions[idx + 1], 0.02);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.z = progress * Math.PI * 1.5;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent vertexColors size={0.04} sizeAttenuation depthWrite={false} opacity={0.7}
      />
    </Points>
  );
}

// ─── HYPER CORE ───────────────────────────────────────────────────────────────
function HyperCore() {
  const meshRef   = useRef<THREE.Mesh>(null);
  const auraRef   = useRef<THREE.Mesh>(null);
  const materialRef   = useRef<any>(null);
  const coreLightRef  = useRef<THREE.PointLight>(null);
  const [hovered, setHover] = useState(false);
  const time = useRef(0);

  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(5, 0),
    new THREE.DodecahedronGeometry(5, 0),
    new THREE.OctahedronGeometry(5, 0),
    new THREE.TorusKnotGeometry(5, 0.4, 128, 32),
    new THREE.SphereGeometry(5, 4, 4),
    new THREE.TetrahedronGeometry(5, 0),
  ], []);

  useFrame((_s, delta) => {
    if (!meshRef.current || !materialRef.current || !coreLightRef.current) return;
    time.current += delta;
    const progress = getScrollProgress();
    const phase = Math.min(5, Math.floor(progress * 6));

    meshRef.current.geometry = geometries[phase];
    meshRef.current.rotation.y += delta * (0.08 + progress * 1.5);
    meshRef.current.rotation.x += delta * (0.04 + progress * 1.5);

    const targetScale = hovered ? 1.15 : progress > 0.85 ? 0.01 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);

    if (auraRef.current) {
      const pulse = 1 + Math.sin(time.current * 1.2) * 0.08;
      auraRef.current.scale.setScalar(THREE.MathUtils.lerp(auraRef.current.scale.x, pulse, 0.05));
      const auraOpacity = progress > 0.85 ? 0 : hovered ? 0.2 : 0.09 + progress * 0.07;
      (auraRef.current.material as THREE.MeshStandardMaterial).opacity = THREE.MathUtils.lerp(
        (auraRef.current.material as THREE.MeshStandardMaterial).opacity,
        auraOpacity,
        0.05,
      );
    }

    materialRef.current.distortion = THREE.MathUtils.lerp(
      materialRef.current.distortion,
      hovered ? 1.5 : progress < 0.8 ? progress * 2 : 0,
      0.05,
    );

    const baseIntensity = progress > 0.85 ? 0 : 9;
    coreLightRef.current.intensity = THREE.MathUtils.lerp(
      coreLightRef.current.intensity,
      hovered ? 18 : baseIntensity + Math.sin(time.current * 10) * (progress * 3),
      0.1,
    );

    const z = lerpZone(progress);
    coreLightRef.current.color.lerp(z.ambient, 0.02);
  });

  return (
    <group>
      <mesh ref={auraRef}>
        <sphereGeometry args={[8, 24, 24]} />
        <meshStandardMaterial
          color="#FF2D78"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
          emissive="#FF2D78"
          emissiveIntensity={0.4}
          depthWrite={false}
        />
      </mesh>
      <pointLight ref={coreLightRef} position={[0, 0, 0]} intensity={9} color="#FF7000" distance={28} />
      <pointLight position={[-4, -4, 2]} intensity={5} color="#9945FF" distance={20} />
      <mesh
        ref={meshRef}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <icosahedronGeometry args={[1.8, 0]} />
        <MeshTransmissionMaterial
          ref={materialRef}
          backside
          backsideThickness={3}
          thickness={2}
          chromaticAberration={2.5}
          anisotropy={2}
          clearcoat={1}
          clearcoatRoughness={0}
          distortion={0.3}
          distortionScale={1}
          color="#ffffff"
          resolution={1024}
        />
      </mesh>
    </group>
  );
}

// ─── CURSOR LIGHT ─────────────────────────────────────────────────────────────
function CursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { pointer, viewport } = useThree();
  useFrame(() => {
    if (!lightRef.current) return;
    lightRef.current.position.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        4,
      ),
      0.1,
    );
  });
  return <pointLight ref={lightRef} intensity={14} color="#00FFB2" distance={38} decay={2} />;
}

// ─── CINEMATIC WEATHER ────────────────────────────────────────────────────────
function WeatherSystem() {
  const flashRef = useRef<THREE.PointLight>(null);
  const timeSinceLastFlash = useRef(0);
  useFrame((_s, delta) => {
    if (!flashRef.current) return;
    const progress = getScrollProgress();
    timeSinceLastFlash.current += delta;
    if (
      (progress > 0.22 && progress < 0.35) ||
      (progress > 0.6 && progress < 0.7)
    ) {
      if (timeSinceLastFlash.current > 1.5 && Math.random() > 0.95) {
        flashRef.current.position.set(
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 20 - 10,
        );
        flashRef.current.color.set(Math.random() > 0.5 ? "#ffffff" : "#FF7000");
        flashRef.current.intensity = 200;
        timeSinceLastFlash.current = 0;
      }
    }
    flashRef.current.intensity = THREE.MathUtils.lerp(flashRef.current.intensity, 0, 0.03);
  });
  return <pointLight ref={flashRef} color="#ffffff" position={[8, 8, 8]} distance={100} decay={2} />;
}

// ─── 4D TESSERACT ─────────────────────────────────────────────────────────────
const T4_VERTS: [number, number, number, number][] = Array.from({ length: 16 }, (_, i) => [
  (i & 1) ? 1 : -1,
  (i & 2) ? 1 : -1,
  (i & 4) ? 1 : -1,
  (i & 8) ? 1 : -1,
] as [number, number, number, number]);

const T4_EDGES: [number, number][] = (() => {
  const e: [number, number][] = [];
  for (let i = 0; i < 16; i++)
    for (let j = i + 1; j < 16; j++) {
      let d = 0;
      for (let k = 0; k < 4; k++) if (T4_VERTS[i][k] !== T4_VERTS[j][k]) d++;
      if (d === 1) e.push([i, j]);
    }
  return e;
})();

function rotate4D(v: [number,number,number,number], t1: number, t2: number, t3: number): [number,number,number,number] {
  const xw_x = v[0] * Math.cos(t1) - v[3] * Math.sin(t1);
  const xw_w = v[0] * Math.sin(t1) + v[3] * Math.cos(t1);
  const yz_y = v[1] * Math.cos(t2) - v[2] * Math.sin(t2);
  const yz_z = v[1] * Math.sin(t2) + v[2] * Math.cos(t2);
  const yw_y = yz_y * Math.cos(t3) - xw_w * Math.sin(t3);
  const yw_w = yz_y * Math.sin(t3) + xw_w * Math.cos(t3);
  return [xw_x, yw_y, yz_z, yw_w];
}

function project4D(v: [number,number,number,number]): THREE.Vector3 {
  const s = 2.0 / Math.max(0.1, v[3] + 2.8);
  return new THREE.Vector3(v[0] * s * 6, v[1] * s * 6, v[2] * s * 6);
}

function Tesseract() {
  const ref = useRef<THREE.LineSegments>(null);
  const t = useRef(0);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(T4_EDGES.length * 6), 3));
    return g;
  }, []);

  useFrame((_s, delta) => {
    if (!ref.current) return;
    t.current += delta;
    const progress = getScrollProgress();
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    T4_EDGES.forEach(([a, b], i) => {
      const rv = (v: [number,number,number,number]) =>
        rotate4D(v, t.current * 0.13, t.current * 0.09, t.current * 0.07);
      const p1 = project4D(rv(T4_VERTS[a]));
      const p2 = project4D(rv(T4_VERTS[b]));
      pos.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z], i * 6);
    });
    ref.current.geometry.attributes.position.needsUpdate = true;
    const fade = progress > 0.52 ? Math.max(0, 1 - (progress - 0.52) / 0.12) : 1;
    (ref.current.material as THREE.LineBasicMaterial).opacity = fade * 0.65;
  });

  return (
    <lineSegments ref={ref} geometry={geo} position={[10, 1.5, -5]}>
      <lineBasicMaterial color="#3E48FF" transparent opacity={0.65} />
    </lineSegments>
  );
}

// ─── CELLULAR NEBULA ──────────────────────────────────────────────────────────
const CELLS = [
  { p: [-18,  8, -22] as [number,number,number], r: 10, c: "#9945FF", s: 0.018, ph: 0.0 },
  { p: [ 22, -6, -28] as [number,number,number], r: 14, c: "#00FFB2", s: 0.012, ph: 1.2 },
  { p: [ -8,-14, -18] as [number,number,number], r:  8, c: "#3E48FF", s: 0.022, ph: 2.4 },
  { p: [ 15, 13, -32] as [number,number,number], r: 12, c: "#0A1030", s: 0.015, ph: 0.7 },
  { p: [-25,  2, -24] as [number,number,number], r:  9, c: "#FF7000", s: 0.020, ph: 1.8 },
  { p: [  5,-19, -30] as [number,number,number], r: 11, c: "#FF2D78", s: 0.016, ph: 3.1 },
  { p: [-12, 17, -38] as [number,number,number], r: 13, c: "#001830", s: 0.011, ph: 0.4 },
  { p: [ 27,  6, -22] as [number,number,number], r:  7, c: "#1A0030", s: 0.025, ph: 2.0 },
  { p: [-21, -9, -35] as [number,number,number], r: 10, c: "#00FFB2", s: 0.014, ph: 1.5 },
];

function CellBlob({ p, r, c, s, ph }: typeof CELLS[0]) {
  const ref = useRef<THREE.Mesh>(null);
  const t = useRef(ph);
  useFrame((_s, delta) => {
    if (!ref.current) return;
    t.current += delta * s * 10;
    ref.current.position.set(
      p[0] + Math.cos(t.current * 0.6) * 2,
      p[1] + Math.sin(t.current) * 3,
      p[2],
    );
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.z = Math.sin(t.current * 0.3) * 0.15;
  });
  return (
    <mesh ref={ref} position={p}>
      <icosahedronGeometry args={[r, 1]} />
      <meshStandardMaterial
        color={c} emissive={c} emissiveIntensity={0.5}
        transparent opacity={0.12} depthWrite={false} side={THREE.BackSide}
      />
    </mesh>
  );
}

function CellularNebula() {
  return <>{CELLS.map((d, i) => <CellBlob key={i} {...d} />)}</>;
}

// ─── CSS FALLBACK ─────────────────────────────────────────────────────────────
function FallbackBackground() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #0E0030 0%, #04040C 55%, #06060C 100%)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg at 50% 50%, transparent 60%, rgba(153,69,255,0.06) 70%, transparent 80%)",
          animation: "spin 30s linear infinite",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 180deg at 48% 52%, transparent 60%, rgba(0,255,178,0.05) 72%, transparent 82%)",
          animation: "spin 45s linear infinite reverse",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function PhilosophicalEngine() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const [webglOk, setWebglOk] = useState<boolean | null>(null);

  useEffect(() => { setWebglOk(isWebGLAvailable()); }, []);

  if (webglOk === null) return null;
  if (!webglOk) return (
    <>
      <FallbackBackground />
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-red-900/90 border border-red-500 text-red-200 text-[11px] tracking-widest px-4 py-2 pointer-events-none">
          ⚠ WEBGL DISABLED — 3D ENGINE INACTIVE — CSS FALLBACK ACTIVE
        </div>
      )}
    </>
  );

  return (
    <CanvasErrorBoundary fallback={<FallbackBackground />}>
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 15], fov: 45 }}
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
          }}
          onCreated={({ gl }) => {
            if (!gl.getContext()) throw new Error("WebGL context lost on creation");
          }}
        >
          <AtmosphericSystem ambientRef={ambientRef} />

          <ambientLight ref={ambientRef} intensity={2.8} color="#3E48FF" />
          <directionalLight position={[10, 10, 5]} intensity={3} color="#FF7000" />
          <directionalLight position={[-10, -10, -5]} intensity={4} color="#9945FF" />

          <CursorLight />
          <WeatherSystem />
          <ConquerorsHalo />
          <Tesseract />
          <CellularNebula />
          <InteractiveAbyss />
          <HyperCore />

          {/* Section-specific 3D objects per scroll phase */}
          <PhilosophyAtom />
          <EducationKnot />
          <ArsenalOrb />

          <Sparkles count={300} scale={28} size={1.5} speed={0.2} opacity={0.55} color="#ffffff" />
          <Sparkles count={150} scale={18} size={2.2} speed={0.35} opacity={0.9} color="#FF7000" />
          <Sparkles count={120} scale={22} size={1.8} speed={0.25} opacity={0.6} color="#9945FF" />
          <Sparkles count={100} scale={20} size={1.6} speed={0.3} opacity={0.5} color="#00FFB2" />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
