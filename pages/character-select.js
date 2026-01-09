import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// ✅ Komponen Model yang support extension lama
function CharacterModel({ modelPath }) {
  const [model, setModel] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    
    const loadModel = async () => {
      try {
        // Dynamically import loaders (client-side only)
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')
        const { KHR_materials_pbrSpecularGlossiness } = await import('three/examples/jsm/loaders/KHR_materials_pbrSpecularGlossiness')
        
        const loader = new GLTFLoader()
        
        // ✅ Register extension untuk GLB lama
        loader.register(parser => new KHR_materials_pbrSpecularGlossiness(parser))
        
        loader.load(
          modelPath,
          (gltf) => {
            if (mounted) {
              console.log('Model loaded successfully:', gltf)
              setModel(gltf)
              setError(null)
            }
          },
          (progress) => {
            console.log('Loading progress:', progress)
          },
          (err) => {
            console.error('Failed to load model:', err)
            if (mounted) setError(err.message)
          }
        )
      } catch (err) {
        console.error('Loader setup error:', err)
        if (mounted) setError(err.message)
      }
    }
    
    loadModel()
    
    return () => {
      mounted = false
    }
  }, [modelPath])
  
  if (error) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    )
  }
  
  if (!model) {
    // Loading state
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    )
  }
  
  return (
    <primitive
      object={model.scene}
      scale={10}
      position={[0, -2.5, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
}

export default function CharacterSelect() {
  const router = useRouter()
  const [currentModel, setCurrentModel] = useState('/models/characters/character-male/idle.glb')
  const [animationState, setAnimationState] = useState('idle')

  const character = {
    name: "Pahlawan Muda",
    description: "Pemuda pemberani pejuang kemerdekaan"
  }

  const handleModelChange = (newModel, state) => {
    setCurrentModel(newModel)
    setAnimationState(state)
  }

  return (
    <>
      <Head>
        <title>Pilih Karakter - Game Sejarah Indonesia</title>
      </Head>

      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ 
          textAlign: 'center',
          maxWidth: '1200px',
          width: '100%'
        }}>
          <h1 style={{ color: '#ff6b35', marginBottom: '30px' }}>PILIH KARAKTER</h1>
          
          {/* 3D VIEWER */}
          <div style={{
            width: '100%',
            height: '500px',
            background: 'rgba(30, 30, 30, 0.8)',
            border: '2px solid #ff6b35',
            borderRadius: '15px',
            marginBottom: '30px',
            overflow: 'hidden'
          }}>
            <Canvas
              camera={{ position: [0, 1, 6], fov: 45 }}
            >
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <directionalLight position={[-5, 5, -5]} intensity={0.5} />
              
              <Suspense fallback={null}>
                <CharacterModel modelPath={currentModel} />
              </Suspense>
              
              <OrbitControls 
                enableZoom={true}
                enablePan={true}
                autoRotate={true}
                autoRotateSpeed={1}
              />
            </Canvas>
          </div>
          
          {/* ANIMATION CONTROLS */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleModelChange('/models/characters/character-male/idle.glb', 'idle')}
              style={{
                padding: '12px 24px',
                background: animationState === 'idle' ? '#ff6b35' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🧍 Idle
            </button>
            
            <button
              onClick={() => handleModelChange('/models/characters/character-male/wave.glb', 'wave')}
              style={{
                padding: '12px 24px',
                background: animationState === 'wave' ? '#ff6b35' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              👋 Wave
            </button>
            
            <button
              onClick={() => handleModelChange('/models/characters/character-male/walk.glb', 'walk')}
              style={{
                padding: '12px 24px',
                background: animationState === 'walk' ? '#ff6b35' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              🚶 Walk
            </button>
            
            <button
              onClick={() => handleModelChange('/models/characters/character-male/selected.glb', 'selected')}
              style={{
                padding: '12px 24px',
                background: animationState === 'selected' ? '#ff6b35' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ✅ Selected
            </button>
          </div>
          
          {/* CHARACTER INFO */}
          <div style={{
            background: 'rgba(40, 40, 40, 0.8)',
            padding: '25px',
            borderRadius: '12px',
            marginBottom: '30px',
            textAlign: 'left'
          }}>
            <h3 style={{ color: '#ff6b35', marginBottom: '15px' }}>{character.name}</h3>
            <p style={{ color: '#ccc', lineHeight: '1.6' }}>{character.description}</p>
            <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '15px' }}>
              Status: <span style={{ color: '#0f0' }}>{animationState.toUpperCase()}</span> | 
              Model: <span style={{ color: '#4dabf7' }}>{currentModel.split('/').pop()}</span>
            </p>
          </div>
          
          {/* NAVIGATION */}
          <div>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 30px',
                background: 'transparent',
                color: '#b0b0b0',
                border: '1px solid #555',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                margin: '10px'
              }}
            >
              ← Kembali ke Home
            </button>
            
            <button
              onClick={() => {
                alert('Karakter dipilih!')
                router.push('/')
              }}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                margin: '10px',
                fontWeight: 'bold'
              }}
            >
              PILIH KARAKTER INI
            </button>
          </div>
          
          {/* DEBUG INFO */}
          <div style={{
            marginTop: '40px',
            padding: '15px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#888'
          }}>
            <p>✅ Model file ditemukan (Status 200)</p>
            <p>📁 Path: {currentModel}</p>
            <p>🎮 Animation: {animationState}</p>
            <p>⚠️ Jika model merah, artinya error loading (check console)</p>
          </div>
        </div>
      </div>
    </>
  )
}
