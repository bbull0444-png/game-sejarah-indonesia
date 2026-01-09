import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KHR_materials_pbrSpecularGlossiness } from 'three/examples/jsm/loaders/KHR_materials_pbrSpecularGlossiness'

export function setupGLTFLoader() {
  const loader = new GLTFLoader()
  
  // Tambahkan dukungan untuk extension lama
  loader.register(parser => new KHR_materials_pbrSpecularGlossiness(parser))
  
  // Draco compression
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
  loader.setDRACOLoader(dracoLoader)
  
  return loader
}
