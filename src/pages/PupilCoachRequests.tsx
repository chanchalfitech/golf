import React, { useState } from "react";
import { PupilToCoachRequest } from "../model/PupilToCoachRequest";
import { useFirestore } from "../hooks/useFirestore";
import CrudTable from "../components/CrudTable";
import Modal from "../components/Modal";
import {
  approvePupilToCoachRequest,
  rejectPupilToCoachRequest,
} from "../firebase services/pupilToCoachService";
import { fireDate } from '../utils/fireDate';

export default function PupilCoachRequests() {
  const { 
    data, 
    loading,
    fetchNextPage,
    hasMore
   } = useFirestore<PupilToCoachRequest>("pupil_to_coach_requests", [], 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<PupilToCoachRequest | null>(null);

  const handleView = (item: PupilToCoachRequest) => {
    setSelectedRequest(item);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    const res = await approvePupilToCoachRequest(id, "admin");
    alert(res.message);
    setIsModalOpen(false);
  };

  const handleReject = async (id: string) => {
    const res = await rejectPupilToCoachRequest(id, "Not a valid request", "admin");
    alert(res.message);
    setIsModalOpen(false);
  };


  const columns = [
    // { key: "coachId" as keyof PupilToCoachRequest, label: "id" },
    { key: "coachName" as keyof PupilToCoachRequest, label: "Coach" },
    { key: "pupilName" as keyof PupilToCoachRequest, label: "Pupil Name" },
    { key: "clubName" as keyof PupilToCoachRequest, label: "Club" },
    // { key: "assignedClubId" as keyof PupilToCoachRequest, label: "Assigned Club ID" },
    { key: "assignedClubName" as keyof PupilToCoachRequest, label: "Assigned Club" },

    {
      key: 'clubAssignmentStatus' as keyof PupilToCoachRequest,
      label: 'Club Status',
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approved'
            ? 'bg-green-100 text-green-800'
            : v === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
            }`}
        >
          {v || 'pending'}
        </span>
      ),
    },
    {
      key: "requestedAt" as keyof PupilToCoachRequest,
      label: "Requested At",
      render: (value: any) => fireDate(value),
    },

    {
      key: "status" as keyof PupilToCoachRequest,
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${value === "approved"
            ? "bg-green-100 text-green-800"
            : value === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
            }`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "updatedAt" as keyof PupilToCoachRequest,
      label: "updated At",
      render: (value: any) => fireDate(value),
    },
  ];

  return (
    <div>
      <CrudTable
        title="Pupil-Coach Requests"
        data={data}
        columns={columns}
        onEdit={handleView}
        // onDelete={() => { }}
        loading={loading}
      />

      <div className="flex justify-center my-4">
        {hasMore && (
          <button
            onClick={fetchNextPage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Pupil-Coach Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <p><strong>Pupil:</strong> {selectedRequest.pupilName} ({selectedRequest.pupilId})</p>
            <p><strong>Coach:</strong> {selectedRequest.coachName} ({selectedRequest.coachId})</p>
            <p><strong>Club:</strong> {selectedRequest.clubName ?? "—"}</p>
            <p><strong>Message:</strong> {selectedRequest.message || "—"}</p>
            <p><strong>Status:</strong> {selectedRequest.status}</p>
            <p><strong>Requested At:</strong> {fireDate(selectedRequest.requestedAt)}</p>
            <p><strong>Reviewed By:</strong> {selectedRequest.reviewedBy || "—"}</p>
            <p><strong>Reviewed At:</strong> {selectedRequest.reviewedAt ? fireDate(selectedRequest.reviewedAt) : "—"}</p>

            {selectedRequest.status === "pending" && (
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg"
                >
                  Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
