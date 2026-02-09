import React, { useEffect, useState } from 'react';
import { Twitter, Facebook, Link as LinkIcon, Share2, X } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultTitle: string;
  resultDescription: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, resultTitle, resultDescription }) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Check if Web Share API is available
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  if (!isOpen) return null;

  const url = window.location.href;
  const text = `[에겐녀 vs 테토녀 테스트]\n나의 타입은: ${resultTitle}\n\n${resultDescription}`;

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: '에겐녀 vs 테토녀 테스트',
        text: text,
        url: url,
      });
    } catch (err) {
      console.log('Share canceled');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border-4 border-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-50 to-blue-50 p-5 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-display text-xl font-bold text-slate-700 ml-1">
            결과 공유하기 💌
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-2 gap-4 bg-white">
          
          {/* Twitter */}
          <button 
            onClick={handleTwitter}
            className="group flex flex-col items-center justify-center p-4 rounded-3xl bg-sky-50 hover:bg-sky-100 text-sky-600 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 text-sky-500">
              <Twitter size={24} />
            </div>
            <span className="text-sm font-bold">Twitter</span>
          </button>

          {/* Facebook */}
          <button 
            onClick={handleFacebook}
            className="group flex flex-col items-center justify-center p-4 rounded-3xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform duration-300 text-indigo-500">
              <Facebook size={24} />
            </div>
            <span className="text-sm font-bold">Facebook</span>
          </button>

          {/* Native Share */}
          {canNativeShare && (
            <button 
              onClick={handleNativeShare}
              className="col-span-2 group flex items-center justify-center p-4 rounded-3xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all duration-300 hover:-translate-y-1 gap-3"
            >
              <div className="bg-white p-2 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 text-emerald-500">
                <Share2 size={20} />
              </div>
              <span className="text-sm font-bold">더보기 / 카카오톡 공유</span>
            </button>
          )}

          {/* Copy Link */}
          <button 
            onClick={handleCopyLink}
            className={`col-span-2 flex items-center justify-center p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 gap-3 border-2 ${
              copied 
                ? 'bg-rose-100 border-rose-200 text-rose-600' 
                : 'bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-xl shadow-sm transition-transform duration-300 ${copied ? 'bg-white/50' : 'bg-white'}`}>
              <LinkIcon size={20} />
            </div>
            <span className="text-sm font-bold">
              {copied ? '링크가 복사되었어요! 🎉' : '링크 복사하기'}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;