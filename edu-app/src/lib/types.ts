export interface EducationalModule {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  thumbnail: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  authorId: string;
  tags: string[];
  rating: number;
  enrolledStudents: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  order: number;
  resources: Resource[];
  quiz?: Quiz;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'image';
  url: string;
  size?: number;
  description?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  timeLimit?: number; // in minutes
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface UserProgress {
  userId: string;
  moduleId: string;
  lessonId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number; // 0-100
  timeSpent: number; // in seconds
  lastAccessed: Date;
  quizScore?: number;
  completedAt?: Date;
}

export interface UserEnrollment {
  userId: string;
  moduleId: string;
  enrolledAt: Date;
  completedAt?: Date;
  certificateUrl?: string;
  overallProgress: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatar?: string;
  bio?: string;
  subjects: string[];
  grade?: string;
  school?: string;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}
