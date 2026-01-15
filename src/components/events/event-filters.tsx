"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPORT_TYPES } from "@/types/database";

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  );

  // Sync search input with URL params
  useEffect(() => {
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const debouncedSearch = useDebouncedCallback((value: string) => {
    startTransition(() => {
      const queryString = createQueryString({ search: value || null });
      router.push(`/dashboard${queryString ? `?${queryString}` : ""}`);
    });
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  const handleSportTypeChange = (value: string) => {
    startTransition(() => {
      const queryString = createQueryString({
        sportType: value === "all" ? null : value,
      });
      router.push(`/dashboard${queryString ? `?${queryString}` : ""}`);
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    startTransition(() => {
      router.push("/dashboard");
    });
  };

  const hasFilters =
    searchParams.has("search") || searchParams.has("sportType");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search events by name..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      <Select
        value={searchParams.get("sportType") || "all"}
        onValueChange={handleSportTypeChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          {SPORT_TYPES.map((sport) => (
            <SelectItem key={sport} value={sport}>
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" onClick={clearFilters} className="gap-2">
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
