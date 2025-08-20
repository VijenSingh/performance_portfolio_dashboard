import React from 'react';
import useAllStrategiesData from './UseAllStrategiesData';

const Portfolio = ({investment}) => {
  const data = useAllStrategiesData();
  // Sum the final cumulative profit/loss of all strategies
  const totalProfitLoss =
    data.Sniper_NF +
    data.Prop_Desk_Ce_04 +
    data.Prop_Desk_Ce_01 +
    data.CE_PE +
    data.Range_Breakout+
    data.Suprita +
    data.Shambhu +
    data.Mahabuddhi +
    data.Vasuki +
    data.NF_Selling_Long_Term+
    data.VJS+
    data.SK+
    data.DNS+
    data.SIM;

  // Calculate the percentage return
  const percentageReturn = ((totalProfitLoss / investment) * 100).toFixed(2);

  return (
 
     <div style={styles.card}>
        <div style={styles.container}>
      <h2 style={styles.title}>Portfolio Summary</h2>
      <div style={styles.grid}>
        <KPI label="Total Profit/Loss" style={styles.profitText} value={`₹ ${totalProfitLoss.toFixed(2)}`} positive />
      
        <KPI label="Percentage Return" value={`${percentageReturn}%`} positive />
       </div>
      </div>
    </div>
  );
};




function KPI({ label, value, positive, negative }) {
  return (
    <div style={{
      ...styles.kpiBox,
      ...(positive ? styles.kpiPositive : {}),
      ...(negative ? styles.kpiNegative : {}),
    }}>
      <div style={styles.kpiLabel}>{label}</div>
   

     <div
        style={{
          ...styles.kpiValue,
          ...(positive ? styles.kpiValuePositive : {}),
          ...(negative ? styles.kpiValueNegative : {}),
        }}
      >
        {value}
      </div>

    </div>
  );
}

const styles = {
  card: { 
      display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px",
    padding: "20px",
   },

   pageWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "50px",
    padding: "20px",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    padding: "20px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },


  title: { fontSize: 22, fontWeight: 800, marginBottom: 16 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  kpiBox: {
    background: "linear-gradient(180deg, #ffffff, #f8fbff)",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  },
  kpiPositive: { outline: "1px solid rgba(26,142,95,0.18)" },
  kpiNegative: { outline: "1px solid rgba(255,59,48,0.18)" },
  kpiLabel: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 6 },
  kpiValue: { fontSize: 20, fontWeight: 800 },

  kpiValuePositive: { color: "rgb(26, 142, 95)" }, // ✅ Green
  kpiValueNegative: { color: "rgb(255, 59, 48)" }, // ✅ Red


};


export default Portfolio;
