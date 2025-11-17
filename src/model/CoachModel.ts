import { Timestamp } from 'firebase/firestore';

export interface CoachModel {
  id: string;
  name: string;
  profilePic?: string;
  selectedClubId?: string;
  selectedClubName?: string;
  assignedClubId?: string;
  assignedClubName?: string;
  clubAssignedAt?: Date;
  clubAssignmentStatus?: string;
  verificationStatus: string;
  verifiedBy?: string;
  verifiedAt?: Date;
  maxPupils: number;
  currentPupils: number;
  acceptingNewPupils: boolean;
  experience?: number;
  createdAt: Date;
  updatedAt: Date;
}

export const coachModelFromFirestore = (data: any): CoachModel => {
  const parseDate = (value: any): Date => {
    if (!value) return new Date();
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === 'string') return new Date(value);
    if (typeof value === 'number') return new Date(value);
    return new Date();
  };

  const parseNumber = (value: any, fallback: number = 0): number => {
    if (value === null || value === undefined) return fallback;
    return typeof value === 'number' ? value : (Number(value) || fallback);
  };

  const parseBool = (value: any, fallback: boolean = false): boolean => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'boolean') return value;
    return fallback;
  };

  return {
    id: data.id?.toString() || '',
    name: data.name?.toString() || '',
    profilePic: data.profilePic?.toString(),
    selectedClubId: data.selectedClubId?.toString(),
    selectedClubName: data.selectedClubName?.toString(),
    assignedClubId: data.assignedClubId?.toString(),
    assignedClubName: data.assignedClubName?.toString(),
    clubAssignedAt: data.clubAssignedAt ? parseDate(data.clubAssignedAt) : undefined,
    clubAssignmentStatus: data.clubAssignmentStatus?.toString(),
    verificationStatus: data.verificationStatus?.toString() || 'pending',
    verifiedBy: data.verifiedBy?.toString(),
    verifiedAt: data.verifiedAt ? parseDate(data.verifiedAt) : undefined,
    maxPupils: parseNumber(data.maxPupils, 20),
    currentPupils: parseNumber(data.currentPupils, 0),
    acceptingNewPupils: parseBool(data.acceptingNewPupils, true),
    experience: data.experience !== null && data.experience !== undefined ? parseNumber(data.experience) : undefined,
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
  };
};

export const coachModelToFirestore = (coach: CoachModel): any => {
  return {
    id: coach.id,
    name: coach.name,
    profilePic: coach.profilePic || null,
    selectedClubId: coach.selectedClubId || null,
    selectedClubName: coach.selectedClubName || null,
    assignedClubId: coach.assignedClubId || null,
    assignedClubName: coach.assignedClubName || null,
    clubAssignedAt: coach.clubAssignedAt ? Timestamp.fromDate(coach.clubAssignedAt) : null,
    clubAssignmentStatus: coach.clubAssignmentStatus || null,
    verificationStatus: coach.verificationStatus,
    verifiedBy: coach.verifiedBy || null,
    verifiedAt: coach.verifiedAt ? Timestamp.fromDate(coach.verifiedAt) : null,
    maxPupils: coach.maxPupils,
    currentPupils: coach.currentPupils,
    acceptingNewPupils: coach.acceptingNewPupils,
    experience: coach.experience || null,
    createdAt: Timestamp.fromDate(coach.createdAt),
    updatedAt: Timestamp.fromDate(coach.updatedAt),
  };
};