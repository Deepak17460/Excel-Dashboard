import React, { useEffect, useState } from "react";
import SuggestionList from "./SuggestionList";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useCallback } from "react";
import useDebounce from "../../hooks/useDebounce";
import InputField from "./InputField";
import { useDispatch, useSelector } from "react-redux";
import { updateSearchKey } from "../../redux/searchSlice";

const SearchBar = ({ fetchSuggestions }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref = useClickOutside(() => setShowSuggestions(false));

  const dispatch = useDispatch();

  const { key: searchKey } = useSelector((state) => state.searchData);

  useEffect(() => {
    setValue(searchKey);
  }, [searchKey]);

  const getSuggestions = async (key) => {
    setSuggestions(await fetchSuggestions(key));
  };

  const debouncedGetSuggestions = useCallback(
    useDebounce(getSuggestions, 300),
    []
  );

  async function handleOnChange(e) {
    const key = e.target.value;
    setValue(key);
    dispatch(updateSearchKey(key));
    if (key === "") return;
    debouncedGetSuggestions(key);
  }

  function handleSearchInputClear(e) {
    setValue("");
    dispatch(updateSearchKey(""));
  }

  return (
    <div className="m-4 relative inline-block" ref={ref}>
      <InputField
        value={value}
        handleOnChange={handleOnChange}
        handleSearchInputClear={handleSearchInputClear}
      />

      {/* {suggestions.length > 0 && (
        <SuggestionList
          suggestions={suggestions}
          query={value}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
        />
      )} */}
    </div>
  );
};

export default SearchBar;
