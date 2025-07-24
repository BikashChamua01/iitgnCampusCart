import React from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "lucide-react";

const Filter = ({ categories, filter, setFilter }) => {
  const handleSetFilter = (category) => {
    const checked = filter.indexOf(category) !== -1;
    checked
      ? setFilter((prev) => prev.filter((cat) => cat !== category))
      : setFilter((prev) => [...prev, category]);
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 text-md font-medium text-violet-700 ">
        Categories
      </div>
      <div className="flex flex-col gap-1">
        {categories.map((category, idx) => (
          <Label
            htmlFor={category}
            key={idx}
            className="flex items-center gap-3 rounded-md hover:bg-violet-50 transition cursor-pointer group w-fit px-3"
          >
            <Checkbox
              checked={filter.indexOf(category) !== -1}
              onCheckedChange={() => handleSetFilter(category)}
              className="
                accent-violet-600 w-5 h-5 min-w-[20px] min-h-[20px] rounded-md border-gray-300 group-hover:border-violet-500 shadow-sm focus:ring-2 focus:ring-violet-200 transition cursor-pointer "
              id={category}
              name={category}
            />
            <span className="text-base text-gray-800 font-medium group-hover:text-violet-700 transition">
              {category}
            </span>
          </Label>
        ))}
      </div>
    </div>
  );
};

const SORT_OPTIONS = [
  { value: "", label: "Sort By" },
  { value: "priceLowHigh", label: "Price: Low to High" },
  { value: "priceHighLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "rating", label: "Rating" },
];

const SortDropDown = ({ sortOption, setSortOption }) => {
  const handleSelect = (value) => {
    setSortOption(value);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="inline-flex items-center justify-between w-full rounded-xl px-4 py-2 bg-white/90 text-gray-800 border border-gray-200 hover:border-violet-500 shadow-inner focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-300 transition cursor-pointer mt-1">
          {sortOption
            ? {
                priceLowHigh: "Price: Low to High",
                priceHighLow: "Price: High to Low",
                newest: "Newest",
                oldest: "Oldest",
                rating: "Rating",
              }[sortOption]
            : "Sort By"}
          <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="bg-white border border-gray-200 rounded-md shadow-lg p-1 w-[200px] z-[99999]"
          sideOffset={5}
        >
          {[
            { value: "priceLowHigh", label: "Price: Low to High" },
            { value: "priceHighLow", label: "Price: High to Low" },
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
            { value: "rating", label: "Rating" },
          ].map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => handleSelect(option.value)}
              className={`px-4 py-2 text-sm text-gray-800 rounded-md hover:bg-violet-100 cursor-pointer ${
                sortOption === option.value ? "bg-violet-50 font-semibold" : ""
              }`}
            >
              {option.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export { Filter, SortDropDown };
