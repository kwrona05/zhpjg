import {useEffect, useState} from "react";
import axios from 'axios'

const Articles = () => {
    const [posts, setPosts] = useState([])

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4000/api/posts')
        setPosts(res.data)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    return(
        <main>
            {posts.length === 0 ? (
                <p>Brak wpisów</p>
            ) : (
                posts.map((post) => (
                    <article key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <img src={`http://localhost:4000/uploads/${post.image}`} alt="Obraz"/>
                        <button onClick={() => console.log(post.image)}>Click</button>
                    </article>
                ))
            )}
        </main>
    )
}

export default Articles