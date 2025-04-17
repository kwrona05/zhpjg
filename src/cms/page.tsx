import {useEffect, useState} from "react";
import axios from 'axios'

const AdminPage = () => {
    const [token, setToken] = useState('')
    const [posts, setPosts] = useState([])
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [file, setFile] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const fetchPosts = async () => {
        const res = await axios.get('http//localhost:4000/api/posts')
        setPosts(res.data)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleLogin = async () => {
        const res = await axios.get('http//localhost:4000/api/login', {username, password})
        setToken(res.data.token)
    }

    const handleCreatePost = async () => {
        await axios.post('http//localhost:4000/api/posts', {title, content}, {headers: {'Authorization': `Bearer ${token}`}})
        setTitle('')
        setContent('')
        fetchPosts()
    }

    const handleUploadPost = async () => {
        if(!file) {
            return
        }
        const formData = new FormData()
        await axios.post('http//localhost:4000/api/upload', formData, {headers: {'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data'}})
        alert('Uploaded')
    }

    return(
        <main>
            {!token ? (
                <div>
                    <h1>Logowanie</h1>
                    <input placeholder="Nazwa uzytkownika" onChange={(e) => setUsername(e.target.value)} />
                    <input placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={handleLogin}>Zaloguj się</button>
                </div>
            ) : (
                <div>
                    <h1>Panel administratora</h1>
                    <div>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tytuł" />
                        <textarea value={content} onChange={(e) => setContent(e.target.value)}  placeholder="Treść" />
                        <button onClick={handleCreatePost}>Opublikuj</button>
                    </div>
                    <div>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                        <button onClick={handleUploadPost}>Opublikuj zdjęcie</button>
                    </div>

                    <div>
                        <h2>Wpisy:</h2>
                        <ul>
                            {posts.map((post: any) => (
                                <li key={post.id}>
                                    <strong>{post.title}</strong>
                                    <span>{post.content.slice(0, 100)}...</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </main>
    )
}

export default AdminPage