'use client'

import { useEffect, useState } from 'react'

export function HeroScene() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Main floating icosahedron simulation with CSS */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {/* Central glowing orb */}
                <div
                    className="w-48 h-48 rounded-full animate-float"
                    style={{
                        background: 'linear-gradient(135deg, #F97316 0%, #FDBA74 50%, #FED7AA 100%)',
                        boxShadow: '0 0 60px rgba(249, 115, 22, 0.4), 0 0 120px rgba(249, 115, 22, 0.2)',
                        animation: 'float 6s ease-in-out infinite, pulse-glow 4s ease-in-out infinite',
                    }}
                />
            </div>

            {/* Floating secondary orbs */}
            <div
                className="absolute w-20 h-20 rounded-full"
                style={{
                    top: '25%',
                    left: '20%',
                    background: 'linear-gradient(135deg, #FDBA74 0%, #FED7AA 100%)',
                    boxShadow: '0 0 40px rgba(253, 186, 116, 0.4)',
                    animation: 'float 8s ease-in-out infinite 1s',
                }}
            />

            <div
                className="absolute w-12 h-12 rounded-full"
                style={{
                    top: '60%',
                    right: '25%',
                    background: 'linear-gradient(135deg, #FED7AA 0%, #FFFFFF 100%)',
                    boxShadow: '0 0 30px rgba(254, 215, 170, 0.5)',
                    animation: 'float 7s ease-in-out infinite 2s',
                }}
            />

            <div
                className="absolute w-16 h-16 rounded-full"
                style={{
                    bottom: '30%',
                    left: '30%',
                    background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                    boxShadow: '0 0 35px rgba(234, 88, 12, 0.4)',
                    animation: 'float 9s ease-in-out infinite 0.5s',
                }}
            />

            {/* Rotating ring */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72"
                style={{
                    border: '2px solid rgba(249, 115, 22, 0.2)',
                    borderRadius: '50%',
                    animation: 'spin-slow 20s linear infinite',
                }}
            />

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80"
                style={{
                    border: '1px solid rgba(253, 186, 116, 0.15)',
                    borderRadius: '50%',
                    animation: 'spin-slow 25s linear infinite reverse',
                }}
            />

            {/* Inline keyframes */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(5px); }
          50% { transform: translateY(-5px) translateX(-5px); }
          75% { transform: translateY(-20px) translateX(3px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
        </div>
    )
}
