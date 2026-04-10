import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Filter, 
  X, 
  Search,
  Calendar,
  DollarSign,
  Tag
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

export default function AdvancedFilters({ 
  filters, 
  onFiltersChange, 
  type = "expenses",
  categories = []
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const quickDateRanges = [
    { label: "Today", value: "today" },
    { label: "Last 7 days", value: "7days" },
    { label: "Last 30 days", value: "30days" },
    { label: "This month", value: "thisMonth" },
    { label: "Last month", value: "lastMonth" },
    { label: "Custom range", value: "custom" }
  ];

  const applyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      subcategory: "",
      dateRange: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: "",
      sortBy: "date",
      sortOrder: "desc"
    };
    setTempFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const setQuickDateRange = (range) => {
    const today = new Date();
    let startDate = "";
    let endDate = format(today, "yyyy-MM-dd");

    switch (range) {
      case "today":
        startDate = format(today, "yyyy-MM-dd");
        break;
      case "7days":
        startDate = format(subDays(today, 7), "yyyy-MM-dd");
        break;
      case "30days":
        startDate = format(subDays(today, 30), "yyyy-MM-dd");
        break;
      case "thisMonth":
        startDate = format(startOfMonth(today), "yyyy-MM-dd");
        endDate = format(endOfMonth(today), "yyyy-MM-dd");
        break;
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        startDate = format(startOfMonth(lastMonth), "yyyy-MM-dd");
        endDate = format(endOfMonth(lastMonth), "yyyy-MM-dd");
        break;
      default:
        return;
    }

    setTempFilters({
      ...tempFilters,
      dateRange: range,
      startDate,
      endDate
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value && value !== "").length;

  return (
    <div className="space-y-4">
      {/* Quick Search and Filter Toggle */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={`Search ${type}...`}
            value={filters.search || ""}
            onChange={(e) => onFiltersChange({...filters, search: e.target.value})}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={`gap-2 ${activeFiltersCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Date Range */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date Range
                    </Label>
                    <Select
                      value={tempFilters.dateRange || ""}
                      onValueChange={(value) => {
                        setTempFilters({...tempFilters, dateRange: value});
                        if (value !== "custom") {
                          setQuickDateRange(value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        {quickDateRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Date Range */}
                  {tempFilters.dateRange === "custom" && (
                    <>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={tempFilters.startDate || ""}
                          onChange={(e) => setTempFilters({...tempFilters, startDate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={tempFilters.endDate || ""}
                          onChange={(e) => setTempFilters({...tempFilters, endDate: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </Label>
                    <Select
                      value={tempFilters.category || ""}
                      onValueChange={(value) => setTempFilters({...tempFilters, category: value, subcategory: ""})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>All categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Range */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Min Amount
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={tempFilters.minAmount || ""}
                      onChange={(e) => setTempFilters({...tempFilters, minAmount: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="No limit"
                      value={tempFilters.maxAmount || ""}
                      onChange={(e) => setTempFilters({...tempFilters, maxAmount: e.target.value})}
                    />
                  </div>

                  {/* Sort Options */}
                  <div className="space-y-2">
                    <Label>Sort By</Label>
                    <div className="flex gap-2">
                      <Select
                        value={tempFilters.sortBy || "date"}
                        onValueChange={(value) => setTempFilters({...tempFilters, sortBy: value})}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="title">Name</SelectItem>
                          <SelectItem value="category">Category</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={tempFilters.sortOrder || "desc"}
                        onValueChange={(value) => setTempFilters({...tempFilters, sortOrder: value})}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">↑</SelectItem>
                          <SelectItem value="desc">↓</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 mt-4 border-t">
                  <Button variant="ghost" onClick={clearFilters} className="text-gray-600">
                    Clear All
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}