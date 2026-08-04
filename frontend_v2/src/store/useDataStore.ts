import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { initialTimeTables, initialAcademicEvents } from './mockScheduleData';

export type Subject = {
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

interface DataState {
  subjects: Subject[];
  teachers: Teacher[];
  timetables: Record<string, any>;
  academicEvents: any[];
  
  // Subject Actions
  addSubject: (subject: Subject) => void;
  updateSubject: (code: string, updatedSubject: Partial<Subject>) => void;
  deleteSubject: (code: string) => void;
  
  // Teacher Actions
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, updatedTeacher: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
}

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

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      subjects: initialSubjects,
      teachers: initialTeachers,
      timetables: initialTimeTables,
      academicEvents: initialAcademicEvents,

      addSubject: (subject) => set((state) => ({ subjects: [subject, ...state.subjects] })),
      updateSubject: (code, updatedSubject) => set((state) => ({
        subjects: state.subjects.map(sub => sub.code === code ? { ...sub, ...updatedSubject } : sub)
      })),
      deleteSubject: (code) => set((state) => ({
        subjects: state.subjects.filter(sub => sub.code !== code)
      })),

      addTeacher: (teacher) => set((state) => ({ teachers: [teacher, ...state.teachers] })),
      updateTeacher: (id, updatedTeacher) => set((state) => ({
        teachers: state.teachers.map(t => t.id === id ? { ...t, ...updatedTeacher } : t)
      })),
      deleteTeacher: (id) => set((state) => ({
        teachers: state.teachers.filter(t => t.id !== id)
      })),
    }),
    {
      name: 'verisync-data-storage-v1', // unique name
    }
  )
);
