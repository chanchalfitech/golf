import { Timestamp } from 'firebase/firestore';

// Club Model
export interface ClubModel {
  id: string;
  name: string;
  location: string;
  description: string;
  contactEmail: string;
  isActive: boolean;
  totalCoaches: number;
  totalPupils: number;
  createdAt: Date;
  updatedAt: Date;
}

export const clubModelFromFirestore = (data: any, id: string): ClubModel => {
  const toDateTime = (v: any): Date => {
    if (v instanceof Timestamp) return v.toDate();
    return new Date();
  };

  return {
    id,
    name: data.name || '',
    location: data.location || '',
    description: data.description || '',
    contactEmail: data.contactEmail || '',
    isActive: data.isActive ?? true,
    totalCoaches: data.totalCoaches || 0,
    totalPupils: data.totalPupils || 0,
    createdAt: toDateTime(data.createdAt),
    updatedAt: toDateTime(data.updatedAt),
  };
};

export const clubModelToFirestore = (club: ClubModel): any => {
  return {
    name: club.name,
    location: club.location,
    description: club.description,
    contactEmail: club.contactEmail,
    isActive: club.isActive,
    totalCoaches: club.totalCoaches,
    totalPupils: club.totalPupils,
    createdAt: Timestamp.fromDate(club.createdAt),
    updatedAt: Timestamp.fromDate(club.updatedAt),
  };
};

// Coach to Club Request Model
export interface CoachToClubRequest {
  id?: string;
  coachId: string;
  coachName: string;
  clubId: string;
  clubName: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const coachToClubRequestFromFirestore = (data: any): CoachToClubRequest => {
  return {
    id: data.id || '',
    coachId: data.coachId || '',
    coachName: data.coachName || '',
    clubId: data.clubId || '',
    clubName: data.clubName || '',
    message: data.message || '',
    status: data.status || 'pending',
    requestedAt: data.requestedAt instanceof Timestamp ? data.requestedAt.toDate() : new Date(),
    reviewedBy: data.reviewedBy,
    reviewedAt: data.reviewedAt instanceof Timestamp ? data.reviewedAt.toDate() : undefined,
    reviewNote: data.reviewNote,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(),
  };
};

export const coachToClubRequestToFirestore = (request: CoachToClubRequest): any => {
  return {
    id: request.id,
    coachId: request.coachId,
    coachName: request.coachName,
    clubId: request.clubId,
    clubName: request.clubName,
    message: request.message,
    status: request.status,
    requestedAt: Timestamp.fromDate(request.requestedAt),
    reviewedBy: request.reviewedBy || null,
    reviewedAt: request.reviewedAt ? Timestamp.fromDate(request.reviewedAt) : null,
    reviewNote: request.reviewNote || null,
    createdAt: Timestamp.fromDate(request.createdAt),
    updatedAt: Timestamp.fromDate(request.updatedAt),
  };
};