import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAssessmentHistory } from "../services/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const filtered = payload.filter(
      (p) => !p.dataKey.includes("_shadow")
    );
    return (
      <div className="bg-navy-800 border border-navy-600 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-navy-200 text-xs font-medium mb-2">{label}</p>
        {filtered.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: entry.color }}
            />
            <span className="text-xs text-navy-300 capitalize">{entry.name}:</span>
            <span className="text-xs font-bold text-white">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomDot = ({ cx, cy, stroke, value }) => {
  if (!value) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={stroke} opacity={0.3} />
      <circle cx={cx} cy={cy} r={3} fill={stroke} />
    </g>
  );
};

function ProgressChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  const fetchData = async () => {
    try {
      const { data } = await getAssessmentHistory();

      if (!data || data.length === 0) {
        setHasData(false);
        setLoading(false);
        return;
      }

      const technical = data
        .filter((d) => d.testType === "technical")
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const aptitude = data
        .filter((d) => d.testType === "aptitude")
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const softskills = data
        .filter((d) => d.testType === "softskills")
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const maxAttempts = Math.max(
        technical.length,
        aptitude.length,
        softskills.length
      );

      if (maxAttempts === 0) {
        setHasData(false);
        setLoading(false);
        return;
      }

      const points = [];
      for (let i = 0; i < maxAttempts; i++) {
        const point = { attempt: `Test ${i + 1}` };
        if (technical[i]) {
          point.technical = technical[i].score;
          point.technical_shadow = technical[i].score;
        }
        if (aptitude[i]) {
          point.aptitude = aptitude[i].score;
          point.aptitude_shadow = aptitude[i].score;
        }
        if (softskills[i]) {
          point.softskills = softskills[i].score;
          point.softskills_shadow = softskills[i].score;
        }
        points.push(point);
      }

      setChartData(points);
      setHasData(true);
    } catch (err) {
      console.error(err);
      setHasData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-navy-100 rounded-2xl p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-5 bg-navy-200 rounded w-48 mb-4"></div>
          <div className="h-64 bg-navy-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <motion.div
        className="bg-navy-100 rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-semibold text-navy-800 mb-2">📈 Progress Tracker</h3>
        <p className="text-navy-400 text-sm mb-6">
          Your performance chart across all test categories.
        </p>
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="text-4xl">📊</div>
          <p className="text-navy-500 text-sm font-medium">No assessment data yet</p>
          <p className="text-navy-400 text-xs">
            Take your first test to see your progress chart!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bg-navy-800 rounded-2xl p-6 mb-8"
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-white text-lg">📈 Performance Progress</h3>
          <p className="text-navy-300 text-xs mt-1">
            Your scores across all assessment categories over time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
            <span className="text-xs text-navy-300">Technical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
            <span className="text-xs text-navy-300">Aptitude</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
            <span className="text-xs text-navy-300">Soft Skills</span>
          </div>
        </div>
      </div>

      {/* 3D Effect Chart Container */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f2333 0%, #1e3a5f 50%, #163d5e 100%)",
          boxShadow: "inset 0 2px 20px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)",
          transform: "perspective(1000px) rotateX(2deg)",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Grid overlay for 3D depth effect */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top glow line */}
        <div
          className="absolute top-0 left-1/4 w-1/2 h-1 opacity-20 blur-sm"
          style={{
            background: "linear-gradient(90deg, transparent, #60a5fa, transparent)",
          }}
        />

        <div className="relative p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            >
              <defs>
                <filter id="glow-blue">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-green">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glow-orange">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
                vertical={false}
              />

              <XAxis
                dataKey="attempt"
                tick={{ fill: "#8ab4cd", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                tickLine={false}
              />

              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#8ab4cd", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Shadow lines — different dataKeys so they don't appear in tooltip */}
              <Line
                type="monotone"
                dataKey="technical_shadow"
                stroke="rgba(96,165,250,0.15)"
                strokeWidth={8}
                dot={false}
                activeDot={false}
                legendType="none"
                tooltipType="none"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="aptitude_shadow"
                stroke="rgba(74,222,128,0.15)"
                strokeWidth={8}
                dot={false}
                activeDot={false}
                legendType="none"
                tooltipType="none"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="softskills_shadow"
                stroke="rgba(251,146,60,0.15)"
                strokeWidth={8}
                dot={false}
                activeDot={false}
                legendType="none"
                tooltipType="none"
                connectNulls
              />

              {/* Main lines */}
              <Line
                type="monotone"
                dataKey="technical"
                name="Technical"
                stroke="#60a5fa"
                strokeWidth={2.5}
                dot={<CustomDot stroke="#60a5fa" />}
                activeDot={{ r: 6, fill: "#60a5fa", stroke: "#fff", strokeWidth: 2 }}
                filter="url(#glow-blue)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="aptitude"
                name="Aptitude"
                stroke="#4ade80"
                strokeWidth={2.5}
                dot={<CustomDot stroke="#4ade80" />}
                activeDot={{ r: 6, fill: "#4ade80", stroke: "#fff", strokeWidth: 2 }}
                filter="url(#glow-green)"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="softskills"
                name="Soft Skills"
                stroke="#fb923c"
                strokeWidth={2.5}
                dot={<CustomDot stroke="#fb923c" />}
                activeDot={{ r: 6, fill: "#fb923c", stroke: "#fff", strokeWidth: 2 }}
                filter="url(#glow-orange)"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats below chart */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        {[
          {
            label: "Technical",
            color: "text-blue-400",
            data: chartData
              .filter((d) => d.technical !== undefined)
              .map((d) => d.technical),
          },
          {
            label: "Aptitude",
            color: "text-green-400",
            data: chartData
              .filter((d) => d.aptitude !== undefined)
              .map((d) => d.aptitude),
          },
          {
            label: "Soft Skills",
            color: "text-orange-400",
            data: chartData
              .filter((d) => d.softskills !== undefined)
              .map((d) => d.softskills),
          },
        ].map((cat) => {
          const latest = cat.data[cat.data.length - 1];
          const prev = cat.data[cat.data.length - 2];
          const trend = cat.data.length > 1 ? latest - prev : null;

          return (
            <motion.div
              key={cat.label}
              className="bg-navy-700 rounded-xl p-3 text-center"
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs text-navy-300 mb-1">{cat.label}</p>
              <p className={`text-2xl font-bold ${cat.color}`}>
                {latest !== undefined ? `${latest}%` : "—"}
              </p>
              {trend !== null && (
                <p className={`text-xs mt-1 ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
                </p>
              )}
              <p className="text-xs text-navy-400 mt-1">
                {cat.data.length} attempt{cat.data.length !== 1 ? "s" : ""}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ProgressChart;