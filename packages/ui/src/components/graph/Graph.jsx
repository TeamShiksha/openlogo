import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect, useMemo } from "react";
import styles from "./Graph.module.css";
import { useApi } from "../../hooks/useApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Requests" },
  },
  scales: {
    x: {},
  },
};

export default function Graph() {
  const [viewState, setViewState] = useState("week");
  const [chartData, setChartData] = useState({ labels: [], dataPoints: [] });
  const [weekData, setWeekData] = useState(null);
  const [monthData, setMonthData] = useState(null);

  function parseMonthWeekJson(data, period) {
    if (!data || !Array.isArray(data)) return [[], []];

    const numDays = period === "week" ? 7 : 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateRange = [];
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dateRange.push(date);
    }

    const dataMap = new Map();
    data.forEach((item) => {
      if (item.date && item.count !== undefined) {
        const dateStr = item.date.split("T")[0];

        dataMap.set(dateStr, Number(item.count) || 0);
      }
    });

    const labels = [];
    const dataPoints = [];
    
    dateRange.forEach((date) => {
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const count = dataMap.get(dateKey) || 0;

      const label = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
      }).format(date);

      labels.push(label);
      dataPoints.push(count);
    });

    return [labels, dataPoints];
  }
  const {
    fetchRequest: fetchWeekData,
    errorMsg: weekError,
    isSuccess: weekArrived,
    data: dataOfWeek,
  } = useApi({
    method: "get",
    url: "/logo-requests/stats?period=week",
  });

  const {
    fetchRequest: fetchMonthData,
    errorMsg: monthError,
    isSuccess: monthArrived,
    data: dataOfMonth,
  } = useApi({
    method: "get",
    url: "/logo-requests/stats?period=month",
  });

  useEffect(() => {
    fetchWeekData();
    fetchMonthData();
  }, []);

  useEffect(() => {

    if (weekArrived && dataOfWeek) {
      setWeekData(dataOfWeek);
    }


    if (monthArrived && dataOfMonth) {
      setMonthData(dataOfMonth);
    }

    
    if (viewState === "week" && weekData?.data?.data) {
      const [labels, points] = parseMonthWeekJson(weekData.data.data, "week");
      setChartData({ labels, dataPoints: points });
    } else if (viewState === "month" && monthData?.data?.data) {
      const [labels, points] = parseMonthWeekJson(monthData.data.data, "month");
      setChartData({ labels, dataPoints: points });
    }
  }, [
    weekArrived,
    dataOfWeek,
    monthArrived,
    dataOfMonth,
    viewState,
    weekData,
    monthData,
  ]);

  function niceStep(maxValue, targetTicks = 10) {

    if (maxValue <= 0) return 1;
    const rough = Math.ceil(maxValue / targetTicks);
    const pow = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm = Math.ceil(rough / pow);
    const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return niceNorm * pow;
  }

  const { yMax, step } = useMemo(() => {

    const points = chartData.dataPoints || [];
    const maxValue = points.length ? Math.max(...points) : 0;

    if (maxValue <= 10) {
      return { yMax: 15, step: 3 };
    }

    const stepCandidate = niceStep(maxValue, 10);
    const yMaxAdjusted =
      Math.ceil(maxValue / stepCandidate) * stepCandidate + 10;
    return { yMax: yMaxAdjusted, step: stepCandidate };
  }, [chartData]);

  const options = useMemo(() => {
    const maxTicks = Math.min(100, Math.ceil(yMax / step) + 1);

    return {
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        y: {
          type: "linear",
          beginAtZero: true,
          min: 0,
          max: yMax,
          ticks: {
            stepSize: step,
            autoSkip: false,
            maxTicksLimit: maxTicks,
          },
        },
      },
    };
  }, [yMax, step]);

  const graphData = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Requests",
        data: chartData.dataPoints,
        borderColor: "rgb(79, 71, 228)",
        backgroundColor: "rgba(79, 71, 228, 0.25)",
        borderWidth: 2,
        pointRadius: 3,
        spanGaps: true,
        tension: 0.2,
        fill: false,
      },
    ],
  };

  const handleRefresh = () => {
    fetchWeekData();
    fetchMonthData();
  };

  const currentError = viewState === "week" ? weekError : monthError;
  if (currentError) return <div>Error: {currentError}</div>;

  return (
    <div className={styles.graph} id="graph-container">
      {chartData.labels.length > 0 && (
        <Line
          key={`${viewState}-${yMax}-${step}`}
          options={options}
          data={graphData}
        />
      )}

      <div className={styles.buttonParent}>
        <button
          className={styles.button}
          onClick={() => setViewState("month")}
          aria-pressed={viewState === "month"}
        >
          Month
        </button>
        <button
          className={styles.button}
          onClick={() => setViewState("week")}
          aria-pressed={viewState === "week"}
        >
          Week
        </button>
        <button className={styles.button} onClick={handleRefresh}>
          Refresh
        </button>
      </div>
    </div>
  );
}
