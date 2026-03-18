import React from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  // const metrics = [
  //   {
  //     title: 'Total Users',
  //     value: '1250',
  //     change: '+5%',
  //     icon: '👤',
  //     color: 'blue'
  //   },
  //   {
  //     title: 'Active Subscriptions',
  //     value: '320',
  //     change: '+7%',
  //     icon: '📹',
  //     color: 'green'
  //   },
  //   {
  //     title: 'Total Revenue',
  //     value: '8500',
  //     change: '+7%',
  //     icon: '💰',
  //     color: 'purple'
  //   },
  //   {
  //     title: 'Active Challenges',
  //     value: '12',
  //     change: '',
  //     icon: '⏰',
  //     color: 'orange'
  //   }
  // ];

  // const chartData = {
  //   userGrowth: [
  //     { month: 'Jan', value: 600 },
  //     { month: 'Feb', value: 750 },
  //     { month: 'Mar', value: 800 },
  //     { month: 'Apr', value: 900 },
  //     { month: 'May', value: 850 },
  //     { month: 'Jun', value: 1100 }
  //   ],
  //   subscriptionGrowth: [
  //     { month: 'Jan', value: 620 },
  //     { month: 'Feb', value: 700 },
  //     { month: 'Mar', value: 750 },
  //     { month: 'Apr', value: 900 },
  //     { month: 'May', value: 880 },
  //     { month: 'Jun', value: 1150 }
  //   ]
  // };

  const quickActions = [
    { title: "Add New Program", icon: "➕" },
    { title: "Create New Challenge", icon: "🚩" },
    { title: "Create New Event", icon: "👥" },
  ];

  const renderChart = (data, title) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue;

    return (
      <div className="chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="chart">
          <div className="chart-grid">
            <div className="y-axis">
              <span>1,200</span>
              <span>1,000</span>
              <span>800</span>
              <span>600</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <svg viewBox="0 0 300 200" className="chart-svg">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 0 ${200 - ((data[0].value - minValue) / range) * 150} ${data
                    .map(
                      (d, i) =>
                        `L ${i * 60} ${200 - ((d.value - minValue) / range) * 150}`,
                    )
                    .join(" ")} L 300 200 L 0 200 Z`}
                  fill="url(#gradient)"
                />
                <path
                  d={`M 0 ${200 - ((data[0].value - minValue) / range) * 150} ${data
                    .map(
                      (d, i) =>
                        `L ${i * 60} ${200 - ((d.value - minValue) / range) * 150}`,
                    )
                    .join(" ")}`}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  fill="none"
                />
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={i * 60}
                    cy={200 - ((d.value - minValue) / range) * 150}
                    r="3"
                    fill="#3b82f6"
                  />
                ))}
              </svg>
              <div className="x-axis">
                {data.map((d, i) => (
                  <span key={i}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="admin-section">
          <span>Admin</span>
          <div className="avatar">
            <img src="/api/placeholder/40/40" alt="Admin" />
          </div>
        </div>
      </header>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={`metric-card ${metric.color}`}>
            <div className="metric-icon">
              <span>{metric.icon}</span>
            </div>
            <div className="metric-content">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-title">{metric.title}</div>
              {metric.change && (
                <div className="metric-change">{metric.change}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="charts-section">
        {renderChart(chartData.userGrowth, "User Growth")}
        {renderChart(chartData.subscriptionGrowth, "Subscription Growth")}
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button key={index} className="action-button">
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
