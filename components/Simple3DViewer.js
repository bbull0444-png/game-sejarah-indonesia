'use client' // Penting untuk Next.js 13+

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'

export default function Simple3DViewer() {
  return (
    <Canvas style={{ height: '400px', background: '#1a1a1a' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]}>
        <meshStandardMaterial color="orange" />
      </Box>
      <Box position={[1.2, 0, 0]}>
        <meshStandardMaterial color="hotpink" />
      </Box>
      <OrbitControls />
    </Canvas>
  )
}
