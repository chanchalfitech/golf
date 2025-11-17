import React, { useState } from 'react';
import { CoachToClubRequest } from '../model/coach_to_club_request';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import { fireDate } from '../utils/fireDate';
import { approveCoachToClubRequest, rejectCoachToClubRequest } from '../firebase services/coachClubService';

export default function CoachClubRequests() {
  const { 
    data,
     loading,
     fetchNextPage,
     hasMore
     } = useFirestore<CoachToClubRequest>('coach_to_club_requests', [], 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CoachToClubRequest | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleView = (item: CoachToClubRequest) => {
    setSelectedRequest(item);
    setIsModalOpen(true);
    setError(null);
  };

  const handleApprove = async () => {
    if (!selectedRequest?.id) return;

    setProcessing(true);
    setError(null);

    const result = await approveCoachToClubRequest(selectedRequest.id);

    if (result.success) {
      alert(result.message);
      setIsModalOpen(false);
      setSelectedRequest(null);
    } else {
      setError(result.message);
    }

    setProcessing(false);
  };

  const handleReject = async () => {
    if (!selectedRequest?.id) return;

    const reviewNote = prompt('Reason for rejection (optional):');

    setProcessing(true);
    setError(null);

    const result = await rejectCoachToClubRequest(
      selectedRequest.id,
      reviewNote || undefined
    );

    if (result.success) {
      alert(result.message);
      setIsModalOpen(false);
      setSelectedRequest(null);
    } else {
      setError(result.message);
    }

    setProcessing(false);
  };

  const columns = [
    { key: 'coachName' as keyof CoachToClubRequest, label: 'Coach Name' },
    { key: 'clubName' as keyof CoachToClubRequest, label: 'Club Name' },
    {
      key: 'requestedAt' as keyof CoachToClubRequest,
      label: 'Request Date',
      render: (value: Date) => fireDate(value),
    },
    {
      key: 'updatedAt' as keyof CoachToClubRequest,
      label: 'Last Updated',
      render: (value: Date) => fireDate(value),
    },
    {
      key: 'status' as keyof CoachToClubRequest,
      label: 'Status',
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'approved'
              ? 'bg-green-100 text-green-800'
              : value === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800' // if value is not approved/rejected.
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <div>
      <CrudTable
        title="Coach-Club Requests"
        data={data}
        columns={columns}
        onEdit={handleView}
        // onDelete={() => {}}
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
        onClose={() => {
          setIsModalOpen(false);
          setError(null);
        }}
        title="Coach-Club Request Details"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Coach Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRequest.coachName}
                </p>
                <p className="text-xs text-gray-500">ID: {selectedRequest.coachId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Club Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedRequest.clubName}
                </p>
                <p className="text-xs text-gray-500">ID: {selectedRequest.clubId}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                {selectedRequest.message || 'No message provided'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Request Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {fireDate(selectedRequest.requestedAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    selectedRequest.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : selectedRequest.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            {selectedRequest.reviewedAt && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Reviewed At
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {fireDate(selectedRequest.reviewedAt)}
                  </p>
                </div>
                {selectedRequest.reviewedBy && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Reviewed By
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRequest.reviewedBy}
                    </p>
                  </div>
                )}
              </div>
            )}

            {selectedRequest.reviewNote && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Review Note
                </label>
                <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                  {selectedRequest.reviewNote}
                </p>
              </div>
            )}

            {selectedRequest.status === 'pending' && (
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Reject'}
                </button>
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Approve'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}



















