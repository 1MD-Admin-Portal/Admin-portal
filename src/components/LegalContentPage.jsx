import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileContract, FaLock, FaGavel, FaUsers } from "react-icons/fa";
import "../styles/LegalContentPage.css";

const pdfLinks = {
  privacy: "/pdfs/privacy-policy.pdf",
  terms: "/pdfs/terms-of-service.pdf",
  guidelines: "/pdfs/community-guidelines.pdf",
};

const legalDocuments = [
  {
    id: "privacy",
    title: "Privacy Policy",
    description: "How we collect, use, and protect user data",
    icon: <FaLock />,
    color: "pink",
  },
  {
    id: "terms",
    title: "Terms of Service",
    description: "Rules and regulations for using the platform",
    icon: <FaGavel />,
    color: "blue",
  },
  {
    id: "guidelines",
    title: "Community Guidelines",
    description: "Standards and expectations for community behavior",
    icon: <FaUsers />,
    color: "purple",
  },
];

const LegalContentPage = () => {
  const navigate = useNavigate();
  const [activePdf, setActivePdf] = useState(null);

  return (
    <div className="legal-content-container">
      <button className="back-button" onClick={() => navigate("/SettingsPage")}>
        <FaArrowLeft /> Back to Settings
      </button>

      <div className="legal-header">
        <div className="legal-header-content">
          <div className="legal-icon-wrapper">
            <FaFileContract />
          </div>
          <div>
            <h1 className="legal-title">Legal Content</h1>
            <p className="legal-subtitle">Manage terms, policies, and legal documents</p>
          </div>
        </div>
      </div>

      <div className="legal-documents-grid">
        {legalDocuments.map((doc) => (
          <div
            key={doc.id}
            className={`legal-document-card legal-document-card-${doc.color} ${
              activePdf === doc.id ? "active" : ""
            }`}
            onClick={() => setActivePdf(doc.id)}
          >
            <div className="legal-document-icon">{doc.icon}</div>
            <div className="legal-document-content">
              <h3 className="legal-document-title">{doc.title}</h3>
              <p className="legal-document-description">{doc.description}</p>
            </div>
            <div className="legal-document-arrow">→</div>
          </div>
        ))}
      </div>

      {activePdf && (
        <div className="pdf-viewer-wrapper">
          <div className="pdf-viewer-header">
            <h3 className="pdf-viewer-title">
              {legalDocuments.find((doc) => doc.id === activePdf)?.title}
            </h3>
            <button className="pdf-close-btn" onClick={() => setActivePdf(null)}>
              ×
            </button>
          </div>
          <div className="pdf-viewer">
            <iframe
              src={pdfLinks[activePdf]}
              title="Legal Document"
              frameBorder="0"
              width="100%"
              height="600px"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegalContentPage;
