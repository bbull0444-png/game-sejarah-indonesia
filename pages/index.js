import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Home() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/character-select')
  }

  return (
    <>
      <Head>
        <title>Game Sejarah Indonesia 1945-1966</title>
        <meta name="description" content="Game pembelajaran sejarah Indonesia" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="opening-screen">
        <div className="background-overlay"></div>
        
        <div className="opening-content">
          <div className="title-container">
            <h1 className="game-title">1945–1966</h1>
            <p className="game-subtitle">Ketika kemerdekaan diuji dari dalam.</p>
          </div>
          
          <button className="start-button" onClick={handleStart}>
            <span className="button-text">MULAI</span>
            <div className="button-glow"></div>
          </button>
        </div>

        <style jsx>{`
          .opening-screen {
            width: 100vw;
            height: 100vh;
            background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)),
                        url('/images/background/indonesia-map.jpg');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .background-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(ellipse at 20% 30%, rgba(255, 100, 50, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 60%, rgba(255, 150, 100, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, rgba(200, 80, 40, 0.1) 0%, transparent 50%);
            animation: pulse 8s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.8; }
            50% { opacity: 1; }
          }

          .opening-content {
            position: relative;
            z-index: 10;
            text-align: center;
            animation: fadeIn 1.5s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .title-container {
            margin-bottom: 60px;
          }

          .game-title {
            font-size: clamp(3rem, 10vw, 6rem);
            font-weight: 900;
            color: #ff6b35;
            text-shadow: 
              0 0 20px rgba(255, 107, 53, 0.8),
              0 0 40px rgba(255, 107, 53, 0.4),
              0 4px 8px rgba(0, 0, 0, 0.8);
            margin: 0;
            letter-spacing: 0.1em;
            animation: titleGlow 3s ease-in-out infinite;
          }

          @keyframes titleGlow {
            0%, 100% {
              text-shadow: 
                0 0 20px rgba(255, 107, 53, 0.8),
                0 0 40px rgba(255, 107, 53, 0.4),
                0 4px 8px rgba(0, 0, 0, 0.8);
            }
            50% {
              text-shadow: 
                0 0 30px rgba(255, 107, 53, 1),
                0 0 60px rgba(255, 107, 53, 0.6),
                0 4px 8px rgba(0, 0, 0, 0.8);
            }
          }

          .game-subtitle {
            font-size: clamp(1rem, 3vw, 1.5rem);
            color: #e8e8e8;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
            margin-top: 20px;
            letter-spacing: 0.05em;
            font-weight: 300;
          }

          .start-button {
            position: relative;
            padding: 18px 60px;
            font-size: clamp(1rem, 2.5vw, 1.3rem);
            font-weight: 700;
            color: #ffffff;
            background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
            border: 2px solid #ff8c5a;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            box-shadow: 
              0 4px 15px rgba(255, 107, 53, 0.4),
              inset 0 -2px 8px rgba(0, 0, 0, 0.2);
            overflow: hidden;
          }

          .start-button:hover {
            transform: translateY(-3px);
            box-shadow: 
              0 6px 25px rgba(255, 107, 53, 0.6),
              inset 0 -2px 8px rgba(0, 0, 0, 0.2);
            border-color: #ffa07a;
          }

          .start-button:active {
            transform: translateY(-1px);
            box-shadow: 
              0 3px 15px rgba(255, 107, 53, 0.4),
              inset 0 -2px 8px rgba(0, 0, 0, 0.3);
          }

          .button-text {
            position: relative;
            z-index: 2;
          }

          .button-glow {
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            animation: buttonGlow 3s linear infinite;
          }

          @keyframes buttonGlow {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.5);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  )
}
