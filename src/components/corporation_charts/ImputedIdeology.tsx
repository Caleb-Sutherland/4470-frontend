import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Rectangle,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { graph_colors } from "../../graph_colors";
import TileSelectBox from "../TileSelectBox";
import { addCorporationPeriod } from "../../store/actions/corporationActionCreators";
import * as format from "../../helper/formatting";

export default function ImputedIdeology(props: any) {
  const [localPeriod, setLocalPeriod] = useState(props.globalPeriod);

  // Set up dispatch to be able to add local periods
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    // Check if we need to fetch a new period for this corporation
    if (
      localPeriod !== props.globalPeriod &&
      !(localPeriod in corporation[props.corpId].periods)
    ) {
      dispatch(addCorporationPeriod(props.corpId, localPeriod));
    }
  }, [localPeriod]);

  // Access the redux store
  const corporation: Record<number, ICorporation> = useSelector(
    (state: DataState) => state.corporations
  );

  // Ensure that this periods data has been successfully loaded into the redux store
  if (localPeriod in corporation[props.corpId].periods) {
    // Data to feed the graph
    const data = corporation[props.corpId].periods[
      localPeriod
    ].ideologyDistribution.sort(
      (a: IIdeologyScore, b: IIdeologyScore): number => {
        if (a.ideology > b.ideology) {
          return 1;
        }
        if (a.ideology < b.ideology) {
          return -1;
        }
        return 0;
      }
    );

    // Pass through data and convert to a dictionary so that we can quickly see what ideology scores are missing
    const ideologyToValue: any = {};
    for (let i = 0; i < data.length; i++) {
      ideologyToValue[data[i].ideology.toFixed(2)] = data[i].dollars_donated;
    }

    // Fill in any missing ideology scores
    const formattedData = [];
    for (let i = -1; i <= 1.01; i += 0.01) {
      const key = i.toFixed(2);
      if (!(key in ideologyToValue)) {
        formattedData.push({ ideology: key, dollars_donated: 0 });
      } else {
        formattedData.push({
          ideology: key,
          dollars_donated: ideologyToValue[key],
        });
      }
    }

    // Pass through all scores and group them together to smooth out the data
    const smoothed_data = [];
    const group_size = 21; // Must be odd number
    let mid_ideology;
    let average_amount;
    for (let i = 0; i <= formattedData.length - group_size; i++) {
      // Get the group
      const group = [];
      for (let j = i; j < i + group_size; j++) {
        group.push(formattedData[j]);
      }

      // Calculate the midpoint and average amount
      mid_ideology = group[(group_size - 1) / 2].ideology;
      const getAverage = (arr: any) => {
        let sum = 0;
        for (let k = 0; k < arr.length; k++) {
          sum += arr[k].dollars_donated;
        }
        return sum / arr.length;
      };
      average_amount = getAverage(group);

      smoothed_data.push({ideology: mid_ideology, dollars_donated: average_amount});
    }

    // Custom tooltip style for each bar
    const CustomTooltip = ({ active, payload }: any) => {
      if (!active) {
        return null;
      }
      const data = payload[0].payload;

      return (
        <div
          className="bg-other p-4 text-black opacity-90 rounded-2xl"
          style={{ backgroundColor: "#e6f7f4" }}
        >
          <div>
            <span>Ideology: {data.ideology}</span>
          </div>
          <div>
            <span>
              Weighted Value: {format.formatNumber(data.dollars_donated)}
            </span>
          </div>
        </div>
      );
    };

    return (
      <div className="h-full w-full">
        <div className="w-full grid grid-cols-12 mb-3">
          <span className="col-start-1 col-end-6 flex justify-center">
            Imputed Ideology
          </span>
          <div className="col-start-10 col-end-13 flex justify-center">
            <TileSelectBox
              onChange={setLocalPeriod}
              periods={["2017-2018", "2019-2020", "2021-2022"]}
              defaultValue={localPeriod}
            />
          </div>
        </div>
        <ResponsiveContainer width="100%">
          <LineChart
            width={730}
            height={250}
            data={smoothed_data}
            margin={{ top: 5, right: 25, left: 25, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ideology" ticks={[-1, 0, 1]} />
            <YAxis dataKey="dollars_donated" />
            <Tooltip content={CustomTooltip} />
            <Line
              type="monotone"
              dataKey="dollars_donated"
              stroke="#8884d8"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  } else {
    return (
      <div className="h-full w-full">
        <div className="w-full grid grid-cols-12 mb-3">
          <span className="col-start-1 col-end-6 flex justify-center">
            Imputed Ideology
          </span>
          <div className="col-start-10 col-end-13 flex justify-center">
            <TileSelectBox
              onChange={setLocalPeriod}
              periods={["2017-2018", "2019-2020", "2021-2022"]}
              defaultValue={localPeriod}
            />
          </div>
        </div>
      </div>
    );
  }
}