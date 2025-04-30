import { useEffect, useState } from "react";
import axios from "axios";

const Articles = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/api/posts");
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleExpand = (postId) => {
    setExpandedPost((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.slice(0, limit) + "...";
  };

  return (
    <main className="w-screen h-screen bg-[#78815E] flex flex-col gap-4">
      {posts.length === 0 ? (
        <p className="text-[#D7D5BE]">Brak wpisów</p>
      ) : (
        posts.map((post) => {
          const isExpanded = expandedPost[post.id];
          const showReadMore = post.content.length > 200;

          return (
            <article
              key={post.id}
              className="w-[85%] bg-[#D7D5BE] rounded-2xl text-center p-4"
            >
              <h2 className="font-sans text-[#3E452A] text-2xl font-bold">
                <strong>{post.title}</strong>
              </h2>
              <p className="font-mono">
                {isExpanded ? post.content : truncateText(post.content, 200)}
              </p>
              <img
                src={`http://localhost:4000/uploads/${post.image}`}
                alt="Obraz"
                className="scale-90 h-48 rounded-lg"
              />
              {showReadMore && (
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="scale-90 text-[#3E452A] underline mt-2"
                >
                  {isExpanded ? "Zwiń" : "Czytaj więcej"}
                </button>
              )}
            </article>
          );
        })
      )}
    </main>
  );
};

export default Articles;
