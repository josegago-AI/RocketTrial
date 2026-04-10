import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trash2, 
  Edit3, 
  X, 
  CheckSquare,
  Square
} from "lucide-react";

export default function BatchActionsToolbar({ 
  selectedItems, 
  totalItems, 
  onSelectAll, 
  onDeselectAll, 
  onBatchDelete, 
  onBatchEdit,
  type = "expenses"
}) {
  const isAllSelected = selectedItems.length === totalItems && totalItems > 0;
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < totalItems;

  return (
    <AnimatePresence>
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={isAllSelected ? onDeselectAll : onSelectAll}
                className="gap-2"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-4 h-4" />
                ) : isSomeSelected ? (
                  <div className="w-4 h-4 border-2 border-current rounded flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-current" />
                  </div>
                ) : (
                  <Square className="w-4 h-4" />
                )}
                {isAllSelected ? "Deselect All" : `Select All (${totalItems})`}
              </Button>
              
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                {selectedItems.length} {type} selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select onValueChange={(value) => onBatchEdit(value)}>
                <SelectTrigger className="w-auto gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Bulk Edit</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Change Category</SelectItem>
                  <SelectItem value="date">Update Date</SelectItem>
                  {type === "expenses" && (
                    <SelectItem value="recurring">Mark as Recurring</SelectItem>
                  )}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={onBatchDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedItems.length})
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={onDeselectAll}
                className="w-8 h-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}