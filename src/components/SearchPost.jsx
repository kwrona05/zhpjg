import { useState } from "react";
import useFirestoreCollection from "../../useFirestoreCollection";

const SearchPost = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const posts = useFirestoreCollection("posts", "createdAt"); // pobiera wszystkie

  const searchPosts = () => {
    if (!query.trim()) {
      onResults(posts); // jeśli puste, zwracamy całość
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = posts.filter(
      (post) =>
        post.title?.toLowerCase().includes(lowerQuery) ||
        post.content?.toLowerCase().includes(lowerQuery)
    );
    onResults(filtered);
  };

  return (
    <div className="flex flex-col gap-2 max-w-xl w-full">
      <input
        type="text"
        placeholder="Czego szukasz?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 rounded-md"
      />
      <button
        onClick={searchPosts}
        className="bg-[#3E452A] text-white px-4 py-2 rounded-md"
      >
        Szukaj
      </button>
    </div>
  );
};

export default SearchPost;
