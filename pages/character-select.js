import { useState, Suspense, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'

// OPSI 1: Gunakan file lokal (pastikan ada di folder public)
// OPSI 2: Gunakan CDN eksternal (lebih reliable)
const USE_EXTERNAL_CDN = true // Set false jika mau pake lokal

const MODEL_PATHS = USE_EXTERNAL_CDN ? {
  idle: 'https://cdn.jsdelivr.net/gh/bbull0444-png/game-sejarah-indonesia@master/public/models/characters/character-male/idle.glb',
  wave: 'https://cdn.jsdelivr.net/gh/bbull0444-png/game-sejarah-indonesia@master/public/models/characters/character-male/wave.glb',
  selected: 'https://cdn.jsdelivr.net/gh/bbull0444-png/game-sejarah-indonesia@master/public/models/characters/character-male/selected.glb'
} : {
  idle: '/models/characters/character-male/idle.glb',
  wave: '/models/characters/character-male/wave.glb',
  selected: '/models/characters/character-male/selected.glb'
}

// Component 3D dengan Error Handling
function Character3D({ modelPath }) {
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
    return <FallbackCharacter />
  }
}

// Fallback component
function FallbackCharacter() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 1.2, 8, 16]} />
        <meshStandardMaterial color="#ff6b35" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#ff8c5a" />
      </mesh>
    </group>
  )
}

export default function CharacterSelect() {
  const router = useRouter()
  const [animationState, setAnimationState] = useState('idle')
  const [currentModel, setCurrentModel] = useState(MODEL_PATHS.idle)
  const [modelLoadError, setModelLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef(null)

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [currentModel])

  const handleCharacterHover = () => {
    setAnimationState('wave')
    setCurrentModel(MODEL_PATHS.wave)
  }

  const handleCharacterLeave = () => {
    setAnimationState('idle')
    setCurrentModel(MODEL_PATHS.idle)
  }

  const handleCharacterSelect = () => {
    setAnimationState('selected')
    setCurrentModel(MODEL_PATHS.selected)
    
    setTimeout(() => {
      router.push('/game') // Ganti dengan route game Anda
    }, 1000)
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

          <div className="character-container">
            <div className="character-display">
              <div 
                className="character-model"
                onMouseEnter={handleCharacterHover}
                onMouseLeave={handleCharacterLeave}
                onClick={handleCharacterSelect}
              >
                {isLoading && (
                  <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Loading model...</p>
                  </div>
                )}
                
                <Canvas
                  ref={canvasRef}
                  camera={{ position: [0, 1, 6], fov: 45 }}
                  style={{ 
                    background: 'transparent',
                    opacity: isLoading ? 0.3 : 1,
                    transition: 'opacity 0.5s'
                  }}
                  gl={{ 
                    preserveDrawingBuffer: true,
                    antialias: true,
                    alpha: true
                  }}
                  onCreated={({ gl }) => {
                    gl.setClearColor(0x000000, 0)
                  }}
                >
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <directionalLight position={[-5, -5, -5]} intensity={0.5} />
                  <pointLight position={[0, 2, 0]} intensity={0.5} color="#ff6b35" />
                  
                  <Suspense fallback={<FallbackCharacter />}>
                    <Character3D modelPath={currentModel} />
                  </Suspense>
                  
                  <OrbitControls 
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                  />
                </Canvas>
                
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

          .select-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(ellipse at 50% 30%, rgba(255, 107, 53, 0.08) 0%, transparent 50%);
            animation: bgPulse 6s ease-in-out infinite;
          }

          @keyframes bgPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }

          .select-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 1200px;
            width: 90%;
            padding: 40px 20px;
            animation: slideIn 0.6s ease-out;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .select-title {
            font-size: clamp(2rem, 5vw, 3rem);
            color: #ff6b35;
            text-shadow: 0 0 20px rgba(255, 107, 53, 0.6);
            margin-bottom: 10px;
            font-weight: 900;
            letter-spacing: 0.1em;
          }

          .select-subtitle {
            font-size: clamp(1rem, 2vw, 1.2rem);
            color: #b0b0b0;
            margin-bottom: 50px;
          }

          .character-container {
            background: rgba(20, 20, 20, 0.8);
            border: 2px solid rgba(255, 107, 53, 0.3);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
          }

          .character-display {
            display: flex;
            gap: 40px;
            align-items: center;
            margin-bottom: 40px;
            flex-wrap: wrap;
          }

          .character-model {
            flex: 1;
            min-width: 300px;
            background: linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(247, 147, 30, 0.1) 100%);
            border: 2px solid rgba(255, 107, 53, 0.4);
            border-radius: 15px;
            padding: 20px;
            height: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }

          .character-model:hover {
            border-color: rgba(255, 107, 53, 0.8);
            box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
          }

          .loading-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            color: #ff6b35;
          }

          .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 107, 53, 0.2);
            border-top-color: #ff6b35;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .animation-label {
            position: absolute;
            bottom: 20px;
            color: #ff6b35;
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-shadow: 0 0 10px rgba(255, 107, 53, 0.8);
            z-index: 5;
          }

          .character-info {
            flex: 1;
            min-width: 300px;
            text-align: left;
          }

          .character-name {
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            color: #ff6b35;
            margin-bottom: 15px;
            font-weight: 800;
          }

          .character-desc {
            font-size: clamp(0.9rem, 2vw, 1.1rem);
            color: #d0d0d0;
            line-height: 1.6;
            margin-bottom: 30px;
          }

          .character-stats {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .stat {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .stat-label {
            color: #b0b0b0;
            font-size: 0.9rem;
            min-width: 120px;
            font-weight: 600;
          }

          .stat-bar {
            flex: 1;
            min-width: 150px;
            height: 12px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            overflow: hidden;
          }

          .stat-fill {
            height: 100%;
            background: linear-gradient(90deg, #ff6b35 0%, #f7931e 100%);
            border-radius: 10px;
            transition: width 0.5s ease;
            box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
          }

          .stat-value {
            color: #ff6b35;
            font-weight: 700;
            min-width: 40px;
            text-align: right;
          }

          .confirm-button {
            padding: 15px 50px;
            font-size: clamp(1rem, 2vw, 1.2rem);
            font-weight: 700;
            color: #ffffff;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border: 2px solid #ff8c5a;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.15em;
          }

          .confirm-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(255, 107, 53, 0.5);
          }

          .back-button {
            margin-top: 30px;
            padding: 10px 30px;
            font-size: 1rem;
            color: #b0b0b0;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .back-button:hover {
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.5);
          }

          @media (max-width: 768px) {
            .character-display {
              flex-direction: column;
            }
            
            .character-container {
              padding: 20px;
            }
          }
        `}</style>
      </div>
    </>
  )
}
```

## **Langkah-langkah Fix Error di Vercel:**

### **1. Pastikan file GLB ada di folder yang benar:**
```
public/
  └── models/
      └── characters/
          └── character-male/
              ├── idle.glb
              ├── wave.glb
              └── selected.glb
