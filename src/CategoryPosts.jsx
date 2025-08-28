import useFirestoreCollection from "../useFirestoreCollection";
import HeaderBar from "./components/HeaderBar";

const CategoryPosts = ({ category }) => {
  const posts = useFirestoreCollection("posts", "createdAt");
  const filteredPosts = posts.filter((post) => post.category === category);

  return (
    <main className="bg-[#78815E] w-screen min-h-screen flex flex-col gap-4">
      <HeaderBar />
      {filteredPosts.length === 0 ? (
        <p className="text-[#D7D5BE]">Brak wpisów</p>
      ) : (
        filteredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-[#D7D5BE] w-[80%] rounded-2xl p-4 text-center shadow-md mx-auto"
          >
            <h2 className="text-2xl font-bold text-[#3E452A]">{post.title}</h2>
            <p className="mt-2 text-[#3E452A]">{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="scale-90 h-48 object-cover mx-auto mt-4 rounded-lg"
              />
            )}
          </article>
        ))
      )}
      <footer className="text-white mt-auto text-center py-4">
        &copy; {new Date().getFullYear()} AIMEXA | Wszystkie prawa zastrzeżone
      </footer>
    </main>
  );
};

export default CategoryPosts;
