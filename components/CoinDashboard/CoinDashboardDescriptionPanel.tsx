import { cn } from "@/utils/cn";
import parse from "html-react-parser";
import { useCoinQuery } from "@/hooks/useCoin";
import { useEffect, useRef, useState } from "react";

type Props = {
  response: ReturnType<typeof useCoinQuery>;
};

const CoinDashboardDescriptionPanel = ({ response }: Props) => {
  const { data, isLoading } = response;

  const [isClamped, setIsClamped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // determine if the text is being cut off in the first place
  // not all descriptions will be long enough to do so
  const expansionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (expansionRef && expansionRef.current) {
      setIsClamped(
        expansionRef.current.scrollHeight > expansionRef.current.clientHeight
      );
    }
  }, [response, isExpanded]);

  if (isLoading) return <></>;
  if (!data) return <></>;

  const {
    description: { en: description },
  } = data;

  const formattedDesc = description.replaceAll("\n", "<br />");
  const shouldShowButton = isClamped || isExpanded;

  if (description === "") {
    return (
      <div className="w-[700px]">
        <p className="text-muted-foreground italic">No description provided.</p>
      </div>
    );
  }
  return (
    <div>
      <div
        ref={expansionRef}
        className={cn(
          "overflow-hidden w-[700px]",
          isExpanded ? "max-h-[1200px]" : "max-h-[250px]"
        )}
      >
        <p
          style={{
            maskImage: isExpanded
              ? ""
              : "linear-gradient(to bottom, rgba(0,0,0,1) 175px, transparent 250px)",
          }}
        >
          {parse(formattedDesc)}
        </p>
      </div>
      {shouldShowButton &&
        (isExpanded ? (
          <button
            className="block text-menu-highlight/60 hover:underline hover:underline-offset-4"
            onClick={() => setIsExpanded(false)}
          >
            Read Less
          </button>
        ) : (
          <button
            className="block text-menu-highlight/60 hover:underline hover:underline-offset-4 -mt-2"
            onClick={() => setIsExpanded(true)}
          >
            Read More
          </button>
        ))}
    </div>
  );
};

export default CoinDashboardDescriptionPanel;
