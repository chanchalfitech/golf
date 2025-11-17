import { Timestamp } from "firebase/firestore";

export interface ILessonModel {
  id: string;
  title: string;
  description: string;
  estimatedReadTime: number;
  levelNumber: number;
  pdfUrl: string;
  accessTier: string;
  isActive: boolean;
  publishedAt?: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  levelId: string;
}

export class LessonModel implements ILessonModel {
  id: string;
  title: string;
  description: string;
  estimatedReadTime: number;
  levelNumber: number;
  pdfUrl: string;
  accessTier: string;
  isActive: boolean;
  publishedAt?: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  levelId: string;

  constructor(data: ILessonModel) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.estimatedReadTime = data.estimatedReadTime;
    this.levelNumber = data.levelNumber;
    this.pdfUrl = data.pdfUrl;
    this.accessTier = data.accessTier;
    this.isActive = data.isActive;
    this.publishedAt = data.publishedAt ?? null;
    this.sortOrder = data.sortOrder;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.levelId = data.levelId;
  }

  /** Factory: create a new LessonModel instance (Dart: LessonModel.create) */
  static create(params: {
    id: string;
    title: string;
    description: string;
    estimatedReadTime: number;
    levelNumber: number;
    pdfUrl: string;
    accessTier?: string;
    isActive?: boolean;
    publishedAt?: Date | null;
    sortOrder?: number;
    createdBy?: string;
    levelId?: string;
  }): LessonModel {
    const now = new Date();
    return new LessonModel({
      id: params.id,
      title: params.title,
      description: params.description,
      estimatedReadTime: params.estimatedReadTime,
      levelNumber: params.levelNumber,
      pdfUrl: params.pdfUrl,
      accessTier: params.accessTier ?? "free",
      isActive: params.isActive ?? true,
      publishedAt: params.publishedAt ?? null,
      sortOrder: params.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
      createdBy: params.createdBy ?? "admin",
      levelId: params.levelId ?? "",
    });
  }

  /** Convert to Firestore JSON (Dart: toFirestore) */
  toFirestore(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      estimatedReadTime: this.estimatedReadTime,
      levelNumber: this.levelNumber,
      pdfUrl: this.pdfUrl,
      accessTier: this.accessTier,
      isActive: this.isActive,
      publishedAt: this.publishedAt
        ? Timestamp.fromDate(this.publishedAt)
        : null,
      sortOrder: this.sortOrder,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
      createdBy: this.createdBy,
      levelId: this.levelId,
    };
  }

  /** Convert Firestore doc → LessonModel (Dart: LessonModel.fromFirestore) */
  static fromFirestore(json: Record<string, any>): LessonModel {
    return new LessonModel({
      id: json.id ?? "",
      title: json.title ?? "",
      description: json.description ?? "",
      estimatedReadTime: json.estimatedReadTime ?? 0,
      levelNumber: json.levelNumber ?? 1,
      pdfUrl: json.pdfUrl ?? "",
      accessTier: json.accessTier ?? "free",
      isActive: json.isActive ?? true,
      publishedAt: LessonModel._toDateTime(json.publishedAt),
      sortOrder: json.sortOrder ?? 0,
      createdAt: LessonModel._toDateTime(json.createdAt),
      updatedAt: LessonModel._toDateTime(json.updatedAt),
      createdBy: json.createdBy ?? "admin",
      levelId: json.levelId ?? "",
    });
  }

  /** Create a copy with modified fields (Dart: copyWith) */
  copyWith(updates: Partial<ILessonModel>): LessonModel {
    return new LessonModel({
      ...this,
      ...updates,
    });
  }

  /** Convert Firestore Timestamp or string → Date */
  private static _toDateTime(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === "string") return new Date(value);
    if (value instanceof Date) return value;
    return new Date(); // fallback like Dart's DateTime.now()
  }
}
