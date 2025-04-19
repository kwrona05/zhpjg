// import {useEffect, useState} from "react";
// import axios from 'axios'
//
// const Articles = () => {
//     const [posts, setPosts] = useState([])
//
//     const fetchPosts = async () => {
//         const res = await axios.get('http://localhost:4000/api/posts')
//         setPosts(res.data)
//     }
//
//     useEffect(() => {
//         fetchPosts()
//     }, [])
//
//     return(
//         <main>
//             {posts.length === 0 ? (
//                 <p>Brak wpisów</p>
//             ) : (
//                 posts.map((post) => (
//                     <article key={post.id}>
//                         <h2>{post.title}</h2>
//                         <p>{post.content}</p>
//                         <img src={`http://localhost:4000/uploads/${post.image}`} alt="Obraz"/>
//                     </article>
//                 ))
//             )}
//         </main>
//     )
// }
//
// export default Articles

import { useEffect, useState } from 'react'
import axios from 'axios'

const Posts = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        axios.get('http://localhost:1337/api/posts?populate=*')
            .then(res => {
                console.log("Dane z API:", res.data.data)
                setPosts(res.data.data)
            })
            .catch(err => console.error(err))
    }, [])

    return (
        <div>
            <h1>Posty</h1>
            {posts.map(post => {
                const attributes = post.attributes
                if (!attributes) return null

                return (
                    <div key={post.id}>
                        <h2>{attributes.title}</h2>
                        <p>{attributes.content}</p>
                        {attributes.image?.data && (
                            <img
                                src={`http://localhost:1337${attributes.image.data.attributes.url}`}
                                alt={attributes.title}
                                width="300"
                            />
                        )}
                        <small>Kategoria: {attributes.category?.data?.attributes?.name}</small>
                    </div>
                )
            })}
        </div>
    )
}

export default Posts
