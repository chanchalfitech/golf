import { Timestamp } from "firebase/firestore";

export type RequestStatus = "pending" | "approved" | "rejected";

export interface PupilToCoachRequestProps {
  id: string;
  pupilId: string;
  pupilName: string;
  coachId: string;
  coachName: string;
  clubId?: string | null;
  clubName?: string | null;
  message: string;
  status: RequestStatus;
  requestedAt: Date;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  reviewNote?: string | null;
  createdAt: Date;
  updatedAt: Date;

  // ✅ new
  processed?: boolean; // has this request been applied to pupil + club?
    // ✅ new fields
  assignedClubId?: string | null;
  assignedClubName?: string | null;
  clubAssignedAt?: Date | null;
  clubAssignmentStatus?: RequestStatus;

}

export class PupilToCoachRequest {
  readonly id: string;
  readonly pupilId: string;
  readonly pupilName: string;
  readonly coachId: string;
  readonly coachName: string;
  readonly clubId?: string | null;
  readonly clubName?: string | null;
  readonly message: string;
  readonly status: RequestStatus;
  readonly requestedAt: Date;
  readonly reviewedBy?: string | null;
  readonly reviewedAt?: Date | null;
  readonly reviewNote?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  // ✅ new
  readonly processed: boolean;

  constructor(props: PupilToCoachRequestProps) {
    this.id = props.id;
    this.pupilId = props.pupilId;
    this.pupilName = props.pupilName;
    this.coachId = props.coachId;
    this.coachName = props.coachName;
    this.clubId = props.clubId ?? null;
    this.clubName = props.clubName ?? null;
    this.message = props.message ?? "";
    this.status = props.status ?? "pending";
    this.requestedAt = props.requestedAt;
    this.reviewedBy = props.reviewedBy ?? null;
    this.reviewedAt = props.reviewedAt ?? null;
    this.reviewNote = props.reviewNote ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.processed = props.processed ?? false;
  }

  /** ✅ Factory */
  static create(params: {
    id: string;
    pupilId: string;
    pupilName: string;
    coachId: string;
    coachName: string;
    clubId?: string;
    clubName?: string;
    message?: string;
  }) {
    const now = new Date();
    return new PupilToCoachRequest({
      id: params.id,
      pupilId: params.pupilId,
      pupilName: params.pupilName,
      coachId: params.coachId,
      coachName: params.coachName,
      clubId: params.clubId ?? null,
      clubName: params.clubName ?? null,
      message: params.message ?? "",
      status: "pending",
      requestedAt: now,
      createdAt: now,
      updatedAt: now,
      processed: false, // ✅ always false at creation
    });
  }

  /** ✅ Convert to Firestore JSON */
  toFirestore() {
    return {
      id: this.id,
      pupilId: this.pupilId,
      pupilName: this.pupilName,
      coachId: this.coachId,
      coachName: this.coachName,
      clubId: this.clubId ?? null,
      clubName: this.clubName ?? null,
      message: this.message,
      status: this.status,
      requestedAt: Timestamp.fromDate(this.requestedAt),
      reviewedBy: this.reviewedBy ?? null,
      reviewedAt: this.reviewedAt ? Timestamp.fromDate(this.reviewedAt) : null,
      reviewNote: this.reviewNote ?? null,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
      processed: this.processed, // ✅ new
    };
  }

  /** ✅ Build from Firestore JSON */
  static fromFirestore(json: any): PupilToCoachRequest {
    return new PupilToCoachRequest({
      id: json.id ?? "",
      pupilId: json.pupilId ?? "",
      pupilName: json.pupilName ?? "",
      coachId: json.coachId ?? "",
      coachName: json.coachName ?? "",
      clubId: json.clubId ?? null,
      clubName: json.clubName ?? null,
      message: json.message ?? "",
      status: (json.status as RequestStatus) ?? "pending",
      requestedAt:
        json.requestedAt instanceof Timestamp
          ? json.requestedAt.toDate()
          : new Date(),
      reviewedBy: json.reviewedBy ?? null,
      reviewedAt:
        json.reviewedAt instanceof Timestamp
          ? json.reviewedAt.toDate()
          : null,
      reviewNote: json.reviewNote ?? null,
      createdAt:
        json.createdAt instanceof Timestamp
          ? json.createdAt.toDate()
          : new Date(),
      updatedAt:
        json.updatedAt instanceof Timestamp
          ? json.updatedAt.toDate()
          : new Date(),
      processed: json.processed ?? false,
    });
  }

  /** ✅ Copy with modifications */
  copyWith(update: Partial<PupilToCoachRequestProps>) {
    return new PupilToCoachRequest({
      ...this,
      ...update,
    });
  }

  /** ✅ Helpers */
  get isPending() {
    return this.status === "pending";
  }
  get isApproved() {
    return this.status === "approved";
  }
  get isRejected() {
    return this.status === "rejected";
  }
}
