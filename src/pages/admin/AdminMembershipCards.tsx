import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, CreditCard, RefreshCw, Ban, Replace, Download } from 'lucide-react';
import { membershipCardsRepository, profilesRepository } from '../../lib/repositories';
import { notifyService } from '../../lib/notifications';
import type { MembershipCard } from '../../types/database';

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-green-700', bg: 'bg-green-100' },
  expired: { label: 'Expired', color: 'text-amber-700', bg: 'bg-amber-100' },
  deactivated: { label: 'Deactivated', color: 'text-red-700', bg: 'bg-red-100' },
  replaced: { label: 'Replaced', color: 'text-gray-700', bg: 'bg-gray-100' },
};

const FILTER_TABS = ['all', 'active', 'expired', 'deactivated', 'replaced'];

export default function AdminMembershipCards() {
  const [cards, setCards] = useState<MembershipCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MembershipCard | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([membershipCardsRepository.getAll(), membershipCardsRepository.getStats()]);
      setCards(c); setStats(s);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); }
  }, [successMsg]);

  const filtered = cards.filter(c => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (search) { const q = search.toLowerCase(); return c.card_number.toLowerCase().includes(q); }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fetchUserProfile = async (userId: string | null): Promise<{ email: string; fullName: string }> => {
    if (!userId) return { email: '', fullName: 'Member' };
    try {
      const profile = await profilesRepository.getById(userId);
      if (profile) return { email: profile.email, fullName: `${profile.first_name} ${profile.last_name}`.trim() };
    } catch { /* use defaults */ }
    return { email: '', fullName: 'Member' };
  };

  const handleDeactivate = async (card: MembershipCard) => {
    if (!confirm(`Deactivate card ${card.card_number}?`)) return;
    setActionLoading(true);
    try {
      await membershipCardsRepository.deactivate(card.id);
      if (card.user_id) {
        const { email, fullName } = await fetchUserProfile(card.user_id);
        await notifyService.membershipCardUpdated(card.user_id, { email, fullName, cardNumber: card.card_number, action: 'Deactivated', reason: 'Card has been deactivated by admin.' });
      }
      setSuccessMsg(`Card ${card.card_number} deactivated`);
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleReplace = async (card: MembershipCard) => {
    if (!confirm(`Replace card ${card.card_number}? A new card will be generated.`)) return;
    setActionLoading(true);
    try {
      const result = await membershipCardsRepository.replace(card.id);
      if (card.user_id) {
        const { email, fullName } = await fetchUserProfile(card.user_id);
        await notifyService.membershipCardUpdated(card.user_id, { email, fullName, cardNumber: card.card_number, action: 'Replaced', reason: `New card: ${result.new.card_number}` });
      }
      setSuccessMsg(`Card replaced. New card: ${result.new.card_number}`);
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  const handleRenew = async (card: MembershipCard) => {
    const newExpiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setActionLoading(true);
    try {
      await membershipCardsRepository.renew(card.id, newExpiry);
      if (card.user_id) {
        const { email, fullName } = await fetchUserProfile(card.user_id);
        await notifyService.membershipCardUpdated(card.user_id, { email, fullName, cardNumber: card.card_number, action: 'Renewed', reason: `New expiry: ${newExpiry}` });
      }
      setSuccessMsg(`Card ${card.card_number} renewed until ${newExpiry}`);
      setShowDetail(false);
      load();
    } catch (e) { console.error(e); }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Membership Cards</h1>
        <p className="text-sm text-[#6b7280] mt-1">Manage digital membership cards</p>
      </div>

      {successMsg && <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">{successMsg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {['total', 'active', 'expired', 'deactivated', 'replaced'].map(key => (
          <div key={key} className="bg-white rounded-lg border border-gray-200 p-3 text-center">
            <div className="text-2xl font-bold text-[#1a1a1a]">{stats[key] || 0}</div>
            <div className="text-xs text-[#6b7280] mt-1 capitalize">{key}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map(tab => (
          <button key={tab} onClick={() => { setFilter(tab); setPage(1); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === tab ? 'bg-[#A6852F] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {tab === 'all' ? 'All' : tab}
            {tab !== 'all' && stats[tab] ? <span className="ml-1 text-xs">({stats[tab]})</span> : null}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by card number..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A6852F]/20 focus:border-[#A6852F]" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : paged.length === 0 ? (
        <div className="text-center py-12 text-[#6b7280]">No membership cards found</div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Card Number</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Issue Date</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Expiry Date</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.map(card => {
                  const sc = STATUS_CONFIG[card.status] || STATUS_CONFIG.active;
                  return (
                    <tr key={card.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#A6852F]" />
                          <span className="font-mono text-xs font-medium">{card.card_number}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">{card.issue_date}</td>
                      <td className="px-4 py-3 text-xs">{card.expiry_date || '—'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setSelected(card); setShowDetail(true); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#6b7280]" title="View"><Eye className="w-4 h-4" /></button>
                          {card.status === 'active' && <button onClick={() => handleDeactivate(card)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600" title="Deactivate"><Ban className="w-4 h-4" /></button>}
                          {card.status === 'active' && <button onClick={() => handleReplace(card)} disabled={actionLoading} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600" title="Replace"><Replace className="w-4 h-4" /></button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {paged.map(card => {
              const sc = STATUS_CONFIG[card.status] || STATUS_CONFIG.active;
              return (
                <div key={card.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#A6852F]" />
                      <div>
                        <div className="font-mono text-xs font-medium">{card.card_number}</div>
                        <div className="text-xs text-[#6b7280]">Expires: {card.expiry_date || '—'}</div>
                      </div>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => { setSelected(card); setShowDetail(true); }} className="flex-1 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200">View</button>
                    {card.status === 'active' && <button onClick={() => handleDeactivate(card)} disabled={actionLoading} className="flex-1 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100">Deactivate</button>}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6b7280]">{filtered.length} cards · Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detail Modal */}
      {showDetail && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#1a1a1a]">Card Details</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {/* Card Preview */}
            <div className="bg-gradient-to-br from-[#A6852F] to-[#8B6F24] rounded-xl p-6 text-white mb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-bold tracking-wider">HOMER GERE CLUB</div>
                <CreditCard className="w-6 h-6" />
              </div>
              <div className="font-mono text-xl tracking-widest mb-4">{selected.card_number}</div>
              <div className="flex items-center justify-between text-sm opacity-80">
                <div><div className="text-xs">ISSUED</div><div>{selected.issue_date}</div></div>
                <div><div className="text-xs">EXPIRES</div><div>{selected.expiry_date || 'N/A'}</div></div>
                <div><div className="text-xs">DESIGN</div><div className="capitalize">{selected.card_design}</div></div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div><span className="text-[#6b7280]">Status:</span> <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.active).bg} ${(STATUS_CONFIG[selected.status] || STATUS_CONFIG.active).color}`}>{(STATUS_CONFIG[selected.status] || STATUS_CONFIG.active).label}</span></div>
              {selected.qr_code_data && <div><span className="text-[#6b7280]">QR Data:</span> <span className="font-mono text-xs">{selected.qr_code_data}</span></div>}
            </div>

            <div className="flex gap-2 mt-6">
              {selected.status === 'active' && <button onClick={() => handleRenew(selected)} disabled={actionLoading} className="flex-1 py-2 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium flex items-center justify-center gap-1"><RefreshCw className="w-4 h-4" /> Renew</button>}
              {selected.status === 'active' && <button onClick={() => handleReplace(selected)} disabled={actionLoading} className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Replace</button>}
              {selected.status === 'active' && <button onClick={() => handleDeactivate(selected)} disabled={actionLoading} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">Deactivate</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
