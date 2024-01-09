import { useState, useEffect } from "react";
function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState([]);

  const doSearch = async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    setResults([]);
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${query}`
      );
      if (!response.ok) {
        throw new Error("Computer says no! Try again");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setError(error.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  function handleItemClick(index) {
    setSelectedItem([results[index]]);
  }

  function handleFocus(event) {}
  useEffect(() => {
    const delayMultipleCalls = setTimeout(() => {
      doSearch();
    }, 300);

    return () => clearTimeout(delayMultipleCalls);
  }, [query]);
  function handleChange(event) {
    setQuery(event.target.value);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="bg-gray-100 p-6 rounded-md shadow-md">
        <div className="relative inline-block text-left flex">
          <input
            type="text"
            onChange={handleChange}
            placeholder="Start typing to search"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <div className="absolute mt-12 w-56 bg-white border border-gray-300 rounded-md shadow-lg">
            {loading && <div>Fetching....</div>}
            {error && <div>{error}</div>}
            {results.length > 0 && (
              <ul className="py-2 max-h-72 overflow-y-auto ">
                {results.map((result, index) => (
                  <li
                    key={index}
                    className={`px-4 py-2 text-slate-950 hover:bg-gray-${
                      index === 0 ? "200" : "100"
                    } cursor-pointer ${
                      index === 0 ? "bg-green-500 text-white" : ""
                    }`}
                    onClick={() => handleItemClick(index)}
                    onFocus={handleFocus}
                  >
                    {result.name.common}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedItem.length > 0 && (
            <div className="px-10">
              <p>You clicked on: </p>
              <p>
                {selectedItem.map((item) => (
                  <span key={item.tld[0]}>{item.name.common}</span>
                ))}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
