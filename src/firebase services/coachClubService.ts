import { doc, getDoc, updateDoc, increment, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ServiceResponse {
  success: boolean;
  message: string;
}


export async function approveCoachToClubRequest(
  requestId: string,
  reviewedBy?: string
): Promise<ServiceResponse> {
  try {
    // 1. Get request data
    const requestRef = doc(db, 'coach_to_club_requests', requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, message: 'Request not found' };
    }

    const requestData = requestSnap.data();

    if (requestData.status !== 'pending') {
      return { success: false, message: `Request already ${requestData.status}` };
    }

    const now = new Date();

    // 2. Update request
    await updateDoc(requestRef, {
      status: 'approved',
      reviewedBy: reviewedBy || null,
      reviewedAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    // 3. Update coach
    const coachRef = doc(db, 'coaches', requestData.coachId);
    await updateDoc(coachRef, {
      assignedClubId: requestData.clubId,
      assignedClubName: requestData.clubName,
      clubAssignedAt: Timestamp.fromDate(now),
      clubAssignmentStatus: 'assigned',
      updatedAt: Timestamp.fromDate(now),
    });

    // 4. Update club
    const clubRef = doc(db, 'clubs', requestData.clubId);
    await updateDoc(clubRef, {
      totalCoaches: increment(1),
      updatedAt: Timestamp.fromDate(now),
    });

    return {
      success: true,
      message: `Coach successfully assigned to ${requestData.clubName}`,
    };
  } catch (error: any) {
    console.error('Error approving request:', error);
    return {
      success: false,
      message: error.message || 'Failed to approve request',
    };
  }
}

/**
 * Reject a coach-to-club request
 * Updates: Request status only
 */
export async function rejectCoachToClubRequest(
  requestId: string,
  reviewNote?: string,
  reviewedBy?: string
): Promise<ServiceResponse> {
  try {
    const requestRef = doc(db, 'coach_to_club_requests', requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      return { success: false, message: 'Request not found' };
    }

    const requestData = requestSnap.data();

    if (requestData.status !== 'pending') {
      return { success: false, message: `Request already ${requestData.status}` };
    }

    const now = new Date();

    await updateDoc(requestRef, {
      status: 'rejected',
      reviewedBy: reviewedBy || null,
      reviewedAt: Timestamp.fromDate(now),
      reviewNote: reviewNote || null,
      updatedAt: Timestamp.fromDate(now),
    });

    return {
      success: true,
      message: 'Request rejected successfully',
    };
  } catch (error: any) {
    console.error('Error rejecting request:', error);
    return {
      success: false,
      message: error.message || 'Failed to reject request',
    };
  }
}