import parse from "html-react-parser";
import { useCoinQuery } from "@/hooks/useCoin";

type Props = {
  response: ReturnType<typeof useCoinQuery>;
};

const CollapsedDescription = ({ description }: { description: string }) => {
  return (
    <>
      <p>{parse(description)}...</p>
      <button className="text-menu-highlight/70 underline mt-1 block">
        Read More
      </button>
    </>
  );
};

const ExpandedDescription = ({ description }: { description: string }) => {
  return (
    <>
      <p>{parse(description)}...</p>
      <button className="text-menu-highlight/70 underline mt-1 block">
        Read Less
      </button>
    </>
  );
};

const CoinDashboardDescriptionPanel = ({ response }: Props) => {
  const { data, isLoading } = response;

  if (isLoading) return <></>;
  if (!data) return <></>;

  const {
    description: { en: desc },
  } = data;

  const shortenThreshold = 700; // characters
  const formattedDesc = desc.replaceAll("\n", "<br />");

  const shortenedDesc =
    formattedDesc.length > shortenThreshold
      ? formattedDesc.slice(0, shortenThreshold)
      : formattedDesc;

  const handleDescriptionDisplay = () => {
    return desc.length < 700 ? (
      <CollapsedDescription description={shortenedDesc} />
    ) : (
      <ExpandedDescription description={formattedDesc} />
    );
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 w-[600px] p-4 rounded-xl">
      {handleDescriptionDisplay()}
    </div>
  );
};

export default CoinDashboardDescriptionPanel;
