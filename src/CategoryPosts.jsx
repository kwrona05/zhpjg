import useFirestoreCollection from "../useFirestoreCollection";
import HeaderBar from "./components/HeaderBar";

const CategoryPosts = ({ category }) => {
  const posts = useFirestoreCollection("posts", "createdAt");
  const filteredPosts = posts.filter((post) => post.category === category);

  return (
    <main className="bg-[#78815E] w-screen min-h-screen flex flex-col">
      {/* Pasek nawigacji */}
      <HeaderBar />

      {/* Lista postów */}
      <div className="flex flex-col items-center gap-8 py-8 px-4 flex-grow">
        {filteredPosts.length === 0 ? (
          <p className="text-[#E5E8DA] italic opacity-80">Brak wpisów</p>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#D7D5BE] w-full max-w-3xl rounded-2xl p-6 shadow-lg transition hover:shadow-xl"
            >
              {/* Tytuł + meta */}
              <div className="mb-3 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-[#3E452A] font-serif">
                  {post.title}
                </h2>
                {post.createdAt && (
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(post.createdAt.toDate()).toLocaleDateString(
                      "pl-PL",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
              </div>

              {/* Treść */}
              <p className="text-[#3E452A] text-justify leading-relaxed">
                {post.content}
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
            </article>
          ))
        )}
      </div>

      {/* Stopka */}
      <footer className="text-white bg-[#3E452A] mt-auto text-center py-4 rounded-t-2xl shadow-inner">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </main>
  );
};

export default CategoryPosts;
