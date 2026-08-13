import React, { useState } from 'react';
import { X, Calendar, Clock, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { ModalType } from '../types';
import { FEATURED_PROJECT } from '../data/content';

interface DetailModalProps {
  modal: ModalType;
  onClose: () => void;
  onOpenChat: (mode?: 'fan' | 'business') => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  modal,
  onClose,
  onOpenChat,
}) => {
  const [successMsg, setSuccessMsg] = useState('');

  if (!modal || modal.type === 'chat') return null;

  const handleActionClick = (title: string) => {
    setSuccessMsg(`Your request for "${title}" has been registered! We will follow up shortly.`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body depending on type */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-4 bg-green-50 rounded-2xl text-green-800 text-sm font-medium flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. ARTICLE READ MODAL */}
          {modal.type === 'article' && modal.article && (
            <div className="space-y-6">
              <div className="relative h-64 sm:h-80 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-6 overflow-hidden bg-[#EDE9E0]">
                <img
                  src={modal.article.image}
                  alt={modal.article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                    {modal.article.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-editorial mt-2">
                    {modal.article.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-gray-300 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {modal.article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {modal.article.readTime}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[#1C1917] text-base leading-relaxed space-y-4 font-normal whitespace-pre-line">
                {modal.article.content}
              </div>

              <div className="pt-6 flex items-center justify-between">
                <span className="text-xs text-[#44403C]">Written by Homer Gere</span>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#EDE9E0] hover:bg-[#E4DFD5] text-[#1C1917] rounded-full text-sm font-medium transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          )}

          {/* 2. TIMELINE MILESTONE MODAL */}
          {modal.type === 'milestone' && modal.milestone && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium bg-blue-600 text-white px-3 py-1 rounded-full">
                  {modal.milestone.year}
                </span>
                <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917]">
                  {modal.milestone.title}
                </h2>
              </div>

              <p className="text-lg text-[#1C1917] font-medium leading-relaxed">
                {modal.milestone.description}
              </p>

              <div className="p-5 bg-blue-50/60 rounded-2xl text-[#1C1917] text-sm leading-relaxed">
                {modal.milestone.details}
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium"
                >
                  Done Exploring
                </button>
              </div>
            </div>
          )}

          {/* 3. EXPERIENCE BOOKING MODAL */}
          {modal.type === 'experience' && modal.experience && (
            <div className="space-y-6 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase tracking-widest">
                    Exclusive Experience
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-editorial text-[#1C1917] mt-1">
                    {modal.experience.title}
                  </h2>
                </div>
                <div className="text-2xl font-medium text-blue-600 font-editorial">
                  {modal.experience.price}
                </div>
              </div>

              <p className="text-[#44403C] text-sm sm:text-base leading-relaxed">
                {modal.experience.details}
              </p>

              <div className="bg-[#F5F2EB] p-4 rounded-2xl space-y-2 text-xs text-[#44403C]">
                <div className="flex items-center gap-2 font-medium text-[#1C1917]">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Official Booking Guarantee
                </div>
                <p>
                  All bookings are personally coordinated by Homer Gere's official management team.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleActionClick(modal.experience.title)}
                  className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium text-center"
                >
                  Request Experience
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenChat('business');
                  }}
                  className="px-6 py-3.5 bg-[#EDE9E0] hover:bg-[#E4DFD5] text-[#1C1917] rounded-full text-sm font-medium text-center"
                >
                  Inquire via Chat
                </button>
              </div>
            </div>
          )}

          {/* 4. MEMBERSHIP CONFIRMATION MODAL */}
          {modal.type === 'membership' && modal.tier && (
            <div className="space-y-6 pt-2">
              <div className="text-center space-y-2">
                <span className="text-xs font-medium text-blue-600 uppercase tracking-widest">
                  Membership Checkout
                </span>
                <h2 className="text-3xl font-editorial text-[#1C1917]">
                  Join {modal.tier.name} Tier
                </h2>
                <div className="text-3xl font-editorial font-extrabold text-blue-600">
                  ${modal.tier.price} <span className="text-sm text-[#44403C] font-normal">{modal.tier.period}</span>
                </div>
              </div>

              <div className="bg-[#F5F2EB] p-6 rounded-2xl space-y-3">
                <h4 className="text-xs font-medium text-[#1C1917] uppercase tracking-wider">
                  Included Benefits:
                </h4>
                <ul className="space-y-2">
                  {modal.tier.features.filter((f) => f.included).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-[#1C1917]">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{feat.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleActionClick(`${modal.tier.name} Membership`)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium"
                >
                  Complete Registration &rarr;
                </button>
              </div>
            </div>
          )}

          {/* 5. GALLERY LIGHTBOX MODAL */}
          {modal.type === 'gallery' && modal.item && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
                <img
                  src={modal.item.image}
                  alt={modal.item.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-xs font-medium text-blue-600 uppercase">
                    {modal.item.category}
                  </span>
                  <h3 className="text-xl font-editorial text-[#1C1917]">
                    {modal.item.title}
                  </h3>
                  <p className="text-xs text-[#44403C]">{modal.item.caption}</p>
                </div>

                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#EDE9E0] hover:bg-[#E4DFD5] text-[#1C1917] rounded-full text-xs font-medium"
                >
                  Close Lightbox
                </button>
              </div>
            </div>
          )}

          {/* 6. SIGN IN MODAL */}
          {modal.type === 'signin' && (
            <div className="space-y-6 pt-2">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-editorial text-[#1C1917]">
                  Member Sign In
                </h2>
                <p className="text-xs text-[#44403C]">
                  Enter your credentials to access exclusive member content.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleActionClick('Member Portal Login');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-[#F5F2EB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1917] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-[#F5F2EB] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium shadow"
                >
                  Sign In to Account
                </button>
              </form>
            </div>
          )}

          {/* 7. PROJECT DETAILS MODAL */}
          {modal.type === 'project' && (
            <div className="space-y-6">
              <div className="relative h-64 -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 mb-4 overflow-hidden">
                <img
                  src={FEATURED_PROJECT.image}
                  alt={FEATURED_PROJECT.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-medium uppercase">
                    {FEATURED_PROJECT.status}
                  </span>
                  <h2 className="text-3xl font-editorial mt-2">
                    {FEATURED_PROJECT.title}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-[#F5F2EB] rounded-2xl text-xs text-[#1C1917]">
                  <div>
                    <span className="text-[#A8A29E] block">Director</span>
                    <strong className="text-sm font-medium">{FEATURED_PROJECT.director}</strong>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block">Starring Role</span>
                    <strong className="text-sm font-medium">{FEATURED_PROJECT.role}</strong>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-[#1C1917] uppercase tracking-wider mb-2">
                    Project Synopsis
                  </h4>
                  <p className="text-sm text-[#44403C] leading-relaxed">
                    {FEATURED_PROJECT.overview}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  onClick={() => {
                    onClose();
                    onOpenChat('fan');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Ask Homer about 'The Shards' &rarr;
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-[#EDE9E0] hover:bg-[#E4DFD5] text-[#1C1917] rounded-full text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
