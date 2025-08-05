import React from "react";
import "./PayoutsPage.css";

const payouts = [
  {
    id: 1,
    title: "Urban Kiz Mastery",
    icon: "🕺",
    type: "Video",
    price: 100,
    sales: 15,
    penalty: 0,
    gross: 1500,
    commission: 20,
    net: 1200,
    payoutStatus: "Not Requested",
    lastRequest: null,
    paidOn: null,
    receipt: null,
  },
  {
    id: 2,
    title: "Salsa 1-on-1",
    icon: "💃",
    type: "1-on-1",
    price: 80,
    sales: 5,
    penalty: 0,
    gross: 400,
    commission: 20,
    net: 320,
    payoutStatus: "Paid",
    lastRequest: "2025-05-10",
    receipt: "https://example.com/receipt.pdf",
  },
];

const PayoutsPage = () => {
  return (
    <div className="payouts-container">
      <h2>Earnings & Payouts</h2>
      <div className="payouts-list">
        {payouts.map((item) => (
          <div className="payout-card" key={item.id}>
            <div className="card-header">
              <span className="emoji">{item.icon}</span>
              <h3>{item.title}</h3>
            </div>
            <p>
              Type: {item.type} <span>Price: ${item.price}</span>
            </p>
            <p>
              Sales: {item.sales} <span>Penalty: ${item.penalty}</span>
            </p>

            <div className="stats">
              <p>
                Gross Revenue <span>${item.gross}</span>
              </p>
              <p>
                Commission <span>{item.commission}%</span>
              </p>
              <p>
                Net Earning <span>${item.net}</span>
              </p>
            </div>

            <div className="payout-status">
              <p>
                Payout Status:
                <span
                  className={
                    item.payoutStatus === "Paid" ? "paid" : "not-requested"
                  }
                >
                  {item.payoutStatus === "Paid"
                    ? "✅ Paid"
                    : "❌ Not Requested Yet"}
                </span>
              </p>
              <p>Paid On: {item.paidOn || "-"}</p>
              <p>
                Receipt: {item.receipt ? <a href={item.receipt}>View</a> : "-"}
              </p>
            </div>

            <div className="actions">
              {item.payoutStatus !== "Paid" ? (
                <>
                  <button className="primary">Send Email to Admin</button>
                  <button>Upload Receipt</button>
                  <button>Add Penalty</button>
                </>
              ) : (
                <>
                  <button>Receipt Uploaded</button>
                  <button>Payout Complete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutsPage;
