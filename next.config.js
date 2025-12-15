/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

### 3. **Struktur folder `src/` atau `pages/`**

Buat struktur seperti ini:
```
game-sejarah-indonesia/
├── pages/
│   ├── _app.js
│   ├── index.js (Opening Screen)
│   └── character-select.js (Pilih Karakter)
├── public/
│   ├── models/characters/character-male/
│   │   ├── idle.glb
│   │   ├── male.glb
│   │   ├── selected.glb
│   │   ├── walk.glb
│   │   └── wave.glb
│   └── images/background/
│       └── indonesia-map.jpg
├── package.json
├── next.config.js
└── .gitignore
