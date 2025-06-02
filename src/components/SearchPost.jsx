import { useState } from "react";

const SearchPost = ({ onResults }) => {
  const [query, setQuery] = useState("");

  const API_URL =
    "https://hib2xshxpi7aict3l2hqlbqcx40bmwnh.lambda-url.us-east-1.on.aws";

  const searchPosts = async () => {
    const res = await fetch(
      `${API_URL}/api/posts?search=${encodeURIComponent(query)}`
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("Błąd HTTP:", res.status, text);
      return;
    }
    const data = await res.json();
    onResults(data); // przekaż wyniki do komponentu nadrzędnego
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
