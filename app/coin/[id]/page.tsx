import CoinDashboard from "@/components/CoinDashboard/CoinDashboard";

type Props = {
  params: {
    id: string;
  };
};

const CoinPage = ({ params: { id } }: Props) => {
  return <CoinDashboard id={id} />;
};

export default CoinPage;
