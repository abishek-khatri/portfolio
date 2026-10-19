import * as THREE from 'three'

export type ViewMode = 'photo' | 'cad' | 'schematic'

export type ExplodeTarget = {
  object: THREE.Object3D
  base: THREE.Vector3
  dir: THREE.Vector3
}

const EDGES_NAME = 'nb-edges'

// Many exported models wrap everything in one or two empty groups. Walk down
// until we reach the group whose direct children are the real parts.
function findPartsParent(root: THREE.Object3D): THREE.Object3D {
  let node = root
  for (let depth = 0; depth < 5; depth++) {
    const kids = node.children.filter((c) => c.name !== EDGES_NAME)
    if (kids.length >= 2) return node
    if (kids.length === 1) node = kids[0]
    else break
  }
  return node
}

// Works out which parts can be pulled apart, and in which direction each one
// moves: away from the middle of the whole model.
export function findExplodeTargets(root: THREE.Object3D): ExplodeTarget[] {
  root.updateWorldMatrix(true, true)
  const parent = findPartsParent(root)
  const kids = parent.children.filter((c) => c.name !== EDGES_NAME)
  if (kids.length < 2) return []

  const parentBox = new THREE.Box3().setFromObject(parent)
  const parentSize = parentBox.getSize(new THREE.Vector3())
  const parentCenterWorld = parentBox.getCenter(new THREE.Vector3())
  const parentCenterLocal = parent.worldToLocal(parentCenterWorld.clone())
  const middle = (kids.length - 1) / 2

  return kids.map((object, i) => {
    const box = new THREE.Box3().setFromObject(object)
    const dir = new THREE.Vector3()

    if (!box.isEmpty()) {
      const centerLocal = parent.worldToLocal(box.getCenter(new THREE.Vector3()))
      dir.copy(centerLocal).sub(parentCenterLocal)
    }

    if (dir.length() < 1e-6) {
      // Parts that share a centre are spread upward, in order.
      const shifted = parentCenterWorld.clone().add(new THREE.Vector3(0, parentSize.y * 0.5 * (i - middle), 0))
      dir.copy(parent.worldToLocal(shifted)).sub(parentCenterLocal)
    }

    return { object, base: object.position.clone(), dir }
  })
}

// amount 0 = assembled. 1 = every part moved as far from the middle as it started.
export function applyExplode(targets: ExplodeTarget[], amount: number): void {
  for (const t of targets) {
    t.object.position.copy(t.base).addScaledVector(t.dir, amount)
  }
}

const cadMaterial = new THREE.MeshStandardMaterial({ color: '#e2dccb', roughness: 0.9, metalness: 0 })
const schematicMaterial = new THREE.MeshBasicMaterial({ color: '#2b4fb0', wireframe: true })
const edgeMaterial = new THREE.LineBasicMaterial({ color: '#14202a' })

// photo = the model's own materials, CAD = flat clay with dark edges,
// schematic = blue wireframe.
export function applyViewMode(root: THREE.Object3D, mode: ViewMode): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh
    if (!mesh.isMesh) return

    if (!mesh.userData.nbOriginal) mesh.userData.nbOriginal = mesh.material

    let edges = mesh.children.find((c) => c.name === EDGES_NAME)
    if (!edges && mode === 'cad') {
      edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 25), edgeMaterial)
      edges.name = EDGES_NAME
      mesh.add(edges)
    }
    if (edges) edges.visible = mode === 'cad'

    mesh.material =
      mode === 'photo' ? mesh.userData.nbOriginal : mode === 'cad' ? cadMaterial : schematicMaterial
  })
}