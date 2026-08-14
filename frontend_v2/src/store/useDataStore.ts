import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTimeTables, initialAcademicEvents } from './mockScheduleData';

export type Subject = {
  id?: string;
  code: string;
  name: string;
  credits: number;
  type: string;
  category: string;
  semester: string;
  weeklyClasses: number;
  dept: string;
  status: string;
  createdAt: string;
  endDate: string;
};

export type Teacher = {
  id: string;
  name: string;
  dept: string;
  designation?: string;
  subjects: string[];
  semesterSubjects?: Record<number, string[]>;
  status: string;
  email: string;
  phone?: string;
  image?: string;
  temporaryPassword?: string;
};

export type Student = {
  id: string;
  name: string;
  roll: string;
  course: string;
  examRoll: string;
  regNo: string;
  session: string;
  classText: string;
  color: string;
  status: string;
  verification: string;
  time: string;
  monthly: any;
  matrix: any;
  faceEnrolled: boolean;
  attendance: number;
  avatar?: string;
};

export type CourseAuthorization = {
  id: string;
  code: string;
  teacherId: string;
  teacherName: string;
  subjectCode: string;
  session: string;
  semester: string;
  section: string;
  expiry: string;
  status: 'UNUSED' | 'USED';
  type: string;
  createdAt: string;
};

export type CourseInstance = {
  id: string;
  teacherId: string;
  subjectCode: string;
  displayName: string;
  session: string;
  semester: string;
  section: string;
  banner: string;
  expectedStudents: number;
  createdAt: string;
};

interface DataState {
  subjects: Subject[];
  teachers: Teacher[];
  students: Student[];
  timetables: Record<string, any>;
  academicEvents: any[];
  
  authorizations: CourseAuthorization[];
  courseInstances: CourseInstance[];

  addAuthorization: (auth: CourseAuthorization) => void;
  markAuthorizationUsed: (code: string) => void;
  addCourseInstance: (course: CourseInstance) => void;
  
  // API Actions
  fetchSubjects: () => Promise<void>;
  addSubject: (subject: Subject) => Promise<void>;
  updateSubject: (code: string, updatedSubject: Partial<Subject>) => Promise<void>;
  deleteSubject: (code: string) => Promise<void>;
  
  fetchTeachers: () => Promise<void>;
  addTeacher: (teacher: Teacher) => Promise<Teacher>;
  updateTeacher: (id: string, updatedTeacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  fetchStudents: () => Promise<void>;
  addStudent: (student: Student) => Promise<void>;
  updateStudent: (id: string, updatedStudent: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
}

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem('verisync_token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Content-Type', 'application/json');

  const API_URL = import.meta.env.VITE_API_URL || '/api';
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message;
      }
    } catch (e) {
      // Ignore if not JSON
    }
    throw new Error(`API Error: ${errorMessage}`);
  }
  
  return res.json();
};

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      subjects: [],
      teachers: [],
      students: [],
      timetables: initialTimeTables,
      academicEvents: initialAcademicEvents,
      authorizations: [],
      courseInstances: [],

      addAuthorization: (auth) => set(state => ({ authorizations: [auth, ...state.authorizations] })),
      markAuthorizationUsed: (code) => set(state => ({
        authorizations: state.authorizations.map(a => a.code === code ? { ...a, status: 'USED' } : a)
      })),
      addCourseInstance: (course) => set(state => ({ courseInstances: [course, ...state.courseInstances] })),

      fetchSubjects: async () => {
        try {
          const subjects = await fetchWithAuth('/subjects');
          set({ subjects });
        } catch (e) {
          console.error("Failed to fetch subjects", e);
        }
      },
      addSubject: async (subject) => {
        try {
          const newSub = await fetchWithAuth('/subjects', {
            method: 'POST',
            body: JSON.stringify(subject)
          });
          set((state) => ({ subjects: [newSub, ...state.subjects] }));
        } catch (e) { console.error(e); }
      },
      updateSubject: async (code, updatedSubject) => {
        try {
          const target = get().subjects.find(s => s.code === code);
          if (target && target.id) {
            const updated = await fetchWithAuth(`/subjects/${target.id}`, {
              method: 'PATCH',
              body: JSON.stringify(updatedSubject)
            });
            set((state) => ({
              subjects: state.subjects.map(sub => sub.code === code ? { ...sub, ...updated } : sub)
            }));
          } else {
            // fallback if no ID (e.g. static mock)
            set((state) => ({
              subjects: state.subjects.map(sub => sub.code === code ? { ...sub, ...updatedSubject } : sub)
            }));
          }
        } catch (e) { console.error(e); }
      },
      deleteSubject: async (code) => {
        try {
          // Assuming the code is used as ID for now or we match it
          const target = get().subjects.find(s => s.code === code);
          if (target && target.id) await fetchWithAuth(`/subjects/${target.id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
        set((state) => ({ subjects: state.subjects.filter(sub => sub.code !== code) }));
      },

      fetchTeachers: async () => {
        try {
          const teachers = await fetchWithAuth('/teachers');
          set({ teachers });
        } catch (e) {
          console.error("Failed to fetch teachers", e);
        }
      },
      addTeacher: async (teacher) => {
        try {
          const newTeacher = await fetchWithAuth('/teachers', {
            method: 'POST',
            body: JSON.stringify(teacher)
          });
          set((state) => ({ teachers: [newTeacher, ...state.teachers] }));
          return newTeacher as Teacher;
        } catch (e) {
          console.error(e);
          throw e;
        }
      },
      updateTeacher: async (id, updatedTeacher) => {
        try {
          const updated = await fetchWithAuth(`/teachers/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedTeacher)
          });
          set((state) => ({
            teachers: state.teachers.map(t => t.id === id ? { ...t, ...updated } : t)
          }));
        } catch (e) { console.error(e); }
      },
      deleteTeacher: async (id) => {
        try {
          await fetchWithAuth(`/teachers/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
        set((state) => ({ teachers: state.teachers.filter(t => t.id !== id) }));
      },

      fetchStudents: async () => {
        try {
          const students = await fetchWithAuth('/students');
          set({ students });
        } catch (e) {
          console.error("Failed to fetch students", e);
        }
      },
      addStudent: async (student) => {
        try {
          const newStudent = await fetchWithAuth('/students', {
            method: 'POST',
            body: JSON.stringify(student)
          });
          set((state) => ({ students: [newStudent, ...state.students] }));
        } catch (e) { console.error(e); }
      },
      updateStudent: async (id, updatedStudent) => {
        try {
          const updated = await fetchWithAuth(`/students/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedStudent)
          });
          set((state) => ({
            students: state.students.map(s => s.id === id ? { ...s, ...updated } : s)
          }));
        } catch (e) { console.error(e); }
      },
      deleteStudent: async (id) => {
        try {
          await fetchWithAuth(`/students/${id}`, { method: 'DELETE' });
        } catch (e) { console.error(e); }
        set((state) => ({ students: state.students.filter(s => s.id !== id) }));
      },
    }),
    {
      name: 'verisync-data-storage-v4', // bump version to reset static cache
    }
  )
);
