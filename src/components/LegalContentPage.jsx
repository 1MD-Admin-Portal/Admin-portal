import React, { useState } from "react";
import "../styles/LegalContentPage.css";

const pdfLinks = {
  privacy: "/pdfs/privacy-policy.pdf",
  terms: "/pdfs/terms-of-service.pdf",
  guidelines: "/pdfs/community-guidelines.pdf",
};

const LegalContentPage = () => {
  const [activePdf, setActivePdf] = useState(null);

  return (
    <div className="legal-content-container">
      <h2 className="legal-title">Legal Content</h2>

      <div className="legal-buttons">
        <button onClick={() => setActivePdf("privacy")}>Privacy Policy</button>
        <button onClick={() => setActivePdf("terms")}>Terms of Service</button>
        <button onClick={() => setActivePdf("guidelines")}>Community Guidelines</button>
      </div>

      {activePdf && (
        <div className="pdf-viewer">
          <iframe
            src={pdfLinks[activePdf]}
            title="Legal Document"
            frameBorder="0"
            width="100%"
            height="600px"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default LegalContentPage;
