import { useEffect, useState } from "react";
import axios from 'axios';

const Banners = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:4000/api/posts');
        const filteredPosts = res.data.filter(post => post.category === 'Sztandary');
        setPosts(filteredPosts);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <main className='w-full flex flex-col gap-2'>
            {posts.length === 0 ? (
                <p>Brak wpisów</p>
            ) : (
                posts.map((post) => (
                    <article key={post.id} className='bg-[#D7D5BE] rounded-2xl p-4 text-center'>
                        <h2 className='text-2xl font-bold text-[#3E452A]'>{post.title}</h2>
                        <p className='mt-2'>{post.content}</p>
                        {post.image && (
                            <img
                                src={`http://localhost:4000/uploads/${post.image}`}
                                alt="obrazek posta"
                                className='w-[80%] h-48 object-cover mx-auto mt-4 rounded-lg'
                            />
                        )}
                    </article>
                ))
            )}
        </main>
    );
};

export default Banners;
