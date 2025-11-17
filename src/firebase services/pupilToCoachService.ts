import { doc, getDoc, updateDoc, increment, Timestamp } from "firebase/firestore";
import { db } from "../config/firebase";

interface ServiceResponse {
  success: boolean;
  message: string;
}

export async function approvePupilToCoachRequest(
  requestId: string,
  reviewedBy?: string
): Promise<ServiceResponse> {
  try {
    // 1. Get request
    const requestRef = doc(db, "pupil_to_coach_requests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, message: "Request not found" };
    }

    const req = requestSnap.data();

    if (req.status !== "pending") {
      return { success: false, message: `Request already ${req.status}` };
    }

      // ✅ Fix: define now
    const now = new Date();
    
     // 2. Update request (✅ also add assignment fields so UI can display them)
    await updateDoc(requestRef, {
      status: "approved",
      reviewedBy: reviewedBy || null,
      reviewedAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
      processed: true,

      // 🔑 assignment fields mirrored into request doc
      assignedClubId: req.clubId ?? null,
      assignedClubName: req.clubName ?? null,
      clubAssignedAt: Timestamp.fromDate(now),
      clubAssignmentStatus: "approved",
    });

    // 3. Update pupil
    
    const pupilRef = doc(db, "pupils", req.pupilId); // <-- FIX: use correct collection "pupils"
    await updateDoc(pupilRef, {
      assignedCoachId: req.coachId,
      assignedCoachName: req.coachName,
      coachAssignedAt: Timestamp.fromDate(now),
      assignmentStatus: "approved",

      // ✅ mirror club assignment info
      assignedClubId: req.clubId ?? null,
      assignedClubName: req.clubName ?? null,
      clubAssignedAt: Timestamp.fromDate(now),
      clubAssignmentStatus: "approved",

      updatedAt: Timestamp.fromDate(now),
    });

    // 4. Update club (if club exists)
    if (req.clubId) {
      const clubRef = doc(db, "clubs", req.clubId);
      await updateDoc(clubRef, {
        totalPupils: increment(1),
        updatedAt: Timestamp.fromDate(now),
      });
    }

    return { success: true, message: "Request approved successfully" };
  } catch (error: any) {
    console.error("Error approving request:", error);
    return { success: false, message: error.message || "Failed to approve request" };
  }
}

export async function rejectPupilToCoachRequest(
  requestId: string,
  reviewNote?: string,
  reviewedBy?: string
): Promise<ServiceResponse> {
  try {
    const requestRef = doc(db, "pupil_to_coach_requests", requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, message: "Request not found" };
    }

    const req = requestSnap.data();

    if (req.status !== "pending") {
      return { success: false, message: `Request already ${req.status}` };
    }

    const now = new Date();

    await updateDoc(requestRef, {
      status: "rejected",
      reviewedBy: reviewedBy || null,
      reviewedAt: Timestamp.fromDate(now),
      reviewNote: reviewNote || null,
      updatedAt: Timestamp.fromDate(now),
    });

    return { success: true, message: "Request rejected successfully" };
  } catch (error: any) {
    console.error("Error rejecting request:", error);
    return { success: false, message: error.message || "Failed to reject request" };
  }
}
