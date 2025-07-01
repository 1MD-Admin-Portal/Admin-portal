import React, { useState } from "react";
import "../../styles/CreateEventModal.css";

const CreateEventModal = ({ onClose }) => {
  const [tiers, setTiers] = useState([
    { name: "Early Bird", price: 20, quantity: 50 },
    { name: "General", price: 30, quantity: 100 },
  ]);

  return (
    <div className="create-event-modal">
      <div className="modal-content-event">
        <div className="modal-header">
          <span onClick={onClose} className="back-button">← Back</span>
          <h2>Create New Event</h2>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label>Event Title</label>
            <input type="text" placeholder="Event Title" />
          </div>

          <div className="form-group">
            <label>Organizer</label>
            <select>
              <option>Select Organizer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <div className="checkbox-group">
              {['Workshop', 'Festival', 'Social', 'Competition'].map(type => (
                <label key={type}><input type="radio" name="eventType" /> {type}</label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Dance Style</label>
            <div className="checkbox-group">
              {['Salsa', 'Bachata', 'Zouk', 'Hip-Hop', 'Ballet'].map(style => (
                <label key={style}><input type="checkbox" /> {style}</label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Level</label>
            <div className="checkbox-group">
              {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(level => (
                <label key={level}><input type="radio" name="level" /> {level}</label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Date & Time</label>
            <div className="date-time-group">
              <input type="date" />
              <input type="time" />
              <select><option>Timezone</option></select>
            </div>
          </div>

          <div className="form-group">
            <label>Location Address</label>
            <input type="text" placeholder="Address" />
          </div>

          <div className="form-group">
            <label>Ticketing Pricing</label>
            <div className="checkbox-group">
              <label><input type="radio" name="pricing" /> Free</label>
              <label><input type="radio" name="pricing" /> Fixed Price</label>
            </div>
          </div>

          <div className="form-group">
            <label>Max Capacity</label>
            <input type="number" placeholder="Capacity" />
          </div>

          <div className="form-group">
            <label>Ticket Pricing</label>
            <table>
              <thead>
                <tr>
                  <th>Tier Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, index) => (
                  <tr key={index}>
                    <td>{tier.name}</td>
                    <td>${tier.price}</td>
                    <td>{tier.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="form-group">
            <label>Upload Banner Image</label>
            <input type="file" accept="image/*" />
          </div>

          <div className="form-group">
            <label>Tags (optional)</label>
            <input type="text" placeholder="Tags" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea placeholder="Description" />
          </div>

          <div className="form-group">
            <label>Link for Event</label>
            <input type="text" placeholder="Link" />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="publish-btn">Create Event</button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
