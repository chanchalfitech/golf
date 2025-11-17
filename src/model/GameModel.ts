import { Timestamp } from "firebase/firestore";

export interface IGameModel {
  id: string;
  title: string;
  description: string;
  levelNumber: number;
  videoUrl: string;
  thumbnailUrl?: string | null;
  estimatedTime: number;
  accessTier: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  category: string;
  tipText: string;
  videoDurationSeconds: number;
  levelId: string;
}

export class GameModel implements IGameModel {
  id: string;
  title: string;
  description: string;
  levelNumber: number;
  videoUrl: string;
  thumbnailUrl?: string | null;
  estimatedTime: number;
  accessTier: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  category: string;
  tipText: string;
  videoDurationSeconds: number;
  levelId: string;

  constructor(data: IGameModel) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.levelNumber = data.levelNumber;
    this.videoUrl = data.videoUrl;
    this.thumbnailUrl = data.thumbnailUrl;
    this.estimatedTime = data.estimatedTime;
    this.accessTier = data.accessTier;
    this.isActive = data.isActive;
    this.sortOrder = data.sortOrder;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.category = data.category;
    this.tipText = data.tipText;
    this.videoDurationSeconds = data.videoDurationSeconds;
    this.levelId = data.levelId;
  }

  /** Factory: create a new GameModel instance */
  static create(params: {
    id: string;
    title: string;
    description: string;
    levelNumber: number;
    videoUrl: string;
    thumbnailUrl?: string | null;
    estimatedTime: number;
    accessTier?: string;
    isActive?: boolean;
    sortOrder?: number;
    createdBy?: string;
    category: string;
    tipText: string;
    videoDurationSeconds: number;
    levelId: string;
  }): GameModel {
    const now = new Date();
    return new GameModel({
      id: params.id,
      title: params.title,
      description: params.description,
      levelNumber: params.levelNumber,
      videoUrl: params.videoUrl,
      thumbnailUrl: params.thumbnailUrl ?? null,
      estimatedTime: params.estimatedTime,
      accessTier: params.accessTier ?? "free",
      isActive: params.isActive ?? true,
      sortOrder: params.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
      createdBy: params.createdBy ?? "",
      category: params.category,
      tipText: params.tipText,
      videoDurationSeconds: params.videoDurationSeconds,
      levelId: params.levelId,
    });
  }

  /** Convert to Firestore JSON */
  toFirestore(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      levelNumber: this.levelNumber,
      videoUrl: this.videoUrl,
      thumbnailUrl: this.thumbnailUrl,
      estimatedTime: this.estimatedTime,
      accessTier: this.accessTier,
      isActive: this.isActive,
      sortOrder: this.sortOrder,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
      createdBy: this.createdBy,
      category: this.category,
      tipText: this.tipText,
      videoDurationSeconds: this.videoDurationSeconds,
      levelId: this.levelId,
    };
  }

  /** Convert Firestore doc → GameModel */
  static fromFirestore(json: Record<string, any>): GameModel {
    return new GameModel({
      id: json.id ?? "",
      title: json.title ?? "",
      description: json.description ?? "",
      levelNumber: json.levelNumber ?? 1,
      videoUrl: json.videoUrl ?? "",
      thumbnailUrl: json.thumbnailUrl ?? null,
      estimatedTime: json.estimatedTime ?? 0,
      accessTier: json.accessTier ?? "free",
      isActive: json.isActive ?? true,
      sortOrder: json.sortOrder ?? 0,
      createdAt: GameModel._toDateTime(json.createdAt),
      updatedAt: GameModel._toDateTime(json.updatedAt),
      createdBy: json.createdBy ?? "",
      category: json.category ?? "",
      tipText: json.tipText ?? "",
      videoDurationSeconds: json.videoDurationSeconds ?? 0,
      levelId: json.levelId ?? "",
    });
  }

  /** Create a copy with modified fields */
  copyWith(updates: Partial<IGameModel>): GameModel {
    return new GameModel({
      ...this,
      ...updates,
    });
  }

  /** Convert Firestore Timestamp or string → Date */
  private static _toDateTime(value: any): Date {
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === "string") return new Date(value);
    return new Date();
  }
}
