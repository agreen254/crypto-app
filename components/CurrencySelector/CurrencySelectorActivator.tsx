import { KeyboardEvent } from "react";

import { cn } from "@/utils/cn";
import { currencyMap } from "@/utils/maps";
import {
  useUserCurrencySetting,
  useUserSetCurrency as setCurrency,
} from "@/hooks/useUserSettings";

import { ChevronDown as ChevronIcon } from "lucide-react";
import CoinsIcon from "@/Icons/Coins";
import {
  useDropdownResetFromId,
  useDropdownSettersFromId,
  useDropdownUnitFromId,
} from "@/hooks/useDropdownStore";

type Props = {
  dropdownId: string;
};

const CurrencySelectorActivator = ({ dropdownId }: Props) => {
  const currency = useUserCurrencySetting();
  const currencyEntries = Array.from(currencyMap.entries());

  const { isVisible, selectedIndex } = useDropdownUnitFromId(dropdownId);
  const { setIsVisible, setSelectedIndex } =
    useDropdownSettersFromId(dropdownId);
  const reset = useDropdownResetFromId(dropdownId);

  const handleCurrencyKeyEvents = (e: KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowUp": {
        e.preventDefault();
        setSelectedIndex(
          selectedIndex <= 0 ? currencyEntries.length - 1 : selectedIndex - 1
        );
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        setSelectedIndex(
          selectedIndex === currencyEntries.length - 1 ? 0 : selectedIndex + 1
        );
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (isVisible) setCurrency(currencyEntries[selectedIndex][0]);
        setIsVisible(!isVisible);
        break;
      }
      case "Escape": {
        reset();
        break;
      }
    }
  };

  return (
    <button
      className="h-[42px] w-[108px] rounded-md flex justify-evenly items-center dark:bg-white/10 focus:outline-none focus:ring-[1px] focus:ring-black/50 dark:focus:ring-white/50 shadow-top shadow-zinc-500/60 disabled:cursor-not-allowed"
      onClick={() => {
        setIsVisible(!isVisible);
      }}
      onKeyDown={(e) => handleCurrencyKeyEvents(e)}
    >
      <CoinsIcon className="w-6 h-6 ml-2 inline fill-default" />
      {currency.toUpperCase()}
      <ChevronIcon
        className={cn(
          "w-4 h-4 mr-2 inline transition-all",
          isVisible && "rotate-180"
        )}
      />
    </button>
  );
};

export default CurrencySelectorActivator;
