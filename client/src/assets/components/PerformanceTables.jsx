import React, { useMemo } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Styled Components
const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
`;

const Th = styled.th`
  padding: 12px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  background: linear-gradient(90deg, #6dd5ed, #2193b0);
  color: white;
`;

const Td = styled.td`
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }
`;

const Tr = styled.tr`
  transition: background 0.3s ease;
  &:hover {
    background: #f9f9f9;
  }

  &:last-child td {
    border-bottom: none; /* ✅ last row ka border remove */
  }
`;

const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(to bottom, #e0f7fa, #ffffff);
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr; /* Side by side cards */
  }
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
`;

const ChartWrapper = styled.div`
  margin-top: 1.5rem;
  height: 250px;
`;

const PerformanceTables = ({ trades }) => {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const data = trades.map((trade) => ({
    date: trade.date,
    pnl: (trade.exitPrice - trade.entryPrice) * trade.quantity,
  }));

  const calculateDrawdown = (pnlList) => {
    let peak = 0,
      maxDrawdown = 0,
      cumulative = 0;
    pnlList.forEach((val) => {
      cumulative += val;
      if (cumulative > peak) peak = cumulative;
      const drawdown = peak - cumulative;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });
    return maxDrawdown;
  };

  const monthData = useMemo(() => {
    const grouped = {};
    data.forEach(({ date, pnl }) => {
      const d = new Date(date);
      const month = d.getMonth();
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push(pnl);
    });
    return Object.keys(grouped).map((m) => {
      const pnlList = grouped[m];
      return {
        month: monthNames[m],
        totalReturn: pnlList.reduce((a, b) => a + b, 0),
        maxProfit: Math.max(...pnlList),
        maxLoss: Math.min(...pnlList),
        maxDrawdown: calculateDrawdown(pnlList),
      };
    });
  }, [data]);

  const dayData = useMemo(() => {
    const grouped = {};
    data.forEach(({ date, pnl }) => {
      const d = new Date(date);
      const day = d.getDay();
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(pnl);
    });
    return Object.keys(grouped).map((dy) => {
      const pnlList = grouped[dy];
      return {
        day: dayNames[dy],
        totalReturn: pnlList.reduce((a, b) => a + b, 0),
        maxProfit: Math.max(...pnlList),
        maxLoss: Math.min(...pnlList),
        maxDrawdown: calculateDrawdown(pnlList),
      };
    });
  }, [data]);

  return (
    <Container>
      {/* Month Table */}
      <Card>
        <Title>📅 Month-wise Performance</Title>
        <Table>
          <thead>
            <Tr>
              <Th>Month</Th>
              <Th>Total Return</Th>
              <Th>Max Profit</Th>
              <Th>Max Loss</Th>
              <Th>Max Drawdown</Th>
            </Tr>
          </thead>
          <tbody>
            {monthData.map((row, i) => (
              <Tr key={i}>
                <Td>{row.month}</Td>
                <Td>{row.totalReturn.toFixed(2)}</Td>
                <Td style={{ color: "green" }}>{row.maxProfit.toFixed(2)}</Td>
                <Td style={{ color: "red" }}>{row.maxLoss.toFixed(2)}</Td>
                <Td>{row.maxDrawdown.toFixed(2)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        {/* Chart */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalReturn">
                {monthData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.totalReturn >= 0 ? "green" : "red"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </Card>

      {/* Day Table */}
      <Card>
        <Title>📊 Day-of-Week Performance</Title>
        <Table>
          <thead>
            <Tr>
              <Th>Day</Th>
              <Th>Total Return</Th>
              <Th>Max Profit</Th>
              <Th>Max Loss</Th>
              <Th>Max Drawdown</Th>
            </Tr>
          </thead>
          <tbody>
            {dayData.map((row, i) => (
              <Tr key={i}>
                <Td>{row.day}</Td>
                <Td>{row.totalReturn.toFixed(2)}</Td>
                <Td style={{ color: "green" }}>{row.maxProfit.toFixed(2)}</Td>
                <Td style={{ color: "red" }}>{row.maxLoss.toFixed(2)}</Td>
                <Td>{row.maxDrawdown.toFixed(2)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        {/* Chart */}
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalReturn">
                {dayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.totalReturn >= 0 ? "green" : "red"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </Card>
    </Container>
  );
};

export default PerformanceTables;
