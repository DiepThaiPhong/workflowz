import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Heart, MessageSquare, ChevronDown, ChevronUp, Shield, X } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { ForumPost, ForumComment } from '../types';
import { seedForumPosts } from '../data/communityData';
import { moderatePost } from '../services/geminiService';
import { formatRelativeTime } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';

const categories = ['Tất cả', 'Kinh nghiệm', 'Hỏi đáp', 'Sự kiện', 'Chia sẻ'];

const CommunityPage = () => {
  const [posts, setPosts] = useLocalStorage<ForumPost[]>('skillbridge-forum', seedForumPosts);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Chia sẻ');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = activeCategory === 'Tất cả'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const likePost = (id: string) => {
    setPosts((prev) => prev.map((p) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const likeComment = (postId: string, commentId: string) => {
    setPosts((prev) => prev.map((p) =>
      p.id === postId
        ? {
          ...p,
          comments: p.comments.map((c) =>
            c.id === commentId ? { ...c, likes: c.likes + 1 } : c
          ),
        }
        : p
    ));
  };

  const submitPost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    setIsSubmitting(true);

    const { safe } = await moderatePost(newPostTitle + ' ' + newPostContent);

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      author: 'Bạn',
      title: newPostTitle,
      content: newPostContent,
      category: newPostCategory,
      likes: 0,
      isModerated: safe,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    if (safe) {
      setPosts((prev) => [newPost, ...prev]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
    } else {
      alert('Bài đăng có thể chứa nội dung không phù hợp. Vui lòng kiểm tra lại!');
    }
    setIsSubmitting(false);
  };

  const submitComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const { safe } = await moderatePost(text);
    if (!safe) { alert('Bình luận có nội dung không phù hợp.'); return; }

    const newComment: ForumComment = {
      id: `cmt-${Date.now()}`,
      author: 'Bạn',
      content: text,
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setPosts((prev) => prev.map((p) =>
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6 max-w-3xl">
          {/* Header */}
          <div className="py-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={24} className="text-primary" />
                Cộng Đồng
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Chia sẻ kinh nghiệm · Hỏi đáp · Kết nối</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewPost(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Đăng bài
            </motion.button>
          </div>

          {/* Category filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* New post form */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-5 mb-4 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">Đăng bài mới</h3>
                  <button onClick={() => setShowNewPost(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                </div>
                <input
                  className="input-field mb-3"
                  placeholder="Tiêu đề bài đăng..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                />
                <textarea
                  className="input-field mb-3 min-h-[100px] resize-none"
                  placeholder="Nội dung..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex gap-3 items-center">
                  <select
                    className="input-field flex-1"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                  >
                    {categories.filter((c) => c !== 'Tất cả').map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={submitPost}
                    disabled={isSubmitting}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang kiểm duyệt...' : 'Đăng'}
                  </motion.button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                  <Shield size={11} className="text-primary" />
                  Bài đăng sẽ được AI kiểm duyệt tự động
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts list */}
          <div className="space-y-4">
            {filtered.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-card overflow-hidden"
              >
                <div className="p-5">
                  {/* Post header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{post.author}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatRelativeTime(post.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="badge-primary text-[11px] px-2 py-0.5">{post.category}</span>
                      {post.isModerated && (
                        <span className="badge text-[11px] px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
                          <Shield size={10} />AI ✓
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4 mt-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent dark:text-gray-500 transition-colors"
                    >
                      <Heart size={15} />
                      {post.likes}
                    </motion.button>
                    <button
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary dark:text-gray-500 transition-colors"
                    >
                      <MessageSquare size={15} />
                      {post.comments.length} bình luận
                      {expandedPost === post.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>
                </div>

                {/* Comments section */}
                <AnimatePresence>
                  {expandedPost === post.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 dark:border-gray-800 overflow-hidden"
                    >
                      <div className="px-5 py-4 space-y-3">
                        {post.comments.map((cmt) => (
                          <div key={cmt.id} className="flex gap-2">
                            <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                              {cmt.author.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2">
                                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{cmt.author}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{cmt.content}</p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 px-1">
                                <span className="text-[11px] text-gray-400">{formatRelativeTime(cmt.createdAt)}</span>
                                <button
                                  onClick={() => likeComment(post.id, cmt.id)}
                                  className="text-[11px] flex items-center gap-1 text-gray-400 hover:text-accent transition-colors"
                                >
                                  <Heart size={11} />
                                  {cmt.likes}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {/* Comment input */}
                        <div className="flex gap-2 pt-2">
                          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">B</div>
                          <div className="flex-1 flex gap-2">
                            <input
                              className="input-field !py-2 text-sm flex-1"
                              placeholder="Viết bình luận..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === 'Enter' && submitComment(post.id)}
                            />
                            <button
                              onClick={() => submitComment(post.id)}
                              className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:bg-primary-500 transition-colors"
                            >
                              Gửi
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default CommunityPage;
