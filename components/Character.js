import { useGLTF } from '@react-three/drei'

export default function Character({ state }) {
  const file =
    state === 'selected'
      ? '/models/characters/character-male/selected.glb'
      : '/models/characters/character-male/idle.glb'

  const { scene } = useGLTF(file)

  return <primitive object={scene} scale={1.5} />
}
