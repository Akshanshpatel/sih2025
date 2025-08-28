import React from "react";
import type { Student } from "@lib/mockStore";
import { Trash2 } from "lucide-react";

export function StudentTable({ students, onRemove }: { students: Student[]; onRemove: (id: string) => void }) {
  return (
    <table className="w-full text-left border border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur rounded-2xl overflow-hidden">
      <thead>
        <tr className="bg-gray-100/60 dark:bg-white/5">
          <th className="p-2">Name</th>
          <th className="p-2">Modules</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map(s => (
          <tr key={s.id} className="border-t hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <td className="p-2">{s.name}</td>
            <td className="p-2 text-sm text-gray-700">
              {s.modules.map(m => (
                <div key={m.moduleId}>{m.title}: {m.percent}%</div>
              ))}
            </td>
            <td className="p-2">
              <button onClick={() => onRemove(s.id)} className="text-red-600 flex items-center gap-1">
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


