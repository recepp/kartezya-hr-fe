import React, { useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import styles from './ActivityChart.module.scss';

interface ActivityChartProps {
  data?: number[];
}

const defaultData = [45, 52, 48, 61, 55, 58, 63];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ActivityChart({ data = defaultData }: ActivityChartProps) {
  const [activeTab, setActiveTab] = useState('weekly');

  const maxValue = Math.max(...data);
  const padding = 40;
  const chartHeight = 240;
  const chartWidth = 400;

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.cardBody}>
        <div className={styles.header}>
          <h5 className={styles.title}>Activity Chart</h5>
          <ButtonGroup size="sm">
            {['Monthly', 'Weekly', 'Daily'].map((tab) => (
              <Button
                key={tab.toLowerCase()}
                variant={activeTab === tab.toLowerCase() ? 'primary' : 'outline-secondary'}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={styles.tabButton}
              >
                {tab}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        {/* Chart */}
        <div className={styles.chartContainer}>
          <svg width="100%" height={chartHeight + 60} viewBox={`0 0 ${chartWidth + 60} ${chartHeight + 60}`}>
            {/* Y-axis */}
            <line
              x1={padding}
              y1={padding}
              x2={padding}
              y2={chartHeight + padding}
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* X-axis */}
            <line
              x1={padding}
              y1={chartHeight + padding}
              x2={chartWidth + padding}
              y2={chartHeight + padding}
              stroke="#e5e7eb"
              strokeWidth="2"
            />

            {/* Y-axis labels and grid lines */}
            {[0, 20, 40, 60, 80].map((value) => {
              const y = chartHeight + padding - (value / 100) * chartHeight;
              return (
                <g key={`y-${value}`}>
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className={styles.yAxisLabel}
                  >
                    {value}
                  </text>
                  {value > 0 && (
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth + padding}
                      y2={y}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                  )}
                </g>
              );
            })}

            {/* Bars */}
            {data.map((value, index) => {
              const barWidth = (chartWidth - 20) / data.length;
              const barHeight = (value / 100) * chartHeight;
              const x = padding + 10 + index * barWidth;
              const y = chartHeight + padding - barHeight;

              return (
                <g key={`bar-${index}`}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth - 10}
                    height={barHeight}
                    fill="#ff9500"
                    rx="6"
                  />
                  <text
                    x={x + (barWidth - 10) / 2}
                    y={chartHeight + padding + 20}
                    textAnchor="middle"
                    className={styles.xAxisLabel}
                  >
                    {days[index]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </Card.Body>
    </Card>
  );
}
