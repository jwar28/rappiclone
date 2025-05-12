import * as React from "react";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	type ColumnDef,
	type RowSelectionState,
	type SortingState,
	getSortedRowModel,
} from "@tanstack/react-table";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./table";
import { Button } from "./button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "./select";
import { ArrowUp, ArrowDown, Eye } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "./dropdown-menu";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	pageSizeOptions?: number[];
	initialPageSize?: number;
	enableRowSelection?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	pageSizeOptions = [5, 10, 20],
	initialPageSize = 10,
	enableRowSelection = false,
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
	const [pageSize, setPageSize] = React.useState(initialPageSize);
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { rowSelection, sorting },
		enableRowSelection,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		pageCount: Math.ceil(data.length / pageSize),
		manualPagination: false,
		initialState: {
			pagination: { pageSize },
		},
	});

	React.useEffect(() => {
		table.setPageSize(pageSize);
	}, [pageSize, table]);

	return (
		<div className="space-y-2 w-full">
			<div className="flex items-center justify-between gap-2">
				{enableRowSelection && (
					<span className="text-sm text-muted-foreground">
						{Object.keys(rowSelection).length} seleccionadas
					</span>
				)}
				<div className="flex items-center gap-2 ml-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm" className="h-8 px-2">
								<Eye className="w-4 h-4 mr-2" /> View
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
								Toggle columns
							</div>
							{table
								.getAllLeafColumns()
								.filter((col) => col.getCanHide())
								.map((column) => (
									<DropdownMenuItem key={column.id} asChild>
										<label className="flex items-center gap-2 cursor-pointer w-full">
											<input
												type="checkbox"
												checked={column.getIsVisible()}
												onChange={() => column.toggleVisibility()}
												className="accent-primary"
											/>
											{column.columnDef.header as string}
										</label>
									</DropdownMenuItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="rounded-md border w-full overflow-x-auto">
				<Table>
					<TableHeader>
						{table
							.getHeaderGroups()
							.map((headerGroup: ReturnType<typeof table.getHeaderGroups>[number]) => (
								<TableRow key={headerGroup.id}>
									{enableRowSelection && (
										<TableHead>
											<input
												type="checkbox"
												checked={table.getIsAllPageRowsSelected()}
												onChange={table.getToggleAllPageRowsSelectedHandler()}
											/>
										</TableHead>
									)}
									{headerGroup.headers.map((header: (typeof headerGroup.headers)[number]) => {
										const canSort = header.column.getCanSort();
										const sorted = header.column.getIsSorted();
										const canHide = header.column.getCanHide?.() ?? true;
										const colWidth = header.column.columnDef.size
											? { width: header.column.columnDef.size }
											: {};
										return (
											<TableHead
												key={header.id}
												style={{
													minWidth: 120,
													...colWidth,
													cursor: canSort ? "pointer" : undefined,
												}}
											>
												{canSort ? (
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<span className="flex items-center gap-1 select-none">
																{header.isPlaceholder
																	? null
																	: flexRender(header.column.columnDef.header, header.getContext())}
																{canSort && (
																	<span>
																		{sorted === "asc" && <ArrowUp className="w-3 h-3 inline" />}
																		{sorted === "desc" && <ArrowDown className="w-3 h-3 inline" />}
																	</span>
																)}
															</span>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="start">
															<DropdownMenuItem onClick={() => header.column.toggleSorting(false)}>
																<ArrowUp className="w-3 h-3 mr-2" /> Asc
															</DropdownMenuItem>
															<DropdownMenuItem onClick={() => header.column.toggleSorting(true)}>
																<ArrowDown className="w-3 h-3 mr-2" /> Desc
															</DropdownMenuItem>
															{canHide && (
																<DropdownMenuItem
																	onClick={() => header.column.toggleVisibility(false)}
																>
																	<span className="mr-2">🚫</span> Hide
																</DropdownMenuItem>
															)}
														</DropdownMenuContent>
													</DropdownMenu>
												) : (
													<span className="flex items-center gap-1 select-none">
														{header.isPlaceholder
															? null
															: flexRender(header.column.columnDef.header, header.getContext())}
													</span>
												)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length + (enableRowSelection ? 1 : 0)}
									className="text-center text-muted-foreground"
								>
									Sin datos.
								</TableCell>
							</TableRow>
						) : (
							table
								.getRowModel()
								.rows.map((row: ReturnType<typeof table.getRowModel>["rows"][number]) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{enableRowSelection && (
											<TableCell>
												<input
													type="checkbox"
													checked={row.getIsSelected()}
													onChange={row.getToggleSelectedHandler()}
												/>
											</TableCell>
										)}
										{row.getVisibleCells().map((cell) => {
											const colWidth = cell.column.columnDef.size
												? { width: cell.column.columnDef.size }
												: {};
											return (
												<TableCell key={cell.id} style={colWidth}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</TableCell>
											);
										})}
									</TableRow>
								))
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-between gap-2 py-2">
				<span className="text-sm text-muted-foreground">
					Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
				</span>
				<div className="flex items-center gap-2">
					<span className="text-sm">Filas por página:</span>
					<Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
						<SelectTrigger className="w-16 h-8">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((opt) => (
								<SelectItem key={opt} value={String(opt)}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							«
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							‹
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							›
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							»
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
