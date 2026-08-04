export type Publication = {
  title: string;
  journal?: string;
  book?: string;
  year?: string | number;
  link?: string;
};

export type WorkExperience = {
  role: string;
  org: string;
  duration: string;
};

export type TeacherProfile = {
  id: string;
  name: string;
  gender: string;
  designation: string;
  department: string;
  qualifications: string;
  vidwanId?: string;
  orcidId?: string;
  email: string;
  phone?: string;
  image?: string;
  workExperience: WorkExperience[];
  achievements: string[];
  committees: string[];
  publications: Publication[];
  training?: string[];
  patents?: string[];
};

export const teacherProfilesData: Record<string, TeacherProfile> = {
  'FAC2022': {
    id: 'FAC2022',
    name: 'Sushmita Chakraborty',
    gender: 'Female',
    designation: 'Programme Coordinator (PGDCA) / Assistant Professor',
    department: 'Computer Applications (MCA)',
    qualifications: 'MCA, DBMS',
    vidwanId: '356156',
    orcidId: '0009-0003-1922-1305',
    email: 'Sushmitachakraborty.mca@pwc.in',
    image: '/features/susmita.png',
    workExperience: [
      { role: 'Teaching Faculty (UG)', org: 'Patna Women’s College', duration: 'Sep 1999 - Present' },
      { role: 'Teaching Faculty (MCA)', org: 'Patna Women’s College', duration: '2014 - Present' },
      { role: 'Visiting Faculty', org: 'Patna College, Patna University', duration: '2008 - 2010' }
    ],
    committees: [
      'Member of IQAC NAAC Working Committee, Patna Women’s College',
      'Member of Alumni Governing Body, Patna Women’s College (PWCAA)',
      'Coordinator of Technical Committee of Alumni Association (PWCAA)',
      'NPTEL Online Courses, SPOC, NPTEL Patna Local Chapter',
      'Board Member of Board of Studies (BOS) of MCA, BCA, & PGDCA'
    ],
    achievements: [
      'NPTEL Certificate of Appreciation for role as Active SPOC (2019-2022)',
      'Invited Speaker for One Week E-Workshop on Digital Marketing & E-Commerce (2020)',
      'Appreciation Certificate 2024 on Happy Women’s Day! by Senco Gold & Diamonds'
    ],
    publications: [
      { title: 'A module for "Computer Literacy Programme"', book: 'Co-Editor', year: 'N/A' },
      { title: '3D Animation and Design', book: 'Co-Editor', year: 2014 },
      { title: 'Development and Management of E-governance, IT & Communication in Urban India', book: 'Development & Management of Urban Infrastructure in India', year: 2017 },
      { title: 'DBMS Simply in Depth', book: 'Independently published', year: 2018 },
      { title: 'Network Forensics Simply in Depth', book: 'Kindle Direct Publishing', year: 2020 },
      { title: 'A Study of "4G Wireless System"', journal: 'Int. Journal of Application or Innovation in Engineering & Management', year: 2017 },
      { title: 'Study of "Achievements and Future scope of Digital Assessment"', journal: 'Int. Journal of Emerging Technology and Advanced Engineering', year: 2017 },
      { title: 'A Study of E-Resource', journal: 'JETIR', year: 2019 },
      { title: 'A study on DDoS Attacks, danger and its Prevention', journal: 'IJRAR', year: 2019 },
      { title: 'Challenges for Smart Cities in India', journal: 'Our Heritage', year: 2020 },
      { title: 'Database Security Threats and How to Mitigate Them', journal: 'MOL2NET’22 Conference', year: 2022 }
    ]
  },
  'FAC2021': {
    id: 'FAC2021',
    name: 'Praveen Kumar',
    gender: 'Male',
    designation: 'Assistant Professor',
    department: 'Computer Applications (MCA)',
    qualifications: 'M.Tech, MCA',
    vidwanId: '349263',
    orcidId: '0000-0003-4055-6436',
    email: 'Praveenkumar.mca@pwc.in',
    image: '/features/praveen.png',
    workExperience: [
      { role: 'Assistant Professor', org: 'Patna Women’s College', duration: 'Dec 2013 - Present' },
      { role: 'Project Lead', org: 'PeeThree Edutech Pvt. Ltd.', duration: 'Jan 2013 - Dec 2013' },
      { role: 'Manager Technical (IT)', org: 'Anwesha Cybotech Campus', duration: 'Aug 2009 - Jan 2013' },
      { role: 'Software Engineer', org: 'YBS Infotech', duration: 'Feb 2009 - Jul 2009' },
      { role: 'Software Engineer', org: 'vAngelz Technologies', duration: 'Jan 2008 - Feb 2009' },
      { role: 'Software Engineer', org: 'Pentomic System Pvt. Ltd.', duration: 'May 2007 - Jan 2008' }
    ],
    committees: [],
    achievements: [
      'Learning Management System (LMS) Certification',
      'Certificate of Achievement for Digital Marketing by Google Digital Unlocked (2020)'
    ],
    publications: [
      { title: 'Role of Remote Sensing and GIS in Planning Smart Cities', journal: 'Various', year: 'N/A' },
      { title: 'A Study of E-Resource', journal: 'JETIR', year: 2019 },
      { title: 'A study on DDoS Attacks, danger and its Prevention', journal: 'IJRAR', year: 2019 }
    ],
    training: [
      'Quality Management Program by Philip B. Crosby at NIIT',
      'Short Term Course on Wireless Networks & Security at NIT, Patna',
      'STTP through ICT Mode on Introduction to Network Security (NITTTR, Kolkata)',
      'Online 5 days FDP on Moodle LMS (IIT Mumbai)',
      'Cloud Technology FDP by AICTE Training & Learning Academy'
    ]
  },
  'FAC2023': {
    id: 'FAC2023',
    name: 'Braj Kishor Prasad',
    gender: 'Male',
    designation: 'Professor',
    department: 'Computer Applications (MCA)',
    qualifications: 'M.Tech, MCA',
    vidwanId: '356332',
    orcidId: '0009-0003-5258-0625',
    email: 'Brajkishoreprasad.mca@pwc.in',
    image: '/features/brajesh.png',
    workExperience: [
      { role: 'Academic Counselor', org: 'St. Xavier’s School, Patna', duration: 'Jul 2003 - Present' },
      { role: 'Visiting Faculty', org: 'NIT Patna', duration: 'Jan 2008 - Dec 2012' },
      { role: 'Programmer', org: 'P.G. Dept. of Electrical B.C.E., P.U.', duration: 'Oct 1988 - Dec 2001' },
      { role: 'Faculty', org: 'Govt. Polytechnic, Gulzarbagh', duration: 'Jan 1996 - Jun 2003' },
      { role: 'Senior Faculty', org: 'ET & T, Boring Road', duration: 'May 2001 - Feb 2003' },
      { role: 'Visiting Faculty', org: 'IITM, Kankerbagh', duration: 'Jan 2004 - Dec 2008' }
    ],
    committees: [],
    achievements: [
      'NATIONAL RURAL SCHOLARSHIP from Patratu Block, District Hazaribagh (1977-1980)'
    ],
    publications: []
  },
  'FAC2020': {
    id: 'FAC2020',
    name: 'Richa Verma',
    gender: 'Female',
    designation: 'Assistant Professor',
    department: 'Computer Applications (MCA)',
    qualifications: 'MCA, M.Phil, B.LIS, Ph.D.(Pursuing)',
    email: 'Richaverma.mca@pwc.in',
    image: '/features/richa_verma.png',
    workExperience: [
      { role: 'Assistant Professor (IT)', org: 'L.N.Mishra College of Business Management', duration: 'Apr 2024 - Mar 2025' },
      { role: 'Dean, College of B.C.A', org: 'Global Foundation for Higher Studies', duration: 'Mar 2023 - Mar 2024' },
      { role: 'Guest Trainer (IT & Mgmt)', org: 'BAMETI / BIPARD', duration: 'Jul 2022 - Present' },
      { role: 'Visiting Faculty', org: 'L.N Mishra Institute', duration: 'Jul 2016 - Sep 2023' },
      { role: 'Visiting Faculty', org: 'Amity University, Patna', duration: 'Oct 2021 - Dec 2023' },
      { role: 'Assistant Professor', org: 'Ranchi Women’s College', duration: 'Nov 2018 - Jul 2019' },
      { role: 'Technical Support Associate', org: 'WIPRO BPO, Mumbai', duration: 'Jul 2007 - Jan 2008' }
    ],
    committees: [
      'Member of English Learning and Teaching Association of India (ELT@I)'
    ],
    achievements: [
      'Nominated for ATAL RATNA ABHINANDAN 2024 (Nepal)',
      'Received RASHTRIYA SHIKSHAK GAURAV RATN SAMMAN 2024',
      'Parampara Sewa Award 2019 for Best Field of Education Services',
      'Teacher Innovation Award by ZIIEI',
      'Best Presentation Award at German Language Centre, Patna',
      'Camaraderie Award for the Best Team Member (Wipro)'
    ],
    publications: [
      { title: 'Fundamentals of Machine Learning using Python', book: 'Book Rivers Publications', year: 2024 },
      { title: 'Comprehensive guide on Software Project Management', book: 'Foxland Publications', year: 'N/A' },
      { title: 'Frankly Bullywood', book: 'Foxland Publications', year: 'N/A' },
      { title: 'Data Driven Mental Health Predicting Depression Using Machine Learning', journal: 'ICDSBS IEEE', year: 2025 },
      { title: 'Enhanced Drowsiness Prediction through EEG Signal Analysis', journal: 'CONIT IEEE', year: 2024 },
      { title: 'A flexible analytic wavelet transforms and ensemble bagged tree model', journal: 'Scopus Journal', year: 'N/A' }
    ],
    patents: [
      'National patent on An Efficient Deep Learning Technique for Intrusion Detection System',
      'Indian Patent Publication on AI techniques for prediction of customer review in e-commerce',
      'International Patent on 5G Based Remotely Controlled IOT Street Lamp for a UK Design',
      'Indian Utility Patent Publication on Blockchain-Based Digital Identity Verification System'
    ]
  }
};
