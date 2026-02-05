import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import { LoadingButton } from "../components/LoadingStates"
import { useApi } from "../hooks/useApi"
import anime from "animejs"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const navigate = useNavigate()
    const { execute: login, loading, error } = useApi()

    const cardRef = useRef(null)
    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)
    const buttonRef = useRef(null)
    const containerRef = useRef(null)

    // Page load animations
    useEffect(() => {
        // Animate background gradient
        anime({
            targets: '.auth-container',
            background: [
                { value: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' },
                { value: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' }
            ],
            duration: 8000,
            easing: 'linear',
            direction: 'alternate',
            loop: true
        })

        // Card entrance animation
        anime({
            targets: cardRef.current,
            scale: [0.9, 1],
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1200,
            easing: 'easeOutExpo'
        })

        // Card floating effect
        anime({
            targets: cardRef.current,
            translateY: [
                { value: -6, duration: 3000 },
                { value: 6, duration: 3000 }
            ],
            duration: 6000,
            easing: 'easeInOutSine',
            loop: true
        })

        // Stagger input animations
        anime({
            targets: ['.form-group'],
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100, { start: 400 }),
            duration: 800,
            easing: 'easeOutExpo'
        })

        // Button entrance
        anime({
            targets: buttonRef.current,
            scale: [0.8, 1],
            opacity: [0, 1],
            delay: 800,
            duration: 600,
            easing: 'easeOutExpo'
        })
    }, [])

    // Input focus animations
    const handleInputFocus = (inputRef) => {
        anime({
            targets: inputRef.current,
            scale: 1.02,
            duration: 200,
            easing: 'easeOutQuad'
        })

        anime({
            targets: inputRef.current.previousElementSibling,
            translateY: -2,
            color: '#3b82f6',
            duration: 200,
            easing: 'easeOutQuad'
        })

        // Add glow effect
        inputRef.current.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)'
    }

    const handleInputBlur = (inputRef) => {
        anime({
            targets: inputRef.current,
            scale: 1,
            duration: 200,
            easing: 'easeOutQuad'
        })

        anime({
            targets: inputRef.current.previousElementSibling,
            translateY: 0,
            color: '#6b7280',
            duration: 200,
            easing: 'easeOutQuad'
        })

        // Remove glow effect
        inputRef.current.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
    }

    // Button hover animation
    const handleButtonHover = () => {
        if (!loading) {
            anime({
                targets: buttonRef.current,
                translateY: -3,
                duration: 300,
                easing: 'easeOutQuad'
            })

            // Gradient shimmer effect
            anime({
                targets: buttonRef.current,
                background: [
                    { value: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)' },
                    { value: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)' }
                ],
                duration: 600,
                easing: 'linear'
            })
        }
    }

    const handleButtonLeave = () => {
        if (!loading) {
            anime({
                targets: buttonRef.current,
                translateY: 0,
                duration: 300,
                easing: 'easeOutQuad'
            })
        }
    }

    // Error shake animation
    useEffect(() => {
        if (error) {
            anime({
                targets: cardRef.current,
                translateX: [
                    { value: -10, duration: 100 },
                    { value: 10, duration: 100 },
                    { value: -8, duration: 100 },
                    { value: 8, duration: 100 },
                    { value: 0, duration: 100 }
                ],
                duration: 500,
                easing: 'easeInOutQuad'
            })

            // Red glow pulse
            anime({
                targets: cardRef.current,
                boxShadow: [
                    '0 20px 40px rgba(0, 0, 0, 0.1)',
                    '0 20px 60px rgba(239, 68, 68, 0.3)',
                    '0 20px 40px rgba(0, 0, 0, 0.1)'
                ],
                duration: 1000,
                easing: 'easeInOutQuad',
                loop: 2
            })
        }
    }, [error])

    const submit = async () => {
        try {
            // Button compression animation
            anime({
                targets: buttonRef.current,
                scale: 0.95,
                duration: 100,
                easing: 'easeInQuad',
                complete: () => {
                    anime({
                        targets: buttonRef.current,
                        scale: 1,
                        duration: 200,
                        easing: 'easeOutQuad'
                    })
                }
            })

            const res = await login(() => api.post("/auth/login", { email, password }))

            // Success animation
            setIsSuccess(true)
            anime({
                targets: buttonRef.current,
                scale: 1.1,
                duration: 200,
                easing: 'easeOutQuad',
                complete: () => {
                    anime({
                        targets: buttonRef.current,
                        scale: 1,
                        duration: 200,
                        easing: 'easeInQuad'
                    })
                }
            })

            // Card green glow
            anime({
                targets: cardRef.current,
                boxShadow: '0 20px 60px rgba(34, 197, 94, 0.3)',
                duration: 600,
                easing: 'easeOutQuad'
            })

            // Fade out before redirect
            setTimeout(() => {
                anime({
                    targets: cardRef.current,
                    opacity: 0,
                    scale: 0.9,
                    translateY: -20,
                    duration: 400,
                    easing: 'easeInQuad',
                    complete: () => {
                        localStorage.setItem("token", res.token)
                        navigate("/dashboard")
                    }
                })
            }, 800)
        } catch (error) {
            // Error is handled by useApi hook
        }
    }

    return (
        <div className="auth-container" ref={containerRef}>
            <div className="auth-card" ref={cardRef}>
                <h2>Login</h2>
                <form className="auth-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            ref={emailInputRef}
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            onChange={e => setEmail(e.target.value)}
                            className="form-input"
                            required
                            disabled={loading}
                            onFocus={() => handleInputFocus(emailInputRef)}
                            onBlur={() => handleInputBlur(emailInputRef)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            ref={passwordInputRef}
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={e => setPassword(e.target.value)}
                            className="form-input"
                            required
                            disabled={loading}
                            onFocus={() => handleInputFocus(passwordInputRef)}
                            onBlur={() => handleInputBlur(passwordInputRef)}
                        />
                    </div>
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <LoadingButton
                        ref={buttonRef}
                        type="submit"
                        className={`btn btn-primary ${isSuccess ? 'success' : ''}`}
                        loading={loading}
                        disabled={!email || !password}
                        onMouseEnter={handleButtonHover}
                        onMouseLeave={handleButtonLeave}
                    >
                        {isSuccess ? '✓ Success' : 'Login'}
                    </LoadingButton>
                </form>
                <div className="auth-links">
                    <p>Don't have an account? <a href="/register">Register</a></p>
                </div>
            </div>
        </div>
    )
}
