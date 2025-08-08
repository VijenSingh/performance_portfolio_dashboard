import React, { useMemo } from "react";
import styled from "styled-components";

// Styled Components
const Table = styled.table`
  width: 100%;
  border-collapse: collapse; /* Borders join karne ke liye */
`;

const Th = styled.th`
  border: 1px solid #444; /* Dark grey border */
  padding: 8px 12px;
  text-align: center;
  background-color: #f0f0f0; /* Light grey header background */
`;

const Td = styled.td`
  border: 1px solid #444; /* Dark grey border */
  padding: 8px 12px;
  text-align: center;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #fafafa; /* Hover effect for rows */
  }
`;

const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
`;

const PerformanceTables = ({ data }) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const calculateDrawdown = (pnlList) => {
    let peak = 0,
      maxDrawdown = 0;
    let cumulative = 0;
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
      <div>
        <Title>Month-wise Performance</Title>
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
                <Td>{row.maxProfit.toFixed(2)}</Td>
                <Td>{row.maxLoss.toFixed(2)}</Td>
                <Td>{row.maxDrawdown.toFixed(2)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Day Table */}
      <div>
        <Title>Day-of-Week Performance</Title>
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
                <Td>{row.maxProfit.toFixed(2)}</Td>
                <Td>{row.maxLoss.toFixed(2)}</Td>
                <Td>{row.maxDrawdown.toFixed(2)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default PerformanceTables;
