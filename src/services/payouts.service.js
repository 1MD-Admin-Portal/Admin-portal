// ===== PAYOUTS.SERVICE.JS =====
import axios from "axios";
import { CONSTANTS } from "../utils/constants.js";

// ✅ Get Pending Payouts with pagination
export const getPendingPayoutsService = async (page = 1, limit = 20) => {
  try {
    const token = localStorage.getItem("token");

    // ✅ Build query string properly
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const url = `${CONSTANTS.URL.BASE_URL}${
      CONSTANTS.URL.PAYOUTS_PENDING
    }?${queryParams.toString()}`;

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching pending payouts:",
      error.response?.data || error.message
    );
    return { payouts: [], pagination: {} };
  }
};

// ✅ Process Payout (if needed for future implementation)
export const processPayoutService = async (
  payoutId,
  transferProofUrls = []
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.PROCESS_PAYOUT(payoutId)}`,
      { transfer_proof_urls: transferProofUrls },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error processing payout:",
      error.response?.data || error.message
    );
    return {};
  }
};

// ✅ Upload Transfer Proof - Upload files first, then update payout
export const uploadTransferProofService = async (
  payoutId,
  files,
  adminNotes = "",
  paymentReference = ""
) => {
  try {
    const token = localStorage.getItem("token");

    // Step 1: Upload files to get URLs (following challenge service pattern)
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("attachment", file);

      const uploadResponse = await axios.post(
        `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.UPLOAD_MEDIA}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload API response:", uploadResponse.data);

      // Extract URL following the same pattern as challenge service
      return (
        uploadResponse.data?.uploadResponse?.fileURL ||
        uploadResponse.data?.url ||
        uploadResponse.data?.file_url ||
        uploadResponse.data?.attachment_url
      );
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    console.log("Uploaded URLs:", uploadedUrls);

    // Filter out any undefined URLs
    const validUrls = uploadedUrls.filter((url) => url);

    if (validUrls.length === 0) {
      throw new Error("No files were uploaded successfully");
    }

    // Step 2: Update payout with transfer proof URLs (matching API spec exactly)
    const requestBody = {
      admin_notes: adminNotes,
      transfer_proof_urls: validUrls,
      payment_reference: paymentReference,
    };

    console.log("Transfer proof request body:", requestBody);
    console.log(
      "Transfer proof URL:",
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.UPLOAD_TRANSFER_PROOF(
        payoutId
      )}`
    );

    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.UPLOAD_TRANSFER_PROOF(
        payoutId
      )}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error uploading transfer proof:",
      error.response?.data || error.message
    );
    console.error("❌ Full error:", error);
    throw error;
  }
};

// ✅ Mark Dispute as Resolved
export const markDisputeResolvedService = async (
  payoutId,
  paymentReference = ""
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${CONSTANTS.URL.BASE_URL}${CONSTANTS.URL.MARK_DISPUTE_RESOLVED(
        payoutId
      )}`,
      {
        payment_reference: paymentReference,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error marking dispute as resolved:",
      error.response?.data || error.message
    );
    throw error;
  }
};
