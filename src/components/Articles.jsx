import { useState } from "react";
import { collection, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import useFirestoreCollection from "../../useFirestoreCollection";

const Articles = () => {
  const [expandedPost, setExpandedPost] = useState({});
  const posts = useFirestoreCollection("posts", "createdAt"); // 🔥 Twój hook już ogarnia sortowanie

  const toggleExpand = (postId) => {
    setExpandedPost((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length <= limit ? text : text.slice(0, limit) + "...";
  };

  return (
    <main className="w-screen min-h-screen bg-[#78815E] flex flex-col items-center gap-6 py-6">
      {posts.length === 0 ? (
        <p className="text-[#D7D5BE]">Brak wpisów</p>
      ) : (
        posts.map((post) => {
          const isExpanded = expandedPost[post.id];
          const showReadMore = post.content?.length > 200;

          return (
            <article
              key={post.id}
              className="w-[85%] bg-[#D7D5BE] rounded-2xl text-center p-4 shadow-md"
            >
              <h2 className="font-sans text-[#3E452A] text-2xl font-bold mb-2">
                {post.title}
              </h2>
              <p className="font-mono text-[#3E452A]">
                {isExpanded ? post.content : truncateText(post.content, 200)}
              </p>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="scale-90 h-48 rounded-lg object-cover mx-auto mt-3"
                />
              )}
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
