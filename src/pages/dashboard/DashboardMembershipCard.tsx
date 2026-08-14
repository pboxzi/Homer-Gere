import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Download, RefreshCw } from 'lucide-react';
import { membershipCardsRepository } from '../../lib/repositories';
import { useAuth } from '../../context/AuthContext';
import type { MembershipCard } from '../../types/database';

export default function DashboardMembershipCard() {
  const { user } = useAuth();
  const [card, setCard] = useState<MembershipCard | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      setCard(await membershipCardsRepository.getActiveByUserId(user.id));
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">My Membership Card</h1>
        <p className="text-sm text-[#6b7280] mt-1">View and manage your digital membership card</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#6b7280]">Loading...</div>
      ) : !card ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#6b7280]">No active membership card</p>
          <p className="text-sm text-[#6b7280] mt-1">Your card will appear here once your membership is activated</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-gradient-to-br from-[#A6852F] to-[#8B6F24] rounded-2xl p-8 text-white shadow-xl shadow-[#A6852F]/20 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-lg font-bold tracking-[0.15em]">HOMER GERE</div>
                <div className="text-xs opacity-70 tracking-[0.3em]">CLUB</div>
              </div>
              <CreditCard className="w-8 h-8 opacity-80" />
            </div>
            <div className="font-mono text-2xl tracking-[0.2em] mb-8">{card.card_number}</div>
            <div className="flex items-end justify-between text-sm">
              <div>
                <div className="text-[10px] opacity-60 uppercase tracking-wider">Issued</div>
                <div className="font-medium">{card.issue_date}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] opacity-60 uppercase tracking-wider">Expires</div>
                <div className="font-medium">{card.expiry_date || 'No Expiry'}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] opacity-60 uppercase tracking-wider">Design</div>
                <div className="font-medium capitalize">{card.card_design}</div>
              </div>
            </div>
          </div>

          {/* Card Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-md mx-auto">
            <h3 className="font-bold text-[#1a1a1a] mb-4">Card Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#6b7280]">Card Number</span><span className="font-mono font-medium">{card.card_number}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Status</span><span className="font-medium text-green-600 capitalize">{card.status}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Issue Date</span><span className="font-medium">{card.issue_date}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Expiry Date</span><span className="font-medium">{card.expiry_date || 'No Expiry'}</span></div>
              {card.qr_code_data && <div className="flex justify-between"><span className="text-[#6b7280]">QR Code</span><span className="font-mono text-xs">{card.qr_code_data}</span></div>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 max-w-md mx-auto">
            <button className="flex-1 py-2.5 bg-[#A6852F] text-white rounded-lg hover:bg-[#8B6F24] text-sm font-medium flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
