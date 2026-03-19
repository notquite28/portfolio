import * as THREE from 'https://esm.sh/three@0.183.2'
import { GLTFLoader } from 'https://esm.sh/three@0.183.2/examples/jsm/loaders/GLTFLoader?deps=three@0.183.2'
import { DRACOLoader } from 'https://esm.sh/three@0.183.2/examples/jsm/loaders/DRACOLoader?deps=three@0.183.2'

const host = document.querySelector('[data-notfound-model]')

if (host instanceof HTMLDivElement) {
  const modelUrl = host.dataset.modelUrl
  const nav = navigator
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection
  const saveData = Boolean(connection && connection.saveData)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lowPowerDevice = (nav.deviceMemory && nav.deviceMemory <= 4) || window.innerWidth < 768
  const supportsWebGL = (() => {
    try {
      const canvas = document.createElement('canvas')
      return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    } catch {
      return false
    }
  })()

  if (modelUrl && supportsWebGL) {
    let frameId = 0
    let isDisposed = false
    let cleanupResize = null
    let cleanupPointer = null
    let cleanupVisibility = null
    let idleResumeAt = 0
    let lastFrameTime = 0
    let elapsed = 0
    let isPageHidden = document.hidden

    const mountScene = async () => {
      const width = host.clientWidth
      const height = host.clientHeight
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !lowPowerDevice,
        powerPreference: 'low-power'
      })

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerDevice ? 1.25 : 1.75))
      renderer.setSize(width, height, false)
      renderer.outputColorSpace = THREE.SRGBColorSpace
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-4.4, 4.4, 4.4, -4.4, 0.1, 100)
      camera.position.set(10, 7, 10)
      camera.lookAt(0, 1.8, 0)

      const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.1)
      keyLight.position.set(6, 8, 10)
      const rimLight = new THREE.DirectionalLight(0x8be9fd, 0.7)
      rimLight.position.set(-8, 3, -4)
      scene.add(ambientLight, keyLight, rimLight)

      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
      loader.setDRACOLoader(dracoLoader)
      const gltf = await loader.loadAsync(modelUrl)
      if (isDisposed) return

      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)

      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const targetSpan = lowPowerDevice ? 5.6 : 6.2
      const fittedScale = targetSpan / maxDim

      model.scale.setScalar(fittedScale)
      model.position.set(-center.x * fittedScale, -center.y * fittedScale, -center.z * fittedScale)
      model.rotation.set(-0.12, 0.9, 0)

      const fittedBox = new THREE.Box3().setFromObject(model)
      const fittedSize = new THREE.Vector3()
      const fittedCenter = new THREE.Vector3()
      fittedBox.getSize(fittedSize)
      fittedBox.getCenter(fittedCenter)

      model.position.x -= fittedCenter.x
      model.position.y -= fittedCenter.y * 0.92
      model.position.z -= fittedCenter.z
      scene.add(model)

      const rotationState = {
        dragging: false,
        pointerId: null,
        lastX: 0,
        lastY: 0,
        velocity: 0,
        pitchVelocity: 0,
        yaw: model.rotation.y,
        pitch: model.rotation.x,
        idleSpeed: 0.52,
        baseYaw: model.rotation.y,
      }

      const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

      host.style.cursor = 'grab'

      const onPointerDown = (event) => {
        rotationState.dragging = true
        rotationState.pointerId = event.pointerId
        rotationState.lastX = event.clientX
        rotationState.lastY = event.clientY
        rotationState.velocity = 0
        rotationState.pitchVelocity = 0
        idleResumeAt = 0
        lastFrameTime = 0
        host.style.cursor = 'grabbing'
        if (host.setPointerCapture) host.setPointerCapture(event.pointerId)
      }

      const onPointerMove = (event) => {
        if (!rotationState.dragging || rotationState.pointerId !== event.pointerId) return

        const deltaX = event.clientX - rotationState.lastX
        const deltaY = event.clientY - rotationState.lastY
        rotationState.lastX = event.clientX
        rotationState.lastY = event.clientY
        rotationState.velocity = deltaX * 0.0019
        rotationState.pitchVelocity = deltaY * -0.0012
        rotationState.yaw += rotationState.velocity
        rotationState.pitch = clamp(rotationState.pitch + rotationState.pitchVelocity, -0.42, 0.12)
        model.rotation.y = rotationState.yaw
        model.rotation.x = rotationState.pitch
        render()
      }

      const endPointer = (event) => {
        if (rotationState.pointerId !== null && event.pointerId !== rotationState.pointerId) return
        rotationState.dragging = false
        rotationState.pointerId = null
        idleResumeAt = performance.now() + 1200
        host.style.cursor = 'grab'
      }

      host.addEventListener('pointerdown', onPointerDown)
      host.addEventListener('pointermove', onPointerMove)
      host.addEventListener('pointerup', endPointer)
      host.addEventListener('pointercancel', endPointer)
      host.addEventListener('pointerleave', endPointer)

      cleanupPointer = () => {
        host.removeEventListener('pointerdown', onPointerDown)
        host.removeEventListener('pointermove', onPointerMove)
        host.removeEventListener('pointerup', endPointer)
        host.removeEventListener('pointercancel', endPointer)
        host.removeEventListener('pointerleave', endPointer)
      }

      const fallback = host.querySelector('.notfound-model-fallback')
      if (fallback) fallback.remove()

      const render = () => renderer.render(scene, camera)
      render()

      if (!prefersReducedMotion && !saveData) {
        const animate = (time) => {
          frameId = window.requestAnimationFrame(animate)
          if (isPageHidden) return
          const delta = lastFrameTime ? Math.min((time - lastFrameTime) / 1000, 0.033) : 1 / 60
          lastFrameTime = time
          elapsed += delta

          if (!rotationState.dragging) {
            rotationState.yaw += rotationState.velocity * delta * 60
            rotationState.pitch = clamp(rotationState.pitch + rotationState.pitchVelocity * delta * 60, -0.42, 0.12)

            rotationState.velocity *= Math.pow(0.92, delta * 60)
            rotationState.pitchVelocity *= Math.pow(0.84, delta * 60)

            if (Math.abs(rotationState.pitch - -0.12) > 0.0005) {
              rotationState.pitch += (-0.12 - rotationState.pitch) * (1 - Math.pow(0.965, delta * 60))
            }

            if (performance.now() > idleResumeAt) {
              const idleStep = (rotationState.idleSpeed / 60) * delta * 60
              rotationState.velocity += (idleStep - rotationState.velocity) * (1 - Math.pow(0.94, delta * 60))
            }

            const idleWave = Math.sin(elapsed * 0.9) * 0.08
            const idleNod = Math.sin(elapsed * 1.2 + 0.6) * 0.025

            model.rotation.y = rotationState.yaw + idleWave
            model.rotation.x = rotationState.pitch + idleNod
          }
          renderer.render(scene, camera)
        }

        animate()
      }

      const resize = () => {
        if (isDisposed) return
        renderer.setSize(host.clientWidth, host.clientHeight, false)
        render()
      }

      window.addEventListener('resize', resize, { passive: true })
      cleanupResize = () => window.removeEventListener('resize', resize)

      const onVisibilityChange = () => {
        isPageHidden = document.hidden
        if (!isPageHidden) lastFrameTime = 0
      }

      document.addEventListener('visibilitychange', onVisibilityChange)
      cleanupVisibility = () => document.removeEventListener('visibilitychange', onVisibilityChange)

      window.addEventListener('pagehide', () => {
        isDisposed = true
        window.cancelAnimationFrame(frameId)
        if (cleanupResize) cleanupResize()
        if (cleanupPointer) cleanupPointer()
        if (cleanupVisibility) cleanupVisibility()
        dracoLoader.dispose()
        renderer.dispose()
      }, { once: true })
    }

    mountScene().catch(() => {
      host.dataset.modelFailed = 'true'
    })
  }
}
