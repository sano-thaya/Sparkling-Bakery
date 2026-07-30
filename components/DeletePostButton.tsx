"use client";

import { Trash2 } from "lucide-react";

export function DeletePostButton({ id, action }: { id: string; action: (formData: FormData) => Promise<void> }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this post?")) {
          e.preventDefault();
        }
      }}
      className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
