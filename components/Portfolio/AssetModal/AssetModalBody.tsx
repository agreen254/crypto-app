import type { Currency } from "@/utils/types";

import { cn } from "@/utils/cn";
import { coinNameFromId } from "@/utils/coinNameFromId";
import { currencyDropdownId, searchDropdownId } from "./AssetModalWrapper";
import { currencyEntries, currencyMap } from "@/utils/maps";
import { flatMarketRes } from "@/utils/flatMarketRes";
import { getSearchTargets, getSearchResults } from "@/utils/getSearchElements";
import { useClickAway } from "@uidotdev/usehooks";
import {
  useDropdownResetFromId,
  useDropdownSettersFromId,
  useDropdownUnitFromId,
} from "@/hooks/useDropdownStore";
import { useForwardRef } from "@/hooks/useForwardRef";
import { useMarketQuery } from "@/hooks/useMarketQuery";
import { useModalListener } from "@/hooks/useModalListener";
import {
  useRef,
  forwardRef,
  type ForwardedRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useState } from "react";
import { validateAsset } from "@/hooks/useAssetsStore";

import AssetModalCoinSearch from "./Separators/AssetModalCoinSearch";
import AssetModalCurrency from "./Separators/AssetModalCurrency";
import AssetModalDate from "./Separators/AssetModalDate";
import { ChevronDown as ChevronDownIcon } from "lucide-react";
import CloseIcon from "@/Icons/Close";
import DropdownMenu from "@/components/Dropdown/DropdownMenu";
import DropdownMenuItem from "@/components/Dropdown/DropdownMenuItem";
import {
  HandleNameMatch,
  HandleSymbolMatch,
} from "@/components/Search/SearchResultsHelpers";
import Image from "next/image";
import SearchActivator from "@/components/Search/SearchActivator";
import { X as XIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

/**
 * This modal allows users to add [__TODO__: or edit] assets. It is designed to be keyboard-friendly
 * and uses refs to keep track of focus states.
 *
 * Assets follow the asset schema defined in the validation folder.
 * This component contains state to manage input of the necessary fields.
 *
 * The dropdown menus have a context to store each state based on unique IDs defined in the wrapper component.
 *
 * __TODO__: allow passing of stored assets into the modal for editing. Only keep one modal component in the DOM and
 * inject data as needed. Do not have separate modal instances for individual assets in the portfolio.
 */
const AssetModalBody = (
  { isOpen, setIsOpen }: Props,
  activatorRef: ForwardedRef<HTMLButtonElement>
) => {
  // form state initializers
  const [coinId, setCoinId] = useState<string>("");
  const [coinQuery, setCoinQuery] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [valueCurrency, setValueCurrency] = useState<Currency>("usd");

  // search component initializers
  const market = useMarketQuery("usd", "market_cap", "desc");
  const searchTargets = getSearchTargets(market.data?.pages);
  const searchResults = searchTargets
    ? getSearchResults(searchTargets, coinQuery)
    : [];

  const coinInfo = flatMarketRes(market.data?.pages)?.find(
    (coin) => coin.id === coinId
  );
  const coinImageUrl = coinInfo?.image || "";
  const coinSymbol = coinInfo?.symbol || "";

  // refs
  const coinInputRef = useRef<HTMLInputElement>(null);
  const coinDropdownRef = useRef<HTMLDivElement>(null);
  const currencyButtonRef = useRef<HTMLButtonElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const clickAwaySearchRef: React.MutableRefObject<HTMLDivElement> =
    useClickAway(() => {
      resetSearch();
      setCoinQuery(coinNameFromId(coinId, searchTargets));
    });
  const clickAwayCurrencyRef: React.MutableRefObject<HTMLDivElement> =
    useClickAway(() => {
      resetCurrency();
    });
  const forwardedActivatorRef = useForwardRef(activatorRef);

  // dropdown handlers and state for the search input
  const {
    setIsUsingMouse: setIsUsingMouseSearch,
    setSelectedIndex: setSelectedIndexSearch,
  } = useDropdownSettersFromId(searchDropdownId);
  const { isVisible: isVisibleSearch, selectedIndex: selectedIndexSearch } =
    useDropdownUnitFromId(searchDropdownId);
  const resetSearch = useDropdownResetFromId(searchDropdownId);

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault();
        setIsUsingMouseSearch(false);
        setSelectedIndexSearch(
          selectedIndexSearch > 0
            ? selectedIndexSearch - 1
            : searchResults.length - 1
        );
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setIsUsingMouseSearch(false);
        setSelectedIndexSearch(
          selectedIndexSearch < searchResults.length - 1
            ? selectedIndexSearch + 1
            : 0
        );
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (!isVisibleSearch) {
          handleAddAsset();
          break;
        }
        // if there are no results nothing will happen,
        // otherwise if user hits enter with nothing selected then default to the first result
        if (
          searchResults.length > 0 &&
          searchResults.length > selectedIndexSearch
        ) {
          const id =
            selectedIndexSearch === -1
              ? searchResults[0].id
              : searchResults[selectedIndexSearch].id;
          setCoinQuery(coinNameFromId(id, searchTargets));
          setCoinId(id);
        }
        resetSearch();
        break;
      }
      case "Escape": {
        setCoinId("");
        setCoinQuery("");
        resetSearch();
        break;
      }
      case "Tab": {
        if (isVisibleSearch) {
          e.preventDefault();
          break;
        }
      }
    }
  };

  // dropdown handlers and state for the currency input
  const {
    setIsUsingMouse: setIsUsingMouseCurrency,
    setIsVisible: setIsVisibleCurrency,
    setSelectedIndex: setSelectedIndexCurrency,
  } = useDropdownSettersFromId(currencyDropdownId);
  const { isVisible: isVisibleCurrency, selectedIndex: selectedIndexCurrency } =
    useDropdownUnitFromId(currencyDropdownId);
  const resetCurrency = useDropdownResetFromId(currencyDropdownId);

  const currencyName =
    selectedIndexCurrency === -1
      ? "usd"
      : currencyEntries[selectedIndexCurrency][0];

  const handleKeyDownCurrencyInput = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      (e.key >= "0" && e.key <= "9") ||
      ["Tab", "Backspace", "Escape", "."].includes(e.key)
    )
      return;
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAsset();
    }
    e.preventDefault();
  };

  const handleKeyDownCurrencyMenu = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault();
        setIsUsingMouseCurrency(false);
        setSelectedIndexCurrency(
          selectedIndexCurrency <= 0
            ? currencyEntries.length - 1
            : selectedIndexCurrency - 1
        );
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setIsUsingMouseCurrency(false);
        setSelectedIndexCurrency(
          selectedIndexCurrency === currencyEntries.length - 1
            ? 0
            : selectedIndexCurrency + 1
        );
        break;
      }
      case "Escape": {
        resetCurrency();
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (selectedIndexCurrency >= 0) {
          setValueCurrency(currencyName);
        }
        setIsVisibleCurrency(!isVisibleCurrency);
        setSelectedIndexCurrency(-1);
        break;
      }
      case "Tab": {
        if (isVisibleCurrency) {
          e.preventDefault();
          break;
        }
      }
    }
  };

  const handleModalExit = () => {
    setIsOpen(false);
    setCoinId("");
    setCoinQuery("");
    setValue("");
    setDate("");
    forwardedActivatorRef.current?.focus();
  };

  useModalListener(modalRef, coinInputRef, isOpen, handleModalExit, [
    coinDropdownRef,
    currencyDropdownRef,
  ]);

  const handleAddAsset = () => {
    const isValid = validateAsset({
      coinId: coinId,
      date: new Date(date),
      value: parseFloat(value || "0"),
      valueCurrency: valueCurrency,
    });
    if (isValid) {
      handleModalExit();
      forwardedActivatorRef.current?.focus();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      ref={modalRef}
      className={cn(
        "h-full w-full hidden justify-center items-center fixed top-0 left-0 backdrop-blur-md z-10",
        isOpen && "flex"
      )}
    >
      <div className="w-[886px] min-h-[400px] p-12 rounded-xl bg-zinc-900/70 border border-zinc-800">
        <div className="flex justify-between">
          <h2 className="text-xl ml-1">Select Coin</h2>
          <label htmlFor="closeModal" className="sr-only">
            Close Modal
          </label>
          <button
            id="closeModal"
            className="p-2 rounded-full"
            onClick={handleModalExit}
          >
            <CloseIcon className="w-6 h-6 hover:scale-110 transition-transform" />
          </button>
        </div>
        <div className="flex justify-between gap-8 mt-8">
          <div className="w-[297px] h-[241px] flex justify-center items-center rounded-lg bg-zinc-800/60">
            {coinId && (
              <div>
                <Image
                  src={coinImageUrl}
                  alt="coin logo"
                  width={80}
                  height={80}
                />
                <p className="text-center text-lg font-semibold text-muted-foreground uppercase mt-2">
                  {coinSymbol}
                </p>
              </div>
            )}
          </div>
          <div className="w-[460px] flex flex-col gap-y-4">
            <AssetModalCoinSearch
              ref={clickAwaySearchRef}
              className="w-full relative"
            >
              <XIcon
                className={cn(
                  "absolute right-[12px] top-[12px] w-[18px] h-[18px]",
                  !coinQuery && "hidden"
                )}
                onClick={() => {
                  resetSearch();
                  setCoinId("");
                  setCoinQuery("");
                }}
                strokeWidth={2}
              />
              <label htmlFor="coinSearch" className="sr-only">
                search coins to declare asset
              </label>
              <SearchActivator
                ref={coinInputRef}
                id="coinSearch"
                type="text"
                dropdownId={searchDropdownId}
                autoComplete="off"
                spellCheck="false"
                disabled={!searchTargets}
                searchResults={searchResults}
                className="h-11 w-full p-2 rounded-lg bg-zinc-800/60"
                localQuery={coinQuery}
                setLocalQuery={setCoinQuery}
                onKeyDown={(e) => handleKeyDownSearch(e)}
              />
              <DropdownMenu
                ref={coinDropdownRef}
                dropdownId={searchDropdownId}
                key="searchResults"
                className="w-[460px] max-h-[320px] overflow-y-auto bg-dropdown border border-stone-300 overscroll-contain font-normal rounded-md text-zinc-200 absolute top-[52px] z-10"
              >
                {searchResults.map((wrapper, idx) => (
                  <DropdownMenuItem
                    dropdownId="portfolioSearch"
                    index={idx}
                    key={wrapper.result.target + "searchResult"}
                  >
                    <button
                      tabIndex={-1}
                      className={cn(
                        "indent-3 py-1 block w-full text-start",
                        idx === selectedIndexSearch && "bg-zinc-600"
                      )}
                      onClick={() => {
                        setCoinId(wrapper.id);
                        setCoinQuery(
                          wrapper.kind === "symbol"
                            ? wrapper.otherText
                            : wrapper.result.target
                        );
                        resetSearch();
                      }}
                      onMouseEnter={() => {
                        setIsUsingMouseSearch(true);
                        setSelectedIndexSearch(idx);
                      }}
                    >
                      {wrapper.kind === "symbol"
                        ? HandleSymbolMatch(wrapper)
                        : HandleNameMatch(wrapper)}
                    </button>
                  </DropdownMenuItem>
                ))}
                {searchResults.length === 0 && (
                  <p className="italic text-muted-foreground font-medium py-1 indent-3">
                    No results found.
                  </p>
                )}
              </DropdownMenu>
            </AssetModalCoinSearch>
            <AssetModalCurrency
              className="w-full relative flex gap-x-2 justify-between"
              ref={clickAwayCurrencyRef}
            >
              <span
                className={cn(
                  "absolute text-muted-foreground left-2 top-[10px]",
                  value && "text-inherit"
                )}
              >
                {currencyMap.get(valueCurrency)}
              </span>
              <label htmlFor="amount" className="sr-only">
                Enter amount purchased
              </label>
              <input
                type="text"
                id="amount"
                placeholder="0"
                autoComplete="off"
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                onKeyDown={(e) => handleKeyDownCurrencyInput(e)}
                className="h-11 w-full pl-5 rounded-lg bg-zinc-800/60"
              />
              <label htmlFor="assetCurrency" className="sr-only">
                select purchase currency
              </label>
              <button
                id="assetCurrency"
                ref={currencyButtonRef}
                className={cn(
                  "py-2 pr-2 pl-3 min-w-[5rem] rounded-lg bg-zinc-800/60",
                  isVisibleCurrency && "border-2 border-muted-foreground"
                )}
                onKeyDown={(e) => handleKeyDownCurrencyMenu(e)}
                onClick={() => setIsVisibleCurrency(!isVisibleCurrency)}
              >
                <span>{valueCurrency.toUpperCase()}</span>
                <span>
                  <ChevronDownIcon
                    className={cn(
                      "w-4 h-4 ml-1 inline transition-transform",
                      isVisibleCurrency && "rotate-180"
                    )}
                  />
                </span>
              </button>
              <DropdownMenu
                dropdownId={currencyDropdownId}
                ref={currencyDropdownRef}
                key="addCurrency"
                className="absolute w-[5rem] top-[52px] right-0 rounded-md bg-dropdown border border-stone-300"
              >
                {currencyEntries.map((entry, idx) => (
                  <DropdownMenuItem
                    dropdownId={currencyDropdownId}
                    key={entry[0] + "asset"}
                    index={idx}
                    className={cn(
                      selectedIndexCurrency === idx &&
                        "bg-zinc-600 first:rounded-t-md last:rounded-b-md"
                    )}
                  >
                    <button
                      className="w-full text-center py-1 block"
                      tabIndex={-1}
                      onMouseEnter={() => setSelectedIndexCurrency(idx)}
                      onClick={() => {
                        setValueCurrency(currencyName);
                        resetCurrency();
                      }}
                    >
                      <span className="font-semibold mr-2 ">{entry[1]}</span>
                      <span>{entry[0].toUpperCase()}</span>
                    </button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenu>
            </AssetModalCurrency>
            <AssetModalDate>
              <label htmlFor="date" className="sr-only">
                select date of asset purchase
              </label>
              <input
                type="date"
                id="date"
                className={cn(
                  "h-11 w-full pl-2 pr-3 rounded-lg bg-zinc-800/60",
                  date === "" && "text-muted-foreground"
                )}
                placeholder="Purchase date"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAsset();
                  }
                }}
                onChange={(e) => {
                  setDate(e.currentTarget.value);
                }}
                value={date}
              />
            </AssetModalDate>
            <div className="flex justify-between gap-x-4 mt-4 text-center">
              <button
                className="w-1/2 rounded-md bg-zinc-800/60 h-[45px] hover:bg-zinc-700/80 transition-colors"
                onClick={handleModalExit}
              >
                Cancel
              </button>
              <button
                className="w-1/2 rounded-md bg-teal-900 shadow-[0_-1px_0_1px] shadow-zinc-600/80 hover:bg-teal-700 transition-colors"
                onClick={() => {
                  handleAddAsset();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAsset();
                  }
                }}
              >
                Add Asset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(AssetModalBody);
