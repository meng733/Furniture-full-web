import React from 'react';

export const ProductSkeleton = () => {
  return (
    <div className="rounded-2xl border border-zinc-100 p-4 shadow-soft dark:border-zinc-800 animate-pulse bg-white dark:bg-zinc-900">
      <div className="aspect-square rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="mt-4 h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="mt-2 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="mt-2 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="mt-4 h-6 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800"></div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
        <div className="h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="rounded-2xl aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="h-10 w-10 rounded bg-zinc-200 dark:bg-zinc-800 flex-shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-3 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
          <div className="h-6 w-20 rounded bg-zinc-200 dark:bg-zinc-800"></div>
        </div>
      ))}
    </div>
  );
};
