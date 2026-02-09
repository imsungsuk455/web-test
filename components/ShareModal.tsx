import React, { useEffect, useState } from 'react';
import { Twitter, Facebook, Link as LinkIcon, Share2, X, CheckCircle2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  resultTitle: string;
  resultDescription: string;
  resultEmoji: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  resultTitle, 
  resultDescription,
  resultEmoji 
}) => {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      setCanNativeShare(true);
    }
  }, []);

  if (!isOpen) return null;

  const url = window.location.href;
  const shareText = `[에겐녀 vs 테토녀 테스트]\n나의 타입은: ${resultTitle}!\n\n${resultDescription}\n\n결과 확인하기 👇`;

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
  };

  const doManualCopyFallback = (text: string) => {
    const manualCopy = window.confirm(
      '자동 복사에 실패했습니다. 확인을 누르면 주소가 표시됩니다. 직접 길게 눌러 복사해 주세요.'
    );
    if (manualCopy) {
      window.prompt('아래 텍스트를 복사해 주세요:', text);
    }
  };

  const doExecCommandFallback = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      
      // Style to be invisible but functional
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      textArea.setAttribute('readonly', '');
      
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      // Standard selection for mobile compat
      textArea.setSelectionRange(0, 99999); 
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        doManualCopyFallback(text);
      }
    } catch (err) {
      console.error('Fallback failed', err);
      doManualCopyFallback(text);
    }
  };

  const handleCopyLink = () => {
    const textToCopy = `${shareText}\n${url}`;
    
    // 1. Try modern Clipboard API (requires Secure Context)
    // We check securely to avoid trying it in HTTP contexts where it would fail
    const isSecure = window.isSecureContext;
    const hasClipboard = navigator.clipboard && navigator.clipboard.writeText;

    if (isSecure && hasClipboard) {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => {
          console.warn('Modern Clipboard API failed:', err);
          // If the async API fails (e.g. permission denied), we cannot fallback to 
          // execCommand because the user gesture is lost in the Promise chain.
          // We must resort to the manual prompt.
          doManualCopyFallback(textToCopy);
        });
    } else {
      // 2. Synchronous Fallback (execCommand)
      // Since we are in the main thread (user click event), execCommand is allowed.
      doExecCommandFallback(textToCopy);
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: '에겐녀 vs 테토녀 테스트',
        text: shareText,
        url: url,
      });
    } catch (err) {
      // Don't log or fallback if it's a simple user cancellation
      if ((err as Error).name !== 'AbortError') {
        console.log('Native share failed, falling back to copy');
        // If native share fails, we can try to copy.
        // Note: Native share is async, so handleCopyLink's execCommand path won't work well here either.
        // We will try the modern API if available, or manual fallback.
        if (window.isSecureContext && navigator.clipboard) {
           handleCopyLink();
        } else {
           doManualCopyFallback(`${shareText}\n${url}`);
        }
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border-4 border-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-slate-50">
          <h3 className="font-display text-xl font-bold text-slate-700 ml-1">
            결과 공유하기 💌
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Share Preview Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="text-4xl shrink-0 bg-white p-2 rounded-xl shadow-sm">
              {resultEmoji}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">My Result</p>
              <p className="text-slate-800 font-bold truncate">{resultTitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Twitter */}
            <button 
              onClick={handleTwitter}
              className="flex flex-col items-center justify-center p-4 rounded-3xl bg-sky-50 hover:bg-sky-100 text-sky-600 transition-all duration-200 active:scale-95 group"
            >
              <div className="bg-white p-3 rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Twitter size={24} fill="currentColor" stroke="none" />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight">Twitter</span>
            </button>

            {/* Facebook */}
            <button 
              onClick={handleFacebook}
              className="flex flex-col items-center justify-center p-4 rounded-3xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-all duration-200 active:scale-95 group"
            >
              <div className="bg-white p-3 rounded-2xl shadow-sm mb-2 group-hover:scale-110 transition-transform">
                <Facebook size={24} fill="currentColor" stroke="none" />
              </div>
              <span className="text-xs font-bold uppercase tracking-tight">Facebook</span>
            </button>

            {/* Primary Sharing Action */}
            <button 
              onClick={canNativeShare ? handleNativeShare : handleCopyLink}
              className="col-span-2 flex items-center justify-center p-5 rounded-3xl bg-slate-800 text-white hover:bg-slate-700 transition-all duration-200 active:scale-95 gap-3 shadow-md"
            >
              {canNativeShare ? <Share2 size={20} /> : <LinkIcon size={20} />}
              <span className="font-bold">
                {canNativeShare ? '다른 방법으로 공유하기' : '링크 복사하여 공유'}
              </span>
            </button>

            {/* Copy Link Option */}
            <button 
              onClick={handleCopyLink}
              className={`col-span-2 flex items-center justify-center p-4 rounded-2xl transition-all duration-300 gap-2 border-2 ${
                copied 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-white border-slate-100 hover:border-slate-200 text-slate-500'
              }`}
            >
              {copied ? <CheckCircle2 size={18} className="animate-in zoom-in" /> : <LinkIcon size={18} />}
              <span className="text-sm font-bold">
                {copied ? '복사 완료!' : '결과 링크 복사'}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            공유 버튼이 작동하지 않는다면 주소를 직접 복사해 주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;