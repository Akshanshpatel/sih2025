"use client";
import React, { createContext, useContext, useMemo, useState } from "react";

export type ModuleProgress = { moduleId: string; title: string; percent: number };
export type Student = { id: string; name: string; modules: ModuleProgress[] };

type Store = {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  updateStudentProgress: (studentId: string, moduleId: string, percent: number) => void;
  addStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
};

const initialModules: ModuleProgress[] = [
  { moduleId: "m1", title: "Algebra Basics", percent: 10 },
  { moduleId: "m2", title: "Geometry", percent: 30 },
  { moduleId: "m3", title: "Statistics", percent: 0 },
];

const defaultStudents: Student[] = [
  { id: "s1", name: "Alice", modules: initialModules.map(m => ({ ...m })) },
  { id: "s2", name: "Bob", modules: initialModules.map(m => ({ ...m })) },
];

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [students, setStudents] = useState<Student[]>(defaultStudents);

  const value = useMemo<Store>(() => ({
    students,
    setStudents,
    updateStudentProgress: (studentId, moduleId, percent) => {
      setStudents(prev => prev.map(s => s.id === studentId ? {
        ...s,
        modules: s.modules.map(m => m.moduleId === moduleId ? { ...m, percent } : m)
      } : s));
    },
    addStudent: (student) => setStudents(prev => [...prev, student]),
    removeStudent: (studentId) => setStudents(prev => prev.filter(s => s.id !== studentId)),
  }), [students]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}


