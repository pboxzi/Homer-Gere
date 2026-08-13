import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CreditCard, CheckCircle, Clock, Download, Search, Eye, RotateCcw,
  ChevronLeft, ChevronRight, X, AlertTriangle, FileText,
} from 'lucide-react';
import { type AdminSection } from '../../data/adminData';
import { useAdmin } from '../../context/AdminContext';

interface AdminPaymentsProps {
  activeSection: AdminSection;
}

const ITEMS_PER_PAGE = 10;

const STATUS_FILTERS = ['All', 'Completed', 'Pending', 'Refunded'] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const DATE_FILTERS = ['This Month', 'Last 3 Months', 'Last 6 Months', 'All Time'] as const;
type DateFilter = (typeof DATE_FILTERS)[number];

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    completed: 'bg-[#16A34A]/10 text-[#16A34A]',
    pending: 'bg-[#F59E0B]/10 text-[#F59E0B]',
    refunded: 'bg-[#DC2626]/10 text-[#DC2626]',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium w-fit capitalize ${styles[status] || 'bg-[#57534E]/10 text-[#57534E]'}`}>
      {status}
    </span>
  );
};

function parseDate(dateStr: string): Date {
  return new Date(dateStr);
}

function isWithinDateRange(dateStr: string, filter: DateFilter): boolean {
  const date = parseDate(dateStr);
  const now = new Date();
  switch (filter) {
    case 'This Month':
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    case 'Last 3 Months': {
      const threeMonthsAgo = new Date(now);
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      return date >= threeMonthsAgo;
    }
    case 'Last 6 Months': {
      const sixMonthsAgo = new Date(now);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return date >= sixMonthsAgo;
    }
    case 'All Time':
    default:
      return true;
  }
}

function generateCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => `"${val.replace(/"/g, '""')}"`;
  const lines = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ];
  return lines.join('\n');
}

function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const DetailModal: React.FC<{
  open: boolean;
  payment: {
    id: string;
    member: string;
    plan: string;
    amount: number;
    date: string;
    status: string;
  } | null;
  onClose: () => void;
  onRefund: (id: string) => void;
  onDownloadInvoice: (p: { member: string; plan: string; amount: number; date: string; id: string }) => void;
}> = ({ open, payment, onClose, onRefund, onDownloadInvoice }) => {
  if (!payment) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl border border-[#E8E5DF]/80 p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#A6852F]/10 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#A6852F]" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#1C1917]">Payment Details</h4>
                  <p className="text-[10px] text-[#57534E]">{payment.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-[#E8E5DF]/40">
                <span className="text-[11px] text-[#57534E]">Member</span>
                <span className="text-[11px] font-medium text-[#1C1917]">{payment.member}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8E5DF]/40">
                <span className="text-[11px] text-[#57534E]">Email</span>
                <span className="text-[11px] font-medium text-[#1C1917]">{payment.member.toLowerCase().replace(/ /g, '.')}@email.com</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8E5DF]/40">
                <span className="text-[11px] text-[#57534E]">Plan</span>
                <span className="text-[11px] font-medium text-[#1C1917]">{payment.plan}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8E5DF]/40">
                <span className="text-[11px] text-[#57534E]">Amount</span>
                <span className="text-[11px] font-medium text-[#1C1917]">${payment.amount}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8E5DF]/40">
                <span className="text-[11px] text-[#57534E]">Date</span>
                <span className="text-[11px] font-medium text-[#1C1917]">{payment.date}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8E5DF]/40">
                <span className="text-[11px] text-[#57534E]">Status</span>
                <StatusBadge status={payment.status} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[11px] text-[#57534E]">Transaction ID</span>
                <span className="text-[11px] font-mono font-medium text-[#1C1917]">TXN-{payment.id.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDownloadInvoice(payment)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium text-[#A6852F] bg-[#A6852F]/10 hover:bg-[#A6852F]/20 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Invoice
              </button>
              {payment.status === 'completed' && (
                <button
                  onClick={() => { onRefund(payment.id); onClose(); }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Refund
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AdminPayments: React.FC<AdminPaymentsProps> = ({ activeSection }) => {
  const { payments, updatePayment } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('All Time');
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[number] | null>(null);

  const isMembership = activeSection === 'membership-payments';

  const summaryData = useMemo(() => {
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedCount = payments.filter((p) => p.status === 'completed').length;
    const pendingCount = payments.filter((p) => p.status === 'pending').length;
    return { total, completedCount, pendingCount };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    let result = payments;

    if (isMembership) {
      const membershipPlans = ['Silver', 'Gold', 'Platinum'];
      result = result.filter((p) => membershipPlans.includes(p.plan));
    }

    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter.toLowerCase());
    }

    if (dateFilter !== 'All Time') {
      result = result.filter((p) => isWithinDateRange(p.date, dateFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.member.toLowerCase().includes(q) || p.plan.toLowerCase().includes(q)
      );
    }

    return result;
  }, [payments, isMembership, statusFilter, dateFilter, searchQuery]);

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const handleExportCSV = useCallback(() => {
    const headers = isMembership
      ? ['Member', 'Plan', 'Amount', 'Date', 'Status']
      : ['Transaction ID', 'Member', 'Plan', 'Amount', 'Date', 'Status'];

    const rows = filteredPayments.map((p) =>
      isMembership
        ? [p.member, p.plan, `$${p.amount}`, p.date, p.status]
        : [`TXN-${p.id.toUpperCase()}`, p.member, p.plan, `$${p.amount}`, p.date, p.status]
    );

    const csv = generateCSV(headers, rows);
    const filename = isMembership ? 'membership-payments.csv' : 'transactions.csv';
    downloadCSV(csv, filename);
  }, [filteredPayments, isMembership]);

  const handleRefund = useCallback(
    (id: string) => {
      updatePayment(id, { status: 'refunded' });
    },
    [updatePayment]
  );

  const handleDownloadInvoice = useCallback(
    (p: { member: string; plan: string; amount: number; date: string; id: string }) => {
      const invoiceContent = [
        'INVOICE',
        '',
        `Invoice ID: INV-${p.id.toUpperCase()}`,
        `Date: ${p.date}`,
        '',
        `Member: ${p.member}`,
        `Plan: ${p.plan}`,
        `Amount: $${p.amount}`,
        '',
        'Thank you for your payment!',
      ].join('\n');

      const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${p.id}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    },
    []
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] tracking-tight">
          {isMembership ? 'Membership Payments' : 'Transactions'}
        </h1>
        <p className="text-sm text-[#57534E] mt-1">
          {isMembership ? 'Track membership payment history and manage refunds.' : 'View all payment transactions across the platform.'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          className="rounded-xl p-4 border bg-[#16A34A]/8 border-[#16A34A]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#16A34A]/15 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#16A34A]" />
            </div>
            <p className="text-[11px] text-[#57534E] uppercase tracking-[0.05em]">Total Revenue</p>
          </div>
          <p className="text-2xl font-editorial text-[#16A34A]">${summaryData.total.toLocaleString()}</p>
        </motion.div>
        <motion.div
          className="rounded-xl p-4 border bg-[#A6852F]/8 border-[#A6852F]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#A6852F]/15 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-[#A6852F]" />
            </div>
            <p className="text-[11px] text-[#57534E] uppercase tracking-[0.05em]">Completed</p>
          </div>
          <p className="text-2xl font-editorial text-[#A6852F]">{summaryData.completedCount}</p>
        </motion.div>
        <motion.div
          className="rounded-xl p-4 border bg-[#F59E0B]/8 border-[#F59E0B]/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
              <Clock className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <p className="text-[11px] text-[#57534E] uppercase tracking-[0.05em]">Pending</p>
          </div>
          <p className="text-2xl font-editorial text-[#F59E0B]">{summaryData.pendingCount}</p>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#57534E]" />
              <input
                type="text"
                placeholder="Search member or plan..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8E5DF]/60 bg-white text-xs text-[#1C1917] placeholder:text-[#57534E]/50 focus:outline-none focus:border-[#A6852F]/40 focus:ring-1 focus:ring-[#A6852F]/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setStatusFilter(filter); setCurrentPage(1); }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                    statusFilter === filter
                      ? 'bg-[#A6852F]/10 text-[#A6852F] border border-[#A6852F]/25'
                      : 'text-[#57534E] hover:bg-[#F3F1ED] border border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {DATE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setDateFilter(filter); setCurrentPage(1); }}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                    dateFilter === filter
                      ? 'bg-[#1C1917]/10 text-[#1C1917] border border-[#1C1917]/20'
                      : 'text-[#57534E] hover:bg-[#F3F1ED] border border-transparent'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium text-[#A6852F] bg-[#A6852F]/10 hover:bg-[#A6852F]/20 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#E8E5DF]/60 bg-white overflow-hidden">
          <div className={`grid ${isMembership ? 'grid-cols-[1fr_80px_80px_100px_100px_80px]' : 'grid-cols-[120px_1fr_80px_80px_100px_100px_80px]'} gap-4 px-5 py-3 border-b border-[#E8E5DF]/40 text-[10px] font-medium text-[#57534E] uppercase tracking-[0.05em]`}>
            {!isMembership && <span>Transaction ID</span>}
            <span>Member</span>
            <span>Plan</span>
            <span>Amount</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {paginatedPayments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <FileText className="w-8 h-8 text-[#E8E5DF] mx-auto mb-2" />
              <p className="text-xs text-[#57534E]">No payments found matching your criteria.</p>
            </div>
          ) : (
            paginatedPayments.map((p) => (
              <div
                key={p.id}
                className={`grid ${isMembership ? 'grid-cols-[1fr_80px_80px_100px_100px_80px]' : 'grid-cols-[120px_1fr_80px_80px_100px_100px_80px]'} gap-4 px-5 py-3 border-b border-[#E8E5DF]/20 last:border-0 items-center hover:bg-[#F3F1ED]/30 transition-colors`}
              >
                {!isMembership && (
                  <span className="text-[10px] font-mono text-[#57534E] truncate">TXN-{p.id.toUpperCase()}</span>
                )}
                <span className="text-sm text-[#1C1917] truncate">{p.member}</span>
                <span className="text-xs text-[#57534E]">{p.plan}</span>
                <span className="text-sm font-medium text-[#1C1917]">${p.amount}</span>
                <span className="text-xs text-[#57534E]">{p.date}</span>
                <StatusBadge status={p.status} />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setSelectedPayment(p); setDetailModalOpen(true); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#A6852F]/10 hover:text-[#A6852F] transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDownloadInvoice(p)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#A6852F]/10 hover:text-[#A6852F] transition-colors cursor-pointer"
                    title="Download Invoice"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {p.status === 'completed' && (
                    <button
                      onClick={() => handleRefund(p.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-colors cursor-pointer"
                      title="Refund"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}

          {filteredPayments.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E5DF]/40">
              <p className="text-[10px] text-[#57534E]">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredPayments.length)} of {filteredPayments.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-7 h-7 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
                      page === currentPage
                        ? 'bg-[#A6852F]/10 text-[#A6852F]'
                        : 'text-[#57534E] hover:bg-[#F3F1ED]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[#57534E] hover:bg-[#F3F1ED] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <DetailModal
        open={detailModalOpen}
        payment={selectedPayment}
        onClose={() => { setDetailModalOpen(false); setSelectedPayment(null); }}
        onRefund={handleRefund}
        onDownloadInvoice={handleDownloadInvoice}
      />
    </div>
  );
};
