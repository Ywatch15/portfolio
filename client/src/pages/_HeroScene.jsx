import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMemo, useRef } from 'react'

function SpinningTorus() {
  const meshRef = useRef()
  const speed = useMemo(() => {
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return 0
    }
    return 1
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current || speed === 0) return
    meshRef.current.rotation.x += 0.6 * delta
    meshRef.current.rotation.y += 0.4 * delta
  })

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <meshStandardMaterial color="#7c3aed" metalness={0.6} roughness={0.3} />
    </mesh>
  )
}

export default function HeroScene() {
  return (
  <Canvas camera={{ position: [0, 0, 4] }} className="h-[60vh] sm:h-[70vh]" aria-hidden="true">
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={1} />
      <SpinningTorus />
      <OrbitControls enableZoom={false} />
    </Canvas>
  )
}
