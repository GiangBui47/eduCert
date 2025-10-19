import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';

export default function AddCourse() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        requirement: 'no',
        imageUrl: '',
        imageFile: null,
        draft: true,
        price: 0,
        currency: 'ADA',
        discount: 0,
        discountEndTime: '',
        policyId: '',
        instructorId: 1,
        paymentMethods: [],
        chapters: [],
        courseTests: []
    });

    const [expandedChapters, setExpandedChapters] = useState({});

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addPaymentMethod = () => {
        setFormData(prev => ({
            ...prev,
            paymentMethods: [...prev.paymentMethods, { paymentMethodId: '', receiverAddress: '' }]
        }));
    };

    const updatePaymentMethod = (index, field, value) => {
        const updated = [...formData.paymentMethods];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, paymentMethods: updated }));
    };

    const removePaymentMethod = (index) => {
        setFormData(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.filter((_, i) => i !== index)
        }));
    };

    const addChapter = () => {
        const newChapter = {
            title: '',
            orderIndex: formData.chapters.length + 1,
            lectures: [],
            tests: []
        };
        setFormData(prev => ({ ...prev, chapters: [...prev.chapters, newChapter] }));
    };

    const updateChapter = (index, field, value) => {
        const updated = [...formData.chapters];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const removeChapter = (index) => {
        setFormData(prev => ({
            ...prev,
            chapters: prev.chapters.filter((_, i) => i !== index)
        }));
    };

    const addLecture = (chapterIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].lectures.push({
            title: '',
            videoUrl: '',
            videoFile: null,
            duration: 0,
            orderIndex: updated[chapterIndex].lectures.length + 1,
            resourceFiles: [],
            previewFree: false
        });
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const updateLecture = (chapterIndex, lectureIndex, field, value) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].lectures[lectureIndex][field] = value;
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const removeLecture = (chapterIndex, lectureIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].lectures = updated[chapterIndex].lectures.filter((_, i) => i !== lectureIndex);
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const addChapterTest = (chapterIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests.push({
            title: '',
            durationMinutes: 10,
            rule: '',
            passScore: 60,
            orderIndex: updated[chapterIndex].tests.length + 1,
            questions: []
        });
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const updateChapterTest = (chapterIndex, testIndex, field, value) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex][field] = value;
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const removeChapterTest = (chapterIndex, testIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests = updated[chapterIndex].tests.filter((_, i) => i !== testIndex);
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const addQuestion = (chapterIndex, testIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex].questions.push({
            content: '',
            score: 5,
            orderIndex: updated[chapterIndex].tests[testIndex].questions.length + 1,
            imageUrl: null,
            answers: []
        });
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const updateQuestion = (chapterIndex, testIndex, questionIndex, field, value) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex].questions[questionIndex][field] = value;
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const removeQuestion = (chapterIndex, testIndex, questionIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex].questions = updated[chapterIndex].tests[testIndex].questions.filter((_, i) => i !== questionIndex);
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const addAnswer = (chapterIndex, testIndex, questionIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex].questions[questionIndex].answers.push({
            content: '',
            correct: false
        });
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const updateAnswer = (chapterIndex, testIndex, questionIndex, answerIndex, field, value) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex].questions[questionIndex].answers[answerIndex][field] = value;
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const removeAnswer = (chapterIndex, testIndex, questionIndex, answerIndex) => {
        const updated = [...formData.chapters];
        updated[chapterIndex].tests[testIndex].questions[questionIndex].answers =
            updated[chapterIndex].tests[testIndex].questions[questionIndex].answers.filter((_, i) => i !== answerIndex);
        setFormData(prev => ({ ...prev, chapters: updated }));
    };

    const addCourseTest = () => {
        setFormData(prev => ({
            ...prev,
            courseTests: [...prev.courseTests, {
                title: '',
                durationMinutes: 30,
                rule: '',
                passScore: 70,
                orderIndex: prev.courseTests.length + 1,
                questions: []
            }]
        }));
    };

    const updateCourseTest = (index, field, value) => {
        const updated = [...formData.courseTests];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const removeCourseTest = (index) => {
        setFormData(prev => ({
            ...prev,
            courseTests: prev.courseTests.filter((_, i) => i !== index)
        }));
    };

    const addCourseQuestion = (testIndex) => {
        const updated = [...formData.courseTests];
        updated[testIndex].questions.push({
            content: '',
            score: 10,
            orderIndex: updated[testIndex].questions.length + 1,
            imageUrl: null,
            answers: []
        });
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const updateCourseQuestion = (testIndex, questionIndex, field, value) => {
        const updated = [...formData.courseTests];
        updated[testIndex].questions[questionIndex][field] = value;
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const removeCourseQuestion = (testIndex, questionIndex) => {
        const updated = [...formData.courseTests];
        updated[testIndex].questions = updated[testIndex].questions.filter((_, i) => i !== questionIndex);
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const addCourseAnswer = (testIndex, questionIndex) => {
        const updated = [...formData.courseTests];
        updated[testIndex].questions[questionIndex].answers.push({
            content: '',
            correct: false
        });
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const updateCourseAnswer = (testIndex, questionIndex, answerIndex, field, value) => {
        const updated = [...formData.courseTests];
        updated[testIndex].questions[questionIndex].answers[answerIndex][field] = value;
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const removeCourseAnswer = (testIndex, questionIndex, answerIndex) => {
        const updated = [...formData.courseTests];
        updated[testIndex].questions[questionIndex].answers =
            updated[testIndex].questions[questionIndex].answers.filter((_, i) => i !== answerIndex);
        setFormData(prev => ({ ...prev, courseTests: updated }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const serializable = {
            ...formData,
            imageFile: formData.imageFile ? formData.imageFile.name : null,
            chapters: formData.chapters.map((ch) => ({
                ...ch,
                lectures: (ch.lectures || []).map((lec) => ({
                    ...lec,
                    videoFile: lec.videoFile ? lec.videoFile.name : null,
                    resourceFiles: (lec.resourceFiles || []).map(f => f?.name || '')
                }))
            })),
            courseTests: formData.courseTests
        };
        console.log('Course Data (preview):', serializable);
        alert('Course data printed to console (with file names)!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ">
            <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <Save className="text-indigo-600" />
                    Create New Course
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <section className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <input
                                    type="text"
                                    value={formData.shortDescription}
                                    onChange={(e) => updateField('shortDescription', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => updateField('imageUrl', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                                <div className="mt-2 flex items-center gap-3">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files && e.target.files[0];
                                            if (!file) return;
                                            const objectUrl = URL.createObjectURL(file);
                                            setFormData(prev => ({ ...prev, imageFile: file, imageUrl: objectUrl }));
                                        }}
                                        className="text-sm"
                                    />
                                    {formData.imageUrl && (
                                        <img src={formData.imageUrl} alt="preview" className="h-10 w-10 object-cover rounded" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.draft}
                                        onChange={(e) => updateField('draft', e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Draft</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section className="border-b pb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Pricing & Discounts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="number"
                                    value={Number.isFinite(formData.price) ? formData.price : ''}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        updateField('price', v === '' ? '' : parseFloat(v));
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => updateField('currency', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="ADA">ADA</option>
                                    <option value="USD">USD</option>
                                    <option value="VND">VND</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                                <input
                                    type="number"
                                    value={Number.isFinite(formData.discount) ? formData.discount : ''}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        updateField('discount', v === '' ? '' : parseFloat(v));
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount End Time</label>
                                <input
                                    type="datetime-local"
                                    value={formData.discountEndTime}
                                    onChange={(e) => updateField('discountEndTime', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="border-b pb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Payment Methods</h2>
                            <button
                                type="button"
                                onClick={addPaymentMethod}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <Plus size={16} />
                                Add
                            </button>
                        </div>
                        {formData.paymentMethods.map((pm, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Payment Method ID"
                                        value={pm.paymentMethodId}
                                        onChange={(e) => updatePaymentMethod(idx, 'paymentMethodId', e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Receiver Address"
                                            value={pm.receiverAddress}
                                            onChange={(e) => updatePaymentMethod(idx, 'receiverAddress', e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removePaymentMethod(idx)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="border-b pb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Chapters</h2>
                            <button
                                type="button"
                                onClick={addChapter}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <Plus size={16} />
                                Add Chapter
                            </button>
                        </div>
                        {formData.chapters.map((chapter, chIdx) => (
                            <div key={chIdx} className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold">Chapter {chIdx + 1}</h3>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setExpandedChapters(prev => ({ ...prev, [chIdx]: !prev[chIdx] }))}
                                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            {expandedChapters[chIdx] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeChapter(chIdx)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Tiêu đề chương"
                                    value={chapter.title}
                                    onChange={(e) => updateChapter(chIdx, 'title', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                                />

                                {expandedChapters[chIdx] && (
                                    <>
                                        <div className="bg-white p-4 rounded-lg mb-3">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-semibold">Lectures</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => addLecture(chIdx)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                                >
                                                    <Plus size={14} />
                                                    Add
                                                </button>
                                            </div>
                                            {chapter.lectures.map((lecture, lIdx) => (
                                                <div key={lIdx} className="bg-gray-100 p-3 rounded mb-2">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium">Lecture {lIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeLecture(chIdx, lIdx)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Lecture title"
                                                            value={lecture.title}
                                                            onChange={(e) => updateLecture(chIdx, lIdx, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 border rounded text-sm"
                                                        />
                                                        <input
                                                            type="url"
                                                            placeholder="Video URL"
                                                            value={lecture.videoUrl}
                                                            onChange={(e) => updateLecture(chIdx, lIdx, 'videoUrl', e.target.value)}
                                                            onBlur={(e) => {
                                                                const url = e.target.value;
                                                                if (!url) return;
                                                                try {
                                                                    const video = document.createElement('video');
                                                                    video.preload = 'metadata';
                                                                    video.src = url;
                                                                    video.onloadedmetadata = () => {
                                                                        const seconds = video.duration || 0;
                                                                        const minutes = Math.ceil(seconds / 60);
                                                                        updateLecture(chIdx, lIdx, 'duration', minutes);
                                                                        if (video.src && video.src.startsWith('blob:')) {
                                                                            URL.revokeObjectURL(video.src);
                                                                        }
                                                                    };
                                                                    video.onerror = () => { };
                                                                } catch { }
                                                            }}
                                                            className="w-full px-3 py-2 border rounded text-sm"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files && e.target.files[0];
                                                                    if (!file) return;
                                                                    const objectUrl = URL.createObjectURL(file);
                                                                    updateLecture(chIdx, lIdx, 'videoFile', file);
                                                                    updateLecture(chIdx, lIdx, 'videoUrl', objectUrl);
                                                                    try {
                                                                        const video = document.createElement('video');
                                                                        video.preload = 'metadata';
                                                                        video.src = objectUrl;
                                                                        video.onloadedmetadata = () => {
                                                                            const seconds = video.duration || 0;
                                                                            const minutes = Math.ceil(seconds / 60);
                                                                            updateLecture(chIdx, lIdx, 'duration', minutes);
                                                                        };
                                                                        video.onerror = () => { };
                                                                    } catch { }
                                                                }}
                                                                className="text-xs"
                                                            />
                                                            {lecture.videoFile && (
                                                                <span className="text-xs text-gray-600 truncate">{lecture.videoFile.name}</span>
                                                            )}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="text-xs text-gray-600">Duration (minutes): {Number.isFinite(lecture.duration) ? lecture.duration : 0}</div>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="application/pdf"
                                                                onChange={(e) => {
                                                                    const files = e.target.files ? Array.from(e.target.files) : [];
                                                                    if (files.length === 0) return;
                                                                    const updated = [...(lecture.resourceFiles || [])];
                                                                    files.forEach(f => updated.push(f));
                                                                    updateLecture(chIdx, lIdx, 'resourceFiles', updated);
                                                                }}
                                                                className="text-xs"
                                                            />
                                                            {(lecture.resourceFiles && lecture.resourceFiles.length > 0) && (
                                                                <div className="space-y-1">
                                                                    {lecture.resourceFiles.map((f, fIdx) => (
                                                                        <div key={fIdx} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded">
                                                                            <span className="text-xs text-gray-700 truncate mr-2">{f.name}</span>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    const next = [...lecture.resourceFiles];
                                                                                    next.splice(fIdx, 1);
                                                                                    updateLecture(chIdx, lIdx, 'resourceFiles', next);
                                                                                }}
                                                                                className="text-red-500 text-xs"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <label className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                checked={lecture.previewFree}
                                                                onChange={(e) => updateLecture(chIdx, lIdx, 'previewFree', e.target.checked)}
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm">Preview free</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-white p-4 rounded-lg">
                                            <div className="flex justify-between items-center mb-3">
                                                <h4 className="font-semibold">Chapter Tests</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => addChapterTest(chIdx)}
                                                    className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
                                                >
                                                    <Plus size={14} />
                                                    Add
                                                </button>
                                            </div>
                                            {chapter.tests.map((test, tIdx) => (
                                                <div key={tIdx} className="bg-gray-100 p-3 rounded mb-2">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-sm font-medium">Test {tIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeChapterTest(chIdx, tIdx)}
                                                            className="text-red-500"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Test title"
                                                            value={test.title}
                                                            onChange={(e) => updateChapterTest(chIdx, tIdx, 'title', e.target.value)}
                                                            className="w-full px-3 py-2 border rounded text-sm"
                                                        />
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Duration (minutes)"
                                                                    value={Number.isFinite(test.durationMinutes) ? test.durationMinutes : ''}
                                                                    onChange={(e) => {
                                                                        const v = e.target.value;
                                                                        updateChapterTest(chIdx, tIdx, 'durationMinutes', v === '' ? '' : parseInt(v));
                                                                    }}
                                                                    className="px-3 py-2 border rounded text-sm"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Pass Score</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Điểm đạt"
                                                                    value={Number.isFinite(test.passScore) ? test.passScore : ''}
                                                                    onChange={(e) => {
                                                                        const v = e.target.value;
                                                                        updateChapterTest(chIdx, tIdx, 'passScore', v === '' ? '' : parseInt(v));
                                                                    }}
                                                                    className="px-3 py-2 border rounded text-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => addQuestion(chIdx, tIdx)}
                                                            className="text-sm text-blue-600 hover:text-blue-800"
                                                        >
                                                            + Add question
                                                        </button>

                                                        {test.questions.map((q, qIdx) => (
                                                            <div key={qIdx} className="bg-white p-2 rounded">
                                                                <div className="flex justify-between mb-2">
                                                                    <span className="text-xs font-medium">Question {qIdx + 1}</span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeQuestion(chIdx, tIdx, qIdx)}
                                                                        className="text-red-500"
                                                                    >
                                                                        <Trash2 size={12} />
                                                                    </button>
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Question content"
                                                                    value={q.content}
                                                                    onChange={(e) => updateQuestion(chIdx, tIdx, qIdx, 'content', e.target.value)}
                                                                    className="w-full px-2 py-1 border rounded text-xs mb-2"
                                                                />
                                                                <input
                                                                    type="number"
                                                                    placeholder="Score"
                                                                    value={Number.isFinite(q.score) ? q.score : ''}
                                                                    onChange={(e) => {
                                                                        const v = e.target.value;
                                                                        updateQuestion(chIdx, tIdx, qIdx, 'score', v === '' ? '' : parseInt(v));
                                                                    }}
                                                                    className="w-full px-2 py-1 border rounded text-xs mb-2"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() => addAnswer(chIdx, tIdx, qIdx)}
                                                                    className="text-xs text-green-600 mb-1"
                                                                >
                                                                    + Add answer
                                                                </button>

                                                                {q.answers.map((ans, aIdx) => (
                                                                    <div key={aIdx} className="flex gap-1 mb-1">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Answer"
                                                                            value={ans.content}
                                                                            onChange={(e) => updateAnswer(chIdx, tIdx, qIdx, aIdx, 'content', e.target.value)}
                                                                            className="flex-1 px-2 py-1 border rounded text-xs"
                                                                        />
                                                                        <label className="flex items-center gap-1">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={ans.correct}
                                                                                onChange={(e) => updateAnswer(chIdx, tIdx, qIdx, aIdx, 'correct', e.target.checked)}
                                                                                className="w-3 h-3"
                                                                            />
                                                                            <span className="text-xs">Correct</span>
                                                                        </label>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeAnswer(chIdx, tIdx, qIdx, aIdx)}
                                                                            className="text-red-500"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </section>

                    <section className="pb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Bài Test Tổng Kết</h2>
                            <button
                                type="button"
                                onClick={addCourseTest}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                <Plus size={16} />
                                Thêm Test
                            </button>
                        </div>
                        {formData.courseTests.map((test, tIdx) => (
                            <div key={tIdx} className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between mb-3">
                                    <h3 className="text-lg font-semibold">Final Test {tIdx + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeCourseTest(tIdx)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Tiêu đề test"
                                        value={test.title}
                                        onChange={(e) => updateCourseTest(tIdx, 'title', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thời Gian</label>
                                            <input
                                                type="number"
                                                placeholder="Thời gian (phút)"
                                                value={Number.isFinite(test.durationMinutes) ? test.durationMinutes : ''}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    updateCourseTest(tIdx, 'durationMinutes', v === '' ? '' : parseInt(v));
                                                }}
                                                className="px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đạt</label>
                                            <input
                                                type="number"
                                                placeholder="Điểm đạt"
                                                value={Number.isFinite(test.passScore) ? test.passScore : ''}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    updateCourseTest(tIdx, 'passScore', v === '' ? '' : parseInt(v));
                                                }}
                                                className="px-4 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Rules/Notes for the test"
                                        value={test.rule}
                                        onChange={(e) => updateCourseTest(tIdx, 'rule', e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => addCourseQuestion(tIdx)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        + Add question
                                    </button>

                                    {test.questions.map((q, qIdx) => (
                                        <div key={qIdx} className="bg-white p-3 rounded border">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-medium">Question {qIdx + 1}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCourseQuestion(tIdx, qIdx)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    placeholder="Question content"
                                                    value={q.content}
                                                    onChange={(e) => updateCourseQuestion(tIdx, qIdx, 'content', e.target.value)}
                                                    className="px-3 py-2 border rounded text-sm"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Score"
                                                    value={Number.isFinite(q.score) ? q.score : ''}
                                                    onChange={(e) => {
                                                        const v = e.target.value;
                                                        updateCourseQuestion(tIdx, qIdx, 'score', v === '' ? '' : parseInt(v));
                                                    }}
                                                    className="px-3 py-2 border rounded text-sm"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => addCourseAnswer(tIdx, qIdx)}
                                                className="text-xs text-green-600 mb-2"
                                            >
                                                + Add answer
                                            </button>

                                            {q.answers.map((ans, aIdx) => (
                                                <div key={aIdx} className="flex gap-2 mb-2 items-center">
                                                    <input
                                                        type="text"
                                                        placeholder="Answer"
                                                        value={ans.content}
                                                        onChange={(e) => updateCourseAnswer(tIdx, qIdx, aIdx, 'content', e.target.value)}
                                                        className="flex-1 px-2 py-1 border rounded text-xs"
                                                    />
                                                    <label className="flex items-center gap-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={ans.correct}
                                                            onChange={(e) => updateCourseAnswer(tIdx, qIdx, aIdx, 'correct', e.target.checked)}
                                                            className="w-3 h-3"
                                                        />
                                                        <span className="text-xs">Correct</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCourseAnswer(tIdx, qIdx, aIdx)}
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => setFormData({
                                title: '',
                                description: '',
                                shortDescription: '',
                                requirement: 'no',
                                imageUrl: '',
                                imageFile: null,
                                draft: true,
                                price: 0,
                                currency: 'ADA',
                                discount: 0,
                                discountEndTime: '',
                                policyId: '',
                                instructorId: 1,
                                paymentMethods: [],
                                chapters: [],
                                courseTests: []
                            })}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Save Course
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}