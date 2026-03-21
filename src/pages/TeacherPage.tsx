import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Plus, X, Users, BookOpen, DollarSign, TrendingUp, Trash2, Edit2 } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { formatNumber } from '../utils/helpers';
import useLocalStorage from '../hooks/useLocalStorage';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  studentsEnrolled: number;
}

// Unsplash image suggestions for course thumbnails
const UNSPLASH_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
  'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=400&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=400&q=80',
];

const emptyForm = { title: '', description: '', price: '0', imageUrl: '' };

const TeacherPage = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useLocalStorage<Course[]>('skillbridge-teacher-courses', []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Analytics
  const totalStudents = courses.reduce((s, c) => s + c.studentsEnrolled, 0);
  const totalRevenue = courses.reduce((s, c) => s + c.price * c.studentsEnrolled, 0);

  const handleSave = () => {
    if (!form.title.trim()) return;

    if (editId) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editId
            ? { ...c, title: form.title, description: form.description, price: Number(form.price), imageUrl: form.imageUrl }
            : c
        )
      );
      setEditId(null);
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        title: form.title,
        description: form.description,
        price: Number(form.price),
        imageUrl: form.imageUrl || UNSPLASH_SUGGESTIONS[Math.floor(Math.random() * UNSPLASH_SUGGESTIONS.length)],
        createdAt: new Date().toISOString(),
        studentsEnrolled: Math.floor(Math.random() * 50) + 1, // mock enrolled count
      };
      setCourses((prev) => [newCourse, ...prev]);
    }

    setForm(emptyForm);
    setShowForm(false);
  };

  const handleEdit = (course: Course) => {
    setForm({ title: course.title, description: course.description, price: String(course.price), imageUrl: course.imageUrl });
    setEditId(course.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('teacher.deleteConfirm'))) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-surface-dark">
        <div className="container-max px-4 sm:px-6">
          {/* Header */}
          <div className="py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <GraduationCap size={26} className="text-accent" />
                {t('teacher.pageTitle')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{t('teacher.pageSubtitle')}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm); }}
              className="btn-accent flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              {t('teacher.createTitle')}
            </motion.button>
          </div>

          {/* Analytics cards */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { icon: BookOpen, value: courses.length, label: t('teacher.totalCourses'), color: 'text-primary' },
              { icon: Users, value: totalStudents, label: t('teacher.totalStudents'), color: 'text-gblue' },
              { icon: DollarSign, value: `${formatNumber(totalRevenue)}đ`, label: t('teacher.totalRevenue'), color: 'text-yellow-500' },
            ].map(({ icon: Icon, value, label, color }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-4 flex flex-col items-center text-center"
              >
                <Icon size={20} className={`${color} mb-1`} />
                <p className={`font-bold text-lg ${color}`}>{typeof value === 'number' ? formatNumber(value) : value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Create / Edit form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6 mb-6 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                    {editId ? t('teacher.editCourse') : t('teacher.createTitle')}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t('teacher.courseTitle')}</label>
                    <input
                      className="input-field"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder={t('teacher.courseTitle')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t('teacher.courseDesc')}</label>
                    <textarea
                      className="input-field min-h-[80px] resize-none"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder={t('teacher.courseDesc')}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t('teacher.coursePrice')}</label>
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      className="input-field"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">{t('teacher.courseImage')}</label>
                    <div className="flex gap-2">
                      <input
                        className="input-field flex-1 text-xs"
                        value={form.imageUrl}
                        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        placeholder="https://images.unsplash.com/..."
                      />
                      <button
                        onClick={() => setPickerOpen(!pickerOpen)}
                        className="flex-shrink-0 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                      >
                        Gợi ý
                      </button>
                    </div>
                    {/* Image picker */}
                    <AnimatePresence>
                      {pickerOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="grid grid-cols-3 gap-2 mt-2"
                        >
                          {UNSPLASH_SUGGESTIONS.map((url) => (
                            <img
                              key={url}
                              src={url}
                              alt="pick"
                              onClick={() => { setForm((f) => ({ ...f, imageUrl: url })); setPickerOpen(false); }}
                              className={`h-16 object-cover rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${
                                form.imageUrl === url ? 'border-primary' : 'border-transparent'
                              }`}
                            />
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Preview */}
                {form.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden h-32">
                    <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowForm(false)} className="btn-secondary text-sm !px-4 !py-2">
                    {t('common.cancel')}
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={!form.title.trim()}
                    className="btn-primary text-sm disabled:opacity-50"
                  >
                    {t('teacher.saveBtn')}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Courses list */}
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-accent" />
              {t('teacher.myCoursesTitle')}
            </h2>

            {courses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-10 text-center"
              >
                <div className="text-5xl mb-4">📚</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t('teacher.noCoursesYet')}</p>
                <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
                  <Plus size={15} className="inline mr-1" />
                  {t('teacher.createTitle')}
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence>
                  {courses.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -3 }}
                      className="glass-card overflow-hidden group"
                    >
                      {/* Course image */}
                      <div className="h-36 overflow-hidden relative">
                        <img
                          src={course.imageUrl || UNSPLASH_SUGGESTIONS[0]}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Price badge */}
                        <div className="absolute top-2 right-2">
                          <span className={`badge text-xs px-2 py-1 rounded-full font-bold ${
                            course.price === 0
                              ? 'bg-primary text-white'
                              : 'bg-white text-gray-800'
                          }`}>
                            {course.price === 0 ? t('teacher.freeCourse') : `${formatNumber(course.price)}đ`}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{course.description}</p>

                        {/* Stats */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Users size={12} className="text-primary" />
                            <strong className="text-primary">{course.studentsEnrolled}</strong> {t('teacher.studentsEnrolled')}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all"
                          >
                            <Edit2 size={13} /> {t('teacher.editCourse')}
                          </button>
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="flex items-center justify-center w-9 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-accent/10 hover:text-accent transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default TeacherPage;
