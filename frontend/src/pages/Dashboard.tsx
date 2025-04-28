import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/api/axios"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"

interface Task {
    ID: number
    title: string
    content: string
}

function Dashboard() {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState("")
    const [newContent, setNewContent] = useState("")
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/")
        } else {
            fetchTasks()
        }
    }, [navigate])

    const fetchTasks = async () => {
        try {
            const res = await api.get("/tasks", {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            setTasks(res.data.tasks)
        } catch (err) {
            console.error(err)
        }
    }

    const handleAddOrUpdateTask = async () => {
        if (!newTask.trim()) return;

        try {
            if (editingTaskId === null) {
                // Tambah task baru
                await api.post("/tasks", {
                    title: newTask,
                    content: newContent
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            } else {
                // Update task yang sudah ada
                await api.put(`/tasks/${editingTaskId}`, {
                    title: newTask,
                    content: newContent
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            }

            // Reset input dan refresh tasks
            setNewTask("");
            setNewContent("");
            setEditingTaskId(null);  // Reset ID editing setelah selesai
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    }

    const handleEditTask = (task: Task) => {
        setEditingTaskId(task.ID);
        setNewTask(task.title);
        setNewContent(task.content);
    }

    const handleCancelEdit = () => {
        setEditingTaskId(null);  // Reset editing task id
        setNewTask("");          // Reset task input
        setNewContent("");       // Reset content input
    }

    const handleDeleteTask = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            })
            fetchTasks()
        } catch (err) {
            console.error(err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        navigate("/")
    }

    return (
        <div className="flex flex-col min-h-screen p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Button onClick={handleLogout} variant="destructive">
                    Logout
                </Button>
            </div>

            {/* Form tambah task */}
            <div className="w-full max-w-md mx-auto">
                <div className="flex flex-col gap-2 mb-6">
                    <Input
                        placeholder="Tambah task baru"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <Textarea
                        placeholder="Tambah content"
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    {/* Tombol Tambah/Ubah */}
                    <Button onClick={handleAddOrUpdateTask}>
                        {editingTaskId === null ? "Tambah" : "Ubah"}
                    </Button>
                </div>

                {/* List task */}
                <ul className="space-y-2">
                    {tasks.map((task) => (
                        <li key={task.ID} className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                            <div>
                                <p className="font-semibold">{task.title}</p>
                                <p className="text-sm text-gray-600">{task.content}</p>
                            </div>
                            <div className="flex gap-2">
                                {/* Tombol Edit atau Batal */}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        if (editingTaskId === task.ID) {
                                            handleCancelEdit();
                                        } else {
                                            handleEditTask(task);
                                        }
                                    }}
                                >
                                    {editingTaskId === task.ID ? "Batal" : "Ubah"}
                                </Button>

                                <Button size="sm" variant="destructive" onClick={() => handleDeleteTask(task.ID)}>
                                    Hapus
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Dashboard
