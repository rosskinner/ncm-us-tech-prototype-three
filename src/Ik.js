import * as THREE from 'three'

export class Ik {
  tip
  root
  effector
  target
  root_position = new THREE.Vector3()
  tolerance = 0.0001
  scene

  constructor(scene = null, tip = null, root = null, effector = null, target= null,tolerance = null) {
    this.scene = scene
    this.tip = tip
    this.root = root
    this.effector = effector
    this.target = target
    this.tolerance = tolerance

    THREE.Vector3.prototype.ToFixed = function (number) {
      this.set(parseFloat(this.x.toFixed(number)), parseFloat(this.y.toFixed(number)), parseFloat(this.z.toFixed(number)))
      return this
    }
  }

  Execute () {
    if (this.CheckDistanceTolerance()) {
      this.root_position.setFromMatrixPosition(this.root.matrixWorld)
      this.FinalToRoot()
      this.RootToFinal()
    }
  }

  FinalToRoot () {
    let target_position = new THREE.Vector3()
    target_position.setFromMatrixPosition(this.target.matrixWorld).ToFixed(4)

    let tail_position = new THREE.Vector3()
    tail_position.setFromMatrixPosition(this.effector.matrixWorld).ToFixed(4)

    let current_bone = this.tip
    while(current_bone) {
      
      let next_tail_position = new THREE.Vector3()
      next_tail_position.setFromMatrixPosition(current_bone.matrixWorld).ToFixed(4)
      
      let child = (current_bone.children[0] != this.effector) ? current_bone.children[0] : null
      
      if (child) {
        this.scene.attach(child)
      }

      this.CustomLookAtTarget(current_bone, tail_position, target_position)
      this.CustomSetWorldPosition(current_bone, tail_position, target_position)

      if(child) {
        current_bone.attach(child)
      }

      tail_position = next_tail_position.clone()
      target_position.setFromMatrixPosition(current_bone.matrixWorld).ToFixed(4)
      current_bone = current_bone != this.root ? current_bone.parent : null
      if (current_bone) {
        current_bone = current_bone.type === 'Bone' ? current_bone : null
      }
    }

  
  }

  RootToFinal () {
    let parent = this.root.parent
    this.scene.attach(this.root)

    this.root.position.set(this.root_position.x, this.root_position.y, this.root_position.z)

    parent.attach(this.root)
  }

  CustomLookAtTarget (bone, tail_position, target_position) {
    let bone_position = new THREE.Vector3()
    bone_position.setFromMatrixPosition(bone.matrixWorld).ToFixed(4)

    let bone_direction = new THREE.Vector3()
    bone_direction.subVectors(tail_position, bone_position).normalize()

    let direction = new THREE.Vector3()
    direction.subVectors(target_position, bone_position).normalize()

    let angle = Math.acos(bone_direction.dot(direction).toFixed(4))

    let rotation = bone_direction.clone().cross(direction).normalize()

    if (!isNaN(angle)) {
      bone.rotation.x += rotation.x * angle
      bone.rotation.y += rotation.y * angle
      bone.rotation.z += rotation.z * angle
    }
  }

  CustomSetWorldPosition (bone, tail_position, target_position) {
    let bone_position = new THREE.Vector3()
    bone_position.setFromMatrixPosition(bone.matrixWorld).ToFixed(4)

    let direction = new THREE.Vector3()
    direction.subVectors(target_position, bone_position).normalize()

    let parent = bone.parent
    
    let distance_float_a = bone_position.distanceTo(tail_position)
    let distance_float_b = bone_position.distanceTo(target_position)

    this.scene.attach(bone)

    bone.position.x += direction.x * (distance_float_b - distance_float_a)
    bone.position.y += direction.y * (distance_float_b - distance_float_a)
    bone.position.z += direction.z * (distance_float_b - distance_float_a)

    parent.attach(bone)

  }

  CheckDistanceTolerance () {
    let target_position = new THREE.Vector3()
    target_position.setFromMatrixPosition(this.target.matrixWorld).ToFixed(4)

    let effector_position = new THREE.Vector3()
    effector_position.setFromMatrixPosition(this.effector.matrixWorld).ToFixed(4)

    let distance = new THREE.Vector3()
    distance.subVectors(target_position, effector_position).ToFixed(4)

    let distance_float = effector_position.distanceTo(target_position);
    return Math.abs(distance_float) > this.tolerance
  }

}