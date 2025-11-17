// /types/CoachVerificationRequest.ts
import { Timestamp } from "firebase/firestore";

export type VerificationStatus = "pending" | "approved" | "rejected";

export interface CoachVerificationRequestProps {
  id: string;
  coachId: string;
  coachName: string;
  message: string;
  status: VerificationStatus;
  requestedAt: Date;
  reviewedBy?: string | null;
  reviewedAt?: Date | null;
  reviewNote?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CoachVerificationRequest {
  readonly id: string;
  readonly coachId: string;
  readonly coachName: string;
  readonly message: string;
  readonly status: VerificationStatus;
  readonly requestedAt: Date;
  readonly reviewedBy?: string | null;
  readonly reviewedAt?: Date | null;
  readonly reviewNote?: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: CoachVerificationRequestProps) {
    this.id = props.id;
    this.coachId = props.coachId;
    this.coachName = props.coachName;
    this.message = props.message ?? "";
    this.status = props.status ?? "pending";
    this.requestedAt = props.requestedAt;
    this.reviewedBy = props.reviewedBy ?? null;
    this.reviewedAt = props.reviewedAt ?? null;
    this.reviewNote = props.reviewNote ?? null;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /** ✅ Factory: create a new request with defaults */
  static create({
    id,
    coachId,
    coachName,
    message,
  }: {
    id: string;
    coachId: string;
    coachName: string;
    message?: string;
  }) {
    const now = new Date();
    return new CoachVerificationRequest({
      id,
      coachId,
      coachName,
      message: message ?? "",
      status: "pending",
      requestedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  /** ✅ Firestore serializer */
  toFirestore() {
    return {
      id: this.id,
      coachId: this.coachId,
      coachName: this.coachName,
      message: this.message,
      status: this.status,
      requestedAt: Timestamp.fromDate(this.requestedAt),
      reviewedBy: this.reviewedBy ?? null,
      reviewedAt: this.reviewedAt
        ? Timestamp.fromDate(this.reviewedAt)
        : null,
      reviewNote: this.reviewNote ?? null,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
    };
  }

  /** ✅ Firestore deserializer */
  static fromFirestore(json: any): CoachVerificationRequest {
    return new CoachVerificationRequest({
      id: json.id ?? "",
      coachId: json.coachId ?? "",
      coachName: json.coachName ?? "",
      message: json.message ?? "",
      status: (json.status as VerificationStatus) ?? "pending",
      requestedAt:
        (json.requestedAt instanceof Timestamp
          ? json.requestedAt.toDate()
          : new Date()) ?? new Date(),
      reviewedBy: json.reviewedBy ?? null,
      reviewedAt: json.reviewedAt instanceof Timestamp
        ? json.reviewedAt.toDate()
        : null,
      reviewNote: json.reviewNote ?? null,
      createdAt:
        (json.createdAt instanceof Timestamp
          ? json.createdAt.toDate()
          : new Date()) ?? new Date(),
      updatedAt:
        (json.updatedAt instanceof Timestamp
          ? json.updatedAt.toDate()
          : new Date()) ?? new Date(),
    });
  }

  /** ✅ Copy with modifications (immutability helper) */
  copyWith(update: Partial<CoachVerificationRequestProps>): CoachVerificationRequest {
    return new CoachVerificationRequest({
      ...this,
      ...update,
    });
  }

  /** ✅ Status helpers */
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
