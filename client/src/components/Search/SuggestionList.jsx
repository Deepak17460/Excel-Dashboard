import React, { useEffect } from "react";

const SuggestionList = ({
  suggestions,
  query = '',
  showSuggestions,
  setShowSuggestions,
}) => {
  useEffect(() => {
    if (query.length > 0) setShowSuggestions(true);
    else setShowSuggestions(false);
  }, [query]);

  function renderFilename(str) {
    const words = str.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {words.map((part, index) => {
          return part.toLowerCase() === query.toLowerCase() ? (
            <b key={index}>{part}</b>
          ) : (
            part
          );
        })}
      </span>
    );
  }

  return (
    <div className={`absolute z-10 bg-white w-full ${!showSuggestions && "hidden"}`}>
      {suggestions.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => alert("works")}
            className="flex border rounded-lg"
          >
            <ul className="bg-white rounded-lg text-gray-900">
              <li className="px-6 py-2 border-b border-gray-200 w-full rounded-t-lg">
                {renderFilename(item.filename)}
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestionList;
