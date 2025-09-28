"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Filter, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { FfOpportunity } from "./FfOpportunityTable";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const columns: ColumnDef<FfOpportunity>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Player
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.getValue<string>("fullName")}
      </span>
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Position
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 90,
    cell: ({ row }) => (
      <span className="font-semibold uppercase">
        {row.getValue<string>("position")}
      </span>
    ),
  },
  {
    accessorKey: "team",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Team
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 80,
    cell: ({ row }) => (
      <span className="font-semibold uppercase">
        {row.getValue<string>("team")}
      </span>
    ),
  },
  {
    accessorKey: "season",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Season
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {integerFormatter.format(row.getValue<number>("season"))}
      </div>
    ),
  },
  {
    accessorKey: "week",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Week
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {integerFormatter.format(row.getValue<number>("week"))}
      </div>
    ),
  },
  {
    accessorKey: "receptions",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Receptions
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {numberFormatter.format(row.getValue<number>("receptions"))}
      </div>
    ),
  },
  {
    accessorKey: "targets",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Targets
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {numberFormatter.format(row.getValue<number>("targets"))}
      </div>
    ),
  },
  {
    accessorKey: "receivingYards",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rec Yards
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {numberFormatter.format(row.getValue<number>("receivingYards"))}
      </div>
    ),
  },
  {
    accessorKey: "airYards",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Air Yards
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {numberFormatter.format(row.getValue<number>("airYards"))}
      </div>
    ),
  },
  {
    accessorKey: "receivingTD",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rec TD
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {numberFormatter.format(row.getValue<number>("receivingTD"))}
      </div>
    ),
  },
  {
    accessorKey: "rushingAttempts",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rush Att
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {numberFormatter.format(row.getValue<number>("rushingAttempts"))}
      </div>
    ),
  },
  {
    accessorKey: "rushingYards",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rush Yards
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right">
        {numberFormatter.format(row.getValue<number>("rushingYards"))}
      </div>
    ),
  },
  {
    accessorKey: "totalTD",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total TD
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {numberFormatter.format(row.getValue<number>("totalTD"))}
      </div>
    ),
  },
  {
    accessorKey: "totalFantasyPoints",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fantasy Pts
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-semibold">
        {numberFormatter.format(row.getValue<number>("totalFantasyPoints"))}
      </div>
    ),
  },
];

interface FfOpportunityTableClientProps {
  data: FfOpportunity[];
}

export function FfOpportunityTableClient({
  data,
}: FfOpportunityTableClientProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  const positions = React.useMemo(() => {
    const unique = new Set<string>();
    data.forEach((row) => {
      if (row.position) {
        unique.add(row.position);
      }
    });
    return Array.from(unique).sort();
  }, [data]);

  const playerFilter =
    (table.getColumn("fullName")?.getFilterValue() as string) ?? "";
  const teamFilter =
    (table.getColumn("team")?.getFilterValue() as string) ?? "";
  const selectedPosition =
    (table.getColumn("position")?.getFilterValue() as string | undefined) ??
    undefined;

  const resetFilters = () => {
    table.resetColumnFilters();
    table.setPageIndex(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Input
              placeholder="Search by player name..."
              value={playerFilter}
              onChange={(event) =>
                table
                  .getColumn("fullName")
                  ?.setFilterValue(event.target.value)
              }
              className="w-full max-w-xs"
            />
            <Input
              placeholder="Filter by team..."
              value={teamFilter}
              onChange={(event) =>
                table.getColumn("team")?.setFilterValue(event.target.value)
              }
              className="w-full max-w-[180px]"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-[180px] justify-between"
                >
                  <span>
                    {selectedPosition
                      ? `Position: ${selectedPosition}`
                      : "All positions"}
                  </span>
                  <Filter className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[180px] rounded-md border bg-background p-1 shadow-lg"
              >
                <DropdownMenuLabel>Position</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() =>
                    table.getColumn("position")?.setFilterValue(undefined)
                  }
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {positions.map((pos) => (
                  <DropdownMenuItem
                    key={pos}
                    onClick={() =>
                      table.getColumn("position")?.setFilterValue(pos)
                    }
                  >
                    {pos}
                  </DropdownMenuItem>
                ))}
                {!positions.length && (
                  <DropdownMenuItem disabled>No positions</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={resetFilters}
            >
              <X className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-background shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          Showing
          <span className="mx-1 font-semibold">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              (table.getRowModel().rows.length ? 1 : 0)}
          </span>
          to
          <span className="mx-1 font-semibold">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>
          of
          <span className="ml-1 font-semibold">
            {table.getFilteredRowModel().rows.length}
          </span>
          entries
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-20 justify-between">
                  {table.getState().pagination.pageSize}
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-24 rounded-md border bg-background p-1 shadow-lg"
              >
                {[25, 50, 100, 200].map((pageSize) => (
                  <DropdownMenuItem
                    key={pageSize}
                    onClick={() => table.setPageSize(pageSize)}
                  >
                    {pageSize}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FfOpportunityTableClient;
