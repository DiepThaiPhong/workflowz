import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingCart, Trash2, ArrowRight, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import PageTransition from '../components/PageTransition';

export default function CartPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const { items, removeFromCart, total } = useCart();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0b0f0c]" style={{ paddingTop: '4rem' }}>
        <div className="container-max px-4 sm:px-6 py-10 max-w-3xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(146,230,0,0.1)' }}>
              <ShoppingCart size={20} style={{ color: '#92e600' }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">
                {isEn ? 'Your Cart' : 'Giỏ hàng của bạn'}
              </h1>
              <p className="text-sm text-[#8a9a92]">
                {items.length} {isEn ? 'item(s)' : 'sản phẩm'}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border p-16 text-center"
              style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
              <Package size={48} className="mx-auto mb-4 text-[#3a4a42]" />
              <p className="text-lg font-bold text-white mb-1">
                {isEn ? 'Cart is empty' : 'Giỏ hàng trống'}
              </p>
              <p className="text-sm text-[#8a9a92] mb-6">
                {isEn ? 'Explore the marketplace to find workflows.' : 'Khám phá Marketplace để tìm workflow.'}
              </p>
              <Link to="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
                style={{ background: '#92e600', color: '#0b0f0c' }}>
                {isEn ? 'Browse Marketplace' : 'Khám phá Marketplace'}
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Items */}
              <div className="space-y-3 mb-6">
                <AnimatePresence>
                  {items.map(({ workflow }) => (
                    <motion.div
                      key={workflow.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16, height: 0 }}
                      className="flex items-center gap-4 rounded-2xl border p-4"
                      style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.1)' }}>
                      <img src={workflow.thumbnail} alt={workflow.title}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {workflow.titleEn || workflow.title}
                        </p>
                        <p className="text-xs text-[#8a9a92] mt-0.5">{workflow.creatorName}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {workflow.price === 0 ? (
                          <span className="text-sm font-black" style={{ color: '#92e600' }}>Free</span>
                        ) : (
                          <span className="text-sm font-black text-white">
                            {(workflow.price / 1000).toFixed(0)}K VNĐ
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(workflow.id)}
                        className="p-2 rounded-lg text-[#3a4a42] hover:text-red-400 hover:bg-red-400/10 transition-all">
                        <Trash2 size={15} />
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order summary */}
              <div className="rounded-2xl border p-6"
                style={{ background: '#0e150d', borderColor: 'rgba(146,230,0,0.15)' }}>
                <h2 className="font-bold text-white mb-4">{isEn ? 'Order Summary' : 'Tóm tắt đơn hàng'}</h2>
                <div className="space-y-2 mb-4">
                  {items.map(({ workflow }) => (
                    <div key={workflow.id} className="flex justify-between text-sm text-[#cedde9]">
                      <span className="truncate mr-4">{workflow.titleEn || workflow.title}</span>
                      <span className="flex-shrink-0 font-semibold">
                        {workflow.price === 0 ? 'Free' : `${(workflow.price / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 flex justify-between items-center" style={{ borderColor: 'rgba(146,230,0,0.1)' }}>
                  <span className="font-bold text-white">{isEn ? 'Total' : 'Tổng cộng'}</span>
                  <span className="text-xl font-black" style={{ color: '#92e600' }}>
                    {total === 0 ? 'Free' : `${(total / 1000).toFixed(0)}K VNĐ`}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(146,230,0,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/payment')}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base transition-all"
                  style={{ background: '#92e600', color: '#0b0f0c' }}>
                  {isEn ? 'Proceed to Payment' : 'Tiến hành thanh toán'}
                  <ArrowRight size={18} />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
