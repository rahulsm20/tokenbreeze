import { Sparklines, SparklinesLine } from "react-sparklines";

const SparklineChart = ({ data = [5, 10, 15, 13], color = "blue" }) => {
  return (
    <Sparklines data={data}>
      <SparklinesLine color={color} style={{ fill: "none" }} />
    </Sparklines>
  );
};

export default SparklineChart;
