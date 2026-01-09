import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import dynamic from 'next/dynamic'

// ⚠️ IMPORTANT: Non-aktifkan SSR untuk Three.js components
const Canvas = dynamic(() => import('@react-three/fiber').then(mod => mod.Canvas), { 
  ssr: false 
})

const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => mod.OrbitControls), { 
  ssr: false 
})

// Simple fallback component
function FallbackCharacter() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#ff6b35" />
    </mesh>
  )
}

// Main Model Component - SANGAT SEDERHANA
function SimpleCharacter({ modelUrl }) {
  const [scene, setScene] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return // Skip di server

    const loadModel = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Dynamically import GLTFLoader (hanya di client)
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader')
        
        const loader = new GLTFLoader()
        
        loader.load(
          modelUrl,
          (gltf) => {
            console.log('✅ Model loaded:', gltf)
            setScene(gltf.scene)
            setLoading(false)
          },
          (progress) => {
            console.log('Loading:', progress.loaded / progress.total * 100, '%')
          },
          (err) => {
            console.error('❌ Load error:', err)
            setError(err.message)
            setLoading(false)
          }
        )
      } catch (err) {
        console.error('❌ Setup error:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    loadModel()
  }, [modelUrl])

  if (error) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    )
  }

  if (loading || !scene) {
    return <FallbackCharacter />
  }

  return (
    <primitive 
      object={scene} 
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
  const [show3D, setShow3D] = useState(false) // Mulai dengan false untuk hindari initial error

  // Data karakter
  const character = {
    name: "Pahlawan Muda",
    description: "Seorang pemuda pemberani yang ikut berjuang mempertahankan kemerdekaan Indonesia",
    stats: {
      courage: 85,
      wisdom: 70,
      leadership: 75
    }
  }

  // Handler untuk ganti model
  const handleModelChange = (modelPath, stateName) => {
    setCurrentModel(modelPath)
    setAnimationState(stateName)
  }

  // Aktifkan 3D setelah component mount (client-side only)
  useEffect(() => {
    setShow3D(true)
  }, [])

  // Test apakah model file ada
  const testModelFile = async (path) => {
    try {
      const response = await fetch(path)
      console.log(`Test ${path}:`, response.status, response.ok ? 'OK' : 'NOT FOUND')
      return response.ok
    } catch (error) {
      console.error(`Test ${path}:`, error)
      return false
    }
  }

  // Test semua model saat component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const models = [
        '/models/characters/character-male/idle.glb',
        '/models/characters/character-male/wave.glb',
        '/models/characters/character-male/walk.glb',
        '/models/characters/character-male/selected.glb'
      ]
      
      models.forEach(testModelFile)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Pilih Karakter - Game Sejarah Indonesia</title>
        <meta name="description" content="Pilih karakter untuk memulai petualangan sejarah Indonesia" />
      </Head>

      <div className="container">
        <header>
          <h1>🎮 PILIH KARAKTER</h1>
          <p className="subtitle">Siapa yang akan memimpin perjuangan?</p>
        </header>

        <main>
          {/* 3D VIEWER SECTION */}
          <section className="viewer-section">
            <h2>Model 3D Karakter</h2>
            
            <div className="model-controls">
              <button 
                className={`model-btn ${animationState === 'idle' ? 'active' : ''}`}
                onClick={() => handleModelChange('/models/characters/character-male/idle.glb', 'idle')}
              >
                🧍 Diam
              </button>
              <button 
                className={`model-btn ${animationState === 'wave' ? 'active' : ''}`}
                onClick={() => handleModelChange('/models/characters/character-male/wave.glb', 'wave')}
              >
                👋 Melambaikan Tangan
              </button>
              <button 
                className={`model-btn ${animationState === 'walk' ? 'active' : ''}`}
                onClick={() => handleModelChange('/models/characters/character-male/walk.glb', 'walk')}
              >
                🚶 Berjalan
              </button>
              <button 
                className={`model-btn ${animationState === 'selected' ? 'active' : ''}`}
                onClick={() => handleModelChange('/models/characters/character-male/selected.glb', 'selected')}
              >
                ✅ Terpilih
              </button>
            </div>

            <div className="canvas-container">
              {show3D ? (
                <Canvas
                  camera={{ position: [0, 1, 6], fov: 50 }}
                  style={{ background: 'transparent' }}
                >
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                  
                  <Suspense fallback={<FallbackCharacter />}>
                    <SimpleCharacter modelUrl={currentModel} />
                  </Suspense>
                  
                  <OrbitControls 
                    enableZoom={true}
                    enablePan={true}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Canvas>
              ) : (
                <div className="loading-canvas">
                  <div className="loader"></div>
                  <p>Menyiapkan viewer 3D...</p>
                </div>
              )}
              
              <div className="model-status">
                <span className="status-badge">{animationState.toUpperCase()}</span>
                <span className="model-name">{currentModel.split('/').pop()}</span>
              </div>
            </div>
          </section>

          {/* CHARACTER INFO SECTION */}
          <section className="info-section">
            <div className="character-card">
              <h3>{character.name}</h3>
              <p className="character-description">{character.description}</p>
              
              <div className="stats">
                <div className="stat-item">
                  <span className="stat-label">Keberanian</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${character.stats.courage}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{character.stats.courage}</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Kebijaksanaan</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${character.stats.wisdom}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{character.stats.wisdom}</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-label">Kepemimpinan</span>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill" 
                      style={{ width: `${character.stats.leadership}%` }}
                    ></div>
                  </div>
                  <span className="stat-value">{character.stats.leadership}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ACTION BUTTONS */}
          <section className="action-section">
            <button 
              className="btn back-btn"
              onClick={() => router.push('/')}
            >
              ← Kembali ke Menu
            </button>
            
            <button 
              className="btn select-btn"
              onClick={() => {
                alert(`Karakter ${character.name} dipilih!`)
                // router.push('/game') // Uncomment untuk navigasi
              }}
            >
              🎮 Pilih Karakter Ini
            </button>
          </section>

          {/* DEBUG INFO */}
          <section className="debug-section">
            <details>
              <summary>ℹ️ Info Debug</summary>
              <div className="debug-info">
                <p><strong>Model saat ini:</strong> {currentModel}</p>
                <p><strong>Status:</strong> {animationState}</p>
                <p><strong>3D Viewer:</strong> {show3D ? 'Aktif' : 'Loading...'}</p>
                <button 
                  className="test-btn"
                  onClick={() => testModelFile(currentModel)}
                >
                  Test Model File
                </button>
              </div>
            </details>
          </section>
        </main>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
          color: white;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px;
          border-bottom: 2px solid rgba(255, 107, 53, 0.3);
        }
        
        h1 {
          color: #ff6b35;
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
        }
        
        .subtitle {
          color: #b0b0b0;
          font-size: 1.1rem;
        }
        
        section {
          margin-bottom: 40px;
          background: rgba(20, 20, 30, 0.7);
          border-radius: 15px;
          padding: 25px;
          border: 1px solid rgba(255, 107, 53, 0.2);
        }
        
        .viewer-section h2 {
          color: #fff;
          margin-bottom: 20px;
          text-align: center;
        }
        
        .model-controls {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }
        
        .model-btn {
          padding: 12px 20px;
          background: rgba(255, 107, 53, 0.2);
          color: #ff6b35;
          border: 1px solid rgba(255, 107, 53, 0.5);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 1rem;
        }
        
        .model-btn:hover {
          background: rgba(255, 107, 53, 0.3);
          transform: translateY(-2px);
        }
        
        .model-btn.active {
          background: #ff6b35;
          color: white;
          box-shadow: 0 0 15px rgba(255, 107, 53, 0.5);
        }
        
        .canvas-container {
          width: 100%;
          height: 500px;
          background: rgba(10, 10, 15, 0.8);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          border: 2px solid rgba(255, 107, 53, 0.3);
        }
        
        .loading-canvas {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #888;
        }
        
        .loader {
          width: 50px;
          height: 50px;
          border: 5px solid rgba(255, 107, 53, 0.2);
          border-top: 5px solid #ff6b35;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .model-status {
          position: absolute;
          bottom: 15px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .status-badge {
          background: rgba(255, 107, 53, 0.9);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .model-name {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
        }
        
        .character-card {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .character-card h3 {
          color: #ff6b35;
          font-size: 2rem;
          margin-bottom: 15px;
        }
        
        .character-description {
          color: #d0d0d0;
          line-height: 1.6;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }
        
        .stats {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .stat-label {
          color: #b0b0b0;
          min-width: 120px;
          font-weight: 600;
        }
        
        .stat-bar {
          flex: 1;
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
        }
        
        .stat-value {
          color: #ff6b35;
          font-weight: bold;
          min-width: 40px;
          text-align: right;
        }
        
        .action-section {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 15px 40px;
          font-size: 1.1rem;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          font-weight: 600;
        }
        
        .back-btn {
          background: transparent;
          color: #b0b0b0;
          border: 2px solid rgba(255, 255, 255, 0.2);
        }
        
        .back-btn:hover {
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }
        
        .select-btn {
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
        }
        
        .select-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 107, 53, 0.5);
        }
        
        .debug-section {
          background: rgba(0, 0, 0, 0.5);
          border-color: rgba(255, 255, 255, 0.1);
        }
        
        details {
          color: #888;
        }
        
        summary {
          cursor: pointer;
          padding: 10px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.05);
        }
        
        summary:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .debug-info {
          margin-top: 15px;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        
        .test-btn {
          margin-top: 10px;
          padding: 8px 15px;
          background: #444;
          color: #ccc;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        
        .test-btn:hover {
          background: #555;
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 2rem;
          }
          
          .canvas-container {
            height: 400px;
          }
          
          .model-controls {
            flex-direction: column;
            align-items: center;
          }
          
          .model-btn {
            width: 100%;
            max-width: 250px;
          }
          
          .action-section {
            flex-direction: column;
            align-items: center;
          }
          
          .btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </>
  )
}
