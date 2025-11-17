// src/models/pupil/PupilModel.ts
import {
  Timestamp,
  serverTimestamp,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  DocumentData,
} from "firebase/firestore";
import { LevelProgress } from "./level_progress";
import { Subscription } from "../subscription model/subscription";

/* =========================
   Enums & helpers
   ========================= */
export type AssignmentStatus = "pending" | "approved" | "rejected" | null;
export type ClubAssignmentStatus = "pending" | "approved" | "rejected" | null;

const toDate = (value: any, fallbackNow = false): Date | null => {
  if (value == null) return fallbackNow ? new Date() : null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === "number" || typeof value === "string") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? (fallbackNow ? new Date() : null) : d;
  }
  return fallbackNow ? new Date() : null;
};

const toInt = (value: any, fallback = 0): number => {
  if (typeof value === "number") return value;
  if (value == null) return fallback;
  const n = parseInt(String(value), 10);
  return isNaN(n) ? fallback : n;
};

const toFloat = (value: any, fallback = 0): number => {
  if (typeof value === "number") return value;
  if (value == null) return fallback;
  const n = parseFloat(String(value));
  return isNaN(n) ? fallback : n;
};

/* =========================
   Interface
   ========================= */
export interface IPupilModel {
  id: string;
  name: string;
  dateOfBirth?: Date | null;
  profilePic?: string | null;
  handicap?: string | null;

  selectedCoachId?: string | null;
  selectedCoachName?: string | null;
  selectedClubId?: string | null;
  selectedClubName?: string | null;

  assignedCoachId?: string | null;
  assignedCoachName?: string | null;
  coachAssignedAt?: Date | null;
  assignmentStatus?: AssignmentStatus;

  assignedClubId?: string | null;
  assignedClubName?: string | null;
  clubAssignedAt?: Date | null;
  clubAssignmentStatus?: ClubAssignmentStatus;

  currentLevel: number;
  unlockedLevels: number[];
  totalXP: number;

  levelProgress: Record<number, LevelProgress>;

  totalLessonsCompleted: number;
  totalQuizzesCompleted: number;
  totalChallengesCompleted: number;
  averageQuizScore: number; // 0-100
  streakDays: number;
  lastActivityDate: Date;

  badges: string[];
  subscription?: Subscription | null;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================
   Class
   ========================= */
export class PupilModel implements IPupilModel {
  id!: string;
  name!: string;
  dateOfBirth?: Date | null;
  profilePic?: string | null;
  handicap?: string | null;

  selectedCoachId?: string | null;
  selectedCoachName?: string | null;
  selectedClubId?: string | null;
  selectedClubName?: string | null;

  assignedCoachId?: string | null;
  assignedCoachName?: string | null;
  coachAssignedAt?: Date | null;
  assignmentStatus?: AssignmentStatus;

  assignedClubId?: string | null;
  assignedClubName?: string | null;
  clubAssignedAt?: Date | null;
  clubAssignmentStatus?: ClubAssignmentStatus;

  currentLevel!: number;
  unlockedLevels!: number[];
  totalXP!: number;

  levelProgress!: Record<number, LevelProgress>;

  totalLessonsCompleted!: number;
  totalQuizzesCompleted!: number;
  totalChallengesCompleted!: number;
  averageQuizScore!: number;
  streakDays!: number;
  lastActivityDate!: Date;

  badges!: string[];
  subscription?: Subscription | null;

  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: IPupilModel) {
    Object.assign(this, data);
  }

  /* ---------- Factory (plain data -> model) ---------- */
  static fromFirestore(data: any, id?: string): PupilModel {
    // Level progress (keys might be strings in Firestore)
    const lvlProgEntries = Object.entries(data?.levelProgress ?? {}).map(
      ([k, v]) => [parseInt(k, 10), LevelProgress.fromJson(v)]
    );
    const levelProgress = Object.fromEntries(lvlProgEntries) as Record<number, LevelProgress>;

    return new PupilModel({
      id: id ?? data?.id ?? "",
      name: data?.name ?? "",

      dateOfBirth: toDate(data?.dateOfBirth),
      profilePic: data?.profilePic ?? null,
      handicap: data?.handicap ?? null,

      selectedCoachId: data?.selectedCoachId ?? null,
      selectedCoachName: data?.selectedCoachName ?? null,
      selectedClubId: data?.selectedClubId ?? null,
      selectedClubName: data?.selectedClubName ?? null,

      assignedCoachId: data?.assignedCoachId ?? null,
      assignedCoachName: data?.assignedCoachName ?? null,
      coachAssignedAt: toDate(data?.coachAssignedAt),
      assignmentStatus: (data?.assignmentStatus as AssignmentStatus) ?? null,

      assignedClubId: data?.assignedClubId ?? null,
      assignedClubName: data?.assignedClubName ?? null,
      clubAssignedAt: toDate(data?.clubAssignedAt),
      clubAssignmentStatus: (data?.clubAssignmentStatus as ClubAssignmentStatus) ?? null,

      currentLevel: toInt(data?.currentLevel, 1),
      unlockedLevels:
        (Array.isArray(data?.unlockedLevels) ? data.unlockedLevels : [1]).map((n: any) => toInt(n, 1)),

      totalXP: toInt(data?.totalXP, 0),

      levelProgress,

      totalLessonsCompleted: toInt(data?.totalLessonsCompleted, 0),
      totalQuizzesCompleted: toInt(data?.totalQuizzesCompleted, 0),
      totalChallengesCompleted: toInt(data?.totalChallengesCompleted, 0),
      averageQuizScore: toFloat(data?.averageQuizScore, 0),
      streakDays: toInt(data?.streakDays, 0),
      lastActivityDate: toDate(data?.lastActivityDate, true)!,

      badges: Array.isArray(data?.badges) ? (data.badges as string[]) : [],

      subscription: data?.subscription ? Subscription.fromFirestore(data.subscription) : null,

      createdAt: toDate(data?.createdAt, true)!,
      updatedAt: toDate(data?.updatedAt, true)!,
    });
  }

  /* ---------- Serializer (model -> Firestore) ---------- */
  toFirestore(serverTime = false): any {
    // When serverTime=true, createdAt/updatedAt are set to serverTimestamp()
    const baseDates = serverTime
      ? {
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      : {
        createdAt: Timestamp.fromDate(this.createdAt),
        updatedAt: Timestamp.fromDate(this.updatedAt),
      };

    return {
      id: this.id,
      name: this.name,
      dateOfBirth: this.dateOfBirth ? Timestamp.fromDate(this.dateOfBirth) : null,
      profilePic: this.profilePic ?? null,
      handicap: this.handicap ?? null,

      selectedCoachId: this.selectedCoachId ?? null,
      selectedCoachName: this.selectedCoachName ?? null,
      selectedClubId: this.selectedClubId ?? null,
      selectedClubName: this.selectedClubName ?? null,

      assignedCoachId: this.assignedCoachId ?? null,
      assignedCoachName: this.assignedCoachName ?? null,
      coachAssignedAt: this.coachAssignedAt ? Timestamp.fromDate(this.coachAssignedAt) : null,
      assignmentStatus: this.assignmentStatus ?? null,

      assignedClubId: this.assignedClubId ?? null,
      assignedClubName: this.assignedClubName ?? null,
      clubAssignedAt: this.clubAssignedAt ? Timestamp.fromDate(this.clubAssignedAt) : null,
      clubAssignmentStatus: this.clubAssignmentStatus ?? null,

      currentLevel: this.currentLevel,
      unlockedLevels: (this.unlockedLevels ?? []).map((n) => Number(n)),

      totalXP: this.totalXP,

      levelProgress: Object.fromEntries(
        Object.entries(this.levelProgress ?? {}).map(([k, v]) => [k.toString(), v.toJson()])
      ),

      totalLessonsCompleted: this.totalLessonsCompleted,
      totalQuizzesCompleted: this.totalQuizzesCompleted,
      totalChallengesCompleted: this.totalChallengesCompleted,
      averageQuizScore: this.averageQuizScore,
      streakDays: this.streakDays,
      lastActivityDate: Timestamp.fromDate(this.lastActivityDate),

      badges: this.badges ?? [],

      subscription: this.subscription?.toFirestore() ?? null,

      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
    };
  }

  copyWith(params: Partial<IPupilModel>): PupilModel {
    return new PupilModel({ ...this, ...params });
  }

  /* ---------- Computed ---------- */
  get age(): number | null {
    if (!this.dateOfBirth) return null;
    const diff = Date.now() - this.dateOfBirth.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
    // 365.25 for leap-year accuracy
  }

  get isPremium(): boolean {
    return this.subscription?.isActive ?? false;
  }

  get hasAssignedCoach(): boolean {
    return Boolean(this.assignedCoachId);
  }

  get hasAssignedClub(): boolean {
    return Boolean(this.assignedClubId);
  }
}

/* =========================
   Firestore Converter
   ========================= */
export const PupilConverter: FirestoreDataConverter<PupilModel> = {
  toFirestore(model: PupilModel): DocumentData {
    // Use server timestamps on writes by default
    return model.toFirestore(true);
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PupilModel {
    const data = snapshot.data(options);
    return PupilModel.fromFirestore(data, snapshot.id);
  },
};
