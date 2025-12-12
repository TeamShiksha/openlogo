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
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("week");
  const [chartData, setChartData] = useState({ labels: [], dataPoints: [] });
  const [cachedWeekData, setCachedWeekData] = useState(null);
  const [cachedMonthData, setCachedMonthData] = useState(null);

  function parseStatsDataForPeriod(data, period) {
    if (!data || !Array.isArray(data)) return [[], []];

    const daysToDisplay = period === "week" ? 7 : 30;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateRangeArray = [];
    for (let i = daysToDisplay - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dateRangeArray.push(date);
    }

    const dateToCountMap = new Map();
    data.forEach((item) => {
      if (item.date && item.count !== undefined) {
        const dateKey = item.date.split("T")[0];

        dateToCountMap.set(dateKey, Number(item.count) || 0);
      }
    });

    const chartLabels = [];
    const requestCounts = [];

    dateRangeArray.forEach((date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;

      const count = dateToCountMap.get(dateKey) || 0;

      const label = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
      }).format(date);

      chartLabels.push(label);
      requestCounts.push(count);
    });

    return [chartLabels, requestCounts];
  }
  const {
    fetchRequest: fetchWeekData,
    errorMsg: weekError,
    isSuccess: isWeekDataLoaded,
    data: weekApiResponse,
  } = useApi({
    method: "get",
    url: "/logo-requests/stats?period=week",
  });

  const {
    fetchRequest: fetchMonthData,
    errorMsg: monthError,
    isSuccess: isMonthDataLoaded,
    data: monthApiResponse,
  } = useApi({
    method: "get",
    url: "/logo-requests/stats?period=month",
  });

  useEffect(() => {
    fetchWeekData();
    fetchMonthData();
  }, []);

  useEffect(() => {
    if (isWeekDataLoaded && weekApiResponse) {
      setCachedWeekData(weekApiResponse);
    }

    if (isMonthDataLoaded && monthApiResponse) {
      setCachedMonthData(monthApiResponse);
    }

    if (selectedTimePeriod === "week" && cachedWeekData?.data?.data) {
      const [chartLabels, requestCounts] = parseStatsDataForPeriod(
        cachedWeekData.data.data,
        "week"
      );
      setChartData({ labels: chartLabels, dataPoints: requestCounts });
    } else if (selectedTimePeriod === "month" && cachedMonthData?.data?.data) {
      const [chartLabels, requestCounts] = parseStatsDataForPeriod(
        cachedMonthData.data.data,
        "month"
      );
      setChartData({ labels: chartLabels, dataPoints: requestCounts });
    }
  }, [
    isWeekDataLoaded,
    weekApiResponse,
    isMonthDataLoaded,
    monthApiResponse,
    selectedTimePeriod,
    cachedWeekData,
    cachedMonthData,
  ]);

  function niceStep(maxValue, targetTicks = 10) {
    if (maxValue <= 0) return 1;
    const roughStepSize = Math.ceil(maxValue / targetTicks);
    const powerOfTen = Math.pow(10, Math.floor(Math.log10(roughStepSize)));
    const normalizedValue = Math.ceil(roughStepSize / powerOfTen);
    const roundedNormalizedValue =
      normalizedValue <= 1
        ? 1
        : normalizedValue <= 2
          ? 2
          : normalizedValue <= 5
            ? 5
            : 10;
    return roundedNormalizedValue * powerOfTen;
  }

  const { yMax, step } = useMemo(() => {
    const requestCounts = chartData.dataPoints || [];
    const maxRequestCount = requestCounts.length
      ? Math.max(...requestCounts)
      : 0;

    if (maxRequestCount <= 10) {
      return { yMax: 15, step: 3 };
    }

    const calculatedStepSize = niceStep(maxRequestCount, 10);
    const adjustedYAxisMax =
      Math.ceil(maxRequestCount / calculatedStepSize) * calculatedStepSize + 10;
    return { yMax: adjustedYAxisMax, step: calculatedStepSize };
  }, [chartData]);

  const options = useMemo(() => {
    const maxYAxisTicks = Math.min(100, Math.ceil(yMax / step) + 1);

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
            maxTicksLimit: maxYAxisTicks,
          },
        },
      },
    };
  }, [yMax, step]);

  const chartDataConfig = {
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

  const currentError = selectedTimePeriod === "week" ? weekError : monthError;
  if (currentError) return <div>Error: {currentError}</div>;

  return (
    <div className={styles.graph} id="graph-container">
      {chartData.labels.length > 0 && (
        <Line
          key={`${selectedTimePeriod}-${yMax}-${step}`}
          options={options}
          data={chartDataConfig}
        />
      )}

      <div className={styles.buttonParent}>
        <button
          className={styles.button}
          onClick={() => setSelectedTimePeriod("month")}
          aria-pressed={selectedTimePeriod === "month"}
        >
          Month
        </button>
        <button
          className={styles.button}
          onClick={() => setSelectedTimePeriod("week")}
          aria-pressed={selectedTimePeriod === "week"}
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
