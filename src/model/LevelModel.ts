// src/models/LevelModel.ts
import { Timestamp, DocumentData, QueryDocumentSnapshot, DocumentSnapshot } from "firebase/firestore";

export interface ILevelModel {
  levelNumber: number;
  name: string;
  pupilDescription: string;
  coachDescription: string;
  accessTier: string;
  prerequisite?: string;
  isActive: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class LevelModel implements ILevelModel {
  levelNumber: number;
  name: string;
  pupilDescription: string;
  coachDescription: string;
  accessTier: string;
  prerequisite?: string;
  isActive: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: ILevelModel) {
    this.levelNumber = data.levelNumber;
    this.name = data.name;
    this.pupilDescription = data.pupilDescription;
    this.coachDescription = data.coachDescription;
    this.accessTier = data.accessTier;
    this.prerequisite = data.prerequisite;
    this.isActive = data.isActive;
    this.isPublished = data.isPublished;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Factory: create new LevelModel
  static create(params: {
    levelNumber: number;
    name: string;
    pupilDescription: string;
    coachDescription: string;
    accessTier: string;
    prerequisite?: string;
  }): LevelModel {
    const now = new Date();
    return new LevelModel({
      ...params,
      isActive: true,
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Parse Firestore Date
  private static parseDate(value: any): Date {
    if (!value) return new Date();
    if (value instanceof Timestamp) return value.toDate();
    if (typeof value === "string") {
      try {
        return new Date(value);
      } catch {
        return new Date();
      }
    }
    if (typeof value === "number") return new Date(value);
    return new Date();
  }

  // From Firestore Document
  static fromFirestoreDoc(doc: DocumentSnapshot<DocumentData>): LevelModel {
    const data = doc.data();
    if (!data) {
      throw new Error(`Document is null for level: ${doc.id}`);
    }
    return LevelModel.fromJson(data);
  }

  static fromFirestoreQuery(doc: QueryDocumentSnapshot<DocumentData>): LevelModel {
    return LevelModel.fromJson(doc.data());
  }

  // From JSON/Plain object
  static fromJson(json: Record<string, any>): LevelModel {
    return new LevelModel({
      levelNumber:
        typeof json.levelNumber === "number"
          ? json.levelNumber
          : parseInt(json.levelNumber, 10) || 0,
      name: String(json.name ?? ""),
      pupilDescription: String(json.pupilDescription ?? ""),
      coachDescription: String(json.coachDescription ?? ""),
      accessTier: String(json.accessTier ?? ""),
      prerequisite: json.prerequisite ? String(json.prerequisite) : undefined,
      isActive:
        typeof json.isActive === "boolean"
          ? json.isActive
          : String(json.isActive).toLowerCase() === "true",
      isPublished:
        typeof json.isPublished === "boolean"
          ? json.isPublished
          : String(json.isPublished).toLowerCase() === "true",
      createdAt: LevelModel.parseDate(json.createdAt),
      updatedAt: LevelModel.parseDate(json.updatedAt),
    });
  }

  // To Firestore
  toFirestore(): Record<string, any> {
    const data: Record<string, any> = {
      levelNumber: this.levelNumber,
      name: this.name,
      pupilDescription: this.pupilDescription,
      coachDescription: this.coachDescription,
      accessTier: this.accessTier,
      isActive: this.isActive,
      isPublished: this.isPublished,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
    };
    if (this.prerequisite && this.prerequisite.length > 0) {
      data.prerequisite = this.prerequisite;
    }
    return data;
  }

  // To JSON (for API/UI)
  toJson(): Record<string, any> {
    return {
      ...this.toFirestore(),
    };
  }

  copyWith(params: Partial<ILevelModel>): LevelModel {
    return new LevelModel({
      levelNumber: params.levelNumber ?? this.levelNumber,
      name: params.name ?? this.name,
      pupilDescription: params.pupilDescription ?? this.pupilDescription,
      coachDescription: params.coachDescription ?? this.coachDescription,
      accessTier: params.accessTier ?? this.accessTier,
      prerequisite: params.prerequisite ?? this.prerequisite,
      isActive: params.isActive ?? this.isActive,
      isPublished: params.isPublished ?? this.isPublished,
      createdAt: params.createdAt ?? this.createdAt,
      updatedAt: params.updatedAt ?? this.updatedAt,
    });
  }

  toString(): string {
    return `LevelModel(levelNumber: ${this.levelNumber}, name: ${this.name}, accessTier: ${this.accessTier}, isActive: ${this.isActive}, isPublished: ${this.isPublished})`;
  }
}
