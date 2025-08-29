import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  EducationalModule, 
  Lesson, 
  UserProgress, 
  UserEnrollment,
  UserProfile 
} from '../types';

// Collection references
const modulesRef = collection(db, 'modules');
const lessonsRef = collection(db, 'lessons');
const progressRef = collection(db, 'userProgress');
const enrollmentsRef = collection(db, 'enrollments');
const usersRef = collection(db, 'users');

// Module Services
export const moduleService = {
  // Get all published modules
  async getPublishedModules(): Promise<EducationalModule[]> {
    const q = query(
      modulesRef,
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as EducationalModule[];
  },

  // Get modules by subject
  async getModulesBySubject(subject: string): Promise<EducationalModule[]> {
    const q = query(
      modulesRef,
      where('subject', '==', subject),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as EducationalModule[];
  },

  // Get module by ID
  async getModuleById(moduleId: string): Promise<EducationalModule | null> {
    const docRef = doc(db, 'modules', moduleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as EducationalModule;
    }
    return null;
  },

  // Create new module
  async createModule(moduleData: Omit<EducationalModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(modulesRef, {
      ...moduleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Update module
  async updateModule(moduleId: string, updates: Partial<EducationalModule>): Promise<void> {
    const docRef = doc(db, 'modules', moduleId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete module
  async deleteModule(moduleId: string): Promise<void> {
    const docRef = doc(db, 'modules', moduleId);
    await deleteDoc(docRef);
  }
};

// Lesson Services
export const lessonService = {
  // Get lessons by module ID
  async getLessonsByModule(moduleId: string): Promise<Lesson[]> {
    const q = query(
      lessonsRef,
      where('moduleId', '==', moduleId),
      orderBy('order', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    })) as Lesson[];
  },

  // Get lesson by ID
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    const docRef = doc(db, 'lessons', lessonId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as Lesson;
    }
    return null;
  },

  // Create new lesson
  async createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(lessonsRef, {
      ...lessonData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  // Update lesson
  async updateLesson(lessonId: string, updates: Partial<Lesson>): Promise<void> {
    const docRef = doc(db, 'lessons', lessonId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  // Delete lesson
  async deleteLesson(lessonId: string): Promise<void> {
    const docRef = doc(db, 'lessons', lessonId);
    await deleteDoc(docRef);
  }
};

// User Progress Services
export const progressService = {
  // Get user progress for a module
  async getUserModuleProgress(userId: string, moduleId: string): Promise<UserProgress[]> {
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('moduleId', '==', moduleId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      lastAccessed: doc.data().lastAccessed?.toDate(),
      completedAt: doc.data().completedAt?.toDate()
    })) as UserProgress[];
  },

  // Update user progress
  async updateUserProgress(progressData: Omit<UserProgress, 'id'>): Promise<void> {
    const { userId, moduleId, lessonId } = progressData;
    const q = query(
      progressRef,
      where('userId', '==', userId),
      where('moduleId', '==', moduleId),
      where('lessonId', '==', lessonId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Create new progress record
      await addDoc(progressRef, {
        ...progressData,
        lastAccessed: Timestamp.now()
      });
    } else {
      // Update existing progress record
      const docRef = doc(db, 'userProgress', snapshot.docs[0].id);
      await updateDoc(docRef, {
        ...progressData,
        lastAccessed: Timestamp.now()
      });
    }
  },

  // Get user enrollment
  async getUserEnrollment(userId: string, moduleId: string): Promise<UserEnrollment | null> {
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('moduleId', '==', moduleId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        ...data,
        enrolledAt: data.enrolledAt?.toDate(),
        completedAt: data.completedAt?.toDate()
      } as UserEnrollment;
    }
    return null;
  },

  // Enroll user in module
  async enrollUser(userId: string, moduleId: string): Promise<void> {
    const enrollment: Omit<UserEnrollment, 'id'> = {
      userId,
      moduleId,
      enrolledAt: new Date(),
      overallProgress: 0,
      lessonsCompleted: 0,
      totalLessons: 0
    };
    
    await addDoc(enrollmentsRef, {
      ...enrollment,
      enrolledAt: Timestamp.now()
    });
  }
};

// User Profile Services
export const userService = {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        id: docSnap.id,
        createdAt: data.createdAt?.toDate(),
        lastActive: data.lastActive?.toDate()
      } as UserProfile;
    }
    return null;
  },

  // Create or update user profile
  async upsertUserProfile(userProfile: Omit<UserProfile, 'id'>): Promise<void> {
    const docRef = doc(db, 'users', userProfile.email);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing profile
      await updateDoc(docRef, {
        ...userProfile,
        lastActive: Timestamp.now()
      });
    } else {
      // Create new profile
      await addDoc(docRef, {
        ...userProfile,
        createdAt: Timestamp.now(),
        lastActive: Timestamp.now()
      });
    }
  }
};
