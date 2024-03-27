"use client";

import { ChangeEvent, KeyboardEvent } from "react";
import type { SearchResultWrapper } from "@/utils/types";

import { useRouter } from "next/navigation";
import { useDropdownStore, useDropdownReset } from "@/hooks/useDropdownStore";
import { useSearchQueryActions, useSearchQuery } from "@/hooks/useSearch";

interface SearchActivatorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  searchResults: SearchResultWrapper[];
  localQuery?: string;
  setLocalQuery?: (q: string) => void;
}

const SearchActivator = ({
  searchResults,
  localQuery,
  setLocalQuery,
  ...props
}: SearchActivatorProps) => {
  const router = useRouter();

  const navQuery = useSearchQuery();
  const navSetQuery = useSearchQueryActions().setQuery;

  const isUsingLocal = localQuery !== undefined && setLocalQuery !== undefined;
  const [query, setQuery] = isUsingLocal
    ? [localQuery, setLocalQuery]
    : [navQuery, navSetQuery];

  const { setIsUsingMouse, setIsVisible, selectedIndex, setSelectedIndex } =
    useDropdownStore((state) => state);

  const resetMenu = useDropdownReset();
  const resetBarAndMenu = () => {
    setQuery("");
    resetMenu();
  };

  const handleSearchKeyEvents = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      // stop the default event of jumping to the front/back of input text
      e.preventDefault();
      setIsUsingMouse(false);
      setSelectedIndex(
        selectedIndex > 0 ? selectedIndex - 1 : searchResults.length - 1
      );
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsUsingMouse(false);
      setSelectedIndex(
        selectedIndex < searchResults.length - 1 ? selectedIndex + 1 : 0
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      // if there are no results nothing will happen,
      // otherwise if user hits enter with nothing selected then default to the first result
      if (searchResults.length > 0) {
        router.push(
          selectedIndex === -1
            ? `/coin/${searchResults[0].id}`
            : `/coin/${searchResults[selectedIndex].id}`
        );
        resetBarAndMenu();
      }
    }

    if (e.key === "Escape") {
      e.preventDefault();
      resetBarAndMenu();
    }
  };

  const handleUpdateQuery = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
    if (e.currentTarget.value !== "") {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  return (
    <input
      type="search"
      placeholder={props.disabled ? "" : "Search Coins"}
      value={props.value || query}
      onChange={(e) => handleUpdateQuery(e)}
      onKeyDown={(e) => handleSearchKeyEvents(e)}
      {...props}
    />
  );
};

export default SearchActivator;
