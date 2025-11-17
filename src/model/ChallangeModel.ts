import { Timestamp } from "firebase/firestore";

/* =========================
   Task Model
========================= */

export interface ITaskModel {
  id: string;
  title: string;
  maxScore: number;
  passingScore: number;
}

export class TaskModel implements ITaskModel {
  id: string;
  title: string;
  maxScore: number;
  passingScore: number;

  constructor(data: ITaskModel) {
    this.id = data.id;
    this.title = data.title;
    this.maxScore = data.maxScore;
    this.passingScore = data.passingScore;
  }

  static create(params: {
    id: string;
    title: string;
    maxScore: number;
    passingScore: number;
  }): TaskModel {
    return new TaskModel({
      id: params.id,
      title: params.title,
      maxScore: params.maxScore,
      passingScore: params.passingScore,
    });
  }

  toFirestore(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      maxScore: this.maxScore,
      passingScore: this.passingScore,
    };
  }

  static fromFirestore(json: Record<string, any>): TaskModel {
    return new TaskModel({
      id: json.id ?? "",
      title: json.title ?? "",
      maxScore: json.maxScore ?? 0,
      passingScore: json.passingScore ?? 0,
    });
  }

  copyWith(params: Partial<ITaskModel>): TaskModel {
    return new TaskModel({
      id: params.id ?? this.id,
      title: params.title ?? this.title,
      maxScore: params.maxScore ?? this.maxScore,
      passingScore: params.passingScore ?? this.passingScore,
    });
  }
}

/* =========================
   Challenge Model
========================= */

export interface IChallengeModel {
  id: string;
  title: string;
  description: string;
  proTip: string;
  levelNumber: number;
  tasks: TaskModel[];
  totalTasks: number;
  minTasksToPass: number;
  quizPassingScore: number;
  estimatedTime: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  levelId: string;
}

export class ChallengeModel implements IChallengeModel {
  id: string;
  title: string;
  description: string;
  proTip: string;
  levelNumber: number;
  tasks: TaskModel[];
  totalTasks: number;
  minTasksToPass: number;
  quizPassingScore: number;
  estimatedTime: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  levelId: string;

  constructor(data: IChallengeModel) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.proTip = data.proTip;
    this.levelNumber = data.levelNumber;
    this.tasks = data.tasks;
    this.totalTasks = data.totalTasks;
    this.minTasksToPass = data.minTasksToPass;
    this.quizPassingScore = data.quizPassingScore;
    this.estimatedTime = data.estimatedTime;
    this.isActive = data.isActive;
    this.sortOrder = data.sortOrder;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.levelId = data.levelId;
  }

  /** Factory: create a new ChallengeModel instance */
  static create(params: {
    id: string;
    title: string;
    description: string;
    proTip: string;
    levelNumber: number;
    tasks: TaskModel[];
    totalTasks: number; // pass tasks.length if you want auto
    minTasksToPass: number;
    quizPassingScore: number;
    estimatedTime: number;
    isActive?: boolean;
    sortOrder?: number;
    createdBy?: string;
    levelId?: string;
  }): ChallengeModel {
    const now = new Date();
    return new ChallengeModel({
      id: params.id,
      title: params.title,
      description: params.description,
      proTip: params.proTip,
      levelNumber: params.levelNumber,
      tasks: params.tasks,
      totalTasks: params.totalTasks, // or params.tasks.length
      minTasksToPass: params.minTasksToPass,
      quizPassingScore: params.quizPassingScore,
      estimatedTime: params.estimatedTime,
      isActive: params.isActive ?? true,
      sortOrder: params.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
      createdBy: params.createdBy ?? "",
      levelId: params.levelId ?? "",
    });
  }

  /** Convert to Firestore JSON */
  toFirestore(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      proTip: this.proTip,
      levelNumber: this.levelNumber,
      tasks: this.tasks.map((t) => t.toFirestore()),
      totalTasks: this.totalTasks,
      minTasksToPass: this.minTasksToPass,
      quizPassingScore: this.quizPassingScore,
      estimatedTime: this.estimatedTime,
      isActive: this.isActive,
      sortOrder: this.sortOrder,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
      createdBy: this.createdBy,
      levelId: this.levelId,
    };
  }

  /** Firestore doc → ChallengeModel */
  static fromFirestore(json: Record<string, any>): ChallengeModel {
    return new ChallengeModel({
      id: json.id ?? "",
      title: json.title ?? "",
      description: json.description ?? "",
      proTip: json.proTip ?? "",
      levelNumber: json.levelNumber ?? 1,
      tasks:
        (json.tasks as any[])?.map((e) => TaskModel.fromFirestore(e)) ?? [],
      totalTasks: json.totalTasks ?? 0,
      minTasksToPass: json.minTasksToPass ?? 0,
      quizPassingScore: json.quizPassingScore ?? 0,
      estimatedTime: json.estimatedTime ?? 0,
      isActive: json.isActive ?? true,
      sortOrder: json.sortOrder ?? 0,
      createdAt: ChallengeModel._toDateTime(json.createdAt),
      updatedAt: ChallengeModel._toDateTime(json.updatedAt),
      createdBy: json.createdBy ?? "",
      levelId: json.levelId ?? "",
    });
  }

  /** Create a copy with modified fields */
  copyWith(params: Partial<IChallengeModel>): ChallengeModel {
    return new ChallengeModel({
      id: params.id ?? this.id,
      title: params.title ?? this.title,
      description: params.description ?? this.description,
      proTip: params.proTip ?? this.proTip,
      levelNumber: params.levelNumber ?? this.levelNumber,
      tasks: params.tasks ?? this.tasks,
      totalTasks: params.totalTasks ?? this.totalTasks,
      minTasksToPass: params.minTasksToPass ?? this.minTasksToPass,
      quizPassingScore: params.quizPassingScore ?? this.quizPassingScore,
      estimatedTime: params.estimatedTime ?? this.estimatedTime,
      isActive: params.isActive ?? this.isActive,
      sortOrder: params.sortOrder ?? this.sortOrder,
      createdAt: params.createdAt ?? this.createdAt,
      updatedAt: params.updatedAt ?? this.updatedAt,
      createdBy: params.createdBy ?? this.createdBy,
      levelId: params.levelId ?? this.levelId,
    });
  }

  /** Timestamp | string | Date → Date */
  private static _toDateTime(v: any): Date {
    if (!v) return new Date();
    if (v instanceof Timestamp) return v.toDate();
    if (v instanceof Date) return v;
    if (typeof v === "string") return new Date(v);
    return new Date();
  }
}
