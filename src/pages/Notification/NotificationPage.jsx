import React, { useState } from "react";
import "./NotificationPage.css";
import { FaBullhorn } from "react-icons/fa";

const NotificationPage = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("subscription");
  const [subscriptions, setSubscriptions] = useState({
    danceur: true,
    ginga: true,
    fiver: false,
  });
  const [sendNow, setSendNow] = useState(true);
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSubscriptionChange = (e) => {
    setSubscriptions({
      ...subscriptions,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className="notification-container">
      <h2 className="notification-header">
        <FaBullhorn className="icon" /> Notification Center
      </h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <textarea
          placeholder="Message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="audience-section">
        <h3>Who Should Receive This?</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="audience"
              value="all"
              onChange={() => setAudience("all")}
            />{" "}
            All Users
          </label>
          <label>
            <input
              type="radio"
              name="audience"
              value="dancers"
              onChange={() => setAudience("dancers")}
            />{" "}
            Only Dancers
          </label>
          <label>
            <input
              type="radio"
              name="audience"
              value="instructors"
              onChange={() => setAudience("instructors")}
            />{" "}
            Only Instructors
          </label>
          <label>
            <input
              type="radio"
              name="audience"
              value="subscription"
              checked={audience === "subscription"}
              onChange={() => setAudience("subscription")}
            />{" "}
            Based on Subscription
          </label>
        </div>

        {audience === "subscription" && (
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="danceur"
                checked={subscriptions.danceur}
                onChange={handleSubscriptionChange}
              />{" "}
              Danceur
            </label>
            <label>
              <input
                type="checkbox"
                name="ginga"
                checked={subscriptions.ginga}
                onChange={handleSubscriptionChange}
              />{" "}
              Ginga
            </label>
            <label>
              <input
                type="checkbox"
                name="fiver"
                checked={subscriptions.fiver}
                onChange={handleSubscriptionChange}
              />{" "}
              Fiver
            </label>
          </div>
        )}
      </div>

      <div className="schedule-section">
        <h3>When to Send?</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="schedule"
              value="now"
              checked={sendNow}
              onChange={() => setSendNow(true)}
            />{" "}
            Send Now
          </label>
          <label>
            <input
              type="radio"
              name="schedule"
              value="later"
              checked={!sendNow}
              onChange={() => setSendNow(false)}
            />{" "}
            Schedule for Later
            {!sendNow && (
              <input
                type="date"
                className="date-input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            )}
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button className="draft-btn">Save as Draft</button>
        <button className="send-btn">Send Notification</button>
      </div>
    </div>
  );
};

export default NotificationPage;
