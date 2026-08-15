import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, CreditCard, Smartphone, Building2, HandCoins, Globe } from 'lucide-react';
import { paymentMethodsRepository } from '../../lib/repositories';
import type { PaymentMethod, PaymentMethodType } from '../../types/database';

const TYPE_ICONS: Record<string, typeof CreditCard> = {
  bank_transfer: Building2,
  mobile_money: Smartphone,
  cash_deposit: HandCoins,
  manual_transfer: CreditCard,
  online_gateway: Globe,
};

const TYPE_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  mobile_money: 'Mobile Money',
  cash_deposit: 'Cash Deposit',
  manual_transfer: 'Manual Transfer',
  online_gateway: 'Online Gateway',
};

const PAGE_SIZE = 10;

export default function AdminPaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PaymentMethod | null>(null);
  const [form, setForm] = useState({ name: '', type: 'bank_transfer', country: '', currency: 'USD', accountName: '', accountNumber: '', bankName: '', swiftCode: '', routingCode: '', mobileNumber: '', instructions: '', isActive: true, sortOrder: 0 });
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setMethods(await paymentMethodsRepository.getAll()); } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  const filtered = methods.filter(m => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false;
    if (statusFilter === 'active' && !m.is_active) return false;
    if (statusFilter === 'inactive' && m.is_active) return false;
    if (search) { const q = search.toLowerCase(); return m.name.toLowerCase().includes(q) || (m.bank_name || '').toLowerCase().includes(q) || (m.country || '').toLowerCase().includes(q); }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => {
    setForm({ name: '', type: 'bank_transfer', country: '', currency: 'USD', accountName: '', accountNumber: '', bankName: '', swiftCode: '', routingCode: '', mobileNumber: '', instructions: '', isActive: true, sortOrder: 0 });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    setActionLoading(true);
    try {
      const data = {
        name: form.name, type: form.type as PaymentMethodType, country: form.country || null, currency: form.currency,
        account_name: form.accountName || null, account_number: form.accountNumber || null, bank_name: form.bankName || null,
        swift_code: form.swiftCode || null, routing_code: form.routingCode || null, mobile_number: form.mobileNumber || null,
        instructions: form.instructions || null, is_active: form.isActive, sort_order: form.sortOrder,
      };
      if (editing) {
        await paymentMethodsRepository.update(editing.id, data);
        setSuccessMsg('Payment method updated');
      } else {
        await paymentMethodsRepository.create(data);
        setSuccessMsg('Payment method created');
      }
      resetForm();
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleToggle = async (m: PaymentMethod) => {
    try { await paymentMethodsRepository.toggleActive(m.id); load(); } catch (e) { console.error(e); }
  };

  const handleDelete = async (m: PaymentMethod) => {
    if (!confirm(`Delete payment method "${m.name}"?`)) return;
    try { await paymentMethodsRepository.delete(m.id); setSuccessMsg('Deleted'); load(); } catch (e) { console.error(e); }
  };

  const startEdit = (m: PaymentMethod) => {
    setForm({ name: m.name, type: m.type, country: m.country || '', currency: m.currency, accountName: m.account_name || '', accountNumber: m.account_number || '', bankName: m.bank_name || '', swiftCode: m.swift_code || '', routingCode: m.routing_code || '', mobileNumber: m.mobile_number || '', instructions: m.instructions || '', isActive: m.is_active, sortOrder: m.sort_order });
    setEditing(m);
    setShowForm(true);
  };

  const inputCls = 'w-full px-3 py-2 border border-[#E8E5DF]/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]';
  const labelCls = 'block text-sm font-medium text-[#1a1a1a] mb-1';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Payment Methods</h1>
          <p className="text-sm text-[#6b7280] mt-1">Manage payment options for members</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm">
          <Plus className="w-4 h-4" /> Add Method
        </button>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search methods..."
            className="w-full pl-10 pr-4 py-2 border border-[#E8E5DF]/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
        </div>
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-12 text-[#6b7280]">No payment methods found</div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-[#A6852F]/20 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
            <table className="w-full text-sm">
              <thead className="bg-[#A6852F]/5 border-b border-[#A6852F]/15">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Method</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Country</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Account Info</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A6852F]/10">
                {paged.map(m => {
                  const Icon = TYPE_ICONS[m.type] || CreditCard;
                  return (
                    <tr key={m.id} className="hover:bg-[#A6852F]/5 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-[#A6852F]" />
                          <div>
                            <div className="font-medium text-[#1a1a1a]">{m.name}</div>
                            {m.bank_name && <div className="text-xs text-[#6b7280]">{m.bank_name}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">{TYPE_LABELS[m.type] || m.type}</td>
                      <td className="px-4 py-3 text-xs">{m.country || '—'}</td>
                      <td className="px-4 py-3 text-xs font-mono">{m.account_number || m.mobile_number || '—'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggle(m)} className="flex items-center gap-1">
                          {m.is_active ? <><ToggleRight className="w-5 h-5 text-green-600" /><span className="text-xs text-green-600">Active</span></> : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-xs text-gray-400">Inactive</span></>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => startEdit(m)} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(m)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paged.map(m => {
              const Icon = TYPE_ICONS[m.type] || CreditCard;
              return (
                <div key={m.id} className="bg-white rounded-xl border border-[#A6852F]/20 p-4 shadow-sm hover:shadow-lg transition-all duration-500">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-[#A6852F]" />
                      <div>
                        <div className="font-medium text-[#1a1a1a]">{m.name}</div>
                        <div className="text-xs text-[#6b7280]">{TYPE_LABELS[m.type]} · {m.country || 'Global'}</div>
                      </div>
                    </div>
                    <button onClick={() => handleToggle(m)}>
                      {m.is_active ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => startEdit(m)} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">Edit</button>
                    <button onClick={() => handleDelete(m)} className="flex-1 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Delete</button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280]">{filtered.length} methods · Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={resetForm}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 border border-[#A6852F]/20 shadow-xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">{editing ? 'Edit' : 'Add'} Payment Method</h2>
            <div className="space-y-4">
              <div><label className={labelCls}>Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputCls} placeholder="e.g. Chase Bank" /></div>
              <div><label className={labelCls}>Type *</label><select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className={inputCls}>
                {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Country</label><input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={inputCls} placeholder="US" /></div>
                <div><label className={labelCls}>Currency</label><input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className={inputCls} /></div>
              </div>
              {(form.type === 'bank_transfer' || form.type === 'manual_transfer') && (
                <>
                  <div><label className={labelCls}>Account Name</label><input value={form.accountName} onChange={e => setForm(f => ({ ...f, accountName: e.target.value }))} className={inputCls} /></div>
                  <div><label className={labelCls}>Account Number</label><input value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))} className={inputCls} /></div>
                  <div><label className={labelCls}>Bank Name</label><input value={form.bankName} onChange={e => setForm(f => ({ ...f, bankName: e.target.value }))} className={inputCls} /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className={labelCls}>Swift Code</label><input value={form.swiftCode} onChange={e => setForm(f => ({ ...f, swiftCode: e.target.value }))} className={inputCls} /></div>
                    <div><label className={labelCls}>Routing Code</label><input value={form.routingCode} onChange={e => setForm(f => ({ ...f, routingCode: e.target.value }))} className={inputCls} /></div>
                  </div>
                </>
              )}
              {form.type === 'mobile_money' && (
                <div><label className={labelCls}>Mobile Number</label><input value={form.mobileNumber} onChange={e => setForm(f => ({ ...f, mobileNumber: e.target.value }))} className={inputCls} /></div>
              )}
              <div><label className={labelCls}>Instructions</label><textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} className={inputCls + ' min-h-[80px]'} placeholder="Payment instructions for members..." /></div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                <span className="text-sm text-[#1a1a1a]">Active</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSave} disabled={actionLoading || !form.name.trim()} className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium disabled:opacity-50">{editing ? 'Update' : 'Create'}</button>
              <button onClick={resetForm} className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
