import { Sparklines, SparklinesLine } from "react-sparklines";

const SparklineChart = ({ data = [5, 10, 15, 13], color = "red" }) => {
  return (
    <Sparklines data={data}>
      <SparklinesLine color={color} />
    </Sparklines>
  );
};

export default SparklineChart;
