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
  designation: string;
  subjects: string[];
  semesterSubjects?: Record<number, string[]>;
  status: string;
  email: string;
  phone?: string;
  image?: string;
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
  addTeacher: (teacher: Teacher) => Promise<void>;
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

  const res = await fetch(`http://localhost:3001${endpoint}`, {
    ...options,
    headers
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.statusText}`);
  }
  
  return res.json();
};

const initialSubjects: Subject[] = [
  // Semester 1
  { code: 'CC101', name: 'Software Engineering', credits: 5, type: 'Theory', category: 'Core', semester: '1', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC102', name: 'Advanced Database Management System', credits: 5, type: 'Theory + Practical', category: 'Core', semester: '1', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC103', name: 'Design & Analysis of Algorithm', credits: 5, type: 'Theory', category: 'Core', semester: '1', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC104', name: 'Data Communications & Computer Networks', credits: 5, type: 'Theory + Practical', category: 'Core', semester: '1', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC105', name: 'Python Programming', credits: 5, type: 'Theory + Practical', category: 'Core', semester: '1', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'SEC101', name: 'Data Visualization', credits: 3, type: 'Theory + Practical', category: 'Skill Enhancement Course', semester: '1', weeklyClasses: 3, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'MAEC101', name: 'Environmental Sustainability Swachh Bharat Abhiyan Activities', credits: 5, type: 'Theory + Practical', category: 'Ability Enhancement Course', semester: '1', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },

  // Semester 2
  { code: 'CC206', name: 'Web Technology using .NET', credits: 5, type: 'Theory + Practical', category: 'Core', semester: '2', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC207', name: 'Data & Web Mining', credits: 5, type: 'Theory', category: 'Core', semester: '2', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC208', name: 'Artificial Intelligence and Machine Learning', credits: 5, type: 'Theory + Practical', category: 'Core', semester: '2', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC209', name: 'Mini Project I (Lab)', credits: 3, type: 'Practical', category: 'Laboratory', semester: '2', weeklyClasses: 3, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'MDC201', name: 'Optimization Techniques', credits: 5, type: 'Theory', category: 'Multidisciplinary Course', semester: '2', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'DSE201', name: 'Elective-1', credits: 5, type: 'Theory', category: 'Discipline Specific Elective', semester: '2', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'SEC202', name: 'Statistical Analysis using R', credits: 3, type: 'Theory + Practical', category: 'Skill Enhancement Course', semester: '2', weeklyClasses: 3, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },

  // Semester 3
  { code: 'CC310', name: 'Advanced Web Designing using J2EE', credits: 5, type: 'Theory + Practical', category: 'Core', semester: '3', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC311', name: 'Cloud Computing', credits: 5, type: 'Theory', category: 'Core', semester: '3', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC312', name: 'Big Data Analytics', credits: 5, type: 'Theory', category: 'Core', semester: '3', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC313', name: 'Mini Project II (Lab)', credits: 3, type: 'Practical', category: 'Laboratory', semester: '3', weeklyClasses: 3, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'MDC302', name: 'Digital Marketing and E-Commerce', credits: 5, type: 'Theory', category: 'Multidisciplinary Course', semester: '3', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'MAEC302', name: 'Human Values & Professional Ethics and Gender Sensitization', credits: 5, type: 'Theory + Practical', category: 'Ability Enhancement Course', semester: '3', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'SEC303', name: 'Industrial Visit and Technical Report Writing', credits: 3, type: 'Theory + Practical', category: 'Skill Enhancement Course', semester: '3', weeklyClasses: 3, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },

  // Semester 4
  { code: 'DSE402', name: 'MOOCs', credits: 5, type: 'Theory', category: 'Discipline Specific Elective', semester: '4', weeklyClasses: 5, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'CC414', name: 'OJT and Project Dissertation', credits: 22, type: 'Practical', category: 'Project', semester: '4', weeklyClasses: 22, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
  { code: 'SEC404', name: 'Industrial Training and Internship', credits: 3, type: 'Practical', category: 'Internship', semester: '4', weeklyClasses: 3, dept: 'MCA', status: 'ACTIVE', createdAt: '2025-08-01', endDate: '2026-05-30' },
];

const initialTeachers: Teacher[] = [
  { 
    id: 'FAC2020', name: 'Richa Verma', dept: 'MCA', designation: 'Assistant Professor', 
    subjects: ['CC101', 'CC103', 'MDC302', 'CC313'], 
    semesterSubjects: { 1: ['CC101', 'CC103'], 3: ['MDC302', 'CC313'] },
    status: 'ACTIVE', email: 'Richaverma.mca@pwc.in', image: '/features/richa_verma.png' 
  },
  { 
    id: 'FAC2021', name: 'Dr. Praveen Kumar', dept: 'MCA', designation: 'Associate Professor', 
    subjects: ['CC102', 'CC105', 'CC310', 'CC313'], 
    semesterSubjects: { 1: ['CC102', 'CC105'], 3: ['CC310', 'CC313'] },
    status: 'ACTIVE', email: 'Praveenkumar.mca@pwc.in', image: '/features/praveen.png' 
  },
  { 
    id: 'FAC2022', name: 'Dr. Sushmita Chakraborty', dept: 'MCA', designation: 'Assistant Professor', 
    subjects: ['CC102', 'CC105', 'CC312', 'CC313'], 
    semesterSubjects: { 1: ['CC102', 'CC105'], 3: ['CC312', 'CC313'] },
    status: 'ACTIVE', email: 'Sushmitachakraborty.mca@pwc.in', image: '/features/susmita.png' 
  },
  { 
    id: 'FAC2023', name: 'Braj Kishor Prasad', dept: 'MCA', designation: 'Professor', 
    subjects: ['CC104', 'SEC101', 'CC311', 'CC313'], 
    semesterSubjects: { 1: ['CC104', 'SEC101'], 3: ['CC311', 'CC313'] },
    status: 'ACTIVE', email: 'Brajkishoreprasad.mca@pwc.in', image: '/features/brajesh.png' 
  },
  { 
    id: 'FAC2024', name: 'Dr. Bhawna Sinha', dept: 'MCA', designation: 'Professor (HOD)', 
    subjects: ['CC103', 'SEC101', 'MDC302', 'CC313'], 
    semesterSubjects: { 1: ['CC103', 'SEC101'], 3: ['MDC302', 'CC313'] },
    status: 'ACTIVE', email: 'Bhawnasinha.mca@pwc.in', image: '/features/Bhawnasinha.png' 
  },
];

const initialAuthorizations: CourseAuthorization[] = [
  {
    id: 'AUTH1', code: 'Wc7P2kLm9Q', teacherId: 'FAC2021', teacherName: 'Dr. Praveen Kumar',
    subjectCode: 'CC102', session: '2024-2026', semester: '1', section: 'A',
    expiry: '2026-11-15', status: 'UNUSED', type: 'COURSE_CREATION', createdAt: new Date().toISOString()
  }
];

const initialCourseInstances: CourseInstance[] = initialTeachers.flatMap(teacher => {
  if (!teacher.semesterSubjects) return [];
  const instances: CourseInstance[] = [];
  Object.entries(teacher.semesterSubjects).forEach(([semStr, codes]) => {
    codes.forEach(code => {
      const sub = initialSubjects.find(s => s.code === code);
      if (sub) {
        instances.push({
          id: `CRS-MCA-${code}-${teacher.id}-${semStr}-A`,
          teacherId: teacher.id,
          subjectCode: code,
          displayName: sub.name,
          session: '2024-2026',
          semester: semStr,
          section: 'A',
          banner: 'Blue', // Default banner
          expectedStudents: 60,
          createdAt: new Date().toISOString()
        });
      }
    });
  });
  return instances;
});

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      subjects: initialSubjects,
      teachers: initialTeachers,
      students: [],
      timetables: initialTimeTables,
      academicEvents: initialAcademicEvents,
      authorizations: initialAuthorizations,
      courseInstances: initialCourseInstances,

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
        } catch (e) { console.error(e); }
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
      name: 'verisync-data-storage-v3', // bump version to reset static cache
    }
  )
);
