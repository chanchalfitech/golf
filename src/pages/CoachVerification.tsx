import React, { useState } from 'react';
import { CoachVerificationRequest } from '../types/models';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import { fireDate } from '../utils/fireDate';


// import { doc, updateDoc } from 'firebase/firestore';
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from '../config/firebase'; // <-- adjust path to your firebase config

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row?: T) => React.ReactNode;
};

export default function CoachVerification() {
  const { data, loading, updateItem, deleteItem } =
    useFirestore<CoachVerificationRequest>('coach_verification_requests', [
      ['status', '==', 'pending'],
    ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<CoachVerificationRequest | null>(null);

  const handleView = (item: CoachVerificationRequest) => {
    setSelectedRequest(item);
    setIsModalOpen(true);
  };

  /* 2️⃣  UPDATED – syncs coaches & users collections */
  // const handleVerificationUpdate = async (
  //   id: string,
  //   status: 'approved' | 'rejected',
  //   reviewNote: string
  // ) => {
  //   try {
  //     // 1. update the request row
  //     await updateItem(id, {
  //       status,
  //       reviewedAt: new Date(),
  //       reviewNote,
  //     });

  //     const request = data.find((r) => r.id === id);
  //     if (!request) return;

  //     const { coachId, userId } = request;

  //     // 2. update coach doc – map "approved" → "verified"
  //     const coachRef = doc(db, 'coaches', coachId);
  //     const coachStatus = status === 'approved' ? 'verified' : status;
  //     await updateDoc(coachRef, {
  //       verificationStatus: coachStatus,
  //       verifiedAt: status === 'approved' ? new Date() : null,
  //     });

  //     // 3. update user doc
  //     const userRef = doc(db, 'users', userId);
  //     await updateDoc(userRef, {
  //       coachVerificationStatus: status,
  //     });

  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error(error);
  //     alert('Failed to update verification request');
  //   }
  // };

//   const handleVerificationUpdate = async (
//   id: string,
//   status: 'approved' | 'rejected' | 'pending',
//   reviewNote: string
// ) => {
//   try {
//     // 1. Always update the verification request itself
//     await updateItem(id, {
//       status,
//       reviewedAt: new Date(),
//       reviewNote,
//       updatedAt: new Date(),
//     });

//     const request = data.find((r) => r.id === id);
//     if (!request) return;

//     const { coachId, userId } = request;

//     // 🔒 If still pending, stop here (do NOT update coaches/club requests)
//     if (status === 'pending') {
//       console.log("Coach is still pending → skipping coach & club updates");
//       return;
//     }

//     // 2. Update coach document (only if approved/rejected)
//     const coachRef = doc(db, 'coaches', coachId);
//     const coachStatus = status === 'approved' ? 'verified' : 'rejected';
//     await updateDoc(coachRef, {
//       verificationStatus: coachStatus,
//       verifiedAt: status === 'approved' ? new Date() : null,
//     });

//     // 3. Update user document
//     const userRef = doc(db, 'users', userId);
//     await updateDoc(userRef, {
//       coachVerificationStatus: status,
//     });

//     // 4. Update related club requests for this coach
//     const clubReqsQuery = query(
//       collection(db, 'coach_club_requests'),
//       where('coachId', '==', coachId)
//     );
//     const clubReqsSnap = await getDocs(clubReqsQuery);
//     clubReqsSnap.forEach(async (docSnap) => {
//       await updateDoc(docSnap.ref, {
//         clubRequestStatus: status === 'approved' ? 'approved' : 'blocked',
//         updatedAt: new Date(),
//       });
//     });

//     setIsModalOpen(false);
//   } catch (error) {
//     console.error(error);
//     alert('Failed to update verification request');
//   }
// };
   const handleVerificationUpdate = async (
  id: string,
  status: "approved" | "rejected" | "pending",
  reviewNote: string
) => {
  try {
    // 1. Update the verification request itself
    await updateItem(id, {
      status,
      reviewedAt: new Date(),
      reviewNote,
      reviewedBy: "admin",
      updatedAt: new Date(),
    });

    const request = data.find((r) => r.id === id);
    if (!request) return;

    const { coachId, userId } = request;

    // 2. Update coach document
    const coachRef = doc(db, "coaches", coachId);
    let coachStatus: string | null = null;

    if (status === "approved") coachStatus = "verified";
    if (status === "rejected") coachStatus = "rejected";
    if (status === "pending") coachStatus = "pending";

    await updateDoc(coachRef, {
      verificationStatus: coachStatus,
      verifiedAt: status === "approved" ? new Date() : null,
      updatedAt: new Date(),
    });

    // 3. Update user document
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      coachVerificationStatus: status,
      updatedAt: new Date(),
    });

    // 4. Update related club requests for this coach
    const clubReqsQuery = query(
      collection(db, "coach_club_requests"),
      where("coachId", "==", coachId)
    );
    const clubReqsSnap = await getDocs(clubReqsQuery);

    for (const docSnap of clubReqsSnap.docs) {
      await updateDoc(docSnap.ref, {
        clubRequestStatus:
          status === "approved"
            ? "approved"
            : status === "rejected"
            ? "blocked"
            : "pending", // ✅ keep consistent
        updatedAt: new Date(),
      });
    }

    setIsModalOpen(false);
  } catch (error) {
    console.error(error);
    alert("Failed to update verification request");
  }
};
  /* 3️⃣  NEW – delete handler */
  const handleDelete = async (item: CoachVerificationRequest) => {
    if (!window.confirm(`Delete request for coach ${item.coachName}?`)) return;
    try {
      await deleteItem(item.id);
    } catch (err) {
      alert('Could not delete request');
    }
  };

  const columns: Column<CoachVerificationRequest>[] = [
    // { key: 'coachId', label: 'Coach ID' },
    { key: 'coachName', label: 'Coach Name' },
    {
      key: 'requestedAt',
      label: 'Request Date',
      render: (value: any) => fireDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'approved'
              ? 'bg-green-100 text-green-800'
              : value === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: 'reviewedAt',
      label: 'Review Date',
      render: (value: any) => fireDate(value),
    },
    {
      key: 'reviewedBy',
      label: 'Reviewed By',
      render: (value: string, row) =>
        value ? `${value} • Coach: ${row?.coachName}` : '—', // 🔹 CHANGED: show both admin + coachName
    },
     {
        key: "updatedAt" as keyof CoachVerificationRequest,
        label: "Last Updated",
        render: (value: Date | undefined) => value ? fireDate(value) : "Not updated",
      },
  ];

  return (
    <div>
      <CrudTable
        title="Coach Verification Requests"
        data={data.filter((item) => item.status === 'pending')}
        columns={columns}
        // onAdd={() => {}}
        onEdit={handleView}
        // onDelete={handleDelete} /* <-- NEW */
        loading={loading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Coach Verification Details"
        size="lg"
      >
        {selectedRequest && (
          <VerificationDetails
            request={selectedRequest}
            onUpdate={handleVerificationUpdate}
          />
        )}
      </Modal>
    </div>
  );
}

/* VerificationDetails component – unchanged except minor type fix */
function VerificationDetails({
  request,
  onUpdate,
}: {
  request: CoachVerificationRequest;
  onUpdate: (id: string, status: 'approved' | 'rejected', reviewNote: string) => void;
}) {
  const [reviewNote, setReviewNote] = useState(request.reviewNote || '');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Coach ID</label>
        <p className="mt-1 text-sm text-gray-900">{request.coachId}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Coach name</label>
        <p className="mt-1 text-sm text-gray-900">{request.coachName}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <p className="mt-1 text-sm text-gray-900">{request.message}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Requested at</label>
          <p className="mt-1 text-sm text-gray-900">{fireDate(request.requestedAt)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              request.status === 'approved'
                ? 'bg-green-100 text-green-800'
                : request.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {request.status}
          </span>
        </div>
      </div>

            <div>
        <label className="block text-sm font-medium text-gray-700">Reviewed By</label>
        <p className="mt-1 text-sm text-gray-900">
          {request.reviewedBy
            ? `${request.reviewedBy} • Coach: ${request.coachName}` // 🔹 CHANGED: show both admin + coach name
            : '—'}
        </p>
      </div>


      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Review note</label>
        <textarea
          value={reviewNote}
          onChange={(e) => setReviewNote(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add notes about the verification review..."
        />
      </div>

      {request.status === 'pending' && (
        <div className="flex justify-end space-x-3 pt-4">
          <button
            onClick={() => onUpdate(request.id, 'rejected', reviewNote)}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
          >
            Reject
          </button>
          <button
            onClick={() => onUpdate(request.id, 'approved', reviewNote)}
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}


















