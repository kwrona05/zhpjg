import { useEffect, useState } from "react";
import axios from "axios";
import HeaderBar from "./HeaderBar";

const HistoricComission = () => {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/api/posts");
    const filteredPosts = res.data.filter(
      (post) => post.category === "Komisja Historyczna"
    );
    setPosts(filteredPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="bg-[#78815E] w-screen h-screen flex flex-col gap-4">
      <HeaderBar />
      {posts.length === 0 ? (
        <p className="text-[#D7D5BE]">Brak wpisów</p>
      ) : (
        posts.map((post) => (
          <article
            key={post.id}
            className="bg-[#D7D5BE] w-[80%] rounded-2xl p-4 text-center"
          >
            <h2 className="text-2xl font-bold text-[#3E452A]">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:4000/uploads/${post.image}`}
                alt="obrazek posta"
                className="scale-90 h-48 object-cover mx-auto mt-4 rounded-lg"
              />
            )}
          </article>
        ))
      )}
      <footer className="text-white mt-auto">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </main>
  );
};

export default HistoricComission;
