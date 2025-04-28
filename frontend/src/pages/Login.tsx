import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/api/axios"
import { useNavigate } from "react-router-dom"

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("") // Tambahan error state
    const navigate = useNavigate()

    const handleLogin = async () => {
        setLoading(true)
        setError("") // Reset error tiap mau login
        try {
            const res = await api.post('/login', { email, password }, { withCredentials: true })

            const token = res.data.token
            localStorage.setItem('token', token)

            navigate('/dashboard')
        } catch (err) {
            console.error(err)
            setError("Email atau Password salah!") // Set error
        } finally {
            setLoading(false) // Ini fix harus false
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <div className="space-y-4">
                    <Input
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                        onClick={handleLogin}
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Login"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Login
