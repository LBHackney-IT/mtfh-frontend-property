import { SyntheticEvent, useState } from "react";

import { useSearchResults } from "@mtfh/search";

export const useSearchForBoilerHouse = (resetSelectBoilerHouseForm: () => void) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryError, setSearchQueryError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const { fetchResults, total, searchResultsData, loading, error } = useSearchResults([
    "BoilerHouse",
  ]);

  const handleSearch = (e: SyntheticEvent) => {
    e.preventDefault();

    if (loading) return;

    resetSelectBoilerHouseForm();

    if (!validate()) return;

    clearErrors();
    setTouched(true);

    fetchResults(searchQuery);
  };

  const validate = () => {
    if (searchQuery === "" || searchQuery.length < 2) {
      setSearchQueryError("Search text must be at least 2 characters");
      return false;
    }

    return true;
  };

  const clearErrors = () => {
    setSearchQueryError(null);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchQueryError,
    handleSearch,
    touched,
    error,
    loading,
    total,
    searchResultsData,
  };
};
