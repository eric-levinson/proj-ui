"use client";

import * as React from "react";
import Link from "next/link";
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

import { PlayerProjection, playerKeyToSlug } from "./PlayersTable";

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const columns: ColumnDef<PlayerProjection>[] = [
  {
    accessorKey: "playerName",
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
    cell: ({ row }) => {
      const projection = row.original;
      const slugSource =
        projection.playerKey?.trim() || projection.playerName?.trim() || "";
      const slug = slugSource ? playerKeyToSlug(slugSource) : "";
  const href = slug ? `/player/${slug}` : "#";

      return (
        <Link
          href={href}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {row.getValue<string>("playerName")}
        </Link>
      );
    },
  },
  {
    accessorKey: "pos",
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
    size: 80,
    cell: ({ row }) => (
      <span className="font-semibold uppercase">
        {row.getValue<string>("pos")}
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
    accessorKey: "source",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Source
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
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
        {row.getValue<number>("season")}
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
        {row.getValue<number>("week")}
      </div>
    ),
  },
  {
    accessorKey: "projectedPoints",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Projected Pts
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue<number>("projectedPoints");
      return <div className="text-right">{numberFormatter.format(value)}</div>;
    },
  },
  {
    accessorKey: "fantasyPoints",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Actual Pts
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue<number>("fantasyPoints");
      return <div className="text-right">{numberFormatter.format(value)}</div>;
    },
  },
];

interface PlayersTableClientProps {
  data: PlayerProjection[];
}

export function PlayersTableClient({ data }: PlayersTableClientProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
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
        pageSize: 10,
      },
    },
  });

  const positions = React.useMemo(() => {
    const unique = new Set<string>();
    data.forEach((row) => {
      if (row.pos) {
        unique.add(row.pos);
      }
    });
    return Array.from(unique).sort();
  }, [data]);

  const sources = React.useMemo(() => {
    const unique = new Set<string>();
    data.forEach((row) => {
      if (row.source) {
        unique.add(row.source);
      }
    });
    return Array.from(unique).sort();
  }, [data]);

  const playerFilter =
    (table.getColumn("playerName")?.getFilterValue() as string) ?? "";
  const teamFilter =
    (table.getColumn("team")?.getFilterValue() as string) ?? "";
  const selectedPosition =
    (table.getColumn("pos")?.getFilterValue() as string | undefined) ??
    undefined;
  const selectedSource =
    (table.getColumn("source")?.getFilterValue() as string | undefined) ??
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
                  .getColumn("playerName")
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
                    {selectedPosition ? `Position: ${selectedPosition}` : "All positions"}
                  </span>
                  <Filter className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[180px] rounded-md border bg-background p-1 shadow-lg"
              >
                <DropdownMenuLabel>Position</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => table.getColumn("pos")?.setFilterValue(undefined)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {positions.map((pos) => (
                  <DropdownMenuItem
                    key={pos}
                    onClick={() => table.getColumn("pos")?.setFilterValue(pos)}
                  >
                    {pos}
                  </DropdownMenuItem>
                ))}
                {!positions.length && (
                  <DropdownMenuItem disabled>No positions</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full max-w-[200px] justify-between"
                >
                  <span>
                    {selectedSource ? `Source: ${selectedSource}` : "All sources"}
                  </span>
                  <Filter className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-[200px] rounded-md border bg-background p-1 shadow-lg"
              >
                <DropdownMenuLabel>Source</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => table.getColumn("source")?.setFilterValue(undefined)}
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {sources.map((source) => (
                  <DropdownMenuItem
                    key={source}
                    onClick={() => table.getColumn("source")?.setFilterValue(source)}
                  >
                    {source}
                  </DropdownMenuItem>
                ))}
                {!sources.length && (
                  <DropdownMenuItem disabled>No sources</DropdownMenuItem>
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
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
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
                {[10, 20, 50, 100].map((pageSize) => (
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

export default PlayersTableClient;
