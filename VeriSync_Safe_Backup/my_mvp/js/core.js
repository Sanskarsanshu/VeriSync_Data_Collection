'use strict';

const VeriSync = (() => {
  const DB_KEY = 'verisync_mvp_db_v1';
  const SESSION_KEY = 'verisync_mvp_session';
  const THEME_KEY = 'verisync_mvp_theme';

  const icons = {
    logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 8V5a2 2 0 0 1 2-2h3M20 8V5a2 2 0 0 0-2-2h-3M4 16v3a2 2 0 0 0 2 2h3M20 16v3a2 2 0 0 1-2 2h-3"/><circle cx="12" cy="10" r="3"/><path d="M7.5 18c.7-2.5 2.2-3.8 4.5-3.8s3.8 1.3 4.5 3.8"/></svg>`,
    dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    teacher: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 4h18v13H3z"/><path d="M8 21h8M12 17v4"/><circle cx="9" cy="9" r="2"/><path d="M6 14c.5-1.7 1.5-2.5 3-2.5s2.5.8 3 2.5M15 8h3M15 11h3"/></svg>`,
    student: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M7 12v5c3 2 7 2 10 0v-5M21 10v6"/></svg>`,
    book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M8 7h8M8 10h7"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>`,
    attendance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
    qr: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 18v3"/></svg>`,
    chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.14.37.35.7.6 1 .29.31.68.5 1.1.6H21a2 2 0 1 1 0 4h-.09c-.42.1-.81.29-1.1.6-.25.3-.46.63-.6 1Z"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    menu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5h16M7 12h10M10 19h4"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    profile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
    alert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 12 4 4L19 6"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"/></svg>`,
    course: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/></svg>`,
    correction: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 7h-9a4 4 0 0 0-4 4v8M4 7l3-3 3 3"/><path d="M14 17h6M17 14v6"/></svg>`,
    holiday: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/><path d="M4.5 4.5 6 6M18 18l1.5 1.5"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1M14 9h1M9 13h1M14 13h1M10 21v-4h4v4"/></svg>`,
    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M15 4l2 2M17 6l2 2"/></svg>`,
    chevron: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m9 18 6-6-6-6"/></svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>`
  };

  const sampleStudents = [
    ['MCA001','Aditi Kumari','aditi@pwc.edu.in','9876541001','IV','A',92.5,'Verified'],
    ['MCA002','Ananya Singh','ananya@pwc.edu.in','9876541002','IV','A',88.4,'Verified'],
    ['MCA003','Ayesha Khan','ayesha@pwc.edu.in','9876541003','IV','A',74.2,'Verified'],
    ['MCA004','Bhavya Sharma','bhavya@pwc.edu.in','9876541004','IV','A',68.8,'Verified'],
    ['MCA005','Divya Raj','divya@pwc.edu.in','9876541005','IV','A',95.1,'Verified'],
    ['MCA006','Ishita Verma','ishita@pwc.edu.in','9876541006','IV','A',81.6,'Verified'],
    ['MCA007','Kajal Kumari','kajal@pwc.edu.in','9876541007','IV','A',63.3,'Pending'],
    ['MCA008','Khushi Sinha','khushi@pwc.edu.in','9876541008','IV','A',77.9,'Verified'],
    ['MCA009','Muskan Gupta','muskan@pwc.edu.in','9876541009','IV','A',86.2,'Verified'],
    ['MCA010','Neha Kumari','neha@pwc.edu.in','9876541010','IV','A',71.5,'Verified'],
    ['MCA011','Nikita Roy','nikita@pwc.edu.in','9876541011','IV','A',90.4,'Verified'],
    ['MCA012','Priya Jha','priya@pwc.edu.in','9876541012','IV','A',83.7,'Verified']
  ].map((s, i) => ({id:`stu-${i+1}`,roll:s[0],name:s[1],email:s[2],phone:s[3],department:'Computer Applications',programme:'MCA',session:'2025-2027',year:'Second Year',semester:s[4],section:s[5],attendance:s[6],faceStatus:s[7],status:'Active'}));

  const additionalStudentNames = [
    'Riya Kumari','Sakshi Singh','Shambhavi Jha','Shreya Raj','Simran Gupta','Sneha Kumari',
    'Soni Kumari','Srishti Sinha','Swati Verma','Tanvi Mishra','Vaishnavi Roy','Vidhi Sharma',
    'Yashika Kumari','Zoya Khan','Anjali Kumari','Aparna Singh','Archana Raj','Deepika Sinha',
    'Garima Gupta','Harshita Jha','Komal Kumari','Mahi Verma','Pallavi Roy','Pooja Sharma'
  ];
  additionalStudentNames.forEach((name, offset) => {
    const number = offset + 13;
    sampleStudents.push({
      id: `stu-${number}`,
      roll: `MCA${String(number).padStart(3,'0')}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g,'.').replace(/^\.|\.$/g,'')}@pwc.edu.in`,
      phone: `987654${String(1000 + number).slice(-4)}`,
      department: 'Computer Applications', programme: 'MCA', session: '2025-2027',
      year: 'Second Year', semester: 'IV', section: 'A',
      attendance: Math.round((66 + ((number * 7) % 31)) * 10) / 10,
      faceStatus: number % 11 === 0 ? 'Pending' : 'Verified', status: 'Active'
    });
  });

  const initialDB = {
    college: {
      name: "Patna Women's College",
      code: 'PWC',
      department: 'Computer Applications',
      programme: 'MCA',
      currentSession: '2025-2027',
      currentSemester: 'IV',
      section: 'A',
      capacity: 50,
      teachingStart: '2026-07-15',
      semesterEnd: '2026-11-30',
      attendanceThreshold: 75
    },
    users: {
      admin: {id:'adm-1',name:'Dr. Academic Admin',email:'admin@pwc.edu.in',password:'admin123',role:'admin',designation:'College Administrator',department:'Administration'},
      teacher: {id:'tch-1',name:'Dr. Jagadeesha R. B.',email:'teacher@pwc.edu.in',password:'teacher123',role:'teacher',employeeId:'PWC-T-104',designation:'Associate Professor',department:'Computer Applications',qualification:'Ph.D.',specialisation:'Wireless Networks'},
      student: {id:'stu-demo',name:'Aditi Kumari',email:'student@pwc.edu.in',password:'student123',role:'student',roll:'MCA001',registration:'PWC-MCA-2025-001',phone:'9876541001',department:'Computer Applications',programme:'MCA',session:'2025-2027',year:'Second Year',semester:'IV',section:'A',faceStatus:'Verified'}
    },
    teachers: [
      {id:'tch-1',name:'Dr. Jagadeesha R. B.',employeeId:'PWC-T-104',email:'teacher@pwc.edu.in',phone:'9876500111',department:'Computer Applications',designation:'Associate Professor',subjects:['5G Networks','Wireless Communication'],status:'Active',verified:true,lastLogin:'Today, 09:02'},
      {id:'tch-2',name:'Dr. Meera Sinha',employeeId:'PWC-T-108',email:'meera@pwc.edu.in',phone:'9876500112',department:'Computer Applications',designation:'Assistant Professor',subjects:['Cloud Computing','DevSecOps'],status:'Active',verified:true,lastLogin:'Yesterday, 16:20'},
      {id:'tch-3',name:'Prof. Prakash Pawar',employeeId:'PWC-T-112',email:'prakash@pwc.edu.in',phone:'9876500113',department:'Computer Applications',designation:'Assistant Professor',subjects:['Industrial IoT'],status:'Active',verified:true,lastLogin:'22 Jul, 13:15'},
      {id:'tch-4',name:'Dr. Rajesh Kumar',employeeId:'PWC-T-116',email:'rajesh@pwc.edu.in',phone:'9876500114',department:'Computer Applications',designation:'Associate Professor',subjects:['CMOS RF Circuit Design'],status:'Pending',verified:false,lastLogin:'Never'}
    ],
    students: sampleStudents,
    subjects: [
      {id:'sub-1',name:'5G Networks: Theory and Practice',code:'EC202',semester:'IV',type:'Core',credits:4,weeklyClasses:4,status:'Active'},
      {id:'sub-2',name:'Cloud Computing',code:'MCA402',semester:'IV',type:'Core',credits:4,weeklyClasses:4,status:'Active'},
      {id:'sub-3',name:'Industrial IoT',code:'MCA404',semester:'IV',type:'Elective',credits:3,weeklyClasses:3,status:'Active'},
      {id:'sub-4',name:'DevSecOps',code:'MCA406',semester:'IV',type:'Elective',credits:3,weeklyClasses:3,status:'Active'},
      {id:'sub-5',name:'Wireless Communication',code:'EC307',semester:'IV',type:'Core',credits:4,weeklyClasses:4,status:'Active'}
    ],
    assignments: [
      {id:'asg-1',teacherId:'tch-1',subjectId:'sub-1',session:'2025-2027',semester:'IV',section:'A',role:'Primary Teacher'},
      {id:'asg-2',teacherId:'tch-1',subjectId:'sub-5',session:'2025-2027',semester:'IV',section:'A',role:'Primary Teacher'},
      {id:'asg-3',teacherId:'tch-2',subjectId:'sub-2',session:'2025-2027',semester:'IV',section:'A',role:'Primary Teacher'},
      {id:'asg-4',teacherId:'tch-2',subjectId:'sub-4',session:'2025-2027',semester:'IV',section:'A',role:'Primary Teacher'},
      {id:'asg-5',teacherId:'tch-3',subjectId:'sub-3',session:'2025-2027',semester:'IV',section:'A',role:'Primary Teacher'}
    ],
    authorizations: [
      {id:'auth-1',teacherId:'tch-1',subjectId:'sub-1',code:'qmb28GHy9K',session:'2025-2027',semester:'IV',section:'A',expires:'2026-08-15',status:'Used'},
      {id:'auth-2',teacherId:'tch-1',subjectId:'sub-5',code:'Wc7P2kLm9Q',session:'2025-2027',semester:'IV',section:'A',expires:'2026-08-31',status:'Active'},
      {id:'auth-3',teacherId:'tch-2',subjectId:'sub-2',code:'Ce4R8pVa2N',session:'2025-2027',semester:'IV',section:'A',expires:'2026-08-31',status:'Active'}
    ],
    courses: [
      {id:'crs-1',subjectId:'sub-1',teacherId:'tch-1',name:'5G Networks: Theory and Practice',code:'EC202',session:'2025-2027',semester:'IV',section:'A',students:36,status:'Active',banner:'blue',nextClass:'Mon, 10:00 AM'},
      {id:'crs-2',subjectId:'sub-2',teacherId:'tch-2',name:'Cloud Computing',code:'MCA402',session:'2025-2027',semester:'IV',section:'A',students:36,status:'Active',banner:'purple',nextClass:'Tue, 11:00 AM'},
      {id:'crs-3',subjectId:'sub-3',teacherId:'tch-3',name:'Industrial IoT',code:'MCA404',session:'2025-2027',semester:'IV',section:'A',students:28,status:'Active',banner:'teal',nextClass:'Wed, 12:00 PM'},
      {id:'crs-4',subjectId:'sub-4',teacherId:'tch-2',name:'DevSecOps',code:'MCA406',session:'2025-2027',semester:'IV',section:'A',students:24,status:'Active',banner:'slate',nextClass:'Thu, 02:00 PM'},
      {id:'crs-5',subjectId:'sub-5',teacherId:'tch-1',name:'Wireless Communication',code:'EC307',session:'2025-2027',semester:'IV',section:'A',students:36,status:'Draft',banner:'orange',nextClass:'Fri, 10:00 AM'}
    ],
    schedule: [
      {id:'sch-1',date:'2026-07-24',day:'Friday',start:'10:00',end:'11:00',courseId:'crs-1',room:'Room 204',type:'Theory',status:'Upcoming'},
      {id:'sch-2',date:'2026-07-24',day:'Friday',start:'12:00',end:'13:00',courseId:'crs-5',room:'Lab 2',type:'Theory',status:'Upcoming'},
      {id:'sch-3',date:'2026-07-25',day:'Saturday',start:'09:00',end:'10:00',courseId:'crs-2',room:'Room 302',type:'Theory',status:'Upcoming'},
      {id:'sch-4',date:'2026-07-27',day:'Monday',start:'10:00',end:'11:00',courseId:'crs-3',room:'IoT Lab',type:'Practical',status:'Upcoming'}
    ],
    holidays: [
      {id:'hol-1',name:'Independence Day',start:'2026-08-15',end:'2026-08-15',type:'National Holiday',appliesTo:'All',status:'Active'},
      {id:'hol-2',name:'College Foundation Day',start:'2026-09-12',end:'2026-09-12',type:'College Holiday',appliesTo:'All',status:'Active'},
      {id:'hol-3',name:'Durga Puja Break',start:'2026-10-18',end:'2026-10-22',type:'Vacation',appliesTo:'All',status:'Active'}
    ],
    attendanceSessions: [
      {id:'sess-1',courseId:'crs-1',scheduleId:'sch-1',teacherId:'tch-1',date:'2026-07-23',start:'10:00',end:'10:10',token:'5G7X9P',status:'Closed',present:32,total:36,method:'Face + Dynamic QR + Device'},
      {id:'sess-2',courseId:'crs-2',scheduleId:'sch-3',teacherId:'tch-2',date:'2026-07-22',start:'11:00',end:'11:08',token:'CC4K8D',status:'Closed',present:30,total:36,method:'Face + Dynamic QR + Device'}
    ],
    attendanceRecords: [],
    corrections: [
      {id:'cor-1',studentId:'stu-4',courseId:'crs-1',date:'2026-07-21',current:'Absent',requested:'Present',reason:'Face verification failed because of camera permission issue.',teacherRecommendation:'Pending',adminDecision:'Pending',status:'Under Teacher Review'},
      {id:'cor-2',studentId:'stu-7',courseId:'crs-2',date:'2026-07-20',current:'Absent',requested:'Present',reason:'Network disconnected after QR verification.',teacherRecommendation:'Recommend Approval',adminDecision:'Pending',status:'Under Admin Review'}
    ],
    notifications: {
      admin: [
        {id:'n1',text:'A new student face verification is pending.',time:'10 minutes ago',unread:true},
        {id:'n2',text:'Teacher course authorization code will expire in 7 days.',time:'1 hour ago',unread:true},
        {id:'n3',text:'Attendance correction COR-002 is awaiting final review.',time:'Yesterday',unread:false}
      ],
      teacher: [
        {id:'n4',text:'Aditi submitted an attendance correction request.',time:'12 minutes ago',unread:true},
        {id:'n5',text:'Wireless Communication authorization code is active.',time:'2 hours ago',unread:true},
        {id:'n6',text:'Tomorrow’s 5G class starts at 10:00 AM.',time:'Yesterday',unread:false}
      ],
      student: [
        {id:'n7',text:'Your 5G Networks attendance is 92.5%.',time:'Today',unread:true},
        {id:'n8',text:'Cloud Computing class is scheduled for Saturday at 9:00 AM.',time:'3 hours ago',unread:true},
        {id:'n9',text:'Independence Day is marked as a holiday.',time:'Yesterday',unread:false}
      ]
    },
    auditLogs: [
      {id:'log-1',user:'Dr. Academic Admin',role:'Admin',action:'Generated course authorization',target:'Wireless Communication - EC307',time:'2026-07-23 14:05',result:'Success'},
      {id:'log-2',user:'Dr. Jagadeesha R. B.',role:'Teacher',action:'Closed attendance session',target:'5G Networks',time:'2026-07-23 10:11',result:'Success'},
      {id:'log-3',user:'Aditi Kumari',role:'Student',action:'Completed face verification',target:'5G Networks',time:'2026-07-23 10:03',result:'Success'}
    ],
    settings: {
      attendanceThreshold: 75,
      qrRefreshSeconds: 15,
      defaultAttendanceWindow: 10,
      faceMatchThreshold: 82,
      correctionDeadlineHours: 48,
      maxStudentsPerSection: 50,
      emailNotifications: true,
      securityAlerts: true
    }
  };

  function seedAttendance(db) {
    if (db.attendanceRecords.length) return db;
    const courseIds = db.courses.slice(0,4).map(c => c.id);
    const dates = ['2026-07-15','2026-07-16','2026-07-17','2026-07-18','2026-07-20','2026-07-21','2026-07-22','2026-07-23'];
    let index = 1;
    db.students.forEach((student, sIndex) => {
      courseIds.forEach((courseId, cIndex) => {
        dates.forEach((date, dIndex) => {
          const present = ((sIndex * 3 + cIndex * 2 + dIndex) % 10) > (student.attendance < 70 ? 4 : student.attendance < 80 ? 2 : 1);
          db.attendanceRecords.push({
            id:`att-${index++}`,
            studentId: student.id,
            courseId,
            date,
            status: present ? 'Present' : 'Absent',
            value: present ? 1 : 0,
            method: present ? 'Face + QR' : 'Not verified',
            time: present ? `10:0${(sIndex+dIndex)%9}` : '—'
          });
        });
      });
    });
    return db;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function initDB() {
    let db;
    try {
      const stored = localStorage.getItem(DB_KEY);
      db = stored ? JSON.parse(stored) : clone(initialDB);
    } catch (_) {
      db = clone(initialDB);
    }
    db = seedAttendance(db);
    saveDB(db);
    return db;
  }

  function getDB() {
    return initDB();
  }

  function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  function updateDB(mutator) {
    const db = getDB();
    const result = mutator(db) || db;
    saveDB(result);
    return result;
  }

  function resetDB() {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SESSION_KEY);
    initDB();
  }

  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      loginAt: new Date().toISOString()
    }));
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch (_) {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function requireRole(role) {
    const session = getSession();
    if (!session || session.role !== role) {
      window.location.href = `${role}-login.html`;
      return null;
    }
    return session;
  }

  function login(role, email, password) {
    const db = getDB();
    const user = db.users[role];
    if (!user || user.email.toLowerCase() !== email.trim().toLowerCase() || user.password !== password) {
      return {ok:false, message:'The email or password is incorrect.'};
    }
    setSession(user);
    return {ok:true, user};
  }

  function escapeHTML(value = '') {
    return String(value)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  function initials(name='') {
    return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'FA';
  }

  function uid(prefix='id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  }

  function randomCode(length=10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const bytes = new Uint32Array(length);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(bytes);
    return Array.from(bytes, n => chars[n % chars.length]).join('');
  }

  function todayISO() {
    return new Date().toISOString().slice(0,10);
  }

  function formatDate(value, options={day:'2-digit',month:'short',year:'numeric'}) {
    if (!value) return '—';
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-IN', options);
  }

  function percentage(present, conducted) {
    if (!conducted) return 0;
    return Math.round((present / conducted) * 10000) / 100;
  }

  function statusBadge(status) {
    const key = String(status).toLowerCase();
    let type = 'neutral';
    if (['active','verified','approved','present','success','completed','used','good','closed'].some(x=>key.includes(x))) type='success';
    else if (['pending','warning','review','draft','upcoming','more information'].some(x=>key.includes(x))) type='warning';
    else if (['critical','rejected','failed','inactive','suspended','absent','revoked','expired'].some(x=>key.includes(x))) type='danger';
    else if (['recommended','primary','core','open'].some(x=>key.includes(x))) type='info';
    return `<span class="badge badge-${type}"><span class="status-dot"></span>${escapeHTML(status)}</span>`;
  }

  function attendanceStatusBadge(value) {
    const map = {Present:'success',Absent:'danger',Holiday:'info','Cancelled':'warning','Not Applicable':'neutral','Pending Review':'warning'};
    const type = map[value] || 'neutral';
    return `<span class="badge badge-${type}">${escapeHTML(value)}</span>`;
  }

  function statCard(label, value, meta, icon='chart', trend='') {
    return `<article class="stat-card">
      <div class="stat-top"><span class="stat-label">${escapeHTML(label)}</span><span class="stat-icon">${icons[icon] || icons.chart}</span></div>
      <div class="stat-value">${escapeHTML(value)}</div>
      <div class="stat-meta ${trend}">${meta}</div>
    </article>`;
  }

  function userCell(name, subtitle='', size='sm') {
    return `<div class="table-user"><span class="avatar ${size}">${initials(name)}</span><div><strong>${escapeHTML(name)}</strong><span>${escapeHTML(subtitle)}</span></div></div>`;
  }

  function courseCard(course, teacher, attendance=null, buttons='') {
    const banner = course.banner && course.banner !== 'blue' ? course.banner : '';
    const attendanceRow = attendance === null ? '' : `<div class="course-meta-row"><span>My attendance</span><strong class="${attendance < 75 ? 'text-danger' : 'text-success'}">${attendance}%</strong></div>`;
    return `<article class="course-card" data-course-id="${escapeHTML(course.id)}">
      <div class="course-banner ${banner}">
        <h3>${escapeHTML(course.name)}</h3>
        <p>${escapeHTML(course.code)} · Semester ${escapeHTML(course.semester)} · Section ${escapeHTML(course.section)}</p>
        <span class="course-avatar">${initials(teacher?.name || 'Teacher')}</span>
      </div>
      <div class="course-body">
        <div class="course-meta">
          <div class="course-meta-row"><span>Teacher</span><strong>${escapeHTML(teacher?.name || 'Not assigned')}</strong></div>
          <div class="course-meta-row"><span>Students</span><strong>${escapeHTML(course.students)}</strong></div>
          <div class="course-meta-row"><span>Next class</span><strong>${escapeHTML(course.nextClass || 'Not scheduled')}</strong></div>
          ${attendanceRow}
        </div>
      </div>
      <div class="course-footer">${buttons}</div>
    </article>`;
  }

  function tableEmpty(message='No records found.', colspan=8) {
    return `<tr><td colspan="${colspan}" class="text-center text-muted" style="padding:34px">${escapeHTML(message)}</td></tr>`;
  }

  function showToast(title, message='', type='success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.innerHTML = `<span class="toast-icon">${type === 'error' ? icons.alert : icons.check}</span><div><strong>${escapeHTML(title)}</strong><p>${escapeHTML(message)}</p></div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4200);
  }

  function openModal({title, body, footer='', large=false, onOpen}) {
    let backdrop = document.getElementById('globalModal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'globalModal';
      backdrop.className = 'modal-backdrop';
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML = `<div class="modal ${large ? 'modal-lg' : ''}" role="dialog" aria-modal="true">
      <div class="modal-header"><h3>${escapeHTML(title)}</h3><button class="icon-button" data-modal-close aria-label="Close">×</button></div>
      <div class="modal-body">${body}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>`;
    backdrop.classList.add('open');
    backdrop.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
    backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); }, {once:true});
    document.addEventListener('keydown', modalEscape, {once:true});
    if (onOpen) requestAnimationFrame(() => onOpen(backdrop));
    return backdrop;
  }

  function modalEscape(event) {
    if (event.key === 'Escape') closeModal();
  }

  function closeModal() {
    document.getElementById('globalModal')?.classList.remove('open');
  }

  function confirmDialog(title, message, confirmText='Confirm') {
    return new Promise(resolve => {
      openModal({
        title,
        body:`<p class="text-muted mt-0">${escapeHTML(message)}</p>`,
        footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-danger" id="confirmModalAction">${escapeHTML(confirmText)}</button>`,
        onOpen(modal){
          modal.querySelector('#confirmModalAction').addEventListener('click',()=>{ closeModal(); resolve(true); });
          modal.querySelectorAll('[data-modal-close]').forEach(el=>el.addEventListener('click',()=>resolve(false),{once:true}));
        }
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text).then(()=>showToast('Copied', 'The code has been copied to your clipboard.'));
    }
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    input.remove();
    showToast('Copied', 'The code has been copied to your clipboard.');
  }

  function exportCSV(filename, rows) {
    if (!rows.length) return showToast('Nothing to export', 'No matching records were found.', 'error');
    const headers = Object.keys(rows[0]);
    const quote = value => `"${String(value ?? '').replaceAll('"','""')}"`;
    const csv = [headers.map(quote).join(','), ...rows.map(row=>headers.map(h=>quote(row[h])).join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export prepared', `${filename} was generated.`);
  }

  function drawLineChart(canvas, labels, values, options={}) {
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 260;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    ctx.clearRect(0,0,width,height);
    const css = getComputedStyle(document.body);
    const primary = options.color || css.getPropertyValue('--primary').trim() || '#2563eb';
    const muted = css.getPropertyValue('--muted').trim() || '#64748b';
    const border = css.getPropertyValue('--border').trim() || '#e2e8f0';
    const surface = css.getPropertyValue('--surface').trim() || '#fff';
    const pad = {l:38,r:18,t:22,b:34};
    const chartW = width-pad.l-pad.r;
    const chartH = height-pad.t-pad.b;
    const min = options.min ?? 0;
    const max = options.max ?? Math.max(100, ...values);
    ctx.font = '11px system-ui';
    ctx.strokeStyle = border;
    ctx.fillStyle = muted;
    ctx.lineWidth = 1;
    for(let i=0;i<=4;i++){
      const y = pad.t + chartH * (i/4);
      ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(width-pad.r,y); ctx.stroke();
      const label = Math.round(max-(max-min)*(i/4));
      ctx.fillText(String(label), 6, y+4);
    }
    const step = labels.length > 1 ? chartW/(labels.length-1) : chartW;
    labels.forEach((label,i)=>{
      const x=pad.l+i*step;
      ctx.fillText(label, Math.max(2,x-12), height-10);
    });
    const points = values.map((value,i)=>({x:pad.l+i*step,y:pad.t+chartH-((value-min)/(max-min))*chartH}));
    const gradient=ctx.createLinearGradient(0,pad.t,0,height-pad.b);
    gradient.addColorStop(0, primary+'44');
    gradient.addColorStop(1, primary+'00');
    ctx.beginPath();
    points.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.lineTo(points.at(-1)?.x || pad.l,height-pad.b); ctx.lineTo(points[0]?.x || pad.l,height-pad.b); ctx.closePath();
    ctx.fillStyle=gradient; ctx.fill();
    ctx.beginPath();
    points.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
    ctx.strokeStyle=primary; ctx.lineWidth=3; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.stroke();
    points.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle=surface;ctx.fill();ctx.strokeStyle=primary;ctx.lineWidth=2;ctx.stroke();});
  }

  function drawBarChart(canvas, labels, values, options={}) {
    if (!canvas) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = canvas.clientHeight || 260;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio);
    const css = getComputedStyle(document.body);
    const primary = options.color || css.getPropertyValue('--primary').trim() || '#2563eb';
    const muted = css.getPropertyValue('--muted').trim() || '#64748b';
    const border = css.getPropertyValue('--border').trim() || '#e2e8f0';
    const max = options.max || Math.max(100, ...values);
    const pad={l:36,r:15,t:18,b:36};
    const cw=width-pad.l-pad.r, ch=height-pad.t-pad.b;
    ctx.font='11px system-ui'; ctx.fillStyle=muted; ctx.strokeStyle=border;
    for(let i=0;i<=4;i++){const y=pad.t+ch*i/4;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(width-pad.r,y);ctx.stroke();ctx.fillText(String(Math.round(max-max*i/4)),4,y+4);}
    const slot=cw/values.length; const bar=Math.min(38,slot*.56);
    values.forEach((v,i)=>{const x=pad.l+i*slot+(slot-bar)/2;const h=(v/max)*ch;const y=pad.t+ch-h;ctx.fillStyle=primary;roundRect(ctx,x,y,bar,h,7);ctx.fill();ctx.fillStyle=muted;ctx.fillText(labels[i],x-2,height-11);});
  }

  function roundRect(ctx,x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
  }

  function renderQR(element, seed='VERISYNC') {
    if (!element) return;
    element.innerHTML='';
    let hash=0;
    for(const ch of seed) hash=((hash<<5)-hash)+ch.charCodeAt(0);
    const fixed=(r,c)=>((r<7&&c<7)||(r<7&&c>13)||(r>13&&c<7));
    for(let r=0;r<21;r++){
      for(let c=0;c<21;c++){
        const cell=document.createElement('span');
        cell.className='qr-cell';
        const finder=fixed(r,c) && (r===0||c===0||r===6||c===6||((r>=2&&r<=4)&&(c>=2&&c<=4)) || (c>13&&r>=2&&r<=4&&c>=16&&c<=18) || (r>13&&r>=16&&r<=18&&c>=2&&c<=4));
        const random=((r*31+c*17+hash+(r*c*7))%11+11)%11 < 5;
        if(finder || (!fixed(r,c)&&random)) cell.classList.add('on');
        element.appendChild(cell);
      }
    }
  }

  function setupTheme() {
    const theme=localStorage.getItem(THEME_KEY) || 'light';
    document.body.classList.toggle('dark',theme==='dark');
    document.querySelectorAll('[data-theme-toggle]').forEach(btn=>{
      btn.innerHTML=document.body.classList.contains('dark')?icons.sun:icons.moon;
      btn.onclick=()=>{
        document.body.classList.toggle('dark');
        const dark=document.body.classList.contains('dark');
        localStorage.setItem(THEME_KEY,dark?'dark':'light');
        document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.innerHTML=dark?icons.sun:icons.moon);
        window.dispatchEvent(new Event('resize'));
      };
    });
  }

  function notificationPanel(role) {
    const db=getDB();
    const items=db.notifications[role] || [];
    let panel=document.getElementById('notificationPanel');
    if(!panel){panel=document.createElement('aside');panel.id='notificationPanel';panel.className='notification-panel';document.body.appendChild(panel);}
    panel.innerHTML=`<div class="card-header"><div><h3>Notifications</h3><p>${items.filter(x=>x.unread).length} unread updates</p></div><button class="btn btn-ghost btn-sm" id="markAllRead">Mark all read</button></div>
      <div>${items.map(item=>`<div class="notification-item ${item.unread?'unread':''}"><span class="list-icon">${icons.bell}</span><div><p>${escapeHTML(item.text)}</p><span>${escapeHTML(item.time)}</span></div></div>`).join('') || '<div class="empty-state"><p>No notifications.</p></div>'}</div>`;
    panel.querySelector('#markAllRead')?.addEventListener('click',()=>{
      updateDB(db2=>{(db2.notifications[role]||[]).forEach(n=>n.unread=false);return db2;});
      notificationPanel(role);
      panel.classList.add('open');
    });
    return panel;
  }

  function initPortal({role, nav, views, defaultView='dashboard', user}) {
    const content=document.getElementById('appContent');
    const navRoot=document.getElementById('sidebarNav');
    const pageTitle=document.getElementById('pageTitle');
    const pageSubtitle=document.getElementById('pageSubtitle');
    const profileName=document.getElementById('profileName');
    const profileEmail=document.getElementById('profileEmail');
    const profileAvatar=document.getElementById('profileAvatar');
    const sidebar=document.getElementById('sidebar');

    if(profileName) profileName.textContent=user.name;
    if(profileEmail) profileEmail.textContent=user.email;
    if(profileAvatar) profileAvatar.textContent=initials(user.name);

    const grouped=nav.reduce((acc,item)=>{(acc[item.section] ||= []).push(item);return acc;},{});
    navRoot.innerHTML=Object.entries(grouped).map(([section,items])=>`<div class="nav-section">${escapeHTML(section)}</div>${items.map(item=>`<button class="nav-item" data-view="${escapeHTML(item.id)}">${icons[item.icon]||icons.dashboard}<span>${escapeHTML(item.label)}</span>${item.badge?`<span class="nav-badge">${escapeHTML(item.badge)}</span>`:''}</button>`).join('')}`).join('');

    function showView(id, push=true){
      const view=views[id] || views[defaultView];
      const item=nav.find(n=>n.id===id) || nav.find(n=>n.id===defaultView);
      content.innerHTML=view();
      pageTitle.textContent=item?.label || 'Dashboard';
      pageSubtitle.textContent=item?.subtitle || `${role[0].toUpperCase()+role.slice(1)} Portal`;
      document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.view===id));
      if(push) location.hash=id;
      sidebar.classList.remove('open');
      if(typeof window.afterViewRender==='function') requestAnimationFrame(()=>window.afterViewRender(id));
      content.scrollTop=0;
    }

    navRoot.addEventListener('click',event=>{
      const item=event.target.closest('[data-view]');
      if(item) showView(item.dataset.view);
    });

    document.getElementById('mobileMenuBtn')?.addEventListener('click',()=>sidebar.classList.toggle('open'));
    document.getElementById('logoutBtn')?.addEventListener('click',()=>{clearSession();window.location.href=`faceattend-landing/auth.html?role=${role}`;});
    document.getElementById('topLogoutBtn')?.addEventListener('click',()=>{clearSession();window.location.href=`faceattend-landing/auth.html?role=${role}`;});
    const notifBtn=document.getElementById('notificationBtn');
    if(notifBtn){
      const panel=notificationPanel(role);
      notifBtn.addEventListener('click',event=>{event.stopPropagation();panel.classList.toggle('open');});
      document.addEventListener('click',event=>{if(!panel.contains(event.target)&&event.target!==notifBtn)panel.classList.remove('open');});
    }
    setupTheme();
    const hash=location.hash.replace('#','');
    showView(views[hash]?hash:defaultView,false);
    return {showView};
  }

  function courseById(db,id){return db.courses.find(x=>x.id===id);}
  function subjectById(db,id){return db.subjects.find(x=>x.id===id);}
  function teacherById(db,id){return db.teachers.find(x=>x.id===id) || (db.users.teacher.id===id?db.users.teacher:null);}
  function studentById(db,id){return db.students.find(x=>x.id===id) || (db.users.student.id===id?db.users.student:null);}

  function monthlyMatrix(db, courseId, students=db.students, year=2026, month=6) {
    const days=new Date(year,month+1,0).getDate();
    const start=new Date(db.college.teachingStart+'T00:00:00');
    const holidayDates=new Set();
    db.holidays.forEach(h=>{
      let d=new Date(h.start+'T00:00:00'); const end=new Date(h.end+'T00:00:00');
      while(d<=end){holidayDates.add(d.toISOString().slice(0,10));d.setDate(d.getDate()+1);}
    });
    return students.map(student=>{
      const values=[];let present=0,conducted=0;
      for(let day=1;day<=days;day++){
        const date=`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const d=new Date(date+'T00:00:00');
        if(d<start){values.push('NA');continue;}
        if(d.getDay()===0 || holidayDates.has(date)){values.push('H');continue;}
        const record=db.attendanceRecords.find(r=>r.studentId===student.id&&r.courseId===courseId&&r.date===date);
        if(record){values.push(record.value);conducted++;if(record.value===1)present++;}
        else if(d<=new Date('2026-07-23T00:00:00')){values.push(((student.roll.charCodeAt(student.roll.length-1)+day)%7)>1?1:0);conducted++;if(values.at(-1)===1)present++;}
        else values.push('—');
      }
      return {student,values,present,conducted,percentage:percentage(present,conducted)};
    });
  }

  return {
    icons, initDB, getDB, saveDB, updateDB, resetDB, setSession, getSession, clearSession, requireRole, login,
    escapeHTML, initials, uid, randomCode, todayISO, formatDate, percentage, statusBadge, attendanceStatusBadge,
    statCard, userCell, courseCard, tableEmpty, showToast, openModal, closeModal, confirmDialog, copyText, exportCSV,
    drawLineChart, drawBarChart, renderQR, setupTheme, initPortal, courseById, subjectById, teacherById, studentById,
    monthlyMatrix
  };
})();

window.VeriSync = VeriSync;
