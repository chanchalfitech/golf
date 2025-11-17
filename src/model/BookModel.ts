import { Timestamp, DocumentData } from "firebase/firestore";

export interface IBookModel {
  id: string;
  title: string;
  description: string;
  // estimatedReadTime: number;
  levelNumber: number;
  pdfUrl: string;
  accessTier: "free" | "premium";
  isActive: boolean;
  publishedAt?: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  totalPages: number;
  levelId: string; 
}

export class BookModel implements IBookModel {
  id: string;
  title: string;
  description: string;
  // estimatedReadTime: number;
  levelNumber: number;
  pdfUrl: string;
  accessTier: "free" | "premium";
  isActive: boolean;
  publishedAt?: Date | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  totalPages: number;
  levelId: string;

  constructor(data: IBookModel) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    // this.estimatedReadTime = data.estimatedReadTime;
    this.levelNumber = data.levelNumber;
    this.pdfUrl = data.pdfUrl;
    this.accessTier = data.accessTier;
    this.isActive = data.isActive;
    this.publishedAt = data.publishedAt ?? null;
    this.sortOrder = data.sortOrder;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.totalPages = data.totalPages;
    this.levelId = data.levelId;
  }

  static create(params: {
    id: string;
    title: string;
    description: string;
    // estimatedReadTime: number;
    levelNumber: number;
    pdfUrl: string;
    accessTier?: "free" | "premium";
    totalPages: number;
    isActive?: boolean;
    publishedAt?: Date | null;
    sortOrder?: number;
    createdBy?: string;
    levelId?: string;
  }): BookModel {
    const now = new Date();
    return new BookModel({
      id: params.id,
      title: params.title,
      description: params.description,
      // estimatedReadTime: params.estimatedReadTime,
      levelNumber: params.levelNumber,
      pdfUrl: params.pdfUrl,
      accessTier: params.accessTier ?? "free",
      totalPages: params.totalPages,
      isActive: params.isActive ?? true,
      publishedAt: params.publishedAt ?? null,
      sortOrder: params.sortOrder ?? 0,
      createdBy: params.createdBy ?? "admin",
      createdAt: now,
      updatedAt: now,
      levelId: params.levelId,
    });
  }

  static fromFirestore(data: DocumentData, idFromSnap?: string): BookModel {
    return new BookModel({
      id: idFromSnap ?? data.id ?? "",
      title: data.title ?? "",
      description: data.description ?? "",
      // estimatedReadTime: Number(data.estimatedReadTime ?? 0),
      levelNumber: Number(data.levelNumber ?? 1),
      pdfUrl: data.pdfUrl ?? "",
      accessTier: (data.accessTier ?? "free") as "free" | "premium",
      isActive: Boolean(data.isActive ?? true),
      publishedAt: BookModel._toDate(data.publishedAt),
      sortOrder: Number(data.sortOrder ?? 0),
      createdAt: BookModel._toDate(data.createdAt) ?? new Date(),
      updatedAt: BookModel._toDate(data.updatedAt) ?? new Date(),
      createdBy: data.createdBy ?? "admin",
      totalPages: Number(data.totalPages ?? 0),
      levelId: data.levelId ?? "",
    });
  }

  toFirestore(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      // estimatedReadTime: this.estimatedReadTime,
      levelNumber: this.levelNumber,
      pdfUrl: this.pdfUrl,
      accessTier: this.accessTier,
      isActive: this.isActive,
      publishedAt: this.publishedAt ? Timestamp.fromDate(this.publishedAt) : null,
      sortOrder: this.sortOrder,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
      createdBy: this.createdBy,
      totalPages: this.totalPages,
      levelId: this.levelId,
    };
  }

  copyWith(params: Partial<IBookModel>): BookModel {
    return new BookModel({
      id: params.id ?? this.id,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      // estimatedReadTime: params.estimatedReadTime ?? this.estimatedReadTime,
      levelNumber: params.levelNumber ?? this.levelNumber,
      pdfUrl: params.pdfUrl ?? this.pdfUrl,
      accessTier: (params.accessTier ?? this.accessTier) as "free" | "premium",
      isActive: params.isActive ?? this.isActive,
      publishedAt: params.publishedAt ?? this.publishedAt,
      sortOrder: params.sortOrder ?? this.sortOrder,
      createdAt: params.createdAt ?? this.createdAt,
      updatedAt: params.updatedAt ?? this.updatedAt,
      createdBy: params.createdBy ?? this.createdBy,
      totalPages: params.totalPages ?? this.totalPages,
      levelId: params.levelId ?? this.levelId,
    });
  }

  private static _toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return null;
  }
}
