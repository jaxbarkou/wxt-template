"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { FileText, Edit3, Trash2 } from "lucide-react";
import { MoreIcon } from "@/components/alia/icons/more";

export default function MoreActionsMenu({
 onDelete, onEdit
}:{
 onEdit: () => void;
 onDelete: () => void;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreIcon />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[160px] rounded-lg border bg-white p-1 shadow-md"
          sideOffset={6}
          align="end"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {/* <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100">
            <FileText className="h-4 w-4" />
            Export
          </DropdownMenu.Item> */}
          <DropdownMenu.Item 
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 outline-none hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Edit3 className="h-4 w-4" />
            Edit title
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}