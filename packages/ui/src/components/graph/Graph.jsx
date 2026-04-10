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
import { useState, useEffect, useMemo, useContext } from "react";
import styles from "./Graph.module.css";
import { useApi } from "../../hooks/useApi";
import { ThemeContext } from "../../contexts/Contexts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getBaseOptions = (theme) => {
  const isDarkMode =
    theme === "dark" ||
    (theme === "device" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Requests",
        color: isDarkMode ? "rgb(255, 255, 255)" : "rgb(17, 24, 39)",
        font: {
          size: 20,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgb(31, 41, 55)" : "rgb(255, 255, 255)",
        titleColor: isDarkMode ? "rgb(255, 255, 255)" : "rgb(17, 24, 39)",
        bodyColor: isDarkMode ? "rgb(209, 213, 219)" : "rgb(75, 85, 99)",
        borderColor: isDarkMode
          ? "rgba(75, 85, 99, 0.3)"
          : "rgb(177, 179, 183, 0.3)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.2)"
            : "rgba(177, 179, 183, 0.2)",
        },
        ticks: {
          color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(134, 137, 139)",
        },
      },
      y: {
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.2)"
            : "rgba(177, 179, 183, 0.2)",
        },
        ticks: {
          color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(134, 137, 139)",
        },
      },
    },
  };
};

function parseStatsDataForPeriod(data, period) {
  if (!Array.isArray(data)) {
    return [[], []];
  }

  const daysToDisplay = period === "week" ? 7 : 30;

  const today = new Date();

  const dateRange = [];
  for (let offset = daysToDisplay - 1; offset >= 0; offset--) {
    const date = new Date(today);
    const dayPadding = 3;
    date.setDate(date.getDate() + dayPadding);
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
  const { theme } = useContext(ThemeContext);
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [chartData, setChartData] = useState({
    labels: [],
    dataPoints: [],
  });
  const [cachedWeekData, setCachedWeekData] = useState(null);
  const [cachedMonthData, setCachedMonthData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    const baseOptions = getBaseOptions(theme);

    return {
      ...baseOptions,
      scales: {
        ...baseOptions.scales,
        y: {
          ...baseOptions.scales.y,
          beginAtZero: true,
          min: 0,
          max: yMax,
          ticks: {
            ...baseOptions.scales.y.ticks,
            stepSize: step,
            autoSkip: false,
            maxTicksLimit: maxTicks,
          },
        },
      },
    };
  }, [yMax, step, theme]);

  const dataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Requests",
        data: chartData.dataPoints,
        borderWidth: 2,
        pointRadius: 3,
        tension: 0.2,
        borderColor:
          theme === "dark" ||
          (theme === "device" &&
            typeof window !== "undefined" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? "rgb(99, 102, 241)"
            : "rgb(79, 71, 228)",
        spanGaps: true,
        fill: false,
      },
    ],
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchWeekData(), fetchMonthData()]);
    setIsRefreshing(false);
  };

  const error = selectedPeriod === "week" ? weekError : monthError;
  if (error) {
    return <div>Error: {error}</div>;
  }

  const isLoading = !cachedWeekData && !cachedMonthData;

  return (
    <div className={styles.graph}>
      {isLoading ? (
        <div className={styles.mainSpinner}></div>
      ) : (
        chartData.labels.length > 0 && (
          <Line
            key={`${selectedPeriod}-${yMax}-${step}`}
            data={dataConfig}
            options={options}
          />
        )
      )}

      <div className={styles.buttonParent}>
        <button
          className={`${styles.button} ${
            selectedPeriod === "month" ? "segment-btn-active" : ""
          }`}
          onClick={() => setSelectedPeriod("month")}
          aria-pressed={selectedPeriod === "month"}
        >
          Month
        </button>

        <button
          className={`${styles.button} ${
            selectedPeriod === "week" ? "segment-btn-active" : ""
          }`}
          onClick={() => setSelectedPeriod("week")}
          aria-pressed={selectedPeriod === "week"}
        >
          Week
        </button>
        <div className={styles.refreshContainer}>
          <button
            className={styles.button}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            Refresh
          </button>
          <div className={styles.spinnerSlot}>
            {isRefreshing && <div className={styles.smallSpinner}></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
