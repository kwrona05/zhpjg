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
        <main className='w-full flex flex-col gap-2'>
            {posts.length === 0 ? (
                <p className='text-[#D7D5BE]'>Brak wpisów</p>
            ) : (
                posts.map((post) => (
                    <article key={post.id} className='w-[85%] bg-[#D7D5BE] rounded-2xl text-center'>
                        <h2 className='font-sans text-[#3E452A] text-2xl font-bold'><strong>{post.title}</strong></h2>
                        <p className='font-mono'>{post.content}</p>
                        <img src={`http://localhost:4000/uploads/${post.image}`} alt="Obraz" className='scale-90 w-80% h-48' />
                    </article>
                ))
            )}
        </main>
    )
}

export default Articles