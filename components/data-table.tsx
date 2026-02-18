import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Card,
  CardBody,
  CardHeader,
  Button,
  Pagination,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@heroui/react";
import React, { Key, ReactNode } from "react";
import { FiPlus } from "react-icons/fi";
import { useSearchParams } from "next/navigation";

import { SearchIcon } from "./icons";

import { LIMIT_DEFAULT, LIMIT_LISTS } from "@/constant/PAGINATION";
import useChangeUrl from "@/hooks/useChangeUrl";

interface PropTypes {
  columns: Record<string, unknown>[];
  data: Record<string, unknown>[];
  renderCell: (item: Record<string, unknown>, columnKey: Key) => ReactNode;
  title?: string;
  description?: string;
  addButton?: boolean;
  addButtonText?: string;
  onPressAddButton?: () => void;
  emptyContent?: string;
  isLoading?: boolean;
  totalPage?: number;
  currentPage?: number;
  searchPlaceholder?: string;
  isPaginate?: boolean;
}

const DataTable = ({
  columns,
  data,
  renderCell,
  title = "Data Table",
  description = "Description of data table",
  addButton = false,
  addButtonText = "Tambah",
  onPressAddButton,
  emptyContent,
  isLoading,
  totalPage,
  currentPage,
  searchPlaceholder = "Search...",
  isPaginate = true,
}: PropTypes) => {
  const {
    handleChangePage,
    handleClearSearch,
    handleChangeSearch,
    handleChangeLimit,
  } = useChangeUrl();

  const params = useSearchParams();
  const searhcValue = params.get("search");

  const topContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-end mb-4">
        <Input
          isClearable
          suppressHydrationWarning
          className="lg:w-80 w-full"
          defaultValue={searhcValue as string}
          placeholder={searchPlaceholder}
          startContent={
            <SearchIcon className="text-default-400 pointer-events-none flex-shrink-0" />
          }
          variant="flat"
          onChange={handleChangeSearch}
          onClear={handleClearSearch}
        />
      </div>
    );
  }, [handleClearSearch, handleChangeSearch]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        {isPaginate ? (
          <>
            <Select
              disallowEmptySelection
              className="w-32"
              defaultSelectedKeys={[LIMIT_DEFAULT.toString()]}
              label="Show:"
              labelPlacement="outside-left"
              variant="bordered"
              onChange={(value) => {
                handleChangeLimit(value);
              }}
            >
              {LIMIT_LISTS.map((limit) => (
                <SelectItem key={limit.value}>{limit.label}</SelectItem>
              ))}
            </Select>
            <Pagination
              showControls
              classNames={{
                cursor: "bg-success text-white",
              }}
              color="success"
              page={currentPage}
              size="sm"
              total={totalPage as number}
              onChange={handleChangePage}
            />
          </>
        ) : null}
      </div>
    );
  }, [handleChangePage, currentPage, totalPage]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        {addButton && (
          <Button
            className="flex items-center gap-2 text-white"
            color="success"
            onPress={onPressAddButton}
          >
            <FiPlus />
            {addButtonText}
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Example table with custom cells"
          bottomContent={bottomContent}
          topContent={topContent}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid as Key}
                align={
                  column.uid === "actions" ||
                  column.uid === "user" ||
                  column.uid === "createdBy"
                    ? "center"
                    : "start"
                }
              >
                {`${column.name}`}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={emptyContent}
            isLoading={isLoading}
            items={data}
            loadingContent={<Spinner color="success" />}
          >
            {(item) => (
              <TableRow key={item.id as Key}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as Key)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default DataTable;
