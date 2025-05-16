"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

import { usePathname, useSearchParams } from "next/navigation";

const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function PaginationBox({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return pathname + "?" + params.toString();
  };

  const pages = generatePagination(currentPage, totalPages);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageUrl(currentPage - 1)}
            isDisabled={currentPage <= 1}
          ></PaginationPrevious>
        </PaginationItem>
        {pages.map((p, index) => (
          <PaginationItem key={index}>
            {p === "..." ? <PaginationEllipsis />:
            <PaginationLink
              href={createPageUrl(index+1)}
              isActive={currentPage === index + 1}
            >
              {index + 1}
            </PaginationLink>}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext isDisabled={currentPage >= totalPages}
            href={createPageUrl(currentPage + 1)}
          ></PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
