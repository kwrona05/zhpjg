const SearchResults = ({ results }) => {
  if (!results.length) {
    return <p className="text-white text-center mt-4">Brak wyników</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <ul className="space-y-4">
        {results.map((post) => (
          <li
            key={post.id}
            className="bg-white p-4 rounded-lg shadow-md text-gray-800"
          >
            <h2 className="text-xl font-semibold text-[#3E452A]">
              {post.title}
            </h2>
            <p className="text-sm mt-1">{post.content}</p>

            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="mt-3 rounded-md max-h-48 object-cover"
              />
            )}

            {post.createdAt && (
              <p className="text-xs text-gray-500 mt-2">
                {new Date(post.createdAt.seconds * 1000).toLocaleDateString()}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
