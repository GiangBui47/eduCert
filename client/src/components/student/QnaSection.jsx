import React, { useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';

const QnaSection = ({ courseId, lectureId, canPost }) => {
  const { backendUrl, getToken, userData } = useContext(AppContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [replyDrafts, setReplyDrafts] = useState({});
  const [openReplyFor, setOpenReplyFor] = useState({});

  const isLoggedIn = useMemo(() => !!userData?._id, [userData]);

  const fetchList = async (p = page, append = false) => {
    if (!courseId || !lectureId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/qna/list`, {
        params: { courseId, lectureId, page: p, limit },
      });
      if (data.success) {
        if (append) {
          setItems(prev => [...prev, ...(data.items || [])]);
        } else {
          setItems(data.items || []);
        }
        setTotal(data.total || 0);
        setPage(data.page || p);
      } else {
        toast.error(data.message || 'Failed to load Q&A');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Failed to load Q&A');
    } finally {
      setLoading(false);
    }
  };
  const relTime = (ts) => {
    try {
      const t = new Date(ts).getTime();
      if (!t) return '';
      const s = Math.floor((Date.now() - t) / 1000);
      if (s < 60) return `${s}s ago`;
      const m = Math.floor(s / 60);
      if (m < 60) return `${m}m ago`;
      const h = Math.floor(m / 60);
      if (h < 24) return `${h}h ago`;
      const d = Math.floor(h / 24);
      if (d < 30) return `${d}d ago`;
      const mo = Math.floor(d / 30);
      if (mo < 12) return `${mo}mo ago`;
      const y = Math.floor(mo / 12);
      return `${y}y ago`;
    } catch {
      return '';
    }
  };

  const toggleLike = async (questionId, answerId) => {
    if (!isLoggedIn) return toast.info('Please sign in to like');
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/qna/like`,
        { questionId, answerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success && data.question) {
        setItems(prev => prev.map(it => (it._id === data.question._id ? data.question : it)));
      } else {
        toast.error(data.message || 'Failed to like');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Failed to like');
    }
  };

  useEffect(() => {
    setItems([]);
    setPage(1);
    setTotal(0);
    setQuestionText('');
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, lectureId]);

  const submitQuestion = async () => {
    if (!isLoggedIn) return toast.info('Please sign in to post a comment');
    if (!canPost) return toast.info('You must enroll in this course to comment');
    if (!questionText.trim()) return;
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/qna/question`,
        { courseId, lectureId, content: questionText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success('Comment posted');
        setQuestionText('');
        setItems(prev => [data.question, ...prev]);
        setTotal(prev => prev + 1);
      } else {
        toast.error(data.message || 'Failed to post comment');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Failed to post comment');
    }
  };

  const submitAnswer = async (questionId) => {
    const content = (replyDrafts[questionId] || '').trim();
    if (!isLoggedIn) return toast.info('Please sign in to reply');
    if (!canPost) return toast.info('You must enroll in this course to reply');
    if (!content) return;
    try {
      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/qna/answer`,
        { questionId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success && data.question) {
        setItems(prev => prev.map(it => (it._id === questionId ? data.question : it)));
        setReplyDrafts(prev => ({ ...prev, [questionId]: '' }));
        setOpenReplyFor(prev => ({ ...prev, [questionId]: false }));
      } else {
        toast.error(data.message || 'Failed to send reply');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || e.message || 'Failed to send reply');
    }
  };

  if (!lectureId) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-black mb-3">Comments</h2>
        <p className="text-gray-600 text-sm">Select a lecture to view and post Q&A.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-white mb-4">
        <div className="flex items-start gap-3">
          {userData?.imageUrl ? (
            <img src={userData.imageUrl} alt={userData?.name || 'User'} className="w-9 h-9 rounded-full object-cover border" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-700">
              {(userData?.name || 'U').slice(0,2).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a new comment"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              disabled={!canPost}
            />
            <div className="flex items-center mt-2">
              {!canPost && (
                <div className="text-xs text-gray-500">You must enroll in this course to comment</div>
              )}
              <button
                className="ml-auto px-3 py-1.5 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={submitQuestion}
                disabled={!questionText.trim() || !canPost}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-2">{total} comments</div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600 text-sm">No comments yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map(q => (
            <div key={q._id} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                {q.authorAvatar ? (
                  <img src={q.authorAvatar} alt={q.authorName || 'User'} className="w-8 h-8 rounded-full object-cover border" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-700">
                    {(q.authorName || 'U').slice(0,2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-900">{q.authorName || 'User'}</div>
                    <div className="text-xs text-gray-500">{relTime(q.createdAt)}</div>
                  </div>
                  <div className="text-sm text-gray-800 whitespace-pre-line mt-1">{q.content}</div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                    <button
                      className={`text-blue-600 hover:underline ${ (q.likes||[]).includes(userData?._id) ? 'font-semibold' : ''}`}
                      onClick={() => toggleLike(q._id)}
                    >
                      Like {Array.isArray(q.likes) ? q.likes.length : 0}
                    </button>
                    <span>•</span>
                    <span>{(q.answers?.length || 0)} replies</span>
                    <span>•</span>
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => {
                        if (!isLoggedIn) return toast.info('Please sign in to reply');
                        if (!canPost) return toast.info('You must enroll in this course to reply');
                        setOpenReplyFor(prev => ({ ...prev, [q._id]: !prev[q._id] }));
                      }}
                    >
                      Reply
                    </button>
                  </div>
                  <div className="mt-3 space-y-3">
                    {(q.answers || []).map((a, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {a.authorAvatar ? (
                          <img src={a.authorAvatar} alt={a.authorName || 'User'} className="w-7 h-7 rounded-full object-cover border" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-medium text-gray-700">
                            {(a.authorName || 'U').slice(0,2).toUpperCase()}
                          </div>
                        )}
                        <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-gray-900">{a.authorName || 'User'}</div>
                            <div className="text-xs text-gray-500">{relTime(a.createdAt)}</div>
                          </div>
                          <div className="mt-0.5 whitespace-pre-line">{a.content}</div>
                           <div className="mt-2">
                            <button
                              className={`text-xs text-blue-600 hover:underline ${ (a.likes||[]).includes(userData?._id) ? 'font-semibold' : ''}`}
                              onClick={() => toggleLike(q._id, a._id)}
                            >
                              Like {Array.isArray(a.likes) ? a.likes.length : 0}
                            </button>
                          </div>
                        </div>
                       
                      </div>
                    ))}

                    {openReplyFor[q._id] && (
                      <div className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Write a reply"
                          value={replyDrafts[q._id] || ''}
                          onChange={(e) => setReplyDrafts(prev => ({ ...prev, [q._id]: e.target.value }))}
                          disabled={!canPost}
                        />
                        <button
                          className="px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                          onClick={() => submitAnswer(q._id)}
                          disabled={!((replyDrafts[q._id] || '').trim()) || !canPost}
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > items.length && (
        <div className="flex justify-center mt-4">
          <button
            className="px-3 py-1.5 text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
            onClick={() => fetchList(page + 1, true)}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};

export default QnaSection;
