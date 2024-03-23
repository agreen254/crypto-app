import parse from "html-react-parser";
import { useCoinQuery } from "@/hooks/useCoin";

type Props = {
  response: ReturnType<typeof useCoinQuery>;
};

const CoinDashboardDescriptionPanel = ({ response }: Props) => {
  const { data, isLoading } = response;

  if (isLoading) return <></>;
  if (!data) return <></>;

  const {
    description: { en: desc },
  } = data;

  const formattedDesc = desc.replaceAll("\n", "<br />");

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 w-[600px] p-4 rounded-xl">
      <p>{parse(formattedDesc)}</p>
    </div>
  );
};

export default CoinDashboardDescriptionPanel;
