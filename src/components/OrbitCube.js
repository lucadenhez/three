import { createRoot } from 'react-dom/client';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, useGLTF, useScroll, Text, Image, Scroll, Preload, ScrollControls, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

function Lens({ children, damping = 0.15, ...props }) {
    const ref = useRef()
    const { nodes } = useGLTF('/lens-transformed.glb')
    const buffer = useFBO()
    const viewport = useThree((state) => state.viewport)
    const [scene] = useState(() => new THREE.Scene())
    useFrame((state, delta) => {
      // Tie lens to the pointer
      // getCurrentViewport gives us the width & height that would fill the screen in threejs units
      // By giving it a target coordinate we can offset these bounds, for instance width/height for a plane that
      // sits 15 units from 0/0/0 towards the camera (which is where the lens is)
      const viewport = state.viewport.getCurrentViewport(state.camera, [0, 0, 15])
      easing.damp3(
        ref.current.position,
        [(state.pointer.x * viewport.width) / 2, (state.pointer.y * viewport.height) / 2, 15],
        damping,
        delta
      )
      // This is entirely optional but spares us one extra render of the scene
      // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
      // The following code will render that scene into a buffer, whose texture will then be fed into
      // a plane spanning the full screen and the lens transmission material
      state.gl.setRenderTarget(buffer)
      state.gl.setClearColor('#d8d7d7')
      state.gl.render(scene, state.camera)
      state.gl.setRenderTarget(null)
    })
    return (
      <>
        {createPortal(children, scene)}
        <mesh scale={[viewport.width, viewport.height, 1]}>
          <planeGeometry />
          <meshBasicMaterial map={buffer.texture} />
        </mesh>
        <mesh scale={0.25} ref={ref} rotation-x={Math.PI / 2} geometry={nodes.Cylinder.geometry} {...props}>
          <MeshTransmissionMaterial buffer={buffer.texture} ior={1.2} thickness={1.5} anisotropy={0.1} chromaticAberration={0.04} />
        </mesh>
      </>
    )
}

const CubeToOrbit = () => {
    const RPM = 100;
    const cubeRef = useRef();

    useFrame(() => {
        cubeRef.current.rotation.y += 1 / RPM;
        cubeRef.current.rotation.x += 1 / RPM;
    });

    return (
        <mesh ref={cubeRef} rotation-x={Math.PI * 0.25} rotation-y={Math.PI * 0.25}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={"red"} />
        </mesh>
    );
}


export default function OrbitCube() {
    return (
        <div className="w-full h-96 relative" id="canvas-container">
            <Canvas camera={{ position: [0, 0, 20], fov: 12 }}>
                <ScrollControls damping={0.2} pages={3} distance={0.5}>
                    <Lens>
                        <Scroll>
                            <ambientLight intensity={0.1} />
                            <directionalLight position={[0, 0, 5]} color="white" />
                            <CubeToOrbit />
                        </Scroll>
                    </Lens>
                </ScrollControls>
            </Canvas>
        </div>
    );
}

createRoot(document.getElementById('root')).render(<OrbitCube />);
