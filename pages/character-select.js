import { useState, Suspense, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'

// ✅ Komponen 3D yang SEDERHANA dan AMAN
function Character3D({ modelPath }) {
  const [loadError, setLoadError] = useState(false)
  
  // Gunakan try-catch untuk handle error loading
  try {
    const { scene, animations } = useGLTF(modelPath)
    const { actions } = useAnimations(animations, scene)

    useEffect(() => {
      if (actions && Object.keys(actions).length > 0) {
        const firstAction = Object.values(actions)[0]
        firstAction?.reset().play()
        
        return () => firstAction?.stop()
      }
    }, [actions])

    if (loadError) {
      return null
    }

    return (
      <primitive
        object={scene}
        scale={10}
        position={[0, -2.5, 0]}
        rotation={[0, 0, 0]}
      />
    )
  } catch (error) {
    console.error('Error loading 3D model:', error)
    setLoadError(true)
    return null
  }
}

// ✅ Fallback component
function FallbackCharacter() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#ff6b35" />
    </mesh>
  )
}

export default function CharacterSelect() {
  const router = useRouter()
  const [animationState, setAnimationState] = useState('idle')
  const [currentModel, setCurrentModel] = useState('/models/characters/character-male/idle.glb')
  const [modelLoadError, setModelLoadError] = useState(false)
  const [showCanvas, setShowCanvas] = useState(true)
  const canvasRef = useRef(null)

  // ✅ Preload models di DALAM useEffect
  useEffect(() => {
    console.log('Preloading models...')
    try {
      // Preload hanya di environment client
      if (typeof window !== 'undefined') {
        useGLTF.preload('/models/characters/character-male/idle.glb')
        useGLTF.preload('/models/characters/character-male/wave.glb')
        useGLTF.preload('/models/characters/character-male/selected.glb')
        console.log('Models preloaded successfully')
      }
    } catch (error) {
      console.warn('Preload error (non-critical):', error)
    }
  }, [])

  // Data karakter
  const character = {
    id: 1,
    name: "Pahlawan Muda",
    description: "Seorang pemuda pemberani yang ikut berjuang mempertahankan kemerdekaan Indonesia",
    stats: {
      courage: 85,
      wisdom: 70,
      leadership: 75
    }
  }

  // Cek apakah model exists
  useEffect(() => {
    const checkModel = async () => {
      try {
        const response = await fetch(currentModel, { method: 'HEAD' })
        if (!response.ok) {
          console.warn('Model not found:', currentModel)
          setModelLoadError(true)
        } else {
          setModelLoadError(false)
        }
      } catch (error) {
        console.error('Error checking model:', error)
        setModelLoadError(true)
      }
    }
    
    checkModel()
  }, [currentModel])

  const handleCharacterHover = () => {
    setAnimationState('wave')
    const newModel = '/models/characters/character-male/wave.glb'
    setCurrentModel(newModel)
  }

  const handleCharacterLeave = () => {
    setAnimationState('idle')
    const newModel = '/models/characters/character-male/idle.glb'
    setCurrentModel(newModel)
  }

  const handleCharacterSelect = () => {
    setAnimationState('selected')
    const newModel = '/models/characters/character-male/selected.glb'
    setCurrentModel(newModel)
    
    setTimeout(() => {
      alert('Karakter dipilih! Game akan dimulai...')
    }, 1000)
  }

  // Error boundary untuk Canvas
  const handleCanvasError = (error) => {
    console.error('Canvas error:', error)
    setShowCanvas(false)
  }

  // ✅ Hapus semua model loading yang kompleks
  const handleTestModel = () => {
    // Coba dengan model online untuk testing
    setCurrentModel('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/zombie/model.gltf')
  }

  return (
    <>
      <Head>
        <title>Pilih Karakter - Game Sejarah Indonesia</title>
      </Head>

      <div className="character-select">
        <div className="select-background"></div>
        
        <div className="select-content">
          <h2 className="select-title">PILIH KARAKTERMU</h2>
          <p className="select-subtitle">Siapa yang akan kamu mainkan?</p>

          {/* ✅ TEST BUTTON - Hapus nanti */}
          <button 
            onClick={handleTestModel}
            style={{
              marginBottom: '20px',
              padding: '10px',
              background: '#444',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Test Model Online
          </button>

          <div className="character-container">
            <div className="character-display">
              <div 
                className="character-model"
                onMouseEnter={handleCharacterHover}
                onMouseLeave={handleCharacterLeave}
                onClick={handleCharacterSelect}
              >
                {showCanvas ? (
                  <Canvas
                    ref={canvasRef}
                    camera={{ position: [0, 1, 6], fov: 45 }}
                    style={{ background: 'transparent' }}
                    onError={handleCanvasError}
                    gl={{ 
                      preserveDrawingBuffer: true,
                      failIfMajorPerformanceCaveat: false,
                      powerPreference: 'high-performance'
                    }}
                  >
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <directionalLight position={[-5, -5, -5]} intensity={0.5} />
                    
                    {/* ✅ Suspense dengan fallback */}
                    <Suspense fallback={<FallbackCharacter />}>
                      {modelLoadError ? (
                        <FallbackCharacter />
                      ) : (
                        <Character3D modelPath={currentModel} />
                      )}
                    </Suspense>
                    
                    <OrbitControls 
                      enableZoom={false}
                      enablePan={false}
                      autoRotate={false}
                      minPolarAngle={Math.PI / 3}
                      maxPolarAngle={Math.PI / 1.5}
                    />
                  </Canvas>
                ) : (
                  <div className="model-placeholder">
                    <div className="placeholder-icon">👤</div>
                    <p className="placeholder-text">Canvas error</p>
                    <button onClick={() => setShowCanvas(true)}>
                      Coba Lagi
                    </button>
                  </div>
                )}
                
                <div className="animation-label">{animationState.toUpperCase()}</div>
              </div>

              <div className="character-info">
                <h3 className="character-name">{character.name}</h3>
                <p className="character-desc">{character.description}</p>
                
                <div className="character-stats">
                  <div className="stat">
                    <span className="stat-label">Keberanian</span>
                    <div className="stat-bar">
                      <div className="stat-fill" style={{width: `${character.stats.courage}%`}}></div>
                    </div>
                    <span className="stat-value">{character.stats.courage}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Kebijaksanaan</span>
                    <div className="stat-bar">
                      <div className="stat-fill" style={{width: `${character.stats.wisdom}%`}}></div>
                    </div>
                    <span className="stat-value">{character.stats.wisdom}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Kepemimpinan</span>
                    <div className="stat-bar">
                      <div className="stat-fill" style={{width: `${character.stats.leadership}%`}}></div>
                    </div>
                    <span className="stat-value">{character.stats.leadership}</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="confirm-button" onClick={handleCharacterSelect}>
              PILIH KARAKTER
            </button>
          </div>

          <button className="back-button" onClick={() => router.push('/')}>
            ← Kembali
          </button>
        </div>

        {/* CSS tetap sama */}
        <style jsx>{`
          .character-select {
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          /* ... (CSS yang sama seperti sebelumnya) ... */
        `}</style>
      </div>
    </>
  )
}
