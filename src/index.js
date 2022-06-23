import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls' 
import { Ik } from './ik'

let points = 5
let ik_controls = []
let myCanvas = document.getElementById('myCanvas')
let scene = new THREE.Scene()

let renderer = new THREE.WebGL1Renderer({canvas: myCanvas})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x1B0DE3)
renderer.setPixelRatio(window.devicePixelRatio)



let camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 1000)
camera.position.set(10, 10, 10)

let orbit = new OrbitControls(camera, renderer.domElement)

for (let i = 0; i < points; i++) {
  let custom_ik = new Ik()
  custom_ik.scene = scene
  ik_controls.push(custom_ik)
}
console.log(ik_controls)


let loader = new GLTFLoader()
new RGBELoader()
  .setPath( 'textures/' )
  .load( 'photo_studio_london_hall_4k.hdr', function ( texture ) {

    texture.mapping = THREE.EquirectangularReflectionMapping;

    // scene.background = texture;
    scene.environment = texture;

    loadModel()

  } );
const loadModel = () => {
  loader.load(
    "models/rigged_mesh_loop.glb",
    (glb) => {
      console.log(glb)
      let helper = new THREE.SkeletonHelper(glb.scene)
      scene.add(helper)
      console.log('ik_controls', ik_controls)
     
      glb.scene.traverse(function(child) {
        
        if (child.type == 'Bone') {

          ///// HEAD ///////

          if (child.name == 'Tip_RH') {
            ik_controls[0].root = child
          }
    
          if (child.name == 'Tip_Head') {
            ik_controls[0].tip = child
          }
    
          if (child.name == 'Effector_Head') {
            ik_controls[0].effector = child
          }
    
          if (child.name == 'Control_Head') {
            ik_controls[0].target = child
            let transform = new TransformControls(camera, renderer.domElement)
            transform.size = 0.4
            transform.addEventListener('mouseDown', mouse_down)
            transform.addEventListener('mouseUp', mouse_up)
            transform.attach(ik_controls[0].target)
            transform.mode = 'translate'
            transform.space = 'local'
            scene.add(transform)
          }

          ///// RIGHT HAND ///////
          if (child.name == 'Tip_RF') {
            ik_controls[1].root = child
          }
    
          if (child.name == 'Tip_RH') {
            ik_controls[1].tip = child
          }
    
          if (child.name == 'Effector_RH') {
            ik_controls[1].effector = child
          }
    
          if (child.name == 'Control_RH') {
            ik_controls[1].target = child
            let transform = new TransformControls(camera, renderer.domElement)
            transform.size = 0.4
            transform.addEventListener('mouseDown', mouse_down)
            transform.addEventListener('mouseUp', mouse_up)
            transform.attach(ik_controls[1].target)
            transform.mode = 'translate'
            transform.space = 'local'
            scene.add(transform)
          }


           ///// RIGHT FOOT ///////
           if (child.name == 'Tip_LF') {
            ik_controls[2].root = child
          }
    
          if (child.name == 'Tip_RF') {
            ik_controls[2].tip = child
          }
    
          if (child.name == 'Effector_RF') {
            ik_controls[2].effector = child
          }
    
          if (child.name == 'Control_RF') {
            ik_controls[2].target = child
            let transform = new TransformControls(camera, renderer.domElement)
            transform.size = 0.4
            transform.addEventListener('mouseDown', mouse_down)
            transform.addEventListener('mouseUp', mouse_up)
            transform.attach(ik_controls[2].target)
            transform.mode = 'translate'
            transform.space = 'local'
            scene.add(transform)
          }

          ///// LEFT FOOT ///////
          if (child.name == 'Tip_LH') {
            ik_controls[3].root = child
          }
    
          if (child.name == 'Tip_LF') {
            ik_controls[3].tip = child
          }
    
          if (child.name == 'Effector_LF') {
            ik_controls[3].effector = child
          }
    
          if (child.name == 'Control_LF') {
            ik_controls[3].target = child
            let transform = new TransformControls(camera, renderer.domElement)
            transform.size = 0.4
            transform.addEventListener('mouseDown', mouse_down)
            transform.addEventListener('mouseUp', mouse_up)
            transform.attach(ik_controls[3].target)
            transform.mode = 'translate'
            transform.space = 'local'
            scene.add(transform)
          }

          ///// LEFT HAND ///////
          if (child.name == 'Tip_Head') {
            ik_controls[4].root = child
          }
    
          if (child.name == 'Tip_LH') {
            ik_controls[4].tip = child
          }
    
          if (child.name == 'Effector_LH') {
            ik_controls[4].effector = child
          }
    
          if (child.name == 'Control_LH') {
            ik_controls[4].target = child
            let transform = new TransformControls(camera, renderer.domElement)
            transform.size = 0.4
            transform.addEventListener('mouseDown', mouse_down)
            transform.addEventListener('mouseUp', mouse_up)
            transform.attach(ik_controls[4].target)
            transform.mode = 'translate'
            transform.space = 'local'
            scene.add(transform)
          }
        }
        
  
        
      })
  
      scene.add(glb.scene)
      animate()
    }
  )
}


let mouse_down = function (e) {
  orbit.enabled = false
}

let mouse_up = function (e) {
  orbit.enabled = true
}

let animate = function () {
  if (camera) {
    renderer.render(scene, camera)

    for (let i = 0; i < points; i++) {
      let ik = ik_controls[i]
      ik.Execute()
    }
    
  }

  requestAnimationFrame(animate)
}