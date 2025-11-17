import { Timestamp } from "firebase/firestore";

// ---------------------
// Quiz Question Model
// ---------------------
export interface IQuizQuestionModel {
  questionId: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export class QuizQuestionModel implements IQuizQuestionModel {
  questionId: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;

  constructor(data: IQuizQuestionModel) {
    this.questionId = data.questionId;
    this.type = data.type;
    this.question = data.question;
    this.options = data.options;
    this.correctAnswer = data.correctAnswer;
    this.explanation = data.explanation;
    this.points = data.points;
  }

  static fromFirestore(json: any): QuizQuestionModel {
    return new QuizQuestionModel({
      questionId: json.questionId ?? "",
      type: json.type ?? "multiple_choice",
      question: json.question ?? "",
      options: json.options?.map((o: any) => String(o)),
      correctAnswer: json.correctAnswer ?? "",
      explanation: json.explanation,
      points: json.points ?? 1,
    });
  }

  toFirestore(): any {
    return {
      questionId: this.questionId,
      type: this.type,
      question: this.question,
      options: this.options,
      correctAnswer: this.correctAnswer,
      explanation: this.explanation,
      points: this.points,
    };
  }

  copyWith(params: Partial<IQuizQuestionModel>): QuizQuestionModel {
    return new QuizQuestionModel({
      questionId: params.questionId ?? this.questionId,
      type: params.type ?? this.type,
      question: params.question ?? this.question,
      options: params.options ?? this.options,
      correctAnswer: params.correctAnswer ?? this.correctAnswer,
      explanation: params.explanation ?? this.explanation,
      points: params.points ?? this.points,
    });
  }
}

// ---------------------
// Quiz Model
// ---------------------
export interface IQuizModel {
  id: string;
  title: string;
  description: string;
  levelNumber: number;
  timeLimit?: number;
  passingScore: number;
  allowRetakes: boolean;
  maxAttempts?: number;
  questions: QuizQuestionModel[];
  totalQuestions: number;
  totalPoints: number;
  accessTier: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  levelId: string;
}

export class QuizModel implements IQuizModel {
  id: string;
  title: string;
  description: string;
  levelNumber: number;
  timeLimit?: number;
  passingScore: number;
  allowRetakes: boolean;
  maxAttempts?: number;
  questions: QuizQuestionModel[];
  totalQuestions: number;
  totalPoints: number;
  accessTier: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  levelId: string;

  constructor(data: IQuizModel) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.levelNumber = data.levelNumber;
    this.timeLimit = data.timeLimit;
    this.passingScore = data.passingScore;
    this.allowRetakes = data.allowRetakes;
    this.maxAttempts = data.maxAttempts;
    this.questions = data.questions;
    this.totalQuestions = data.totalQuestions;
    this.totalPoints = data.totalPoints;
    this.accessTier = data.accessTier;
    this.isActive = data.isActive;
    this.sortOrder = data.sortOrder;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.createdBy = data.createdBy;
    this.levelId = data.levelId;
  }

  static create(params: {
    id: string;
    title: string;
    description: string;
    levelNumber: number;
    questions: QuizQuestionModel[];
    passingScore: number;
    timeLimit?: number;
    allowRetakes?: boolean;
    maxAttempts?: number;
    accessTier?: string;
    sortOrder?: number;
    createdBy?: string;
    levelId?: string;
  }): QuizModel {
    const now = new Date();
    const totalQ = params.questions.length;
    const totalP = params.questions.reduce((sum, q) => sum + q.points, 0);

    return new QuizModel({
      id: params.id,
      title: params.title,
      description: params.description,
      levelNumber: params.levelNumber,
      timeLimit: params.timeLimit,
      passingScore: params.passingScore,
      allowRetakes: params.allowRetakes ?? true,
      maxAttempts: params.maxAttempts,
      questions: params.questions,
      totalQuestions: totalQ,
      totalPoints: totalP,
      accessTier: params.accessTier ?? "free",
      isActive: true,
      sortOrder: params.sortOrder ?? 0,
      createdAt: now,
      updatedAt: now,
      createdBy: params.createdBy ?? "",
      levelId: params.levelId ?? "",
    });
  }

  static fromFirestore(data: any): QuizModel {
    return new QuizModel({
      id: data.id ?? "",
      title: data.title ?? "",
      description: data.description ?? "",
      levelNumber: data.levelNumber ?? 1,
      timeLimit: data.timeLimit,
      passingScore: (data.passingScore ?? 0) as number,
      allowRetakes: data.allowRetakes ?? true,
      maxAttempts: data.maxAttempts,
      levelId: data.levelId ?? "",
      questions:
        (data.questions as any[])?.map((q) => QuizQuestionModel.fromFirestore(q)) ?? [],
      totalQuestions: data.totalQuestions ?? 0,
      totalPoints: data.totalPoints ?? 0,
      accessTier: data.accessTier ?? "free",
      isActive: data.isActive ?? true,
      sortOrder: data.sortOrder ?? 0,
      createdAt: QuizModel._toDate(data.createdAt),
      updatedAt: QuizModel._toDate(data.updatedAt),
      createdBy: data.createdBy ?? "",
    });
  }

  toFirestore(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      levelNumber: this.levelNumber,
      timeLimit: this.timeLimit,
      passingScore: this.passingScore,
      allowRetakes: this.allowRetakes,
      maxAttempts: this.maxAttempts,
      questions: this.questions.map((q) => q.toFirestore()),
      totalQuestions: this.totalQuestions,
      totalPoints: this.totalPoints,
      accessTier: this.accessTier,
      isActive: this.isActive,
      sortOrder: this.sortOrder,
      createdAt: Timestamp.fromDate(this.createdAt),
      updatedAt: Timestamp.fromDate(this.updatedAt),
      createdBy: this.createdBy,
      levelId: this.levelId,
    };
  }

  copyWith(params: Partial<IQuizModel>): QuizModel {
    return new QuizModel({
      ...this,
      ...params,
    });
  }

  private static _toDate(value: any): Date {
    if (!value) return new Date();
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    if (typeof value === "string") return new Date(value);
    return new Date();
  }
}
