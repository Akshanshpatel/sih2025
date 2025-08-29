"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EducationalModule } from '../lib/types';
import { moduleService } from '../lib/services/moduleService';

export default function EducationalModules() {
  const [modules, setModules] = useState<EducationalModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Art',
    'Music'
  ];

  useEffect(() => {
    loadModules();
  }, [selectedSubject]);

  const loadModules = async () => {
    try {
      setLoading(true);
      let fetchedModules: EducationalModule[];
      
      if (selectedSubject === 'all') {
        fetchedModules = await moduleService.getPublishedModules();
      } else {
        fetchedModules = await moduleService.getModulesBySubject(selectedSubject);
      }
      
      setModules(fetchedModules);
    } catch (error) {
      console.error('Error loading modules:', error);
      // For demo purposes, show sample data
      setModules(getSampleModules());
    } finally {
      setLoading(false);
    }
  };

  const getSampleModules = (): EducationalModule[] => {
    return [
      {
        id: '1',
        title: 'Introduction to Algebra',
        description: 'Learn the fundamentals of algebraic expressions and equations',
        subject: 'Mathematics',
        grade: '9-10',
        difficulty: 'beginner',
        duration: 120,
        thumbnail: '/math-thumbnail.jpg',
        lessons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        authorId: 'teacher1',
        tags: ['algebra', 'equations', 'variables'],
        rating: 4.5,
        enrolledStudents: 45
      },
      {
        id: '2',
        title: 'Basic Physics Concepts',
        description: 'Explore motion, forces, and energy in everyday life',
        subject: 'Science',
        grade: '8-9',
        difficulty: 'beginner',
        duration: 90,
        thumbnail: '/physics-thumbnail.jpg',
        lessons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        authorId: 'teacher2',
        tags: ['physics', 'motion', 'forces'],
        rating: 4.2,
        enrolledStudents: 38
      },
      {
        id: '3',
        title: 'Creative Writing Workshop',
        description: 'Develop your storytelling and writing skills',
        subject: 'English',
        grade: '10-12',
        difficulty: 'intermediate',
        duration: 150,
        thumbnail: '/writing-thumbnail.jpg',
        lessons: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublished: true,
        authorId: 'teacher3',
        tags: ['writing', 'storytelling', 'creativity'],
        rating: 4.7,
        enrolledStudents: 52
      }
    ];
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Science': 'bg-green-100 text-green-800',
      'English': 'bg-purple-100 text-purple-800',
      'History': 'bg-orange-100 text-orange-800',
      'Geography': 'bg-teal-100 text-teal-800',
      'Computer Science': 'bg-indigo-100 text-indigo-800',
      'Art': 'bg-pink-100 text-pink-800',
      'Music': 'bg-yellow-100 text-yellow-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="w-full space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Educational Modules</h2>
        <p className="text-gray-600">Explore our comprehensive learning modules across various subjects</p>
      </div>

      {/* Subject Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedSubject === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Subjects
        </button>
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedSubject === subject
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <motion.div
              key={module.id}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {module.subject.charAt(0)}
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(module.subject)}`}>
                    {module.subject}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                    {module.difficulty}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱ {module.duration} min</span>
                  <span>👥 {module.enrolledStudents} students</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{module.rating}</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Enroll Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && modules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">No modules found</h3>
          <p className="text-gray-500">Try selecting a different subject or check back later for new content.</p>
        </div>
      )}
    </motion.div>
  );
}
