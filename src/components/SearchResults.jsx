const SearchResults = ({ results }) => {
  if (!results.length) {
    return <p className="text-white text-center mt-4">Brak wyników</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-4">
      <ul className="space-y-2">
        {results.map((post) => (
          <li
            key={post.id}
            className="bg-white p-4 rounded-lg shadow text-gray-800"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
