import { useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";

import Table from "@/components/dataDisplay/CustomTable/DataTable";
import TableSearch from "@/components/dataDisplay/CustomTable/TableSearch";
import TableFilters from "@/components/dataDisplay/CustomTable/TableFilters";
import TablePagination from "@/components/dataDisplay/CustomTable/TablePagination";
import TableActions, { type TableAction } from "@/components/dataDisplay/CustomTable/TableActions";
import SlideOverPanel from "@/components/dataDisplay/SlideOverPanel";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";

import { fetchMemberDetail, type MemberListRow } from "@/lib/supabase/members";

import { optionsFrom } from "@/utils/array";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useDetailPanel } from "@/hooks/useDetailPanel";
import { useTogglePanel } from "@/hooks/useTogglePanel";

import AddMemberContent from "../components/contents/AddMemberContent";
import MemberDetailContent from "../components/contents/MemberDetailContent";
import UpdateMemberContent from "../components/contents/UpdateMemberContent";

import { buildMemberColumns } from "../columns/memberColumns";
import { useMembers } from "../hooks/useMembers";
import { useDeleteMember } from "../hooks/useDeleteMember";


// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

const EMPTY: MemberListRow[] = [];

// ---------------------------------------------------------------------------
// PDG MEMBERS PAGE
// ---------------------------------------------------------------------------

export default function PDGMembersPage() {

  const {
    data: members = EMPTY,
    isPending,
    error,
    refetch,
  } = useMembers();

  const addMemberPanel = useTogglePanel();
  const memberDetailPanel = useDetailPanel(fetchMemberDetail);
  const updateMemberPanel = useDetailPanel(fetchMemberDetail);
  
  const deleteMember = useDeleteMember();

  // DATA TABLE
  const columns = useMemo(() => buildMemberColumns(memberDetailPanel.openPanel, updateMemberPanel.openPanel), [memberDetailPanel.openPanel, updateMemberPanel.openPanel]);

  // TABLE SORT
  const getSortValue = useMemo(() => {
    const validKeys = new Set(columns.map((c) => c.key)) as Set<keyof MemberListRow>;
    const isSortableKey = (key: string): key is keyof MemberListRow =>
      validKeys.has(key as keyof MemberListRow);
    return (row: MemberListRow, key: string) =>
      isSortableKey(key) ? row[key] : undefined;
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
  const filterConfigs = useMemo(() => [
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
      onClick: addMemberPanel.openPanel
    },
  ];

  const bulkActions: TableAction[] = [
    { 
      key: "delete", 
      label: deleteMember.deleting 
        ? "Deleting…" 
        : `Delete (${deleteMember.selectedIds.size})`, 
      icon: <Trash2 size={14} />, 
      variant: "danger", 
      onClick: deleteMember.requestDelete, 
      disabled: deleteMember.deleting 
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
        selectedCount={deleteMember.selectedIds.size} 
        primaryActions={primaryActions} 
        bulkActions={bulkActions}
        onClearSelection={() => deleteMember.setSelectedIds(new Set())} 
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
        selectedKeys={deleteMember.selectedIds} 
        onSelectionChange={deleteMember.setSelectedIds} 
        loading={isPending}
        error={error?.message ?? null}
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
        open={deleteMember.confirmOpen}
        onOpenChange={(open) => !open && deleteMember.cancelDelete()}
        onConfirm={deleteMember.confirmDelete}
        loading={deleteMember.deleting}
        variant="danger"
        title={`Delete ${deleteMember.selectedIds.size} member${deleteMember.selectedIds.size > 1 ? "s" : ""}?`}
        description={`Do you want to delete ${deleteMember.selectedIds.size} member${deleteMember.selectedIds.size > 1 ? "s" : ""}? This can't be undone.`}
        confirmLabel="Delete Member"
      />

      {/* ADD NEW MEMBER PANEL */}
      <SlideOverPanel 
        open={addMemberPanel.open} 
        onClose={addMemberPanel.closePanel} 
        title="Add New PDG Member"
      >
        <AddMemberContent 
          onClose={addMemberPanel.closePanel} 
          onSuccess={() => refetch()} 
        />
      </SlideOverPanel>

      {/* MEMBER DETAILS PANEL */}
      <SlideOverPanel 
        open={!!memberDetailPanel.openFor} 
        onClose={memberDetailPanel.closePanel} 
        title={`Member #${memberDetailPanel.detail?.memberId ?? ""} Details`}
        loading={memberDetailPanel.loading} 
        error={memberDetailPanel.error}
      >
        {memberDetailPanel.detail && <MemberDetailContent detail={memberDetailPanel.detail} />}
      </SlideOverPanel>

      {/* UPDATE MEMBER PANEL */}
      <SlideOverPanel 
        open={!!updateMemberPanel.openFor} 
        onClose={updateMemberPanel.closePanel} 
        title={`Update Member #${updateMemberPanel.detail?.memberId ?? ""}`}
        loading={updateMemberPanel.loading} 
        error={updateMemberPanel.error}
      >
        {updateMemberPanel.detail && (
          <UpdateMemberContent 
            detail={updateMemberPanel.detail} 
            onClose={updateMemberPanel.closePanel} 
            onSuccess={() => refetch()}
          />
        )}
      </SlideOverPanel>
    </div>
  );
}