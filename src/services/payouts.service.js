// ===== PAYOUTS.SERVICE.JS =====
import { CONSTANTS } from "../utils/constants.js";
import api from "../api/api"; // ✅ common axios instance with BASE_URL + token
import { uploadMediaFile } from "./upload.service"; // ✅ reuse existing upload logic

/**
 * Get Pending Payouts (with pagination)
 * GET /api/v1/admin/earnings/payouts/pending?page=&limit=
 */
export const getPendingPayoutsService = async (page = 1, limit = 20) => {
  try {
    const res = await api.get(CONSTANTS.URL.PAYOUTS_PENDING, {
      params: { page, limit }, // -> ?page=1&limit=20
    });

    // Expected shape:
    // {
    //   message: "Pending payouts retrieved successfully",
    //   payouts: [...],
    //   pagination: { page, limit, total }
    // }
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching pending payouts:",
      error.response?.data || error.message
    );

    return {
      payouts: [],
      pagination: { page: 1, limit, total: 0 },
    };
  }
};

/**
 * Upload transfer proof AND complete payout (for PENDING payouts)
 *
 * Flow:
 *  1) Upload files to /api/v1/file/upload → get file URLs
 *  2) Call PUT /api/v1/admin/earnings/payouts/:payoutId/complete
 *     (via CONSTANTS.URL.MARK_DISPUTE_RESOLVED)
 *
 * This is what you should call from PendingPayouts.jsx
 */
export const uploadTransferProofService = async (
  payoutId,
  files,
  adminNotes = "",
  paymentReference = ""
) => {
  try {
    // 1️⃣ Upload each file and get URL using existing uploadMediaFile()
    // Allowed types are validated in the React component (pdf + images)
    const uploadPromises = files.map((file) => uploadMediaFile(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    const validUrls = uploadedUrls.filter((url) => !!url);
    if (validUrls.length === 0) {
      throw new Error("No files were uploaded successfully");
    }

    // 2️⃣ Call /complete endpoint with proof URLs
    const body = {
      admin_notes: adminNotes,
      transfer_proof_urls: validUrls,
      payment_reference: paymentReference,
    };

    const res = await api.put(
      CONSTANTS.URL.MARK_DISPUTE_RESOLVED(payoutId), // -> /payouts/:id/complete
      body
    );

    // Backend example response:
    // {
    //   "admin_notes":"",
    //   "transfer_proof_urls":["invoice.pdf"],
    //   "payment_reference":""
    // }
    // or possibly { payout, message }
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error uploading transfer proof & completing payout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * OPTIONAL: Update transfer proof on an ALREADY COMPLETED payout
 * (if you later build a "Completed payouts" page)
 *
 * Uses /payouts/:id/transfer-proof endpoint.
 * Not used on Pending page.
 */
export const updateTransferProofForCompletedPayoutService = async (
  payoutId,
  files,
  adminNotes = "",
  paymentReference = ""
) => {
  try {
    const uploadPromises = files.map((file) => uploadMediaFile(file));
    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url) => !!url);

    if (validUrls.length === 0) {
      throw new Error("No files were uploaded successfully");
    }

    const body = {
      admin_notes: adminNotes,
      transfer_proof_urls: validUrls,
      payment_reference: paymentReference,
    };

    const res = await api.put(
      CONSTANTS.URL.UPLOAD_TRANSFER_PROOF(payoutId), // -> /payouts/:id/transfer-proof
      body
    );

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error updating transfer proof for completed payout:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * OPTIONAL: Manually complete payout WITHOUT uploading new proof
 * (if you ever need a separate “Mark as paid” without file upload)
 */
export const processPayoutService = async (
  payoutId,
  { adminNotes = "", paymentReference = "", transferProofUrls = [] } = {}
) => {
  try {
    const body = {
      admin_notes: adminNotes,
      transfer_proof_urls: transferProofUrls,
      payment_reference: paymentReference,
    };

    const res = await api.put(
      CONSTANTS.URL.MARK_DISPUTE_RESOLVED(payoutId), // /complete
      body
    );

    return res.data;
  } catch (error) {
    console.error(
      "❌ Error processing payout:",
      error.response?.data || error.message
    );
    throw error;
  }
};
