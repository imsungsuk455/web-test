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
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  if (!isOpen) return null;

  const url = window.location.href;
  const text = `[에겐녀 vs 테토녀 테스트]\n나의 타입은: ${resultTitle}\n${resultDescription}`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 p-4 flex justify-between items-center border-b border-slate-100">
          <h3 className="font-bold text-slate-700 ml-2">결과 공유하기</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-2 gap-4">
          
          {/* Twitter */}
          <button 
            onClick={handleTwitter}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-sky-50 hover:text-sky-500 transition-all gap-2 group border border-transparent hover:border-sky-200"
          >
            <div className="bg-black text-white p-3 rounded-full group-hover:scale-110 transition-transform">
              <Twitter size={20} fill="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-600">Twitter</span>
          </button>

          {/* Facebook */}
          <button 
            onClick={handleFacebook}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 transition-all gap-2 group border border-transparent hover:border-blue-200"
          >
            <div className="bg-blue-600 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
              <Facebook size={20} fill="currentColor" />
            </div>
            <span className="text-sm font-medium text-slate-600">Facebook</span>
          </button>

          {/* Native Share (Kakao/Message etc on Mobile) */}
          {canNativeShare && (
            <button 
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-green-50 hover:text-green-600 transition-all gap-2 group border border-transparent hover:border-green-200 col-span-2"
            >
              <div className="bg-green-500 text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                <Share2 size={20} />
              </div>
              <span className="text-sm font-medium text-slate-600">더보기 (카카오톡 등)</span>
            </button>
          )}

          {/* Copy Link */}
          <button 
            onClick={handleCopyLink}
            className={`col-span-2 flex items-center justify-center p-4 rounded-2xl transition-all gap-2 border ${
              copied 
                ? 'bg-teal-50 border-teal-200 text-teal-700' 
                : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
            }`}
          >
            <LinkIcon size={18} />
            <span className="text-sm font-medium">
              {copied ? '링크가 복사되었습니다! 🎉' : '링크 복사하기'}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;