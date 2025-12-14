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

function parseStatsDataForPeriod(data, period) {
  if (!Array.isArray(data)) {
    return [[], []];
  }

  const daysToDisplay = period === "week" ? 7 : 30;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateRange = [];
  for (let offset = daysToDisplay - 1; offset >= 0; offset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - offset);
    dateRange.push(date);
  }

  const dateToCount = new Map();
  data.forEach((item) => {
    if (item?.date && item.count !== undefined) {
      const key = item.date.split("T")[0];
      dateToCount.set(key, Number(item.count) || 0);
    }
  });

  const labels = [];
  const counts = [];

  dateRange.forEach((date) => {
    const key = date.toISOString().split("T")[0];
    const count = dateToCount.get(key) || 0;

    const label = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(date);

    labels.push(label);
    counts.push(count);
  });

  return [labels, counts];
}

function niceStep(maxValue, targetTicks = 10) {
  if (maxValue <= 0) {
    return 1;
  }

  const roughStep = Math.ceil(maxValue / targetTicks);
  const powerOfTen = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = Math.ceil(roughStep / powerOfTen);

  let rounded;

  if (normalized <= 1) {
    rounded = 1;
  } else if (normalized <= 2) {
    rounded = 2;
  } else if (normalized <= 5) {
    rounded = 5;
  } else {
    rounded = 10;
  }

  return rounded * powerOfTen;
}

export default function Graph() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartData, setChartData] = useState({
    labels: [],
    dataPoints: [],
  });
  const [cachedWeekData, setCachedWeekData] = useState(null);
  const [cachedMonthData, setCachedMonthData] = useState(null);

  const {
    fetchRequest: fetchWeekData,
    data: weekResponse,
    errorMsg: weekError,
    isSuccess: weekLoaded,
  } = useApi({
    method: "get",
    url: "/logo-requests/stats?period=week",
  });

  const {
    fetchRequest: fetchMonthData,
    data: monthResponse,
    errorMsg: monthError,
    isSuccess: monthLoaded,
  } = useApi({
    method: "get",
    url: "/logo-requests/stats?period=month",
  });

  useEffect(() => {
    fetchWeekData();
    fetchMonthData();
  }, []);

  useEffect(() => {
    if (weekLoaded && weekResponse) {
      setCachedWeekData(weekResponse);
    }

    if (monthLoaded && monthResponse) {
      setCachedMonthData(monthResponse);
    }

    if (selectedPeriod === "week" && cachedWeekData?.data?.data) {
      const [labels, counts] = parseStatsDataForPeriod(
        cachedWeekData.data.data,
        "week"
      );
      setChartData({ labels, dataPoints: counts });
    }

    if (selectedPeriod === "month" && cachedMonthData?.data?.data) {
      const [labels, counts] = parseStatsDataForPeriod(
        cachedMonthData.data.data,
        "month"
      );
      setChartData({ labels, dataPoints: counts });
    }
  }, [
    selectedPeriod,
    weekLoaded,
    monthLoaded,
    weekResponse,
    monthResponse,
    cachedWeekData,
    cachedMonthData,
  ]);

  const { yMax, step } = useMemo(() => {
    const values = chartData.dataPoints;
    const max = values.length ? Math.max(...values) : 0;

    if (max <= 10) {
      return { yMax: 15, step: 3 };
    }

    const stepSize = niceStep(max, 10);
    const adjustedMax = Math.ceil(max / stepSize) * stepSize + 10;

    return { yMax: adjustedMax, step: stepSize };
  }, [chartData]);

  const options = useMemo(() => {
    const maxTicks = Math.min(100, Math.ceil(yMax / step) + 1);

    return {
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        y: {
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

  const dataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Requests",
        data: chartData.dataPoints,
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.2,
        borderColor: "rgb(79, 71, 228)",
        spanGaps: true,
        fill: false,
      },
    ],
  };

  const handleRefresh = () => {
    fetchWeekData();
    fetchMonthData();
  };

  const error = selectedPeriod === "week" ? weekError : monthError;
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.graph}>
      {chartData.labels.length > 0 && (
        <Line
          key={`${selectedPeriod}-${yMax}-${step}`}
          data={dataConfig}
          options={options}
        />
      )}

      <div className={styles.buttonParent}>
        <button
          className={styles.button}
          onClick={() => setSelectedPeriod("month")}
          aria-pressed={selectedPeriod === "month"}
        >
          Month
        </button>
        <button
          className={styles.button}
          onClick={() => setSelectedPeriod("week")}
          aria-pressed={selectedPeriod === "week"}
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
