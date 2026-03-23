import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Copy, Download, RotateCcw, Trophy, Star, Zap } from 'lucide-react';

interface CompletionCelebrationProps {
  workflowTitle: string;
  outputArtifact: string;
  xpEarned: number;
  isEn: boolean;
  onRestart: () => void;
  onExit: () => void;
}

const CompletionCelebration = ({
  workflowTitle,
  outputArtifact,
  xpEarned,
  isEn,
  onRestart,
  onExit,
}: CompletionCelebrationProps) => {
  const [copied, setCopied] = useState(false);
  const [showXP, setShowXP] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(0);

  // Show XP animation after a delay
  useEffect(() => {
    setTimeout(() => setShowXP(true), 500);
  }, []);

  // Animate XP counter
  useEffect(() => {
    if (!showXP) return;
    const duration = 1500;
    const steps = 60;
    const increment = xpEarned / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= xpEarned) {
        setAnimatedXP(xpEarned);
        clearInterval(interval);
      } else {
        setAnimatedXP(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [showXP, xpEarned]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputArtifact);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f0c] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        {/* Success header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            className="relative inline-block mb-4"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#92e600] to-[#7ed321] shadow-lg shadow-[#92e600]/30">
              <CheckCircle size={40} className="text-[#0b0f0c]" />
            </div>
            {/* Glow ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-[#92e600]"
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-white mb-2"
          >
            🎉 {isEn ? 'Workflow Complete!' : 'Workflow hoàn thành!'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-[#a3c0d6]"
          >
            {workflowTitle}
          </motion.p>
        </div>

        {/* XP earned card */}
        <AnimatePresence>
          {showXP && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#92e600]/10 to-[#60a5fa]/10 border border-[#92e600]/20"
            >
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#92e600]/20 flex items-center justify-center">
                    <Zap size={24} className="text-[#92e600]" />
                  </div>
                </motion.div>
                <div>
                  <p className="text-xs text-[#a3c0d6] uppercase tracking-wider">
                    {isEn ? 'XP Earned' : 'XP đã nhận'}
                  </p>
                  <div className="flex items-center gap-1">
                    <motion.span
                      className="text-3xl font-black text-[#92e600]"
                      key={animatedXP}
                    >
                      +{animatedXP}
                    </motion.span>
                    <span className="text-lg font-bold text-[#92e600]">XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output artifact card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0e150d] rounded-2xl border border-[#1a2119] overflow-hidden mb-4"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a2119]">
            <h3 className="flex items-center gap-2 font-bold text-white text-sm">
              <span className="text-lg">📄</span>
              {isEn ? 'Output Artifact' : 'Kết quả đầu ra'}
            </h3>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  bg-[#1a2119] text-[#a3c0d6] hover:text-[#92e600] hover:bg-[#92e600]/10 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle size={12} className="text-[#92e600]" />
                    {isEn ? 'Copied!' : 'Đã sao chép!'}
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    {isEn ? 'Copy' : 'Sao chép'}
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                  bg-[#1a2119] text-[#a3c0d6] hover:text-[#92e600] hover:bg-[#92e600]/10 transition-colors"
              >
                <Download size={12} />
                {isEn ? 'Save' : 'Lưu'}
              </motion.button>
            </div>
          </div>
          <div className="p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed font-mono bg-[#0b0f0c] rounded-xl p-3">
              {outputArtifact || (isEn ? 'Workflow completed!' : 'Workflow đã hoàn thành!')}
            </pre>
          </div>
        </motion.div>

        {/* Achievement badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-3 mb-6"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20">
            <Star size={12} className="text-[#f59e0b]" fill="currentColor" />
            <span className="text-xs font-medium text-[#fbbf24]">
              {isEn ? 'First Completion' : 'Hoàn thành đầu tiên'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#a78bfa]/10 border border-[#a78bfa]/20">
            <Trophy size={12} className="text-[#a78bfa]" />
            <span className="text-xs font-medium text-[#a78bfa]">
              {isEn ? 'Workflow Master' : 'Bậc thầy Workflow'}
            </span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm
              border border-[#92e600]/30 text-[#92e600] hover:bg-[#92e600]/10 transition-colors"
          >
            <RotateCcw size={16} />
            {isEn ? 'Run Again' : 'Chạy lại'}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExit}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm
              bg-[#1a2119] text-[#a3c0d6] hover:text-white hover:bg-[#212c26] transition-colors"
          >
            {isEn ? 'Back to Marketplace' : 'Quay lại Marketplace'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompletionCelebration;
