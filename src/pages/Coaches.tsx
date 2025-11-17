import React, { useState } from 'react';
import { Coach } from '../model/CoachModel';
import { useFirestore } from '../hooks/useFirestore';
import CrudTable from '../components/CrudTable';
import Modal from '../components/Modal';
import { fireDate } from '../utils/fireDate';

export default function Coaches() {
  const {
    data,
    loading,
    fetchNextPage,
    hasMore
  } = useFirestore<Coach>('coaches', [], 10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  const handleView = (item: Coach) => {
    setSelectedCoach(item);
    setIsModalOpen(true);
  };

  const columns = [
    {
      key: "name" as keyof Coach,
      label: "Coach",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.profilePic && (
            <img
              src={row.profilePic}
              alt={row.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span>{row.name}</span>
        </div>
      ),
    },
    { key: 'selectedClubName' as keyof Coach, label: 'Requested Club' },
    { key: 'assignedClubId' as keyof Coach, label: 'Assigned Club ID' },
    { key: 'assignedClubName' as keyof Coach, label: 'Assigned Club' },
    {
      key: 'clubAssignmentStatus' as keyof Coach,
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
      key: 'verificationStatus' as keyof Coach,
      label: 'Verification',
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${v === 'approve'
            ? 'bg-green-100 text-green-800'
            : v === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
            }`}
        >
          {v}
        </span>
      ),
    },
    { key: 'maxPupils' as keyof Coach, label: 'Max Pupils' },
    // { key: 'currentPupils' as keyof Coach, label: 'Current Pupils' },
    {
      key: 'acceptingNewPupils' as keyof Coach,
      label: 'Accepting Pupils',
      render: (v) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${v ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
        >
          {v ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'clubAssignedAt' as keyof Coach,
      label: 'Assigned At',
      render: (v) => (v ? fireDate(v) : 'Not Assigned'),
    },
    {
      key: 'updatedAt' as keyof Coach,
      label: 'Last Updated',
      render: (v) => (v ? fireDate(v) : 'Not updated'),
    },
  ];

  return (
    <>
      <CrudTable
        title="Coaches"
        data={data}
        columns={columns}
        onEdit={handleView}
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
        title="Coach Details"
        size="lg"
      >
        {selectedCoach && <CoachDetails coach={selectedCoach} />}
      </Modal>
    </>
  );
}

function CoachDetails({ coach }: { coach: Coach }) {
  const safeDate = (d?: any) => (d ? fireDate(d) : '—');

  return (
    <div className="space-y-4 text-sm">
      <div className="flex items-center gap-3">
        {coach.profilePic && (
          <img
            src={coach.profilePic}
            alt={coach.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-lg">{coach.name}</p>
          <p className="text-gray-500">
            {coach.experience ? `${coach.experience} yrs experience` : '—'}
          </p>
        </div>
      </div>

      {/* Club Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Requested Club</label>
          <p className="mt-1">{coach.selectedClubName || '—'}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Assigned Club</label>
          <p className="mt-1">{coach.assignedClubName || '—'}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Assigned Club ID</label>
          <p className="mt-1">{coach.assignedClubId || '—'}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Club Assigned At</label>
          <p className="mt-1">{coach.clubAssignedAt ? fireDate(coach.clubAssignedAt) : '—'}</p>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Club Status</label>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${coach.clubAssignmentStatus === 'approved'
              ? 'bg-green-100 text-green-800'
              : coach.clubAssignmentStatus === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {coach.clubAssignmentStatus || 'pending'}
          </span>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Verification</label>
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${coach.verificationStatus === 'approve'
              ? 'bg-green-100 text-green-800'
              : coach.verificationStatus === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {coach.verificationStatus}
          </span>
        </div>
      </div>

      {/* Pupils */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Max Pupils</label>
          <p className="mt-1">{coach.maxPupils}</p>
        </div>
        {/* <div>
          <label className="block font-medium text-gray-700">Current Pupils</label>
          <p className="mt-1">{coach.currentPupils}</p>
        </div> */}
      </div>

      {/* Accepting Pupils */}
      <div>
        <label className="block font-medium text-gray-700">Accepting New Pupils</label>
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${coach.acceptingNewPupils
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
            }`}
        >
          {coach.acceptingNewPupils ? 'Yes' : 'No'}
        </span>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium text-gray-700">Created</label>
          <p className="mt-1">{safeDate(coach.createdAt)}</p>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Last Updated</label>
          <p className="mt-1">{safeDate(coach.updatedAt)}</p>
        </div>
      </div>

    </div>
  );
}




















