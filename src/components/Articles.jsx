import { useState } from "react";
import useFirestoreCollection from "../../useFirestoreCollection";

const Articles = () => {
  const [expandedPost, setExpandedPost] = useState({});
  const posts = useFirestoreCollection("posts", "createdAt");

  const toggleExpand = (postId) => {
    setExpandedPost((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const truncateText = (text, limit) => {
    if (!text) return "";
    return text.length <= limit ? text : text.slice(0, limit) + "...";
  };

  return (
    <main className="w-full flex flex-col items-center gap-8 py-8">
      {posts.length === 0 ? (
        <p className="text-[#3E452A] italic opacity-80">Brak wpisów</p>
      ) : (
        posts.map((post) => {
          const isExpanded = expandedPost[post.id];
          const showReadMore = post.content?.length > 200;

          return (
            <article
              key={post.id}
              className="w-full max-w-3xl bg-[#D7D5BE] rounded-2xl p-6 shadow-lg transition hover:shadow-xl"
            >
              {/* Tytuł */}
              <h2 className="font-serif text-[#3E452A] text-2xl md:text-3xl font-bold mb-3 text-center">
                {post.title}
              </h2>

              {/* Treść */}
              <p className="font-sans text-[#3E452A] leading-relaxed text-justify">
                {isExpanded ? post.content : truncateText(post.content, 200)}
              </p>

              {/* Zdjęcia */}
              {post.images && post.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {post.images.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt={`${post.title}-${idx}`}
                      className="h-48 w-full object-cover rounded-xl shadow-md"
                    />
                  ))}
                </div>
              ) : (
                post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-56 w-full object-cover rounded-xl shadow-md mt-4"
                  />
                )
              )}

              {/* Czytaj więcej */}
              {showReadMore && (
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="mt-4 text-sm font-semibold text-[#3E452A] underline hover:text-[#2a311f] transition"
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
