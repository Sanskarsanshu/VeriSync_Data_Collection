'use strict';

(() => {
  const session = VeriSync.requireRole('admin');
  if (!session) return;
  const db0 = VeriSync.getDB();
  const user = db0.users.admin;
  document.getElementById('topAvatar').textContent = VeriSync.initials(user.name);
  document.getElementById('topName').textContent = user.name;

  const nav = [
    {section:'Overview', id:'dashboard', label:'Dashboard', icon:'dashboard', subtitle:'Institution-wide attendance overview'},
    {section:'Academic Setup', id:'college', label:'College & Session', icon:'building', subtitle:'College, programme and active semester configuration'},
    {section:'Academic Setup', id:'subjects', label:'Subjects', icon:'book', subtitle:'Official subject master records'},
    {section:'People', id:'teachers', label:'Teachers', icon:'teacher', subtitle:'Faculty accounts and verification'},
    {section:'People', id:'students', label:'Students', icon:'student', subtitle:'Student records and face-verification status'},
    {section:'Course Control', id:'assignments', label:'Teacher Assignments', icon:'users', subtitle:'Map teachers to authorised subjects'},
    {section:'Course Control', id:'authorizations', label:'Course Authorisations', icon:'key', subtitle:'Secure teacher course-creation codes'},
    {section:'Course Control', id:'courses', label:'Active Courses', icon:'course', subtitle:'All course classrooms and enrolment counts'},
    {section:'Attendance', id:'attendance', label:'Attendance Monitor', icon:'attendance', subtitle:'Institution-wide attendance records'},
    {section:'Attendance', id:'corrections', label:'Correction Requests', icon:'correction', subtitle:'Final review of attendance corrections', badge:String(db0.corrections.filter(c=>c.adminDecision==='Pending').length)},
    {section:'Attendance', id:'sheets', label:'Attendance Sheets', icon:'database', subtitle:'Monthly matrices and exports'},
    {section:'Calendar', id:'holidays', label:'Holidays', icon:'holiday', subtitle:'Working days, holidays and vacations'},
    {section:'Insights', id:'reports', label:'Reports & Analytics', icon:'chart', subtitle:'Attendance and compliance insights'},
    {section:'System', id:'security', label:'Security & Audit', icon:'shield', subtitle:'Risk events and immutable activity records'},
    {section:'System', id:'settings', label:'System Settings', icon:'settings', subtitle:'Attendance rules and frontend configuration'}
  ];

  const views = {
    dashboard: renderDashboard,
    college: renderCollege,
    subjects: renderSubjects,
    teachers: renderTeachers,
    students: renderStudents,
    assignments: renderAssignments,
    authorizations: renderAuthorizations,
    courses: renderCourses,
    attendance: renderAttendance,
    corrections: renderCorrections,
    sheets: renderSheets,
    holidays: renderHolidays,
    reports: renderReports,
    security: renderSecurity,
    settings: renderSettings
  };

  const portal = VeriSync.initPortal({role:'admin', nav, views, user});

  function pageHeader(title, subtitle, actions='') {
    return `<div class="page-header"><div class="page-title"><h2>${VeriSync.escapeHTML(title)}</h2><p>${VeriSync.escapeHTML(subtitle)}</p></div><div class="header-actions">${actions}</div></div>`;
  }

  function renderDashboard() {
    const db = VeriSync.getDB();
    const activeStudents = db.students.filter(s=>s.status==='Active').length;
    const verified = db.students.filter(s=>s.faceStatus==='Verified').length;
    const activeTeachers = db.teachers.filter(t=>t.status==='Active').length;
    const average = Math.round(db.students.reduce((a,s)=>a+s.attendance,0)/db.students.length*10)/10;
    const pendingCorrections = db.corrections.filter(c=>c.adminDecision==='Pending').length;
    const low = db.students.filter(s=>s.attendance<db.settings.attendanceThreshold).length;
    return `${pageHeader('Admin Dashboard','Live operational overview for the active MCA academic session.',`<button class="btn btn-primary" data-action="quick-auth">${VeriSync.icons.key} Generate Authorisation</button>`)}
      <div class="stats-grid">
        ${VeriSync.statCard('Registered students',activeStudents,'36 target · 50 capacity','student','trend-up')}
        ${VeriSync.statCard('Verified students',verified,`${db.students.length-verified} pending face review`,'shield')}
        ${VeriSync.statCard('Active teachers',activeTeachers,`${db.teachers.length} total faculty records`,'teacher')}
        ${VeriSync.statCard('Average attendance',`${average}%`,`${low} students below ${db.settings.attendanceThreshold}%`,'chart',low?'trend-down':'trend-up')}
      </div>
      <div class="grid grid-2">
        <article class="card chart-card"><div class="card-header"><div><h3>Monthly attendance trend</h3><p>Institution average for the current semester</p></div>${VeriSync.statusBadge('Live')}</div><div class="card-body"><canvas id="adminTrendChart"></canvas></div></article>
        <article class="card"><div class="card-header"><div><h3>Verification health</h3><p>Student identity readiness</p></div></div><div class="card-body"><div class="donut-wrap"><div class="donut-visual"><div class="donut" style="--value:${Math.round(verified/db.students.length*100)};position:relative"><div class="donut-label"><strong>${Math.round(verified/db.students.length*100)}%</strong><span>verified</span></div></div></div><div class="legend"><div class="legend-item"><span class="legend-label"><span class="legend-swatch" style="background:var(--success)"></span>Face verified</span><strong>${verified}</strong></div><div class="legend-item"><span class="legend-label"><span class="legend-swatch" style="background:var(--warning)"></span>Pending review</span><strong>${db.students.length-verified}</strong></div><div class="divider"></div><div class="alert ${verified===db.students.length?'success':'warning'}"><span>${VeriSync.icons.info}</span><div><h4>${verified===db.students.length?'All students ready':'Verification action required'}</h4><p>Review pending students before the next high-stakes attendance session.</p></div></div></div></div></div></article>
      </div>
      <div class="grid grid-2 mt-3">
        <article class="card"><div class="card-header"><div><h3>Today’s academic operations</h3><p>Scheduled classes and attendance readiness</p></div><button class="btn btn-ghost btn-sm" data-nav="attendance">View monitor</button></div><div class="card-body"><div class="list">
          ${db.schedule.slice(0,4).map(item=>{const course=VeriSync.courseById(db,item.courseId);const teacher=VeriSync.teacherById(db,course.teacherId);return `<div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.clock}</span><div><p class="list-title">${course.name}</p><p class="list-subtitle">${item.start}–${item.end} · ${item.room} · ${teacher.name}</p></div></div>${VeriSync.statusBadge(item.status)}</div>`}).join('')}
        </div></div></article>
        <article class="card"><div class="card-header"><div><h3>Attention required</h3><p>Items waiting for administrative action</p></div><span class="badge badge-warning">${pendingCorrections+low} items</span></div><div class="card-body"><div class="list">
          <div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.correction}</span><div><p class="list-title">${pendingCorrections} correction requests</p><p class="list-subtitle">Final admin decision is pending</p></div></div><button class="btn btn-soft btn-sm" data-nav="corrections">Review</button></div>
          <div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.alert}</span><div><p class="list-title">${low} low-attendance students</p><p class="list-subtitle">Below the configured ${db.settings.attendanceThreshold}% threshold</p></div></div><button class="btn btn-soft btn-sm" data-nav="reports">Inspect</button></div>
          <div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.key}</span><div><p class="list-title">${db.authorizations.filter(a=>a.status==='Active').length} active authorisation codes</p><p class="list-subtitle">Bound to teachers, subjects and sections</p></div></div><button class="btn btn-soft btn-sm" data-nav="authorizations">Manage</button></div>
        </div></div></article>
      </div>`;
  }

  function renderCollege() {
    const db=VeriSync.getDB(), c=db.college;
    return `${pageHeader('College & Academic Session','Configure the institution hierarchy and exact teaching period.',`<button class="btn btn-primary" id="saveCollegeBtn">${VeriSync.icons.check} Save configuration</button>`)}
      <div class="grid grid-2">
        <article class="card"><div class="card-header"><div><h3>Institution details</h3><p>Initial deployment is scoped to PWC MCA second year</p></div></div><div class="card-body"><form id="collegeForm" class="form-grid">
          <div class="form-group full"><label class="form-label">College name</label><input class="input" name="name" value="${VeriSync.escapeHTML(c.name)}"></div>
          <div class="form-group"><label class="form-label">College code</label><input class="input" name="code" value="${VeriSync.escapeHTML(c.code)}"></div>
          <div class="form-group"><label class="form-label">Department</label><input class="input" name="department" value="${VeriSync.escapeHTML(c.department)}"></div>
          <div class="form-group"><label class="form-label">Programme</label><input class="input" name="programme" value="${VeriSync.escapeHTML(c.programme)}"></div>
          <div class="form-group"><label class="form-label">Section capacity</label><input class="input" type="number" name="capacity" min="1" max="500" value="${c.capacity}"></div>
        </form></div></article>
        <article class="card"><div class="card-header"><div><h3>Active academic period</h3><p>Dates before teaching start are marked Not Applicable</p></div></div><div class="card-body"><form id="sessionForm" class="form-grid">
          <div class="form-group"><label class="form-label">Academic session</label><input class="input" name="currentSession" value="${c.currentSession}"></div>
          <div class="form-group"><label class="form-label">Current semester</label><select class="select" name="currentSemester"><option ${c.currentSemester==='III'?'selected':''}>III</option><option ${c.currentSemester==='IV'?'selected':''}>IV</option></select></div>
          <div class="form-group"><label class="form-label">Teaching start date</label><input class="input" type="date" name="teachingStart" value="${c.teachingStart}"></div>
          <div class="form-group"><label class="form-label">Semester end date</label><input class="input" type="date" name="semesterEnd" value="${c.semesterEnd}"></div>
        </form><div class="alert success mt-3"><span>${VeriSync.icons.check}</span><div><h4>Mid-month logic enabled</h4><p>Dates before ${VeriSync.formatDate(c.teachingStart)} remain NA and never reduce attendance.</p></div></div></div></article>
      </div>
      <article class="card mt-3"><div class="card-header"><div><h3>Academic hierarchy preview</h3><p>Dropdown values used in Teacher and Student portals originate here</p></div></div><div class="card-body"><div class="detail-grid">
        <div class="detail-item"><span>College</span><strong>${c.name}</strong></div><div class="detail-item"><span>Department</span><strong>${c.department}</strong></div><div class="detail-item"><span>Programme</span><strong>${c.programme}</strong></div><div class="detail-item"><span>Session</span><strong>${c.currentSession}</strong></div><div class="detail-item"><span>Year</span><strong>Second Year</strong></div><div class="detail-item"><span>Semester / Section</span><strong>${c.currentSemester} / A</strong></div>
      </div></div></article>`;
  }

  function renderSubjects() {
    const db=VeriSync.getDB();
    return `${pageHeader('Subject Master','Only admin-approved subjects can be assigned or used to create a course.',`<button class="btn btn-primary" data-action="add-subject">${VeriSync.icons.plus} Add Subject</button>`)}
      <article class="card"><div class="card-body"><div class="toolbar"><div class="search-box">${VeriSync.icons.search}<input id="subjectSearch" placeholder="Search subject or code"></div><div class="toolbar-group"><select class="select" id="subjectSemester"><option value="">All semesters</option><option>III</option><option>IV</option></select><button class="btn btn-secondary" data-action="export-subjects">${VeriSync.icons.download} Export</button></div></div><div class="table-wrap"><table><thead><tr><th>Subject</th><th>Code</th><th>Semester</th><th>Type</th><th>Credits</th><th>Weekly classes</th><th>Status</th><th>Actions</th></tr></thead><tbody id="subjectRows">${subjectRows(db.subjects)}</tbody></table></div></div></article>`;
  }

  function subjectRows(subjects){
    return subjects.map(s=>`<tr><td><strong>${VeriSync.escapeHTML(s.name)}</strong></td><td>${VeriSync.escapeHTML(s.code)}</td><td>${s.semester}</td><td>${VeriSync.statusBadge(s.type)}</td><td>${s.credits}</td><td>${s.weeklyClasses}</td><td>${VeriSync.statusBadge(s.status)}</td><td><button class="icon-button" data-edit-subject="${s.id}" title="Edit">${VeriSync.icons.edit}</button></td></tr>`).join('') || VeriSync.tableEmpty('No subjects match the filters.',8);
  }

  function renderTeachers() {
    const db=VeriSync.getDB();
    return `${pageHeader('Teachers','Add, verify, edit and deactivate faculty accounts.',`<button class="btn btn-primary" data-action="add-teacher">${VeriSync.icons.plus} Add Teacher</button>`)}
      <article class="card"><div class="card-body"><div class="toolbar"><div class="search-box">${VeriSync.icons.search}<input id="teacherSearch" placeholder="Search teacher, ID or email"></div><div class="toolbar-group"><select class="select" id="teacherStatus"><option value="">All statuses</option><option>Active</option><option>Pending</option><option>Inactive</option></select><button class="btn btn-secondary" data-action="export-teachers">${VeriSync.icons.download} Export</button></div></div><div class="table-wrap"><table><thead><tr><th>Teacher</th><th>Employee ID</th><th>Department</th><th>Subjects</th><th>Verification</th><th>Status</th><th>Last login</th><th>Actions</th></tr></thead><tbody id="teacherRows">${teacherRows(db.teachers)}</tbody></table></div></div></article>`;
  }

  function teacherRows(teachers){
    return teachers.map(t=>`<tr><td>${VeriSync.userCell(t.name,t.email)}</td><td>${t.employeeId}</td><td>${t.department}</td><td>${t.subjects.slice(0,2).map(s=>`<span class="badge badge-neutral">${VeriSync.escapeHTML(s)}</span>`).join(' ') || '—'}</td><td>${VeriSync.statusBadge(t.verified?'Verified':'Pending')}</td><td>${VeriSync.statusBadge(t.status)}</td><td>${t.lastLogin}</td><td><div class="flex gap-1"><button class="icon-button" data-edit-teacher="${t.id}" title="Edit">${VeriSync.icons.edit}</button><button class="icon-button" data-toggle-teacher="${t.id}" title="Activate or deactivate">${VeriSync.icons.lock}</button></div></td></tr>`).join('') || VeriSync.tableEmpty('No teacher records found.',8);
  }

  function renderStudents() {
    const db=VeriSync.getDB();
    return `${pageHeader('Students','Manage the authorised MCA student list and verification status.',`<button class="btn btn-secondary" data-action="import-students">${VeriSync.icons.upload} Import CSV</button><button class="btn btn-primary" data-action="add-student">${VeriSync.icons.plus} Add Student</button>`)}
      <div class="stats-grid">
        ${VeriSync.statCard('Total records',db.students.length,`${db.college.capacity-db.students.length} capacity remaining`,'student')}
        ${VeriSync.statCard('Face verified',db.students.filter(s=>s.faceStatus==='Verified').length,'Ready for secure attendance','shield')}
        ${VeriSync.statCard('Below threshold',db.students.filter(s=>s.attendance<db.settings.attendanceThreshold).length,`Threshold ${db.settings.attendanceThreshold}%`,'alert','trend-down')}
        ${VeriSync.statCard('Active session',db.college.currentSession,`Semester ${db.college.currentSemester} · Section A`,'calendar')}
      </div>
      <article class="card"><div class="card-body"><div class="toolbar"><div class="search-box">${VeriSync.icons.search}<input id="studentSearch" placeholder="Search name, roll or email"></div><div class="toolbar-group"><select class="select" id="faceFilter"><option value="">All face statuses</option><option>Verified</option><option>Pending</option></select><button class="btn btn-secondary" data-action="export-students">${VeriSync.icons.download} Export</button></div></div><div class="table-wrap"><table><thead><tr><th>Student</th><th>Roll</th><th>Semester</th><th>Section</th><th>Face verification</th><th>Attendance</th><th>Account</th><th>Actions</th></tr></thead><tbody id="studentRows">${studentRows(db.students)}</tbody></table></div></div></article>`;
  }

  function studentRows(students){
    return students.map(s=>`<tr><td>${VeriSync.userCell(s.name,s.email)}</td><td>${s.roll}</td><td>${s.semester}</td><td>${s.section}</td><td>${VeriSync.statusBadge(s.faceStatus)}</td><td><div style="min-width:110px"><div class="flex justify-between"><strong>${s.attendance}%</strong><span class="text-muted">${s.attendance>=75?'Good':s.attendance>=65?'Warning':'Critical'}</span></div><div class="progress"><div class="progress-bar ${s.attendance<65?'danger':s.attendance<75?'warning':'success'}" style="width:${s.attendance}%"></div></div></div></td><td>${VeriSync.statusBadge(s.status)}</td><td><div class="flex gap-1"><button class="icon-button" data-view-student="${s.id}" title="View">${VeriSync.icons.eye}</button><button class="icon-button" data-edit-student="${s.id}" title="Edit">${VeriSync.icons.edit}</button></div></td></tr>`).join('') || VeriSync.tableEmpty('No student records found.',8);
  }

  function renderAssignments() {
    const db=VeriSync.getDB();
    return `${pageHeader('Teacher Assignments','One teacher account can be assigned to multiple official subjects.',`<button class="btn btn-primary" data-action="add-assignment">${VeriSync.icons.plus} Assign Subject</button>`)}
      <article class="card"><div class="card-body"><div class="alert success mb-3"><span>${VeriSync.icons.check}</span><div><h4>Recommended many-to-many model</h4><p>Register a teacher once, then attach multiple subject assignments. Do not create duplicate teacher accounts for each subject.</p></div></div><div class="table-wrap"><table><thead><tr><th>Teacher</th><th>Subject</th><th>Code</th><th>Session</th><th>Semester</th><th>Section</th><th>Role</th><th>Actions</th></tr></thead><tbody>${db.assignments.map(a=>{const t=VeriSync.teacherById(db,a.teacherId),s=VeriSync.subjectById(db,a.subjectId);return `<tr><td>${VeriSync.userCell(t.name,t.employeeId)}</td><td><strong>${s.name}</strong></td><td>${s.code}</td><td>${a.session}</td><td>${a.semester}</td><td>${a.section}</td><td>${VeriSync.statusBadge(a.role)}</td><td><button class="icon-button" data-remove-assignment="${a.id}">${VeriSync.icons.trash}</button></td></tr>`}).join('')}</tbody></table></div></div></article>`;
  }

  function renderAuthorizations() {
    const db=VeriSync.getDB();
    return `${pageHeader('Course Authorisations','Generate secure, teacher-bound and subject-bound course creation codes.',`<button class="btn btn-primary" data-action="quick-auth">${VeriSync.icons.key} Generate Code</button>`)}
      <article class="card"><div class="card-body"><div class="alert warning mb-3"><span>${VeriSync.icons.shield}</span><div><h4>Security rule</h4><p>A teacher cannot create a course unless the code matches the teacher, subject, session, semester and section. Used, expired or revoked codes are rejected.</p></div></div><div class="table-wrap"><table><thead><tr><th>Teacher</th><th>Subject</th><th>Scope</th><th>Secure code</th><th>Expiry</th><th>Status</th><th>Actions</th></tr></thead><tbody>${authorizationRows(db)}</tbody></table></div></div></article>`;
  }

  function authorizationRows(db){
    return db.authorizations.map(a=>{const t=VeriSync.teacherById(db,a.teacherId),s=VeriSync.subjectById(db,a.subjectId);return `<tr><td>${VeriSync.userCell(t.name,t.email)}</td><td><strong>${s.name}</strong><br><span class="text-muted">${s.code}</span></td><td>${a.session}<br><span class="text-muted">Semester ${a.semester} · Section ${a.section}</span></td><td><div class="code-box">${a.code}<button class="icon-button" data-copy-code="${a.code}" style="width:32px;height:32px">${VeriSync.icons.copy}</button></div></td><td>${VeriSync.formatDate(a.expires)}</td><td>${VeriSync.statusBadge(a.status)}</td><td><button class="btn btn-secondary btn-sm" data-toggle-auth="${a.id}">${a.status==='Active'?'Revoke':'Regenerate'}</button></td></tr>`}).join('');
  }

  function renderCourses() {
    const db=VeriSync.getDB();
    return `${pageHeader('Active Courses','Google Classroom-inspired course cards adapted for attendance operations.',`<button class="btn btn-secondary" data-action="export-courses">${VeriSync.icons.download} Export Roster</button>`)}
      <div class="course-grid">${db.courses.map(c=>VeriSync.courseCard(c,VeriSync.teacherById(db,c.teacherId),null,`<button class="btn btn-ghost btn-sm" data-course-admin="${c.id}">${VeriSync.icons.eye} Details</button><button class="btn btn-soft btn-sm" data-course-status="${c.id}">${c.status==='Active'?'Suspend':'Activate'}</button>`)).join('')}</div>`;
  }

  const MONTHS_LATEST_FIRST = ['July','June','May','April','March','February','January'];
  const MONTH_INDEXES = [6, 5, 4, 3, 2, 1, 0];
  const DAY_COLS = Array.from({length:31}, (_,i)=>String(i+1).padStart(2,'0'));
  const AVATAR_COLORS = ['#2F6F5E','#B4517A','#5B6FD6','#C77B3B','#3F8FBF','#7A5FBF','#4E8B5A'];

  let ADMIN_ATTENDANCE_STUDENTS = [];

  function buildAdminStudents() {
    const db = VeriSync.getDB();
    const studentsList = [];
    let colorIndex = 0;

    const courseMatrices = {};
    db.courses.forEach(course => {
      courseMatrices[course.id] = {};
      MONTH_INDEXES.forEach((mIdx, i) => {
        courseMatrices[course.id][MONTHS_LATEST_FIRST[i]] = VeriSync.monthlyMatrix(db, course.id, db.students, 2026, mIdx);
      });
    });

    db.students.forEach(student => {
      db.courses.forEach(course => {
        const studentRecords = db.attendanceRecords.filter(r => r.studentId === student.id && r.courseId === course.id);
        if (studentRecords.length === 0) return;
        
        const latestRecord = [...studentRecords].sort((a,b) => b.date.localeCompare(a.date))[0];
        const correctionRequested = db.corrections.some(c => c.studentId === student.id && c.courseId === course.id && c.teacherRecommendation === 'Pending');

        const matrix = { [course.code]: {} };
        const monthly = {};
        
        MONTHS_LATEST_FIRST.forEach(m => {
          const mData = courseMatrices[course.id][m].find(sm => sm.student.id === student.id);
          const presentPct = mData ? mData.percentage : 0;
          const presentDays = mData ? mData.present : 0;
          const conductedDays = mData ? mData.conducted : 0;
          
          monthly[m] = { presentPct, absentPct: 100 - presentPct, presentDays, conductedDays };
          
          let vals = mData ? mData.values.map(v => v===1?'1':v===0?'0':v==='H'?'H':v==='—'?'—':'NA') : [];
          while(vals.length < 31) vals.push('NA');
          matrix[course.code][m] = vals;
        });

        studentsList.push({
          id: student.id + '_' + course.id,
          name: student.name,
          roll: student.roll,
          course: course.code,
          examRoll: '25' + student.roll.replace('MCA','MCA0'),
          regNo: '25PWC0' + student.roll.replace(/\D/g,''),
          session: course.session || '2025–27',
          classText: course.name,
          color: AVATAR_COLORS[colorIndex++ % AVATAR_COLORS.length],
          status: student.attendance >= 75 ? 'Regular' : 'Irregular',
          verification: latestRecord.method,
          time: latestRecord.time,
          correctionRequested,
          monthly,
          matrix
        });
      });
    });
    return studentsList.sort((a,b)=>a.name.localeCompare(b.name));
  }

  function donutSVG(presentPct){
    const r = 34, sw = 20, c = 2*Math.PI*r;
    const presentLen = c * (presentPct/100);
    return `<svg width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="${r}" fill="none" stroke="#9775FA" stroke-width="${sw}"/><circle cx="50" cy="50" r="${r}" fill="none" stroke="#4C6EF5" stroke-width="${sw}" stroke-dasharray="${presentLen} ${c-presentLen}" stroke-dashoffset="${c*0.25}" stroke-linecap="round"/></svg>`;
  }

  function donutWidget(monthLabel, presentPct){
    const p = parseFloat(presentPct.toFixed(1));
    const a = parseFloat((100 - presentPct).toFixed(1));
    return `<div class="donut-widget"><div class="tag absent">Absent<br><span class="pct">${a}%</span></div><div class="ring-wrap">${donutSVG(presentPct)}<span class="month-label">${monthLabel.slice(0,3)}</span></div><div class="tag present">Present<br><span class="pct">${p}%</span></div></div>`;
  }

  function adminStudentRow(s){
    return `<tr class="student-row" data-admin-att-id="${s.id}"><td><div class="user-cell"><div class="avatar" style="background:${s.color}">${VeriSync.initials(s.name)}</div><div><div class="name">${s.name}</div><div class="roll">${s.roll}</div></div></div></td><td><strong>${s.course}</strong></td><td><span class="badge ${s.status==='Regular'?'badge-success':'badge-danger'}">${s.status}</span></td><td>${s.verification}</td><td>${s.time}</td><td>${s.correctionRequested?'<span class="badge badge-warning">Pending</span>':'—'}</td></tr>`;
  }

  function adminSummaryRow(s){
    const months = MONTHS_LATEST_FIRST.slice(1,6);
    const donuts = months.map(m=>donutWidget(m, s.monthly[m].presentPct)).join('');
    return `<tr class="summary-row" data-summary-for="${s.id}"><td colspan="6"><div class="summary-inner">${donuts}<div class="view-more-tile" data-admin-view-more="${s.id}"><div class="icon-circle"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></div><span style="font-size:12.5px;font-weight:700;color:var(--primary)">View More</span></div></div></td></tr>`;
  }

  function renderAttendance() {
    ADMIN_ATTENDANCE_STUDENTS = buildAdminStudents();
    const courses = [...new Set(ADMIN_ATTENDANCE_STUDENTS.map(s=>s.course))];
    
    return `${pageHeader('Attendance Records','All students, listed alphabetically. Click a student to see a quick summary.',`<button class="btn btn-secondary" data-action="export-admin-records">${VeriSync.icons.download} Export CSV</button>`)}
      <div id="listView">
        <article class="card"><div class="card-body">
          <div class="toolbar">
            <div class="search-box">${VeriSync.icons.search}<input id="adminRecordSearch" placeholder="Search student, roll or course"></div>
            <div class="toolbar-group">
              <select class="select" id="adminRecordCourse"><option value="">All courses</option>${courses.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
              <select class="select" id="adminRecordStatus"><option value="">All statuses</option><option value="Regular">Regular</option><option value="Irregular">Irregular</option></select>
            </div>
          </div>
          <div class="table-wrap">
            <table><thead><tr><th>Student</th><th>Course</th><th>Status</th><th>Verification</th><th>Time</th><th>Correction</th></tr></thead>
            <tbody id="adminRecordRows">${ADMIN_ATTENDANCE_STUDENTS.map(adminStudentRow).join('') || VeriSync.tableEmpty('No students found.',6)}</tbody>
            </table>
          </div>
        </div></article>
      </div>
      <div id="detailView" style="display:none;"></div>`;
  }

  function renderAdminMatrix(student, course){
    const head = `<tr><th>Roll</th><th>Month</th>${DAY_COLS.map(d=>`<th>${d}</th>`).join('')}<th>Present</th><th>Conducted</th><th>%</th></tr>`;
    const body = MONTHS_LATEST_FIRST.map(m=>{
      const cells = student.matrix[course][m].map(v=>{
        if (v === '—') return `<td>—</td>`;
        const cls = v==='1'?'p1':v==='0'?'p0':v==='H'?'pH':'pNA';
        return `<td><span class="cell-badge ${cls}">${v}</span></td>`;
      }).join('');
      const stats = student.monthly[m];
      return `<tr><td class="roll-cell">${student.roll}</td><td>${m}</td>${cells}<td><strong>${stats.presentDays}</strong></td><td>${stats.conductedDays}</td><td><strong class="${stats.presentPct<75?'text-danger':'text-success'}">${parseFloat(stats.presentPct.toFixed(2))}%</strong></td></tr>`;
    }).join('');
    return `<thead>${head}</thead><tbody>${body}</tbody>`;
  }

  function showAdminDetail(id) {
    const s = ADMIN_ATTENDANCE_STUDENTS.find(st=>st.id===id);
    if(!s) return;
    
    const courses = Object.keys(s.matrix);
    const donuts = MONTHS_LATEST_FIRST.map(m=>donutWidget(m, s.monthly[m].presentPct)).join('');
    
    const detailHtml = `
      <span class="back-link" id="adminBackToList">&larr; Back to Attendance Records</span>
      <div class="student-strip">
        <div class="avatar" style="background:${s.color}">${VeriSync.initials(s.name)}</div>
        <div><div class="name">${s.name}</div><div class="roll">${s.roll}</div></div>
      </div>
      <div class="letterhead">
        <div class="letterhead-left"><img src="asset/logo.png" alt="College crest"><div><div class="letterhead-name">PATNA WOMEN'S COLLEGE</div><div class="letterhead-sub">Autonomous · Patna University</div><div class="letterhead-dept">MCA Department</div></div></div>
        <div class="info-grid"><div class="k">Name</div><div class="v">: ${s.name}</div><div class="k">Class Roll No</div><div class="v">: ${s.roll.replace(/\D/g,'')}</div><div class="k">Exam Roll No</div><div class="v">: ${s.examRoll}</div><div class="k">Reg No</div><div class="v">: ${s.regNo}</div><div class="k">Session</div><div class="v">: ${s.session}</div><div class="k">Course</div><div class="v">: ${s.classText}</div></div>
        <button class="btn btn-dark" id="adminDownloadCsvBtn">⭳ Download CSV</button>
      </div>
      <div class="section-title">Attendance Record</div>
      <div class="donuts-row">${donuts}</div>
      <div class="card matrix-card">
        <div class="matrix-head"><div><h3>2026 Attendance Matrix</h3><p class="legend">1 = present, 0 = absent, H = holiday, NA = not applicable</p></div><select class="select" id="adminMatrixCourse">${courses.map(c=>`<option value="${c}">${c}</option>`).join('')}</select></div>
        <div class="table-wrap"><table class="matrix-table" id="adminMatrixTable">${renderAdminMatrix(s, courses[0])}</table></div>
      </div>
    `;
    
    document.getElementById('detailView').innerHTML = detailHtml;
    document.getElementById('listView').style.display = 'none';
    document.getElementById('detailView').style.display = 'block';
    window.scrollTo({top:0, behavior:'smooth'});

    document.getElementById('adminMatrixCourse').onchange = (e) => {
      document.getElementById('adminMatrixTable').innerHTML = renderAdminMatrix(s, e.target.value);
    };
    
    document.getElementById('adminDownloadCsvBtn').onclick = () => {
      const course = document.getElementById('adminMatrixCourse').value;
      const headers = ['Roll', 'Month', ...DAY_COLS, 'Present', 'Conducted', '%'];
      const rows = MONTHS_LATEST_FIRST.map(m=>[s.roll, m, ...s.matrix[course][m], s.monthly[m].presentDays, s.monthly[m].conductedDays, parseFloat(s.monthly[m].presentPct.toFixed(2))]);
      VeriSync.exportCSV(`${s.roll}-attendance.csv`, rows.map(r=>headers.reduce((acc,h,idx)=>{acc[h]=r[idx];return acc;},{})));
    };
  }

  function renderCorrections() {
    const db=VeriSync.getDB();
    return `${pageHeader('Attendance Corrections','Final approval remains with the admin to protect official records.',`<button class="btn btn-secondary" data-action="export-corrections">${VeriSync.icons.download} Export Log</button>`)}
      <article class="card"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Course & date</th><th>Requested change</th><th>Reason</th><th>Teacher recommendation</th><th>Status</th><th>Decision</th></tr></thead><tbody>${db.corrections.map(c=>{const s=VeriSync.studentById(db,c.studentId),course=VeriSync.courseById(db,c.courseId);return `<tr><td>${VeriSync.userCell(s?.name||'Student',s?.roll||'')}</td><td><strong>${course?.code||'—'}</strong><br><span class="text-muted">${VeriSync.formatDate(c.date)}</span></td><td>${c.current} → <strong>${c.requested}</strong></td><td style="max-width:260px">${VeriSync.escapeHTML(c.reason)}</td><td>${VeriSync.statusBadge(c.teacherRecommendation)}</td><td>${VeriSync.statusBadge(c.status)}</td><td><div class="flex gap-1"><button class="btn btn-success btn-sm" data-correction-approve="${c.id}" ${c.adminDecision!=='Pending'?'disabled':''}>Approve</button><button class="btn btn-danger btn-sm" data-correction-reject="${c.id}" ${c.adminDecision!=='Pending'?'disabled':''}>Reject</button></div></td></tr>`}).join('')}</tbody></table></div></div></article>`;
  }

  function renderSheets() {
    const db=VeriSync.getDB();
    const course=db.courses[0];
    const matrix=VeriSync.monthlyMatrix(db,course.id,db.students,2026,6);
    return `${pageHeader('Monthly Attendance Sheets','Rows are students, columns are calendar dates and totals use conducted classes only.',`<button class="btn btn-secondary" id="exportSheetBtn">${VeriSync.icons.download} Download CSV</button>`)}
      <article class="card"><div class="card-header"><div><h3>July 2026 · ${course.name}</h3><p>H = holiday, NA = before teaching start, 1 = present, 0 = absent</p></div><select class="select" id="sheetCourse" style="width:auto">${db.courses.map(c=>`<option value="${c.id}" ${c.id===course.id?'selected':''}>${c.code}</option>`).join('')}</select></div><div class="card-body"><div class="table-wrap"><table class="attendance-matrix"><thead><tr><th style="min-width:84px">Roll</th><th style="min-width:180px">Student</th>${Array.from({length:31},(_,i)=>`<th>${String(i+1).padStart(2,'0')}</th>`).join('')}<th>Present</th><th>Conducted</th><th>%</th></tr></thead><tbody id="sheetRows">${sheetRows(matrix)}</tbody></table></div></div></article>`;
  }

  function sheetRows(matrix){
    return matrix.map(row=>`<tr><td>${row.student.roll}</td><td><strong>${VeriSync.escapeHTML(row.student.name)}</strong></td>${row.values.map(v=>{const cls=v===1?'att-present':v===0?'att-absent':v==='H'?'att-holiday':v==='C'?'att-cancelled':'att-na';return `<td><span class="att-cell ${cls}">${v}</span></td>`}).join('')}<td><strong>${row.present}</strong></td><td>${row.conducted}</td><td><strong class="${row.percentage<75?'text-danger':'text-success'}">${row.percentage}%</strong></td></tr>`).join('');
  }

  function renderHolidays() {
    const db=VeriSync.getDB();
    return `${pageHeader('Holidays & Non-working Days','Holidays are excluded from the attendance denominator automatically.',`<button class="btn btn-primary" data-action="add-holiday">${VeriSync.icons.plus} Add Holiday</button>`)}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Holiday records</h3><p>Official calendar rules</p></div></div><div class="card-body"><div class="list">${db.holidays.map(h=>`<div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.holiday}</span><div><p class="list-title">${VeriSync.escapeHTML(h.name)}</p><p class="list-subtitle">${VeriSync.formatDate(h.start)}${h.end!==h.start?` – ${VeriSync.formatDate(h.end)}`:''} · ${h.type}</p></div></div><div class="flex gap-1">${VeriSync.statusBadge(h.status)}<button class="icon-button" data-delete-holiday="${h.id}">${VeriSync.icons.trash}</button></div></div>`).join('')}</div></div></article>
      <article class="card"><div class="card-header"><div><h3>Attendance behaviour</h3><p>How calendar exceptions affect calculations</p></div></div><div class="card-body"><div class="verification-steps"><div class="verify-step complete"><span class="step-number">H</span><div><strong>Holiday</strong><div class="text-muted">Excluded from conducted classes and percentage.</div></div></div><div class="verify-step"><span class="step-number">C</span><div><strong>Cancelled class</strong><div class="text-muted">Excluded after authorised cancellation.</div></div></div><div class="verify-step"><span class="step-number">NA</span><div><strong>Not applicable</strong><div class="text-muted">Used before semester or teaching start.</div></div></div><div class="verify-step"><span class="step-number">1</span><div><strong>Special working day</strong><div class="text-muted">Attendance can be conducted even on a normal weekly off.</div></div></div></div></div></article></div>`;
  }

  function renderReports() {
    const db=VeriSync.getDB();
    const sorted=[...db.students].sort((a,b)=>a.attendance-b.attendance);
    return `${pageHeader('Reports & Analytics','Attendance health, low-attendance risk and course-level performance.',`<button class="btn btn-secondary" data-action="export-report">${VeriSync.icons.download} Export Summary</button>`)}
      <div class="grid grid-2"><article class="card chart-card"><div class="card-header"><div><h3>Subject-wise attendance</h3><p>Average percentage by active course</p></div></div><div class="card-body"><canvas id="adminBarChart"></canvas></div></article><article class="card"><div class="card-header"><div><h3>Attendance categories</h3><p>Configured threshold: ${db.settings.attendanceThreshold}%</p></div></div><div class="card-body"><div class="donut-wrap"><div class="donut-visual"><div class="donut" style="--value:${Math.round(db.students.filter(s=>s.attendance>=75).length/db.students.length*100)};--donut-color:var(--success);position:relative"><div class="donut-label"><strong>${db.students.filter(s=>s.attendance>=75).length}</strong><span>safe students</span></div></div></div><div class="legend"><div class="legend-item"><span class="legend-label"><span class="legend-swatch" style="background:var(--success)"></span>Good (≥75%)</span><strong>${db.students.filter(s=>s.attendance>=75).length}</strong></div><div class="legend-item"><span class="legend-label"><span class="legend-swatch" style="background:var(--warning)"></span>Warning (65–74.99%)</span><strong>${db.students.filter(s=>s.attendance>=65&&s.attendance<75).length}</strong></div><div class="legend-item"><span class="legend-label"><span class="legend-swatch" style="background:var(--danger)"></span>Critical (&lt;65%)</span><strong>${db.students.filter(s=>s.attendance<65).length}</strong></div></div></div></div></article></div>
      <article class="card mt-3"><div class="card-header"><div><h3>Lowest attendance students</h3><p>Priority review list</p></div></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Roll</th><th>Attendance</th><th>Risk category</th><th>Face status</th></tr></thead><tbody>${sorted.slice(0,8).map(s=>`<tr><td>${VeriSync.userCell(s.name,s.email)}</td><td>${s.roll}</td><td><strong>${s.attendance}%</strong></td><td>${VeriSync.statusBadge(s.attendance>=75?'Good':s.attendance>=65?'Warning':'Critical')}</td><td>${VeriSync.statusBadge(s.faceStatus)}</td></tr>`).join('')}</tbody></table></div></div></article>`;
  }

  function renderSecurity() {
    const db=VeriSync.getDB();
    return `${pageHeader('Security & Audit','Review sensitive actions, verification events and access history.',`<button class="btn btn-secondary" data-action="export-audit">${VeriSync.icons.download} Export Audit</button>`)}
      <div class="stats-grid">${VeriSync.statCard('Failed sign-ins',3,'Last 24 hours','lock')}${VeriSync.statCard('Face mismatches',2,'Marked for review','profile')}${VeriSync.statCard('Invalid QR attempts',1,'Expired token','qr')}${VeriSync.statCard('Active sessions',6,'Across all roles','shield')}</div>
      <article class="card"><div class="card-header"><div><h3>Audit log</h3><p>Sensitive actions are retained and not editable</p></div></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Action</th><th>Target</th><th>Date & time</th><th>Result</th></tr></thead><tbody>${db.auditLogs.map(l=>`<tr><td><strong>${l.user}</strong></td><td>${VeriSync.statusBadge(l.role)}</td><td>${l.action}</td><td>${l.target}</td><td>${l.time}</td><td>${VeriSync.statusBadge(l.result)}</td></tr>`).join('')}</tbody></table></div></div></article>`;
  }

  function renderSettings() {
    const s=VeriSync.getDB().settings;
    return `${pageHeader('System Settings','Configure attendance rules used across all portals.',`<button class="btn btn-primary" id="saveSettingsBtn">${VeriSync.icons.check} Save Settings</button>`)}
      <form id="settingsForm" class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Attendance policy</h3><p>Calculation and session rules</p></div></div><div class="card-body"><div class="form-grid">
        <div class="form-group"><label class="form-label">Minimum attendance %</label><input class="input" type="number" name="attendanceThreshold" value="${s.attendanceThreshold}" min="1" max="100"></div><div class="form-group"><label class="form-label">Default window (minutes)</label><input class="input" type="number" name="defaultAttendanceWindow" value="${s.defaultAttendanceWindow}" min="1" max="60"></div><div class="form-group"><label class="form-label">QR refresh (seconds)</label><input class="input" type="number" name="qrRefreshSeconds" value="${s.qrRefreshSeconds}" min="5" max="60"></div><div class="form-group"><label class="form-label">Correction deadline (hours)</label><input class="input" type="number" name="correctionDeadlineHours" value="${s.correctionDeadlineHours}" min="1"></div>
      </div></div></article><article class="card"><div class="card-header"><div><h3>Verification & notifications</h3><p>Frontend controls representing production policy</p></div></div><div class="card-body"><div class="form-group"><label class="form-label">Face match threshold</label><input class="input" type="number" name="faceMatchThreshold" value="${s.faceMatchThreshold}" min="50" max="100"><span class="form-hint">Production value should be selected after model validation.</span></div><div class="setting-row"><div><h4>Email notifications</h4><p>Send verification and attendance alerts.</p></div><label class="switch"><input type="checkbox" name="emailNotifications" ${s.emailNotifications?'checked':''}><span class="switch-slider"></span></label></div><div class="setting-row"><div><h4>Security alerts</h4><p>Flag suspicious face, QR and device attempts.</p></div><label class="switch"><input type="checkbox" name="securityAlerts" ${s.securityAlerts?'checked':''}><span class="switch-slider"></span></label></div></div></article></form>
      <article class="card mt-3"><div class="card-header"><div><h3>Demo data controls</h3><p>Restore the original frontend sample database</p></div></div><div class="card-body"><button class="btn btn-danger" id="resetDemoBtn">Reset all demo data</button></div></article>`;
  }

  function teacherForm(t={}) {
    return `<form id="teacherForm" class="form-grid"><input type="hidden" name="id" value="${t.id||''}"><div class="form-group full"><label class="form-label">Full name</label><input class="input" name="name" value="${t.name||''}" required></div><div class="form-group"><label class="form-label">Employee ID</label><input class="input" name="employeeId" value="${t.employeeId||''}" required></div><div class="form-group"><label class="form-label">Official email</label><input class="input" type="email" name="email" value="${t.email||''}" required></div><div class="form-group"><label class="form-label">Phone</label><input class="input" name="phone" value="${t.phone||''}" required></div><div class="form-group"><label class="form-label">Designation</label><select class="select" name="designation"><option ${t.designation==='Assistant Professor'?'selected':''}>Assistant Professor</option><option ${t.designation==='Associate Professor'?'selected':''}>Associate Professor</option><option ${t.designation==='Professor'?'selected':''}>Professor</option></select></div><div class="form-group full"><label class="form-label">Department</label><select class="select" name="department"><option>Computer Applications</option></select></div></form>`;
  }

  function subjectForm(s={}) {
    return `<form id="subjectForm" class="form-grid"><input type="hidden" name="id" value="${s.id||''}"><div class="form-group full"><label class="form-label">Subject name</label><input class="input" name="name" value="${s.name||''}" required></div><div class="form-group"><label class="form-label">Subject code</label><input class="input" name="code" value="${s.code||''}" required></div><div class="form-group"><label class="form-label">Semester</label><select class="select" name="semester"><option ${s.semester==='III'?'selected':''}>III</option><option ${s.semester==='IV'?'selected':''}>IV</option></select></div><div class="form-group"><label class="form-label">Type</label><select class="select" name="type"><option ${s.type==='Core'?'selected':''}>Core</option><option ${s.type==='Elective'?'selected':''}>Elective</option><option ${s.type==='Laboratory'?'selected':''}>Laboratory</option></select></div><div class="form-group"><label class="form-label">Credits</label><input class="input" type="number" name="credits" value="${s.credits||4}" min="1"></div><div class="form-group"><label class="form-label">Weekly classes</label><input class="input" type="number" name="weeklyClasses" value="${s.weeklyClasses||4}" min="1"></div></form>`;
  }

  function studentForm(s={}) {
    return `<form id="studentForm" class="form-grid"><input type="hidden" name="id" value="${s.id||''}"><div class="form-group full"><label class="form-label">Full name</label><input class="input" name="name" value="${s.name||''}" required></div><div class="form-group"><label class="form-label">Roll number</label><input class="input" name="roll" value="${s.roll||''}" required></div><div class="form-group"><label class="form-label">Email</label><input class="input" type="email" name="email" value="${s.email||''}" required></div><div class="form-group"><label class="form-label">Phone</label><input class="input" name="phone" value="${s.phone||''}" required></div><div class="form-group"><label class="form-label">Semester</label><select class="select" name="semester"><option>IV</option></select></div><div class="form-group"><label class="form-label">Section</label><select class="select" name="section"><option>A</option></select></div></form>`;
  }

  function openTeacherModal(t=null){VeriSync.openModal({title:t?'Edit Teacher':'Add Teacher',body:teacherForm(t||{}),footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="saveTeacher">Save Teacher</button>`,onOpen(modal){modal.querySelector('#saveTeacher').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#teacherForm')));VeriSync.updateDB(db=>{if(data.id){Object.assign(db.teachers.find(x=>x.id===data.id),data);}else{db.teachers.push({...data,id:VeriSync.uid('tch'),subjects:[],status:'Pending',verified:false,lastLogin:'Never'});}return db;});VeriSync.closeModal();VeriSync.showToast('Teacher saved','Faculty record was updated.');portal.showView('teachers',false);};}});}
  function openSubjectModal(s=null){VeriSync.openModal({title:s?'Edit Subject':'Add Subject',body:subjectForm(s||{}),footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="saveSubject">Save Subject</button>`,onOpen(modal){modal.querySelector('#saveSubject').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#subjectForm')));data.credits=Number(data.credits);data.weeklyClasses=Number(data.weeklyClasses);VeriSync.updateDB(db=>{if(data.id){Object.assign(db.subjects.find(x=>x.id===data.id),data);}else{db.subjects.push({...data,id:VeriSync.uid('sub'),status:'Active'});}return db;});VeriSync.closeModal();VeriSync.showToast('Subject saved','Official subject master was updated.');portal.showView('subjects',false);};}});}
  function openStudentModal(s=null){VeriSync.openModal({title:s?'Edit Student':'Add Student',body:studentForm(s||{}),footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="saveStudent">Save Student</button>`,onOpen(modal){modal.querySelector('#saveStudent').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#studentForm')));VeriSync.updateDB(db=>{if(data.id){Object.assign(db.students.find(x=>x.id===data.id),data);}else{db.students.push({...data,id:VeriSync.uid('stu'),department:'Computer Applications',programme:'MCA',session:db.college.currentSession,year:'Second Year',attendance:0,faceStatus:'Pending',status:'Pending Approval'});}return db;});VeriSync.closeModal();VeriSync.showToast('Student saved','Authorised student record was updated.');portal.showView('students',false);};}});}

  function openAuthorizationModal(){
    const db=VeriSync.getDB();
    VeriSync.openModal({title:'Generate Course Authorisation',body:`<form id="authForm" class="form-grid"><div class="form-group full"><label class="form-label">Teacher</label><select class="select" name="teacherId">${db.teachers.filter(t=>t.status==='Active').map(t=>`<option value="${t.id}">${t.name} · ${t.employeeId}</option>`).join('')}</select></div><div class="form-group full"><label class="form-label">Assigned subject</label><select class="select" name="subjectId">${db.subjects.map(s=>`<option value="${s.id}">${s.name} · ${s.code}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Session</label><input class="input" name="session" value="${db.college.currentSession}" readonly></div><div class="form-group"><label class="form-label">Semester</label><input class="input" name="semester" value="${db.college.currentSemester}" readonly></div><div class="form-group"><label class="form-label">Section</label><input class="input" name="section" value="A" readonly></div><div class="form-group"><label class="form-label">Expiry</label><input class="input" type="date" name="expires" value="2026-08-31"></div><div class="form-group full"><label class="form-label">Generated code</label><div class="code-box"><span id="generatedAuthCode">${VeriSync.randomCode(10)}</span><button type="button" class="btn btn-secondary btn-sm" id="regenerateCode">Regenerate</button></div></div></form>`,footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="saveAuth">Generate & Activate</button>`,onOpen(modal){const code=()=>modal.querySelector('#generatedAuthCode').textContent;modal.querySelector('#regenerateCode').onclick=()=>modal.querySelector('#generatedAuthCode').textContent=VeriSync.randomCode(10);modal.querySelector('#saveAuth').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#authForm')));VeriSync.updateDB(db2=>{db2.authorizations.push({...data,id:VeriSync.uid('auth'),code:code(),status:'Active'});db2.auditLogs.unshift({id:VeriSync.uid('log'),user:user.name,role:'Admin',action:'Generated course authorization',target:VeriSync.subjectById(db2,data.subjectId)?.name||'Subject',time:new Date().toLocaleString('en-IN'),result:'Success'});return db2;});VeriSync.copyText(code());VeriSync.closeModal();VeriSync.showToast('Authorisation generated','The secure code is active and copied.');portal.showView('authorizations',false);};}});
  }

  function openAssignmentModal(){
    const db=VeriSync.getDB();
    VeriSync.openModal({title:'Assign Subject to Teacher',body:`<form id="assignmentForm" class="form-grid"><div class="form-group full"><label class="form-label">Teacher</label><select class="select" name="teacherId">${db.teachers.map(t=>`<option value="${t.id}">${t.name}</option>`).join('')}</select></div><div class="form-group full"><label class="form-label">Subject</label><select class="select" name="subjectId">${db.subjects.map(s=>`<option value="${s.id}">${s.name} · ${s.code}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Session</label><input class="input" name="session" value="${db.college.currentSession}" readonly></div><div class="form-group"><label class="form-label">Semester</label><input class="input" name="semester" value="${db.college.currentSemester}" readonly></div><div class="form-group"><label class="form-label">Section</label><input class="input" name="section" value="A"></div><div class="form-group"><label class="form-label">Role</label><select class="select" name="role"><option>Primary Teacher</option><option>Co-teacher</option><option>Substitute Teacher</option><option>Laboratory Instructor</option></select></div></form>`,footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="saveAssignment">Assign Subject</button>`,onOpen(modal){modal.querySelector('#saveAssignment').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#assignmentForm')));VeriSync.updateDB(db2=>{if(!db2.assignments.some(a=>a.teacherId===data.teacherId&&a.subjectId===data.subjectId&&a.section===data.section)){db2.assignments.push({...data,id:VeriSync.uid('asg')});const teacher=db2.teachers.find(t=>t.id===data.teacherId),subject=db2.subjects.find(s=>s.id===data.subjectId);if(teacher&&!teacher.subjects.includes(subject.name))teacher.subjects.push(subject.name);}return db2;});VeriSync.closeModal();VeriSync.showToast('Subject assigned','Teacher assignment is now active.');portal.showView('assignments',false);};}});
  }

  function openHolidayModal(){VeriSync.openModal({title:'Add Holiday or Vacation',body:`<form id="holidayForm" class="form-grid"><div class="form-group full"><label class="form-label">Name</label><input class="input" name="name" required></div><div class="form-group"><label class="form-label">Start date</label><input class="input" type="date" name="start" required></div><div class="form-group"><label class="form-label">End date</label><input class="input" type="date" name="end" required></div><div class="form-group"><label class="form-label">Type</label><select class="select" name="type"><option>National Holiday</option><option>College Holiday</option><option>Department Holiday</option><option>Vacation</option><option>Emergency Closure</option></select></div><div class="form-group"><label class="form-label">Applies to</label><select class="select" name="appliesTo"><option>All</option><option>MCA</option><option>MCA Second Year</option></select></div></form>`,footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="saveHoliday">Add Holiday</button>`,onOpen(modal){modal.querySelector('#saveHoliday').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#holidayForm')));if(!data.name||!data.start||!data.end)return VeriSync.showToast('Complete required fields','Name and dates are required.','error');VeriSync.updateDB(db=>{db.holidays.push({...data,id:VeriSync.uid('hol'),status:'Active'});return db;});VeriSync.closeModal();VeriSync.showToast('Holiday added','Attendance calculations will exclude these dates.');portal.showView('holidays',false);};}});}

  document.addEventListener('click', async event => {
    const navEl=event.target.closest('[data-nav]'); if(navEl) return portal.showView(navEl.dataset.nav);
    if(event.target.closest('[data-action="quick-auth"]')) return openAuthorizationModal();
    if(event.target.closest('[data-action="add-teacher"]')) return openTeacherModal();
    if(event.target.closest('[data-action="add-subject"]')) return openSubjectModal();
    if(event.target.closest('[data-action="add-student"]')) return openStudentModal();
    if(event.target.closest('[data-action="add-assignment"]')) return openAssignmentModal();
    if(event.target.closest('[data-action="add-holiday"]')) return openHolidayModal();
    const editT=event.target.closest('[data-edit-teacher]'); if(editT) return openTeacherModal(VeriSync.getDB().teachers.find(t=>t.id===editT.dataset.editTeacher));
    const editS=event.target.closest('[data-edit-subject]'); if(editS) return openSubjectModal(VeriSync.getDB().subjects.find(s=>s.id===editS.dataset.editSubject));
    const editStu=event.target.closest('[data-edit-student]'); if(editStu) return openStudentModal(VeriSync.getDB().students.find(s=>s.id===editStu.dataset.editStudent));
    const viewStu=event.target.closest('[data-view-student]'); if(viewStu){const s=VeriSync.getDB().students.find(x=>x.id===viewStu.dataset.viewStudent);return VeriSync.openModal({title:'Student Attendance Profile',large:true,body:`<div class="profile-hero"><div class="profile-identity"><span class="avatar lg">${VeriSync.initials(s.name)}</span><div><h2>${s.name}</h2><p>${s.roll} · MCA ${s.semester} · Section ${s.section}</p></div></div></div><div class="detail-grid mt-3"><div class="detail-item"><span>Email</span><strong>${s.email}</strong></div><div class="detail-item"><span>Face status</span><strong>${s.faceStatus}</strong></div><div class="detail-item"><span>Overall attendance</span><strong>${s.attendance}%</strong></div></div>`});}
    const toggleT=event.target.closest('[data-toggle-teacher]'); if(toggleT){VeriSync.updateDB(db=>{const t=db.teachers.find(x=>x.id===toggleT.dataset.toggleTeacher);t.status=t.status==='Active'?'Inactive':'Active';return db;});VeriSync.showToast('Teacher status changed','Historical records remain preserved.');return portal.showView('teachers',false);}
    const removeA=event.target.closest('[data-remove-assignment]'); if(removeA&&await VeriSync.confirmDialog('Remove assignment?','The teacher will no longer be authorised for this subject.','Remove')){VeriSync.updateDB(db=>{db.assignments=db.assignments.filter(a=>a.id!==removeA.dataset.removeAssignment);return db;});return portal.showView('assignments',false);}
    const copy=event.target.closest('[data-copy-code]'); if(copy) return VeriSync.copyText(copy.dataset.copyCode);
    const toggleAuth=event.target.closest('[data-toggle-auth]'); if(toggleAuth){VeriSync.updateDB(db=>{const a=db.authorizations.find(x=>x.id===toggleAuth.dataset.toggleAuth);if(a.status==='Active')a.status='Revoked';else{a.status='Active';a.code=VeriSync.randomCode(10);}return db;});return portal.showView('authorizations',false);}
    const courseStatus=event.target.closest('[data-course-status]'); if(courseStatus){VeriSync.updateDB(db=>{const c=db.courses.find(x=>x.id===courseStatus.dataset.courseStatus);c.status=c.status==='Active'?'Suspended':'Active';return db;});return portal.showView('courses',false);}
    const courseAdmin=event.target.closest('[data-course-admin]'); if(courseAdmin){const db=VeriSync.getDB(),c=VeriSync.courseById(db,courseAdmin.dataset.courseAdmin),t=VeriSync.teacherById(db,c.teacherId);return VeriSync.openModal({title:'Course Details',large:true,body:`<div class="course-classroom-hero"><div><h2>${c.name}</h2><p>${c.code} · ${c.session} · Semester ${c.semester} · Section ${c.section}</p></div></div><div class="detail-grid mt-3"><div class="detail-item"><span>Teacher</span><strong>${t.name}</strong></div><div class="detail-item"><span>Enrolled students</span><strong>${c.students}</strong></div><div class="detail-item"><span>Status</span><strong>${c.status}</strong></div></div>`});}
    const approve=event.target.closest('[data-correction-approve]'); if(approve){VeriSync.updateDB(db=>{const c=db.corrections.find(x=>x.id===approve.dataset.correctionApprove);c.adminDecision='Approved';c.status='Approved';return db;});VeriSync.showToast('Correction approved','The official record can now be updated by the backend workflow.');return portal.showView('corrections',false);}
    const reject=event.target.closest('[data-correction-reject]'); if(reject){VeriSync.updateDB(db=>{const c=db.corrections.find(x=>x.id===reject.dataset.correctionReject);c.adminDecision='Rejected';c.status='Rejected';return db;});VeriSync.showToast('Correction rejected','The decision was recorded in the correction history.');return portal.showView('corrections',false);}
    const delHol=event.target.closest('[data-delete-holiday]'); if(delHol&&await VeriSync.confirmDialog('Delete holiday?','This will remove the calendar exception from the demo data.','Delete')){VeriSync.updateDB(db=>{db.holidays=db.holidays.filter(h=>h.id!==delHol.dataset.deleteHoliday);return db;});return portal.showView('holidays',false);}
    if(event.target.closest('[data-action="import-students"]')) return VeriSync.showToast('CSV import preview','This frontend MVP represents file import without uploading data to a server.');
    if(event.target.closest('[data-action="export-teachers"]')){const db=VeriSync.getDB();return VeriSync.exportCSV('verisync-teachers.csv',db.teachers.map(t=>({Name:t.name,'Employee ID':t.employeeId,Email:t.email,Department:t.department,Status:t.status})));}
    if(event.target.closest('[data-action="export-students"]')){const db=VeriSync.getDB();return VeriSync.exportCSV('verisync-students.csv',db.students.map(s=>({Roll:s.roll,Name:s.name,Email:s.email,Semester:s.semester,Section:s.section,'Face Status':s.faceStatus,Attendance:s.attendance})));}
    if(event.target.closest('[data-action="export-subjects"]')){const db=VeriSync.getDB();return VeriSync.exportCSV('verisync-subjects.csv',db.subjects.map(s=>({Name:s.name,Code:s.code,Semester:s.semester,Type:s.type,Credits:s.credits})));}
    if(event.target.closest('[data-action="export-courses"]')){const db=VeriSync.getDB();return VeriSync.exportCSV('verisync-courses.csv',db.courses.map(c=>({Course:c.name,Code:c.code,Session:c.session,Semester:c.semester,Section:c.section,Students:c.students,Status:c.status})));}
    const adminViewMore = event.target.closest('[data-admin-view-more]');
    if (adminViewMore) return showAdminDetail(adminViewMore.dataset.adminViewMore);
    
    if (event.target.id === 'adminBackToList') {
      document.getElementById('detailView').style.display = 'none';
      document.getElementById('listView').style.display = 'block';
      return;
    }

    const adminAttRow = event.target.closest('[data-admin-att-id]');
    if (adminAttRow) {
      const id = adminAttRow.dataset.adminAttId;
      const existing = document.querySelector('.summary-row');
      const wasOpen = existing && existing.dataset.summaryFor === id;
      if(existing) existing.remove();
      document.querySelectorAll('.student-row.active').forEach(r=>r.classList.remove('active'));
      if(!wasOpen){
        adminAttRow.classList.add('active');
        const student = ADMIN_ATTENDANCE_STUDENTS.find(s=>s.id===id);
        if(student) adminAttRow.insertAdjacentHTML('afterend', adminSummaryRow(student));
      }
      return;
    }
    
    if (event.target.closest('[data-action="export-admin-records"]')) {
      const rows = ADMIN_ATTENDANCE_STUDENTS.map(s=>({Student:s.name, Roll:s.roll, Course:s.course, Status:s.status, Verification:s.verification, Time:s.time}));
      return VeriSync.exportCSV('admin-attendance-records.csv', rows);
    }
    if(event.target.closest('[data-action="export-corrections"]')) return VeriSync.exportCSV('verisync-corrections.csv',VeriSync.getDB().corrections);
    if(event.target.closest('[data-action="export-report"]')) return VeriSync.exportCSV('verisync-attendance-summary.csv',VeriSync.getDB().students.map(s=>({Roll:s.roll,Name:s.name,Attendance:s.attendance,Category:s.attendance>=75?'Good':s.attendance>=65?'Warning':'Critical'})));
    if(event.target.closest('[data-action="export-audit"]')) return VeriSync.exportCSV('verisync-audit-log.csv',VeriSync.getDB().auditLogs);
  });

  document.addEventListener('input', event=>{
    if(event.target.id==='teacherSearch'||event.target.id==='teacherStatus'){const db=VeriSync.getDB(),q=(document.getElementById('teacherSearch')?.value||'').toLowerCase(),status=document.getElementById('teacherStatus')?.value||'';document.getElementById('teacherRows').innerHTML=teacherRows(db.teachers.filter(t=>(!q||[t.name,t.email,t.employeeId].some(v=>v.toLowerCase().includes(q)))&&(!status||t.status===status)));}
    if(event.target.id==='studentSearch'||event.target.id==='faceFilter'){const db=VeriSync.getDB(),q=(document.getElementById('studentSearch')?.value||'').toLowerCase(),face=document.getElementById('faceFilter')?.value||'';document.getElementById('studentRows').innerHTML=studentRows(db.students.filter(s=>(!q||[s.name,s.email,s.roll].some(v=>v.toLowerCase().includes(q)))&&(!face||s.faceStatus===face)));}
    if(event.target.id==='subjectSearch'||event.target.id==='subjectSemester'){const db=VeriSync.getDB(),q=(document.getElementById('subjectSearch')?.value||'').toLowerCase(),sem=document.getElementById('subjectSemester')?.value||'';document.getElementById('subjectRows').innerHTML=subjectRows(db.subjects.filter(s=>(!q||[s.name,s.code].some(v=>v.toLowerCase().includes(q)))&&(!sem||s.semester===sem)));}
    if(event.target.id==='adminRecordSearch'||event.target.id==='adminRecordCourse'||event.target.id==='adminRecordStatus'){
      const q = (document.getElementById('adminRecordSearch')?.value || '').toLowerCase();
      const course = document.getElementById('adminRecordCourse')?.value || '';
      const status = document.getElementById('adminRecordStatus')?.value || '';
      const filtered = ADMIN_ATTENDANCE_STUDENTS.filter(s=>{
        const searchMatch = !q || [s.name, s.roll, s.course].some(v=>v.toLowerCase().includes(q));
        const courseMatch = !course || s.course === course;
        const statusMatch = !status || s.status === status;
        return searchMatch && courseMatch && statusMatch;
      });
      document.getElementById('adminRecordRows').innerHTML = filtered.map(adminStudentRow).join('') || VeriSync.tableEmpty('No students found.',6);
    }
  });

  document.addEventListener('change',event=>{
    if(event.target.id==='sheetCourse'){const db=VeriSync.getDB();document.getElementById('sheetRows').innerHTML=sheetRows(VeriSync.monthlyMatrix(db,event.target.value,db.students,2026,6));}
  });

  document.addEventListener('click',event=>{
    if(event.target.id==='saveCollegeBtn'){const a=Object.fromEntries(new FormData(document.getElementById('collegeForm'))),b=Object.fromEntries(new FormData(document.getElementById('sessionForm')));VeriSync.updateDB(db=>{Object.assign(db.college,a,b,{capacity:Number(a.capacity)});return db;});VeriSync.showToast('Configuration saved','Academic dropdowns now use the updated values.');}
    if(event.target.id==='saveSettingsBtn'){const form=document.getElementById('settingsForm'),d=Object.fromEntries(new FormData(form));['attendanceThreshold','defaultAttendanceWindow','qrRefreshSeconds','correctionDeadlineHours','faceMatchThreshold'].forEach(k=>d[k]=Number(d[k]));d.emailNotifications=form.emailNotifications.checked;d.securityAlerts=form.securityAlerts.checked;VeriSync.updateDB(db=>{Object.assign(db.settings,d);db.college.attendanceThreshold=d.attendanceThreshold;return db;});VeriSync.showToast('Settings saved','Attendance policy was updated across the demo portals.');}
    if(event.target.id==='exportSheetBtn'){const db=VeriSync.getDB(),courseId=document.getElementById('sheetCourse').value,m=VeriSync.monthlyMatrix(db,courseId,db.students,2026,6);VeriSync.exportCSV('verisync-july-2026-sheet.csv',m.map(r=>{const row={Roll:r.student.roll,Name:r.student.name};r.values.forEach((v,i)=>row[String(i+1).padStart(2,'0')]=v);row.Present=r.present;row.Conducted=r.conducted;row.Percentage=r.percentage;return row;}));}
    if(event.target.id==='resetDemoBtn'){VeriSync.confirmDialog('Reset demo data?','All changes made in this browser will be replaced by the original sample data.','Reset').then(ok=>{if(ok){VeriSync.resetDB();VeriSync.setSession(user);location.reload();}});}
  });

  window.afterViewRender = id => {
    if(id==='dashboard') VeriSync.drawLineChart(document.getElementById('adminTrendChart'),['Jul','Aug','Sep','Oct','Nov'],[79,82,84,86,88]);
    if(id==='reports') VeriSync.drawBarChart(document.getElementById('adminBarChart'),['5G','Cloud','IoT','DevSec','Wireless'],[86,81,78,84,79]);
  };
  window.afterViewRender(location.hash.replace('#','')||'dashboard');
  window.addEventListener('resize',()=>window.afterViewRender?.(location.hash.replace('#','')||'dashboard'));
})();
