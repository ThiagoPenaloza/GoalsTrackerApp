'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Icosahedron, Torus } from '@react-three/drei'
import * as THREE from 'three'

function FloatingShapes() {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
        }
    })

    // Warm pastel orange palette
    const colors = useMemo(() => ({
        primary: '#F97316',    // Bright orange
        secondary: '#FDBA74',  // Soft peach
        accent: '#FED7AA',     // Cream
        dark: '#EA580C',       // Deep orange
    }), [])

    return (
        <group ref={groupRef}>
            {/* Main Icosahedron - hero shape */}
            <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
                <Icosahedron args={[1.2, 1]} position={[0, 0, 0]}>
                    <MeshDistortMaterial
                        color={colors.primary}
                        attach="material"
                        distort={0.3}
                        speed={2}
                        roughness={0.4}
                        metalness={0.1}
                    />
                </Icosahedron>
            </Float>

            {/* Floating spheres */}
            <Float speed={3} rotationIntensity={0.4} floatIntensity={0.8}>
                <Sphere args={[0.35, 32, 32]} position={[-1.8, 0.8, -0.5]}>
                    <meshStandardMaterial color={colors.secondary} roughness={0.3} metalness={0.2} />
                </Sphere>
            </Float>

            <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere args={[0.25, 32, 32]} position={[1.6, -0.6, 0.3]}>
                    <meshStandardMaterial color={colors.accent} roughness={0.2} metalness={0.1} />
                </Sphere>
            </Float>

            <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
                <Sphere args={[0.2, 32, 32]} position={[1.2, 1.2, -0.8]}>
                    <meshStandardMaterial color={colors.dark} roughness={0.4} metalness={0.3} />
                </Sphere>
            </Float>

            {/* Torus ring */}
            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
                <Torus args={[0.6, 0.08, 16, 32]} position={[-1.2, -0.8, 0.5]} rotation={[Math.PI / 3, 0, 0]}>
                    <meshStandardMaterial color={colors.secondary} roughness={0.3} metalness={0.4} />
                </Torus>
            </Float>
        </group>
    )
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 1.5]}
                gl={{ antialias: true, alpha: true }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} color="#FFF7ED" />
                <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#F97316" />
                <FloatingShapes />
            </Canvas>
        </div>
    )
}
