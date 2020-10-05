import React, { useState, useEffect } from "react";
import "./LineGraph.css";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  toolTips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (toolTipItem, data) {
        return numeral(toolTipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          toolTipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          //Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const casesTypeColors = {
  cases: {
    border: "#00c2c2",
    background: "rgba(0, 204, 255,0.5)",
  },
  recovered: {
    border: "#009608",
    background: "rgba(0, 204, 0, 0.5)",
  },
  deaths: {
    border: "#CC1034",
    background: "rgba(204,16,52,0.5)",
  },
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  //https://disease.sh/v3/covid-19/historical/all?lastdays=120
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          const chartData = buildChartData(data, casesType);
          setData(chartData);
        });
    };
    fetchData();
  }, [casesType]);

  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    console.log("BUILDCHARTDATA", data[casesType]);

    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  console.log("HIII", data);

  return (
    <div className={props.className}>
      {/* add protection incase data is not populated yet */}
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: casesTypeColors[casesType].background,
                borderColor: casesTypeColors[casesType].border,
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
