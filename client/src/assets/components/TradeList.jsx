import axios from "axios";
import React, { useState } from "react";
import EquityCurveChart from "./EquityCurveChart";
import "../css/tradeList.css";

function TradeList({ trades, selectedStrategy, setTrades }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTrade, setEditTrade] = useState(null);

  // ✅ Calculate Profit/Loss + Cumulative P&L
  const calculateCumulativePL = () => {
    let cumulativePL = 0;
    return trades.map((trade) => {
      const profitLoss = parseFloat(
        ((trade.exitPrice - trade.entryPrice) * parseInt(trade.quantity)).toFixed(2)
      );
      cumulativePL += profitLoss;
      return { ...trade, profitLoss, cumulativePL };
    });
  };

  const tradesWithCumulativePL = calculateCumulativePL();

  // ✅ Equity data for chart
  const equityData = tradesWithCumulativePL.map((trade) => ({
    date: trade.date,
    cumulativePL: trade.cumulativePL,
  }));

  
  console.log("vjp... ", equityData)
  // Pagination logic (same as before)
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(10);

  const indexOfLastTrade = currentPage * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = tradesWithCumulativePL.slice(
    indexOfFirstTrade,
    indexOfLastTrade
  );

  const totalPages = Math.ceil(tradesWithCumulativePL.length / tradesPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers.map((number) => {
      if (
        number === 1 ||
        number === totalPages ||
        (number >= currentPage - 1 && number <= currentPage + 1)
      ) {
        return (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            className={number === currentPage ? "active" : ""}
          >
            {number}
          </button>
        );
      }
      if (number === currentPage - 2 || number === currentPage + 2) {
        return <span key={number}>...</span>;
      }
      return null;
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/trades/${id}?strategy=${selectedStrategy}`);
      setTrades((prevTrades) => prevTrades.filter((trade) => trade._id !== id));
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const handleEdit = (trade) => {
    setEditTrade(trade);
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTrade((prevTrade) => ({ ...prevTrade, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedTrade = { ...editTrade, selectedStrategy };
      const response = await axios.put(
        `/api/trades/${editTrade._id}`,
        updatedTrade
      );
      setTrades((prevTrades) =>
        prevTrades.map((trade) =>
          trade._id === editTrade._id ? response.data : trade
        )
      );
      setIsEditModalOpen(false);
      setEditTrade(null);
    } catch (error) {
      console.error("Error updating trade:", error);
    }
  };

  return (
    <div className="trade-list">
      <h2>Trade List</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Entry Price</th>
            <th>Exit Price</th>
            <th>Quantity</th>
            <th>Profit/Loss</th>
            <th>Cumulative Profit/Loss</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTrades.map((trade) => (
            <tr key={trade._id}>
              <td>{trade.date}</td>
              <td>{trade.entryPrice}</td>
              <td>{trade.exitPrice}</td>
              <td>{trade.quantity}</td>
              <td>{trade.profitLoss}</td>
              <td>{trade.cumulativePL.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(trade)}>Edit</button>
                <button onClick={() => handleDelete(trade._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>



      {/* Pagination */}
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {renderPageNumbers()}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

                {/* ✅ Equity Curve Chart */}
      <EquityCurveChart equityData={equityData} />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Trade</h2>
            <form onSubmit={handleEditSubmit}>
              <label>
                Date:
                <input
                  type="date"
                  name="date"
                  value={editTrade.date}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Entry Price:
                <input
                  type="number"
                  name="entryPrice"
                  value={editTrade.entryPrice}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Exit Price:
                <input
                  type="number"
                  name="exitPrice"
                  value={editTrade.exitPrice}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={editTrade.quantity}
                  onChange={handleEditChange}
                />
              </label>
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TradeList;
