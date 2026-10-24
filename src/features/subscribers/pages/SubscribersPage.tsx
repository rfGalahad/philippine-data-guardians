import { useMemo } from "react";
import { Trash2 } from "lucide-react";

import Table from "@/components/dataDisplay/CustomTable/DataTable";
import TableSearch from "@/components/dataDisplay/CustomTable/TableSearch";
import TableFilters from "@/components/dataDisplay/CustomTable/TableFilters";
import TablePagination from "@/components/dataDisplay/CustomTable/TablePagination";
import TableActions, { type TableAction } from "@/components/dataDisplay/CustomTable/TableActions";
import SlideOverPanel from "@/components/dataDisplay/SlideOverPanel";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";

import { 
  fetchSubscriberDetail, 
  type PaymentFlag, 
  type SubscriberListRow, 
  type SubscriberStatus 
} from "@/lib/supabase/subscribers";

import { getFullName } from "@/utils/string";
import { optionsFrom } from "@/utils/array";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useDetailPanel } from "@/hooks/useDetailPanel";

import SubscriberDetailContent from "../components/contents/SubscriberDetailContent";

import { buildSubscriberColumns } from "../columns/subscriberColumns";
import { useSubscribers } from "../hooks/useSubscribers";
import { useDeleteSubscriber } from "../hooks/useDeleteSubscriber";


// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

const PAGE_SIZE = 10;

const EMPTY: SubscriberListRow[] = [];

const STATUS_ORDER: Record<SubscriberStatus, number> = {
  expiring_soon: 0,
  active: 1,
  expired: 2,
  no_subscription: 3,
};
 
const PAYMENT_ORDER: Record<PaymentFlag, number> = {
  failed: 0,
  pending: 1,
  paid: 2,
};

// ---------------------------------------------------------------------------
// SUBSCRIBERS PAGE
// ---------------------------------------------------------------------------

export default function SubscribersPage() {

  const {
    data: subscribers = EMPTY,
    isPending,
    error,
    //refetch,
  } = useSubscribers();

  const subscriberDetailPanel = useDetailPanel(fetchSubscriberDetail);
  const deleteSubscriber = useDeleteSubscriber();

  // DATA TABLE
  const columns = useMemo(() => buildSubscriberColumns(subscriberDetailPanel.openPanel), [subscriberDetailPanel.openPanel]);

  // TABLE SORT
  const getSortValue = (row: SubscriberListRow, key: string): string | number => {
    switch (key) {
      case "lastName":
        return `${row.lastName} ${row.firstName}`.toLowerCase();
      case "status":
        return STATUS_ORDER[row.status];
      case "nextExpiry":
        // Subscribers without an upcoming expiry sort last when ascending
        return row.nextExpiry ? new Date(row.nextExpiry).getTime() : Number.MAX_SAFE_INTEGER;
      case "paymentFlag":
        return row.paymentFlag ? PAYMENT_ORDER[row.paymentFlag] : 3;
      case "createdAt":
        return new Date(row.createdAt).getTime();
      default:
        return "";
    }
  };

  // TABLE SEARCH
  const query = useTableQuery<SubscriberListRow>(
    subscribers,
    (m, q) =>
      getFullName(m).toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.contactNumber?.toLowerCase().includes(q) ?? false),
    (m, f) =>
      (!f.status?.length || f.status.includes(m.status)) &&
      (!f.serviceName?.length ||
        m.subscriptions.some((s) => f.serviceName.includes(s.serviceName))) &&
      (!f.planName?.length ||
        m.subscriptions.some((s) => f.planName.includes(s.planName))) &&
      (!f.paymentFlag?.length || (!!m.paymentFlag && f.paymentFlag.includes(m.paymentFlag))),
    PAGE_SIZE,
    getSortValue,
    { key: "createdAt", direction: "desc" }
  );

  // TABLE FILTERS
  const filterConfigs = useMemo(() => [
    {
      key: "status",
      label: "Status",
      options: optionsFrom(subscribers.map((m) => m.status)),
    },
    {
      key: "serviceName",
      label: "Service",
      options: optionsFrom(subscribers.flatMap((m) => m.subscriptions.map((s) => s.serviceName))),
    },
    {
      key: "planName",
      label: "Plan",
      options: optionsFrom(subscribers.flatMap((m) => m.subscriptions.map((s) => s.planName))),
    },
    {
      key: "paymentFlag",
      label: "Payment",
      options: optionsFrom(
        subscribers.map((m) => m.paymentFlag).filter((flag) => flag !== null)
      ),
    },
  ], [subscribers]);

  // TABLE ACTIONS
  const bulkActions: TableAction[] = [
    { 
      key: "delete", 
      label: deleteSubscriber.deleting 
        ? "Deleting…" 
        : `Delete (${deleteSubscriber.selectedIds.size})`, 
      icon: <Trash2 size={14} />, 
      variant: "danger", 
      onClick: deleteSubscriber.requestDelete, 
      disabled: deleteSubscriber.deleting 
    },
  ];


  return (
    <div className="w-full px-8 py-8">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-text-primary">
          Subscribers
        </h1>
        <p className="mt-1 font-body text-sm text-text-secondary">
          {subscribers.length} total
          {query.isFiltered && <> · <span className="text-text-primary">{query.filtered.length}</span> matching</>}
        </p>
      </div>

      {/* TABLE ACTIONS */}
      <TableActions 
        selectedCount={deleteSubscriber.selectedIds.size} 
        bulkActions={bulkActions}
        onClearSelection={() => deleteSubscriber.setSelectedIds(new Set())} 
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
        rowKey={(row) => row.subscriberId}
        sort={query.sort}
        onSortChange={query.setSort}
        selectable
        selectedKeys={deleteSubscriber.selectedIds} 
        onSelectionChange={deleteSubscriber.setSelectedIds} 
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
        open={deleteSubscriber.confirmOpen}
        onOpenChange={(open) => !open && deleteSubscriber.cancelDelete()}
        onConfirm={deleteSubscriber.confirmDelete}
        loading={deleteSubscriber.deleting}
        variant="danger"
        title={`Delete ${deleteSubscriber.selectedIds.size} member${deleteSubscriber.selectedIds.size > 1 ? "s" : ""}?`}
        description={`Do you want to delete ${deleteSubscriber.selectedIds.size} member${deleteSubscriber.selectedIds.size > 1 ? "s" : ""}? This can't be undone.`}
        confirmLabel="Delete Member"
      />

      {/* SUBSCRIBER DETAILS PANEL */}
      <SlideOverPanel 
        open={!!subscriberDetailPanel.openFor} 
        onClose={subscriberDetailPanel.closePanel} 
        title={`Subscriber's Details`}
        loading={subscriberDetailPanel.loading} 
        error={subscriberDetailPanel.error}
      >
        {subscriberDetailPanel.detail && <SubscriberDetailContent detail={subscriberDetailPanel.detail} />}
      </SlideOverPanel>
    </div>
  );
}