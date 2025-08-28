"use client";
import React, { useState } from "react";
import { useStore } from "@lib/mockStore";
import { StudentTable } from "@components/StudentTable";
import Link from "next/link";
import { Button } from "@components/ui/Button";
import { Modal } from "@components/ui/Modal";
import { Plus } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function TeacherDashboard() {
  const { students, addStudent, removeStudent } = useStore();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link href="/lessons" className="text-blue-600">Gamified Lessons →</Link>
          <SignOutButton>
            <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border hover:bg-black/5 dark:hover:bg-white/5">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>

      <div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Add Student
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Add Student">
          <div className="space-y-3">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Student name" className="w-full border rounded px-3 py-2 bg-transparent" />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                if (!name.trim()) return;
                addStudent({ id: Math.random().toString(36).slice(2), name: name.trim(), modules: students[0]?.modules.map(m => ({ ...m, percent: 0 })) || [] });
                setName("");
                setOpen(false);
              }}>Save</Button>
            </div>
          </div>
        </Modal>
      </div>

      <StudentTable students={students} onRemove={removeStudent} />
    </div>
  );
}


