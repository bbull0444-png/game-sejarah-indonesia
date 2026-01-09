import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function CharacterSelect() {
  const router = useRouter()
  
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
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ color: '#ff6b35' }}>PILIH KARAKTER</h1>
          <p>Halaman dalam pengembangan</p>
          
          {/* TEST: Coba load model langsung */}
          <button 
            onClick={() => {
              // Test fetch model
              fetch('/models/characters/character-male/idle.glb')
                .then(res => {
                  if (res.ok) {
                    alert('Model ADA! Status: ' + res.status)
                  } else {
                    alert('Model TIDAK ditemukan! Status: ' + res.status)
                  }
                })
                .catch(err => alert('Error: ' + err.message))
            }}
            style={{
              margin: '20px',
              padding: '10px 20px',
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            Test Model File
          </button>
          
          <button 
            onClick={() => router.push('/')}
            style={{
              margin: '20px',
              padding: '10px 20px',
              background: 'transparent',
              color: '#b0b0b0',
              border: '1px solid #444'
            }}
          >
            ← Kembali ke Home
          </button>
        </div>
      </div>
    </>
  )
}
