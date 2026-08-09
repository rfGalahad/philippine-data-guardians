import { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

import Table from "@/components/CustomTable/DataTable";
import TableSearch from "@/components/CustomTable/TableSearch";
import TableFilters, { type FilterConfig } from "@/components/CustomTable/TableFilters";
import TablePagination from "@/components/CustomTable/TablePagination";
import TableActions, { type TableAction } from "@/components/CustomTable/TableActions";
import SlideOverPanel from "@/components/SlideOverPanel";
import ConfirmDialog from "@/components/ConfirmDialog";

import type { MemberListRow } from "@/lib/supabase/members";

import { optionsFrom } from "@/utils/array";
import { useTableQuery } from "@/hooks/useTableQuery";

import AddMemberContent from "../components/AddMemberContent/";
import MemberDetailContent from "../components/MemberDetailContent";

import { buildMemberColumns } from "../columns/memberColumns";
import { useMembers } from "../hooks/useMembers";
import { useMemberDetail } from "../hooks/useMemberDetail";



const PAGE_SIZE = 10;

export default function PDGMembersPage() {

  const {
    members,
    loading,
    error,
    selectedIds,
    setSelectedIds,
    deleting,
    confirmOpen,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useMembers();
  
  const detailPanel = useMemberDetail();
  const [addOpen, setAddOpen] = useState(false);

  // DATA TABLE
  const columns = useMemo(() => buildMemberColumns(detailPanel.open), [detailPanel.open]);

  // TABLE SORT
  const getSortValue = useMemo(() => {
    const map = new Map(columns.map((c) => [c.key, c]));
    return (row: MemberListRow, key: string) => {
      const col = map.get(key);
      if (!col) return undefined;
      return (row as unknown as Record<keyof MemberListRow, string | number | null | undefined>)[
        col.key as keyof MemberListRow
      ];
    };
  }, [columns]);

  // TABLE SEARCH
  const query = useTableQuery<MemberListRow>(
    members,
    (m, q) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    (m, f) =>
      (!f.subscriptionStatus?.length || f.subscriptionStatus.includes(m.subscriptionStatus)) &&
      (!f.planName?.length || f.planName.includes(m.planName)) &&
      (!f.paymentStatus?.length || (!!m.paymentStatus && f.paymentStatus.includes(m.paymentStatus))),
    PAGE_SIZE,
    getSortValue,
    { key: "startedAt", direction: "desc" }
  );

  // TABLE FILTERS
  const filterConfigs: FilterConfig[] = useMemo(() => [
    { 
      key: "subscriptionStatus", 
      label: "Status", 
      options: optionsFrom(members.map((m) => m.subscriptionStatus)) 
    },
    { 
      key: "planName", 
      label: "Plan", 
      options: optionsFrom(members.map((m) => m.planName)) 
    },
    { 
      key: "paymentStatus", 
      label: "Payment", 
      options: optionsFrom(members.map((m) => m.paymentStatus)) 
    },
  ], [members]);

  // TABLE ACTIONS
  const primaryActions: TableAction[] = [
    { 
      key: "add-member", 
      label: "Add member", 
      icon: <Plus size={14} strokeWidth={2.5} />, 
      variant: "primary", 
      onClick: () => setAddOpen(true) 
    },
  ];

  const bulkActions: TableAction[] = [
    { 
      key: "delete", 
      label: deleting 
        ? "Deleting…" 
        : `Delete (${selectedIds.size})`, 
      icon: <Trash2 size={14} />, 
      variant: "danger", 
      onClick: requestDelete, 
      disabled: deleting 
    },
  ];

  const activeCount = members.filter((m) => m.subscriptionStatus === "active").length;

  return (
    <div className="w-full px-8 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          PDG Members
        </h1>
        <p className="mt-1 font-body text-sm text-text-secondary">
          {members.length} total · {activeCount} active
          {query.isFiltered && <> · <span className="text-text-primary">{query.filtered.length}</span> matching</>}
        </p>
      </div>

      {/* TABLE ACTIONS */}
      <TableActions 
        selectedCount={selectedIds.size} 
        primaryActions={primaryActions} 
        bulkActions={bulkActions}
        onClearSelection={() => setSelectedIds(new Set())} 
        className="mb-4" 
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* TABLE SEARCH */}
        <TableSearch 
          value={query.searchQuery} 
          onChange={query.setSearchQuery} 
          placeholder="Search by name or email…" 
          className="w-full sm:w-72" 
        />

        {/* TABLE FILTERS */}
        <TableFilters 
          filters={filterConfigs} 
          values={query.filterValues} 
          onChange={query.setFilter} 
          onClearAll={query.clearFilters} 
        />
      </div>

      {/* DATA TABLE */}
      <Table 
        columns={columns} 
        data={query.pageData} 
        rowKey={(row) => row.memberId}
        sort={query.sort}
        onSortChange={query.setSort}
        selectable
        selectedKeys={selectedIds} 
        onSelectionChange={setSelectedIds} 
        loading={loading}
        error={error}
      />

      {/* TABLE PAGINATION */}
      <TablePagination 
        page={query.page} 
        pageSize={PAGE_SIZE} 
        totalItems={query.filtered.length}
        onPageChange={query.setPage} 
        className="mt-4 rounded-md border border-field-border" 
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => !open && cancelDelete()}
        onConfirm={confirmDelete}
        loading={deleting}
        variant="danger"
        title={`Delete ${selectedIds.size} member${selectedIds.size > 1 ? "s" : ""}?`}
        description={`Do you want to delete ${selectedIds.size} member${selectedIds.size > 1 ? "s" : ""}? This can't be undone.`}
        confirmLabel="Delete"
      />

      {/* MEMBER DETAILS PANEL */}
      <SlideOverPanel 
        open={!!detailPanel.openFor} 
        onClose={detailPanel.close} 
        title="Member Details"
        loading={detailPanel.loading} 
        error={detailPanel.error}
        >
        {detailPanel.detail && <MemberDetailContent detail={detailPanel.detail} />}
      </SlideOverPanel>

      {/* ADD NEW MEMBER PANEL */}
      <SlideOverPanel 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        title="Add New PDG Member"
      >
        <AddMemberContent onClose={() => setAddOpen(false)}  />
      </SlideOverPanel>
    </div>
  );
}