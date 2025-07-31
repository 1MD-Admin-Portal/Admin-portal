import React, { useEffect, useState } from "react";
import "../Professors/ProfessorsListPage.css"; // Assuming you have a CSS file for styling
import { fetchUsers } from "../../../services/user.Service";

const DancersList = () => {
  const [dancers, setDancers] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [selectedDancer, setSelectedDancer] = useState(null);

  useEffect(() => {
    const loadDancers = async () => {
      try {
        const data = await fetchUsers("user", page, 10);
        if (data?.users) {
          setDancers(data.users);
          setPagination(data.pagination);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error("Error loading dancers:", error);
        setDancers([]);
      }
    };
    loadDancers();
  }, [page]);

  const handleNext = () => {
    if (page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div className="professors-container">
      <h2 className="professors-title">Dancers List</h2>
      <table className="professors-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Location</th>
            <th>Skill Level</th>
            <th>User Type</th>
            <th>Provider</th>
            <th>Created At</th>
            <th>Roles</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {dancers.map((dancer) => (
            <tr key={dancer.id} onClick={() => setSelectedDancer(dancer)}>
              <td>{dancer.id}</td>
              <td>{dancer.email}</td>
              <td>{dancer.name}</td>
              <td>{dancer.location}</td>
              <td>{dancer.skill_level}</td>
              <td>{dancer.profile_user_type}</td>
              <td>{dancer.provider}</td>
              <td>{new Date(dancer.created_at).toLocaleString()}</td>
              <td>{dancer.roles?.join(", ")}</td>
              <td>{dancer.active_subscription?.subscription_name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          className="pagination-btn"
          onClick={handlePrev}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="page-indicator">
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={handleNext}
          disabled={page >= pagination.totalPages}
        >
          Next
        </button>
      </div>

      {selectedDancer && (
        <div className="modal-overlay" onClick={() => setSelectedDancer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Dancer Details</h3>
            <p>
              <strong>ID:</strong> {selectedDancer.id}
            </p>
            <p>
              <strong>Name:</strong> {selectedDancer.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedDancer.email}
            </p>
            <p>
              <strong>Location:</strong> {selectedDancer.location}
            </p>
            <p>
              <strong>Skill Level:</strong> {selectedDancer.skill_level}
            </p>
            <p>
              <strong>User Type:</strong> {selectedDancer.profile_user_type}
            </p>
            <p>
              <strong>Provider:</strong> {selectedDancer.provider}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(selectedDancer.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Roles:</strong> {selectedDancer.roles?.join(", ")}
            </p>

            <h4>Active Subscription</h4>
            {selectedDancer.active_subscription ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedDancer.active_subscription.subscription_name}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedDancer.active_subscription.payment_status}
                </p>
                <p>
                  <strong>ID:</strong> {selectedDancer.active_subscription.id}
                </p>
                <p>
                  <strong>Stripe Subscription ID:</strong>{" "}
                  {selectedDancer.active_subscription.stripe_subscription_id}
                </p>
                <p>
                  <strong>Stripe Customer ID:</strong>{" "}
                  {selectedDancer.active_subscription.stripe_customer_id}
                </p>
                <p>
                  <strong>Price ID:</strong>{" "}
                  {selectedDancer.active_subscription.price_id}
                </p>
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(
                    selectedDancer.active_subscription.start_date
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(
                    selectedDancer.active_subscription.end_date
                  ).toLocaleString()}
                </p>
                <p>
                  <strong>Billing:</strong>{" "}
                  {selectedDancer.active_subscription.billing_interval}
                </p>
                <p>
                  <strong>Reference:</strong>{" "}
                  {selectedDancer.active_subscription.payment_reference}
                </p>
                <p>
                  <strong>Created at:</strong>{" "}
                  {selectedDancer.active_subscription.created_at}
                </p>
                <p>
                  <strong>Is Active:</strong>{" "}
                  {selectedDancer.active_subscription.is_active ? "Yes" : "No"}
                </p>
              </>
            ) : (
              <p>No Active Subscription</p>
            )}

            <h4>Subscription History</h4>
            {selectedDancer.subscription_history?.length > 0 ? (
              selectedDancer.subscription_history.map((sub, idx) => (
                <div key={sub.id || idx} className="subscription-history-block">
                  <p>
                    <strong>Subscription Name:</strong> {sub.subscription_name}
                  </p>
                  <p>
                    <strong>Status:</strong> {sub.payment_status}
                  </p>
                  <p>
                    <strong>Id:</strong> {sub.id}
                  </p>
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(sub.start_date).toLocaleString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(sub.end_date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Billing:</strong> {sub.billing_interval}
                  </p>
                  <p>
                    <strong>Stripe Customer Id:</strong>{" "}
                    {sub.stripe_customer_id}
                  </p>
                  <p>
                    <strong>Stripe Subscription Id:</strong>{" "}
                    {sub.stripe_subscription_id}
                  </p>
                  <p>
                    <strong>Price Id:</strong> {sub.price_id}
                  </p>
                  <p>
                    <strong>Created at:</strong> {sub.created_at}
                  </p>
                  <p>
                    <strong>Is Active:</strong> {sub.is_active ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Payment Ref:</strong> {sub.payment_reference}
                  </p>
                </div>
              ))
            ) : (
              <p>No Subscription History</p>
            )}

            <h4>Subscription Summary</h4>
            {selectedDancer.subscription_summary && (
              <>
                <p>
                  <strong>Count:</strong>{" "}
                  {selectedDancer.subscription_summary.subscription_count}
                </p>
                <p>
                  <strong>Active:</strong>{" "}
                  {selectedDancer.subscription_summary.active_subscriptions}
                </p>
                <p>
                  <strong>Paid:</strong>{" "}
                  {selectedDancer.subscription_summary.has_paid_subscription
                    ? "Yes"
                    : "No"}
                </p>
                <p>
                  <strong>Latest:</strong>{" "}
                  {new Date(
                    selectedDancer.subscription_summary.latest_subscription_date
                  ).toLocaleString()}
                </p>
              </>
            )}

            <button
              className="modal-close-btn"
              onClick={() => setSelectedDancer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DancersList;
