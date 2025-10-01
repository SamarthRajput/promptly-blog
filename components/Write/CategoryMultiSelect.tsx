"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
}

interface CategoryMultiSelectProps {
  categories: Category[];
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function CategoryMultiSelect({
  categories,
  selectedCategories,
  onChange,
  placeholder = "Select categories...",
  className,
}: CategoryMultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const handleSelect = (categoryId: string) => {
    const isSelected = selectedCategories.includes(categoryId);
    if (isSelected) {
      onChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const handleRemove = (categoryId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(selectedCategories.filter((id) => id !== categoryId));
  };

  const getSelectedCategoryNames = () => {
    return categories
      .filter((cat) => selectedCategories.includes(cat.id))
      .map((cat) => cat.name);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[48px] h-auto px-3 py-2"
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedCategories.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1 max-w-full">
                  {getSelectedCategoryNames().slice(0, 2).map((name, index) => {
                    const categoryId = categories.find(cat => cat.name === name)?.id;
                    return (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs px-2 py-1 bg-sky-100 text-sky-700 hover:bg-sky-200"
                      >
                        {name}
                        <button
                          type="button"
                          className="ml-1 hover:bg-sky-300 rounded-full p-0.5"
                          onClick={(e) => categoryId && handleRemove(categoryId, e)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                  {selectedCategories.length > 2 && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 bg-slate-100 text-slate-600">
                      +{selectedCategories.length - 2} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={searchValue}
              onValueChange={setSearchValue}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              
              {/* Selected Categories Group */}
              {selectedCategories.length > 0 && (
                <CommandGroup heading="Selected Categories">
                  <ScrollArea className="max-h-24">
                    {categories
                      .filter((cat) => selectedCategories.includes(cat.id))
                      .map((category) => (
                        <CommandItem
                          key={`selected-${category.id}`}
                          onSelect={() => handleSelect(category.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <Check className="h-4 w-4 text-sky-500" />
                              <span>{category.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-sky-100 text-sky-700">
                              Selected
                            </Badge>
                          </div>
                        </CommandItem>
                      ))}
                  </ScrollArea>
                </CommandGroup>
              )}

              {/* Available Categories Group */}
              <CommandGroup heading="Available Categories">
                <ScrollArea className="max-h-48">
                  {filteredCategories
                    .filter((cat) => !selectedCategories.includes(cat.id))
                    .map((category) => (
                      <CommandItem
                        key={category.id}
                        onSelect={() => handleSelect(category.id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 border-2 border-slate-300 rounded-sm" />
                          <span>{category.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
