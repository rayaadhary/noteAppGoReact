import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import api from "@/api/axios"
import { useNavigate } from "react-router-dom"

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
            setLoading(true)
            await api.post("/register", { name, email, password })

            alert("Register berhasil! Silahkan login.")
            navigate("/") // abis register langsung ke halaman login
        } catch (err) {
            console.error(err)
            alert("Register gagal!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
                <div className="space-y-4">
                    <Input
                        placeholder="Nama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleRegister} className="w-full" disabled={loading}>
                        {loading ? "Loading..." : "Register"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Register
