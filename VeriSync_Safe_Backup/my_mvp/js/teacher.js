'use strict';

(() => {
  const session = VeriSync.requireRole('teacher');
  if (!session) return;
  const db0 = VeriSync.getDB();
  const user = db0.users.teacher;
  document.getElementById('topAvatar').textContent = VeriSync.initials(user.name);
  document.getElementById('topName').textContent = user.name;

  let liveTimer = null;
  let liveRemaining = 0;
  let currentSessionId = null;

  const nav = [
    {section:'Overview',id:'dashboard',label:'Dashboard',icon:'dashboard',subtitle:'Today’s classes and attendance readiness'},
    {section:'Academic',id:'subjects',label:'Assigned Subjects',icon:'book',subtitle:'Subjects authorised by the admin'},
    {section:'Academic',id:'courses',label:'My Courses',icon:'course',subtitle:'Attendance classrooms for assigned subjects'},
    {section:'Academic',id:'create-course',label:'Create Course',icon:'plus',subtitle:'Create a course using an admin authorisation code'},
    {section:'Academic',id:'schedule',label:'Class Schedule',icon:'calendar',subtitle:'Daily and weekly teaching schedule'},
    {section:'Attendance',id:'start-attendance',label:'Start Attendance',icon:'qr',subtitle:'Launch a secure attendance session'},
    {section:'Attendance',id:'live-attendance',label:'Live Attendance',icon:'attendance',subtitle:'Monitor current verification activity'},
    {section:'Attendance',id:'records',label:'Attendance Records',icon:'database',subtitle:'Course and student attendance history'},
    {section:'Attendance',id:'corrections',label:'Correction Requests',icon:'correction',subtitle:'Review and recommend student requests',badge:String(db0.corrections.filter(c=>c.teacherRecommendation==='Pending').length)},
    {section:'Attendance',id:'sheets',label:'Attendance Sheets',icon:'download',subtitle:'Monthly matrices for assigned courses'},
    {section:'Insights',id:'analytics',label:'Reports & Analytics',icon:'chart',subtitle:'Course and student attendance insights'},
    {section:'Account',id:'profile',label:'My Profile',icon:'profile',subtitle:'Faculty identity and role information'},
    {section:'Account',id:'security',label:'Security',icon:'shield',subtitle:'Login activity and account protection'},
    {section:'Account',id:'settings',label:'Settings',icon:'settings',subtitle:'Teacher-side attendance preferences'}
  ];

  const views = {
    dashboard:renderDashboard,subjects:renderSubjects,courses:renderCourses,'create-course':renderCreateCourse,schedule:renderSchedule,
    'start-attendance':renderStartAttendance,'live-attendance':renderLiveAttendance,records:renderRecords,corrections:renderCorrections,
    sheets:renderSheets,analytics:renderAnalytics,profile:renderProfile,security:renderSecurity,settings:renderSettings
  };

  const portal = VeriSync.initPortal({role:'teacher',nav,views,user});

  function pageHeader(title,subtitle,actions=''){return `<div class="page-header"><div class="page-title"><h2>${VeriSync.escapeHTML(title)}</h2><p>${VeriSync.escapeHTML(subtitle)}</p></div><div class="header-actions">${actions}</div></div>`;}
  function teacherAssignments(db){return db.assignments.filter(a=>a.teacherId===user.id);}
  function teacherCourses(db){return db.courses.filter(c=>c.teacherId===user.id);}
  function courseRecords(db,courseIds=teacherCourses(db).map(c=>c.id)){return db.attendanceRecords.filter(r=>courseIds.includes(r.courseId));}

  function renderDashboard(){
    const db=VeriSync.getDB(),courses=teacherCourses(db),assignments=teacherAssignments(db),records=courseRecords(db);
    const present=records.filter(r=>r.status==='Present').length, avg=VeriSync.percentage(present,records.length);
    const pending=db.corrections.filter(c=>courses.some(x=>x.id===c.courseId)&&c.teacherRecommendation==='Pending').length;
    return `${pageHeader('Teacher Dashboard','Your assigned courses and today’s attendance operations.',`<button class="btn btn-primary" data-nav="start-attendance">${VeriSync.icons.qr} Start Attendance</button>`)}
      <div class="stats-grid">
        ${VeriSync.statCard('Assigned subjects',assignments.length,'Admin-authorised subjects','book')}
        ${VeriSync.statCard('Active courses',courses.filter(c=>c.status==='Active').length,`${courses.length} course records`,'course')}
        ${VeriSync.statCard('Average attendance',`${avg}%`,'Across your recorded classes','chart')}
        ${VeriSync.statCard('Pending corrections',pending,'Teacher recommendation required','correction',pending?'trend-down':'trend-up')}
      </div>
      <div class="grid grid-2">
        <article class="card"><div class="card-header"><div><h3>Today’s schedule</h3><p>Attendance actions appear only for authorised classes</p></div><button class="btn btn-ghost btn-sm" data-nav="schedule">View all</button></div><div class="card-body"><div class="list">${db.schedule.filter(s=>courses.some(c=>c.id===s.courseId)).slice(0,4).map(item=>{const c=VeriSync.courseById(db,item.courseId);return `<div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.clock}</span><div><p class="list-title">${c.name}</p><p class="list-subtitle">${VeriSync.formatDate(item.date)} · ${item.start}–${item.end} · ${item.room}</p></div></div><button class="btn btn-soft btn-sm" data-start-course="${c.id}">Start</button></div>`}).join('')||'<div class="empty-state"><p>No classes scheduled.</p></div>'}</div></div></article>
        <article class="card chart-card"><div class="card-header"><div><h3>Weekly attendance trend</h3><p>Average across assigned courses</p></div></div><div class="card-body"><canvas id="teacherTrendChart"></canvas></div></article>
      </div>
      <article class="card mt-3"><div class="card-header"><div><h3>My course classrooms</h3><p>Attendance-focused classroom cards</p></div><button class="btn btn-ghost btn-sm" data-nav="courses">Open courses</button></div><div class="card-body"><div class="course-grid">${courses.slice(0,3).map(c=>VeriSync.courseCard(c,user,null,`<button class="btn btn-soft btn-sm" data-start-course="${c.id}">${VeriSync.icons.qr} Attendance</button>`)).join('')}</div></div></article>`;
  }

  function renderSubjects(){
    const db=VeriSync.getDB(),items=teacherAssignments(db);
    return `${pageHeader('Assigned Subjects','Only subjects assigned by the admin are available for course creation.')}
      <div class="grid grid-3">${items.map(a=>{const s=VeriSync.subjectById(db,a.subjectId);const auth=db.authorizations.find(x=>x.teacherId===user.id&&x.subjectId===s.id);return `<article class="card"><div class="card-body"><span class="list-icon">${VeriSync.icons.book}</span><h3>${s.name}</h3><p class="text-muted">${s.code} · Semester ${s.semester} · ${s.type}</p><div class="detail-grid" style="grid-template-columns:1fr 1fr"><div class="detail-item"><span>Credits</span><strong>${s.credits}</strong></div><div class="detail-item"><span>Role</span><strong>${a.role}</strong></div></div><div class="divider"></div><div class="flex justify-between">${VeriSync.statusBadge(auth?.status||'No Code')}<button class="btn btn-soft btn-sm" data-create-subject="${s.id}">Create Course</button></div></div></article>`}).join('')}</div>`;
  }

  function renderCourses(){
    const db=VeriSync.getDB(),courses=teacherCourses(db);
    return `${pageHeader('My Courses','Course cards are adapted for attendance, schedules, students and analytics only.',`<button class="btn btn-primary" data-nav="create-course">${VeriSync.icons.plus} Create Course</button>`)}<div class="course-grid">${courses.map(c=>VeriSync.courseCard(c,user,null,`<button class="btn btn-ghost btn-sm" data-course-details="${c.id}">${VeriSync.icons.eye} Details</button><button class="btn btn-soft btn-sm" data-start-course="${c.id}">${VeriSync.icons.qr} Start</button>`)).join('')}</div>`;
  }

  function renderCreateCourse(){
    const db=VeriSync.getDB(),assignments=teacherAssignments(db),subjects=assignments.map(a=>VeriSync.subjectById(db,a.subjectId));
    return `${pageHeader('Create Authorised Course','An active admin-issued code is required before the course can be created.')}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Course information</h3><p>Official values are filtered from admin data</p></div></div><div class="card-body"><form id="createCourseForm" class="form-grid">
        <div class="form-group"><label class="form-label">Academic session</label><select class="select" name="session"><option>${db.college.currentSession}</option></select></div>
        <div class="form-group"><label class="form-label">Department</label><select class="select" name="department"><option>${db.college.department}</option></select></div>
        <div class="form-group"><label class="form-label">Year</label><select class="select" name="year"><option>Second Year</option></select></div>
        <div class="form-group"><label class="form-label">Semester</label><select class="select" name="semester"><option>${db.college.currentSemester}</option></select></div>
        <div class="form-group"><label class="form-label">Section</label><select class="select" name="section"><option>A</option></select></div>
        <div class="form-group"><label class="form-label">Assigned subject</label><select class="select" id="courseSubject" name="subjectId">${subjects.map(s=>`<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Subject code</label><input class="input" id="courseCode" value="${subjects[0]?.code||''}" readonly></div>
        <div class="form-group"><label class="form-label">Credits</label><input class="input" id="courseCredits" value="${subjects[0]?.credits||''}" readonly></div>
        <div class="form-group full"><label class="form-label">Course display name</label><input class="input" name="name" value="${subjects[0]?.name||''}" required></div>
        <div class="form-group full"><label class="form-label">Admin authorisation code</label><input class="input" name="authCode" placeholder="Example: Wc7P2kLm9Q" required><span class="form-hint">The code is single-purpose and bound to your account, subject, session, semester and section.</span></div>
        <div class="form-group"><label class="form-label">Course banner</label><select class="select" name="banner"><option value="blue">Blue</option><option value="teal">Teal</option><option value="purple">Purple</option><option value="orange">Orange</option><option value="slate">Slate</option></select></div>
        <div class="form-group"><label class="form-label">Expected students</label><input class="input" type="number" name="students" value="36" min="1" max="50"></div>
      </form></div><div class="card-footer"><button class="btn btn-primary btn-block" id="createCourseBtn">Validate Code & Create Course</button></div></article>
      <article class="card"><div class="card-header"><div><h3>Creation validation</h3><p>Every condition is checked before activation</p></div></div><div class="card-body"><div class="verification-steps"><div class="verify-step complete"><span class="step-number">1</span><div><strong>Verified teacher account</strong><div class="text-muted">${user.email}</div></div></div><div class="verify-step complete"><span class="step-number">2</span><div><strong>Admin subject assignment</strong><div class="text-muted">Only assigned subjects appear.</div></div></div><div class="verify-step"><span class="step-number">3</span><div><strong>Secure code match</strong><div class="text-muted">Teacher, subject, session and section must match.</div></div></div><div class="verify-step"><span class="step-number">4</span><div><strong>Single-use activation</strong><div class="text-muted">Code becomes Used after successful creation.</div></div></div></div><div class="alert warning mt-3"><span>${VeriSync.icons.info}</span><div><h4>Demo code available</h4><p>Wireless Communication uses <strong>Wc7P2kLm9Q</strong> in the seeded frontend data.</p></div></div></div></article></div>`;
  }

  function renderSchedule(){
    const db=VeriSync.getDB(),courseIds=teacherCourses(db).map(c=>c.id),items=db.schedule.filter(s=>courseIds.includes(s.courseId));
    return `${pageHeader('Class Schedule','View authorised classes and start attendance from the correct session.',`<button class="btn btn-secondary" data-export-schedule>${VeriSync.icons.download} Export</button>`)}
      <article class="card"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Time</th><th>Course</th><th>Room</th><th>Type</th><th>Status</th><th>Attendance</th></tr></thead><tbody>${items.map(i=>{const c=VeriSync.courseById(db,i.courseId);return `<tr><td>${VeriSync.formatDate(i.date)}</td><td>${i.start}–${i.end}</td><td><strong>${c.name}</strong><br><span class="text-muted">${c.code}</span></td><td>${i.room}</td><td>${i.type}</td><td>${VeriSync.statusBadge(i.status)}</td><td><button class="btn btn-soft btn-sm" data-start-course="${c.id}">${VeriSync.icons.qr} Start</button></td></tr>`}).join('')}</tbody></table></div></div></article>`;
  }

  function renderStartAttendance(){
    const db=VeriSync.getDB(),courses=teacherCourses(db).filter(c=>c.status==='Active');
    return `${pageHeader('Start Attendance','Create a time-limited class session with dynamic QR and face verification.')}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Session configuration</h3><p>Course and teacher information is validated automatically</p></div></div><div class="card-body"><form id="attendanceSessionForm" class="form-grid">
        <div class="form-group full"><label class="form-label">Course</label><select class="select" name="courseId">${courses.map(c=>`<option value="${c.id}">${c.name} · ${c.code}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Date</label><input class="input" type="date" name="date" value="${VeriSync.todayISO()}"></div>
        <div class="form-group"><label class="form-label">Start time</label><input class="input" type="time" name="start" value="10:00"></div>
        <div class="form-group"><label class="form-label">Attendance window</label><select class="select" name="duration"><option value="5">5 minutes</option><option value="10" selected>10 minutes</option><option value="15">15 minutes</option></select></div>
        <div class="form-group"><label class="form-label">Room</label><input class="input" name="room" value="Room 204"></div>
        <div class="form-group full"><label class="form-label">Verification method</label><select class="select" name="verificationMethod"><option value="face">Attendance Through Face Verification</option><option value="qr">Dynamic QR + Device/Browser Integrity</option><option value="otp">Verification by OTP</option></select></div>
      </form></div><div class="card-footer"><button class="btn btn-primary btn-block" id="launchAttendanceBtn">${VeriSync.icons.qr} Start Attendance Session</button></div></article>
      <article class="card"><div class="card-header"><div><h3>Session security</h3><p>Frontend representation of production controls</p></div></div><div class="card-body"><div class="verification-steps"><div class="verify-step complete"><span class="step-number">✓</span><div><strong>Course-specific</strong><div class="text-muted">Token is bound to one authorised course.</div></div></div><div class="verify-step complete"><span class="step-number">✓</span><div><strong>Time-limited</strong><div class="text-muted">Session expires after the selected window.</div></div></div><div class="verify-step complete"><span class="step-number">✓</span><div><strong>Dynamic refresh</strong><div class="text-muted">QR representation refreshes every ${db.settings.qrRefreshSeconds} seconds.</div></div></div><div class="verify-step complete"><span class="step-number">✓</span><div><strong>Face and device checks</strong><div class="text-muted">Required before Present is recorded.</div></div></div></div></div></article></div>`;
  }

  function renderLiveAttendance(){
    const db=VeriSync.getDB();
    const live=db.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live')||db.attendanceSessions.find(s=>s.status==='Live');
    if(!live) return `${pageHeader('Live Attendance','Monitor active student verification activity.')}<article class="card"><div class="empty-state"><div class="empty-icon">${VeriSync.icons.qr}</div><h3>No active attendance session</h3><p>Start a new attendance session for one of your authorised courses.</p><button class="btn btn-primary" data-nav="start-attendance">Start Attendance</button></div></article>`;
    const course=VeriSync.courseById(db,live.courseId);const students=db.students.slice(0,live.total);const presentCount=live.present||0;
    const leftPanel = live.method === 'face' ? `<article class="card qr-panel"><h3>Face Verification</h3><p class="text-muted">Scanning for enrolled faces</p><div class="webcam-container scanner-mode" style="margin: 1rem 0; height: 240px; border-radius: 12px; overflow: hidden;"><video id="teacherWebcamInline" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover;"></video><div class="webcam-overlay"><div class="face-guide"></div><div class="scan-line" id="teacherScanLine"></div><div id="detectionBoxesInline"></div></div></div><div class="countdown">Session closes in <strong id="liveCountdown">${Math.floor(liveRemaining/60)}:${String(liveRemaining%60).padStart(2,'0')}</strong></div></article>` : (live.method === 'otp' ? `<article class="card qr-panel"><h3>OTP Verification</h3><p class="text-muted">Students verify attendance via email OTP.</p><div class="session-code" id="liveToken">${live.token}</div><div class="countdown">Session closes in <strong id="liveCountdown">${Math.floor(liveRemaining/60)}:${String(liveRemaining%60).padStart(2,'0')}</strong></div><button class="btn btn-primary btn-block mt-3" onclick="VeriSync.showToast('Mailing Service', 'OTP Emails triggered via Nodemailer (Mock)', 'success')">Trigger Nodemailer OTP Emails</button></article>` : `<article class="card qr-panel"><h3>Dynamic attendance QR</h3><p class="text-muted">Refreshes automatically during the active window</p><div class="qr-code" id="liveQR"></div><div class="session-code" id="liveToken">${live.token}</div><div class="countdown">Session closes in <strong id="liveCountdown">${Math.floor(liveRemaining/60)}:${String(liveRemaining%60).padStart(2,'0')}</strong></div><button class="btn btn-primary btn-block mt-3" id="startTeacherFaceScanner">${VeriSync.icons.profile} Scan Class Faces</button></article>`);
    return `${pageHeader('Live Attendance',`${course.name} · ${course.code}`,`<button class="btn btn-danger" id="closeLiveSession">Close Session</button>`)}
      <div class="live-session">${leftPanel}
      <article class="card"><div class="card-header"><div><h3>Live verification list</h3><p><span id="livePresentCount">${presentCount}</span> of ${live.total} students verified</p></div><span class="badge badge-success">Live</span></div><div class="card-body"><div class="kpi-row"><div class="kpi-mini"><span>Present</span><strong id="presentKpi">${presentCount}</strong></div><div class="kpi-mini"><span>Pending</span><strong id="pendingKpi">${Math.max(0,live.total-presentCount)}</strong></div><div class="kpi-mini"><span>Warnings</span><strong>1</strong></div></div><div class="table-wrap mt-3"><table><thead><tr><th>Student</th><th>Face</th><th>QR</th><th>Device</th><th>Status</th><th>Time</th></tr></thead><tbody id="liveStudentRows">${students.map((s,i)=>{const p=i<presentCount;return `<tr><td>${VeriSync.userCell(s.name,s.roll)}</td><td>${VeriSync.statusBadge(p?'Verified':'Pending')}</td><td>${VeriSync.statusBadge(p?'Valid':'Waiting')}</td><td>${VeriSync.statusBadge(p?'Valid':'Waiting')}</td><td>${VeriSync.attendanceStatusBadge(p?'Present':'Pending Review')}</td><td>${p?`10:${String(i+1).padStart(2,'0')}`:'—'}</td></tr>`}).join('')}</tbody></table></div></div></article></div>`;
  }

  const MONTHS_LATEST_FIRST = ['July','June','May','April','March','February','January'];
  const MONTH_INDEXES = [6, 5, 4, 3, 2, 1, 0];
  const DAY_COLS = Array.from({length:30}, (_,i)=>String(i+1).padStart(2,'0')); // 01..30
  const AVATAR_COLORS = ['#2F6F5E','#B4517A','#5B6FD6','#C77B3B','#3F8FBF','#7A5FBF','#4E8B5A'];

  let TEACHER_ATTENDANCE_STUDENTS = [];

  function buildTeacherStudents() {
    const db = VeriSync.getDB();
    const studentsList = [];
    let colorIndex = 0;
    
    // Only process courses assigned to this teacher
    const myCourses = teacherCourses(db);

    const courseIds = myCourses.map(c => c.id);
    const records = db.attendanceRecords.filter(r => courseIds.includes(r.courseId));

    db.students.forEach(student => {
      myCourses.forEach(course => {
        const studentRecords = records.filter(r => r.studentId === student.id && r.courseId === course.id);
        if (studentRecords.length === 0) return;
        
        const latestRecord = [...studentRecords].sort((a,b) => b.date.localeCompare(a.date))[0];
        const correctionRequested = db.corrections.some(c => c.studentId === student.id && c.courseId === course.id && c.teacherRecommendation === 'Pending');

        const matrix = { [course.code]: {} };
        const monthly = {};
        
        MONTHS_LATEST_FIRST.forEach((m, i) => {
          const seedPresent = student.attendance || 75;
          const present = Math.max(55, Math.min(97, seedPresent + (i*4 % 15) - 6));
          monthly[m] = { present, absent: 100 - present };
          
          matrix[course.code][m] = DAY_COLS.map(d=>{
            if(d === '07' || d === '21') return 'H';
            return Math.random()*100 < present ? '1' : '0';
          });
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
    return `
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="#9775FA" stroke-width="${sw}"/>
        <circle cx="50" cy="50" r="${r}" fill="none" stroke="#4C6EF5" stroke-width="${sw}"
          stroke-dasharray="${presentLen} ${c-presentLen}" stroke-dashoffset="${c*0.25}" stroke-linecap="round"/>
      </svg>`;
  }

  function donutWidget(monthLabel, present){
    const p = parseFloat(present).toFixed(2);
    const a = parseFloat(100 - present).toFixed(2);
    return `
      <div class="donut-widget">
        <div class="tag absent">Absent<br><span class="pct">${a}%</span></div>
        <div class="ring-wrap">
          ${donutSVG(present)}
          <span class="month-label">${monthLabel.slice(0,3)}</span>
        </div>
        <div class="tag present">Present<br><span class="pct">${p}%</span></div>
      </div>`;
  }

  function statusBadge(status){
    const cls = status === 'Regular' ? 'regular' : 'irregular';
    return `<span class="badge ${cls}"><span class="badge-dot"></span>${status}</span>`;
  }

  function correctionCell(student){
    return student.correctionRequested
      ? statusBadge('Regular').replace('Regular','Pending').replace('regular','irregular')
      : `<button class="btn btn-ghost btn-sm" data-request-correction="${student.id}" onclick="event.stopPropagation()">Request</button>`;
  }

  function teacherStudentRow(s){
    return `
      <tr class="student-row" data-teacher-att-id="${s.id}">
        <td>
          <div class="user-cell">
            <div class="avatar" style="background:${s.color}">${VeriSync.initials(s.name)}</div>
            <div>
              <div class="name">${s.name}</div>
              <div class="roll">${s.roll}</div>
            </div>
          </div>
        </td>
        <td><strong>${s.course}</strong></td>
        <td>${statusBadge(s.status)}</td>
        <td>${s.verification}</td>
        <td>${s.time}</td>
        <td>${correctionCell(s)}</td>
      </tr>`;
  }

  function teacherSummaryRow(s){
    const months = MONTHS_LATEST_FIRST.slice(1,6);
    const donuts = months.map(m=>donutWidget(m, s.monthly[m].present)).join('');
    return `
      <tr class="summary-row" data-summary-for="${s.id}">
        <td colspan="6">
          <div class="summary-inner">
            ${donuts}
            <div class="view-more-tile" data-teacher-view-more="${s.id}">
              <div class="icon-circle">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
              <span style="font-size:12.5px;font-weight:700;color:var(--primary)">View More</span>
            </div>
          </div>
        </td>
      </tr>`;
  }

  function renderRecords() {
    TEACHER_ATTENDANCE_STUDENTS = buildTeacherStudents();
    const courses = [...new Set(TEACHER_ATTENDANCE_STUDENTS.map(s=>s.course))];
    
    return `
      <div id="listView">
        <div class="page-head" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;">
          <div>
            <h1 style="font-size:22px;margin:0 0 4px;">Attendance Records</h1>
            <p style="margin:0;color:var(--muted);font-size:14px;">All students, listed alphabetically. Click a student to see a quick summary.</p>
          </div>
          <div>
            <button class="btn btn-secondary" data-export-records>⭳ Export CSV</button>
          </div>
        </div>
        <article class="card">
          <div class="card-body">
            <div class="toolbar">
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input id="recordSearch" placeholder="Search student, roll or course">
              </div>
              <div class="toolbar-group">
                <select class="select" id="recordCourse">
                  <option value="">All courses</option>
                  ${courses.map(c=>`<option value="${c}">${c}</option>`).join('')}
                </select>
                <select class="select" id="recordStatus">
                  <option value="">All statuses</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>Student</th><th>Course</th><th>Status</th><th>Verification</th><th>Time</th><th>Correction</th></tr>
                </thead>
                <tbody id="recordRows">${TEACHER_ATTENDANCE_STUDENTS.map(teacherStudentRow).join('') || VeriSync.tableEmpty('No students found.',6)}</tbody>
              </table>
            </div>
          </div>
        </article>
      </div>
      <div id="detailView" style="display:none;"></div>`;
  }

  function renderTeacherMatrix(student, course){
    const head = `<tr><th>Roll</th><th>Month</th>${DAY_COLS.map(d=>`<th>${d}</th>`).join('')}</tr>`;
    const body = MONTHS_LATEST_FIRST.map(m=>{
      const cells = student.matrix[course][m].map(v=>{
        const cls = v==='1'?'p1':v==='0'?'p0':v==='H'?'pH':'pNA';
        return `<td><span class="cell-badge ${cls}">${v}</span></td>`;
      }).join('');
      return `<tr><td class="roll-cell">${student.roll}</td><td>${m}</td>${cells}</tr>`;
    }).join('');
    return `<thead>${head}</thead><tbody>${body}</tbody>`;
  }

  function showTeacherDetail(id) {
    const s = TEACHER_ATTENDANCE_STUDENTS.find(st=>st.id===id);
    if(!s) return;
    
    const courses = Object.keys(s.matrix);
    const donuts = MONTHS_LATEST_FIRST.map(m=>donutWidget(m.slice(0,3), s.monthly[m].present)).join('');
    
    const detailHtml = `
      <span class="back-link" id="teacherBackToList">&larr; Back to Attendance Records</span>

      <div class="student-strip">
        <div class="avatar" style="background:${s.color}">${VeriSync.initials(s.name)}</div>
        <div>
          <div class="name">${s.name}</div>
          <div class="roll">${s.roll}</div>
        </div>
      </div>

      <div class="letterhead">
        <div class="letterhead-left">
          <img src="asset/logo.png" alt="College crest">
          <div>
            <div class="letterhead-name">PATNA WOMEN'S COLLEGE</div>
            <div class="letterhead-sub">Autonomous · Patna University</div>
            <div class="letterhead-dept">MCA Department</div>
          </div>
        </div>
        <div class="info-grid">
          <div class="k">Name</div><div class="v">: ${s.name}</div>
          <div class="k">Class Roll No</div><div class="v">: ${s.roll.replace(/\D/g,'')}</div>
          <div class="k">Exam Roll No</div><div class="v">: ${s.examRoll}</div>
          <div class="k">Reg No</div><div class="v">: ${s.regNo}</div>
          <div class="k">Session</div><div class="v">: ${s.session}</div>
          <div class="k">Course</div><div class="v">: ${s.classText}</div>
        </div>
        <button class="btn btn-dark" id="teacherDownloadCsvBtn">⭳ Download CSV</button>
      </div>

      <div class="section-title">Attendance Record</div>
      <div class="donuts-row">${donuts}</div>

      <div class="card matrix-card">
        <div class="matrix-head">
          <div>
            <h3>2026 Attendance Matrix</h3>
            <p class="legend">1 = present, 0 = absent, H = holiday, NA = not applicable</p>
          </div>
          <select class="select" id="teacherMatrixCourse">${courses.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
        </div>
        <div class="table-wrap">
          <table class="matrix-table" id="teacherMatrixTable">${renderTeacherMatrix(s, courses[0])}</table>
        </div>
      </div>
    `;
    
    document.getElementById('detailView').innerHTML = detailHtml;
    document.getElementById('listView').style.display = 'none';
    document.getElementById('detailView').style.display = 'block';
    window.scrollTo({top:0, behavior:'smooth'});

    document.getElementById('teacherMatrixCourse').onchange = (e) => {
      document.getElementById('teacherMatrixTable').innerHTML = renderTeacherMatrix(s, e.target.value);
    };
    
    document.getElementById('teacherDownloadCsvBtn').onclick = () => {
      const course = document.getElementById('teacherMatrixCourse').value;
      const headers = ['Roll', 'Month', ...DAY_COLS];
      const rows = MONTHS_LATEST_FIRST.map(m=>[s.roll, m, ...s.matrix[course][m]]);
      VeriSync.exportCSV(`${s.roll}-attendance.csv`, rows.map(r=>headers.reduce((acc,h,idx)=>{acc[h]=r[idx];return acc;},{})));
    };
  }

  function renderCorrections(){
    const db=VeriSync.getDB(),courseIds=teacherCourses(db).map(c=>c.id),items=db.corrections.filter(c=>courseIds.includes(c.courseId));
    return `${pageHeader('Correction Requests','Review evidence and send a recommendation to the admin.')}
      <article class="card"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Course & date</th><th>Requested change</th><th>Reason</th><th>Status</th><th>Teacher recommendation</th></tr></thead><tbody>${items.map(c=>{const s=VeriSync.studentById(db,c.studentId),course=VeriSync.courseById(db,c.courseId);return `<tr><td>${VeriSync.userCell(s?.name||'Student',s?.roll||'')}</td><td><strong>${course?.code||'—'}</strong><br><span class="text-muted">${VeriSync.formatDate(c.date)}</span></td><td>${c.current} → <strong>${c.requested}</strong></td><td style="max-width:280px">${VeriSync.escapeHTML(c.reason)}</td><td>${VeriSync.statusBadge(c.status)}</td><td><div class="flex gap-1"><button class="btn btn-success btn-sm" data-recommend="approve" data-correction-id="${c.id}" ${c.teacherRecommendation!=='Pending'?'disabled':''}>Recommend Approval</button><button class="btn btn-danger btn-sm" data-recommend="reject" data-correction-id="${c.id}" ${c.teacherRecommendation!=='Pending'?'disabled':''}>Recommend Rejection</button></div></td></tr>`}).join('')}</tbody></table></div></div></article>`;
  }

  function renderSheets(){
    const db=VeriSync.getDB(),courses=teacherCourses(db),course=courses[0],matrix=VeriSync.monthlyMatrix(db,course.id,db.students,2026,6);
    return `${pageHeader('Attendance Sheets','Download monthly attendance only for your assigned courses.',`<button class="btn btn-secondary" id="teacherExportSheet">${VeriSync.icons.download} Download CSV</button>`)}
      <article class="card"><div class="card-header"><div><h3>July 2026 Attendance Matrix</h3><p>1 = present, 0 = absent, H = holiday, NA = not applicable</p></div><select class="select" id="teacherSheetCourse" style="width:auto">${courses.map(c=>`<option value="${c.id}">${c.code}</option>`).join('')}</select></div><div class="card-body"><div class="table-wrap"><table class="attendance-matrix"><thead><tr><th style="min-width:84px">Roll</th><th style="min-width:180px">Student</th>${Array.from({length:31},(_,i)=>`<th>${String(i+1).padStart(2,'0')}</th>`).join('')}<th>Present</th><th>Conducted</th><th>%</th></tr></thead><tbody id="teacherSheetRows">${sheetRows(matrix)}</tbody></table></div></div></article>`;
  }
  function sheetRows(matrix){return matrix.map(row=>`<tr><td>${row.student.roll}</td><td><strong>${VeriSync.escapeHTML(row.student.name)}</strong></td>${row.values.map(v=>{const cls=v===1?'att-present':v===0?'att-absent':v==='H'?'att-holiday':'att-na';return `<td><span class="att-cell ${cls}">${v}</span></td>`}).join('')}<td><strong>${row.present}</strong></td><td>${row.conducted}</td><td><strong class="${row.percentage<75?'text-danger':'text-success'}">${row.percentage}%</strong></td></tr>`).join('');}

  function renderAnalytics(){
    const db=VeriSync.getDB(),courses=teacherCourses(db),low=[...db.students].sort((a,b)=>a.attendance-b.attendance).slice(0,8);
    return `${pageHeader('Reports & Analytics','Course-level attendance performance and low-attendance risk.',`<button class="btn btn-secondary" data-export-analytics>${VeriSync.icons.download} Export Summary</button>`)}
      <div class="grid grid-2"><article class="card chart-card"><div class="card-header"><div><h3>Course attendance</h3><p>Average by assigned course</p></div></div><div class="card-body"><canvas id="teacherBarChart"></canvas></div></article><article class="card chart-card"><div class="card-header"><div><h3>Weekly trend</h3><p>Attendance change across recent weeks</p></div></div><div class="card-body"><canvas id="teacherAnalyticsLine"></canvas></div></article></div>
      <article class="card mt-3"><div class="card-header"><div><h3>Low-attendance students</h3><p>Students below or close to the institutional threshold</p></div></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Student</th><th>Roll</th><th>Attendance</th><th>Category</th><th>Face status</th></tr></thead><tbody>${low.map(s=>`<tr><td>${VeriSync.userCell(s.name,s.email)}</td><td>${s.roll}</td><td><strong>${s.attendance}%</strong></td><td>${VeriSync.statusBadge(s.attendance>=75?'Good':s.attendance>=65?'Warning':'Critical')}</td><td>${VeriSync.statusBadge(s.faceStatus)}</td></tr>`).join('')}</tbody></table></div></div></article>`;
  }

  function renderProfile(){return `${pageHeader('My Profile','Professional faculty information visible in attendance courses.')}
    <div class="profile-hero"><div class="profile-identity"><span class="avatar lg">${VeriSync.initials(user.name)}</span><div><h2>${user.name}</h2><p>${user.designation} · ${user.department}</p></div></div></div>
    <article class="card mt-3"><div class="card-header"><div><h3>Faculty details</h3><p>Restricted fields require admin approval</p></div><button class="btn btn-secondary" id="editTeacherProfile">${VeriSync.icons.edit} Edit allowed fields</button></div><div class="card-body"><div class="detail-grid"><div class="detail-item"><span>Employee ID</span><strong>${user.employeeId}</strong></div><div class="detail-item"><span>Official email</span><strong>${user.email}</strong></div><div class="detail-item"><span>Department</span><strong>${user.department}</strong></div><div class="detail-item"><span>Designation</span><strong>${user.designation}</strong></div><div class="detail-item"><span>Qualification</span><strong>${user.qualification}</strong></div><div class="detail-item"><span>Specialisation</span><strong>${user.specialisation}</strong></div></div></div></article>`;}

  function renderSecurity(){return `${pageHeader('Security & Login Activity','Protect your verified teacher account.')}
    <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Recent access</h3><p>Frontend sample activity</p></div></div><div class="card-body"><div class="list"><div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.shield}</span><div><p class="list-title">Windows · Edge</p><p class="list-subtitle">Patna, India · Current session</p></div></div>${VeriSync.statusBadge('Active')}</div><div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.profile}</span><div><p class="list-title">Android · Chrome</p><p class="list-subtitle">Yesterday at 18:40</p></div></div>${VeriSync.statusBadge('Closed')}</div></div></div></article><article class="card"><div class="card-header"><div><h3>Account protection</h3><p>Security actions</p></div></div><div class="card-body"><div class="setting-row"><div><h4>Two-factor authentication</h4><p>Add an OTP step after password login.</p></div><label class="switch"><input type="checkbox"><span class="switch-slider"></span></label></div><button class="btn btn-secondary btn-block mt-3" id="logoutAllTeacher">Logout from all devices</button><button class="btn btn-primary btn-block mt-2" id="changeTeacherPassword">Change password</button></div></article></div>`;}

  function renderSettings(){return `${pageHeader('Teacher Settings','Attendance preferences remain within admin-defined limits.',`<button class="btn btn-primary" id="saveTeacherSettings">Save Preferences</button>`)}
    <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Default attendance setup</h3><p>Applied when starting a session</p></div></div><div class="card-body"><div class="form-group"><label class="form-label">Preferred attendance window</label><select class="select" id="teacherWindow"><option>5 minutes</option><option selected>10 minutes</option><option>15 minutes</option></select></div><div class="form-group mt-2"><label class="form-label">Default room</label><input class="input" id="teacherRoom" value="Room 204"></div></div></article><article class="card"><div class="card-header"><div><h3>Notifications</h3><p>Attendance-only alerts</p></div></div><div class="card-body"><div class="setting-row"><div><h4>Attendance session reminders</h4><p>Notify before a scheduled class.</p></div><label class="switch"><input type="checkbox" checked><span class="switch-slider"></span></label></div><div class="setting-row"><div><h4>Correction request alerts</h4><p>Notify when a student submits a request.</p></div><label class="switch"><input type="checkbox" checked><span class="switch-slider"></span></label></div><div class="setting-row"><div><h4>Low-attendance alerts</h4><p>Notify when students cross the warning threshold.</p></div><label class="switch"><input type="checkbox" checked><span class="switch-slider"></span></label></div></div></article></div>`;}

  function launchSession(courseId=null){
    const db=VeriSync.getDB(),form=document.getElementById('attendanceSessionForm');
    let data=form?Object.fromEntries(new FormData(form)):{courseId,date:VeriSync.todayISO(),start:'10:00',duration:'10',room:'Room 204'};
    if(courseId)data.courseId=courseId;
    const course=VeriSync.courseById(db,data.courseId);
    if(!course||course.teacherId!==user.id)return VeriSync.showToast('Not authorised','You can start attendance only for your own active course.','error');
    const token=VeriSync.randomCode(6).toUpperCase();
    const id=VeriSync.uid('sess');
    VeriSync.updateDB(db2=>{db2.attendanceSessions.forEach(s=>{if(s.teacherId===user.id&&s.status==='Live')s.status='Closed';});db2.attendanceSessions.push({id,courseId:course.id,teacherId:user.id,date:data.date,start:data.start,end:'',token,status:'Live',present:0,total:course.students,method:data.verificationMethod||'Face + Dynamic QR + Device',duration:Number(data.duration)});return db2;});
    currentSessionId=id;liveRemaining=Number(data.duration)*60;
    VeriSync.showToast('Attendance session started',`${course.code} is now accepting verification.`);portal.showView('live-attendance');startLiveClock();
  }

  function startLiveClock(){
    clearInterval(liveTimer);liveTimer=setInterval(()=>{if(liveRemaining<=0){closeSession();return;}liveRemaining--;const el=document.getElementById('liveCountdown');if(el)el.textContent=`${Math.floor(liveRemaining/60)}:${String(liveRemaining%60).padStart(2,'0')}`;if(liveRemaining%15===0){const db=VeriSync.getDB(),live=db.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live');if(live){live.token=VeriSync.randomCode(6).toUpperCase();VeriSync.saveDB(db);const token=document.getElementById('liveToken');if(token)token.textContent=live.token;VeriSync.renderQR(document.getElementById('liveQR'),live.token);}}
      if(liveRemaining%8===0){VeriSync.updateDB(db=>{const live=db.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live');if(live&&live.present<live.total)live.present=Math.min(live.total,live.present+1);return db;});const db=VeriSync.getDB(),live=db.attendanceSessions.find(s=>s.id===currentSessionId);if(live){document.getElementById('livePresentCount')?.replaceChildren(String(live.present));document.getElementById('presentKpi')?.replaceChildren(String(live.present));document.getElementById('pendingKpi')?.replaceChildren(String(Math.max(0,live.total-live.present)));}}
    },1000);
  }

  function closeSession(){
    clearInterval(liveTimer);
    VeriSync.updateDB(db=>{const live=db.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live')||db.attendanceSessions.find(s=>s.teacherId===user.id&&s.status==='Live');if(live){live.status='Closed';live.end=new Date().toTimeString().slice(0,5);const students=db.students.slice(0,live.total);students.forEach((s,i)=>{if(!db.attendanceRecords.some(r=>r.studentId===s.id&&r.courseId===live.courseId&&r.date===live.date)){db.attendanceRecords.push({id:VeriSync.uid('att'),studentId:s.id,courseId:live.courseId,date:live.date,status:i<live.present?'Present':'Absent',value:i<live.present?1:0,method:i<live.present?'Face + QR':'Not verified',time:i<live.present?new Date().toTimeString().slice(0,5):'—'});}});}return db;});
    currentSessionId=null;liveRemaining=0;VeriSync.showToast('Session closed','Present and absent records were saved in the frontend demo.');portal.showView('records');
  }

  document.addEventListener('click',event=>{
    const navEl=event.target.closest('[data-nav]');
    if(navEl){
      return portal.showView(navEl.dataset.nav);
    }
    const start=event.target.closest('[data-start-course]');if(start)return launchSession(start.dataset.startCourse);
    const createSub=event.target.closest('[data-create-subject]');if(createSub){portal.showView('create-course');setTimeout(()=>{const sel=document.getElementById('courseSubject');if(sel){sel.value=createSub.dataset.createSubject;sel.dispatchEvent(new Event('change'));}},0);return;}
    const details=event.target.closest('[data-course-details]');if(details){const db=VeriSync.getDB(),c=VeriSync.courseById(db,details.dataset.courseDetails);return VeriSync.openModal({title:'Attendance Course Details',large:true,body:`<div class="course-classroom-hero"><div><h2>${c.name}</h2><p>${c.code} · ${c.session} · Semester ${c.semester} · Section ${c.section}</p></div></div><div class="detail-grid mt-3"><div class="detail-item"><span>Students</span><strong>${c.students}</strong></div><div class="detail-item"><span>Status</span><strong>${c.status}</strong></div><div class="detail-item"><span>Next class</span><strong>${c.nextClass}</strong></div></div>`});}
    if(event.target.id==='createCourseBtn'){const form=document.getElementById('createCourseForm'),data=Object.fromEntries(new FormData(form)),db=VeriSync.getDB(),subject=VeriSync.subjectById(db,data.subjectId),auth=db.authorizations.find(a=>a.teacherId===user.id&&a.subjectId===data.subjectId&&a.code===data.authCode&&a.status==='Active'&&a.session===data.session&&a.semester===data.semester&&a.section===data.section);if(!auth)return VeriSync.showToast('Course creation blocked','The authorisation code is invalid, expired, used or does not match the selected course scope.','error');const existing=db.courses.find(c=>c.teacherId===user.id&&c.subjectId===data.subjectId&&c.status!=='Archived');if(existing&&existing.status==='Active')return VeriSync.showToast('Course already exists','An active course already exists for this subject and section.','error');VeriSync.updateDB(db2=>{const draft=db2.courses.find(c=>c.teacherId===user.id&&c.subjectId===data.subjectId&&c.status==='Draft');const courseData={subjectId:data.subjectId,teacherId:user.id,name:data.name,code:subject.code,session:data.session,semester:data.semester,section:data.section,students:Number(data.students),status:'Active',banner:data.banner,nextClass:draft?.nextClass||'Not scheduled'};if(draft)Object.assign(draft,courseData);else db2.courses.push({id:VeriSync.uid('crs'),...courseData});db2.authorizations.find(a=>a.id===auth.id).status='Used';return db2;});VeriSync.showToast('Course created','The authorisation code is now marked Used and the course is active.');portal.showView('courses');}
    if(event.target.id==='launchAttendanceBtn')return launchSession();
    if(event.target.id==='closeLiveSession')return closeSession();
    
    if(event.target.id==='startTeacherFaceScanner'){
      let localStream = null;
      let scanInterval = null;
      VeriSync.openModal({
        title: 'Classroom Face Scanner',
        large: true,
        body: `<div class="webcam-container scanner-mode"><video id="teacherWebcam" autoplay playsinline muted></video><div class="webcam-overlay"><div class="face-guide"></div><div class="scan-line" id="teacherScanLine"></div><div id="detectionBoxes"></div></div></div><div class="mt-2 flex justify-between align-center"><p class="text-muted m-0">Scanning for enrolled faces...</p><strong class="text-success" id="scanPresentCount">0 verified</strong></div>`,
        footer: `<button class="btn btn-secondary" data-modal-close id="stopTeacherScanBtn">Stop Scanning</button>`,
        onOpen: (modal) => {
          const video = modal.querySelector('#teacherWebcam');
          const detectionBoxes = modal.querySelector('#detectionBoxes');
          let verifiedInSession = 0;
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { localStream = stream; video.srcObject = stream; })
            .catch(err => VeriSync.showToast('Camera error', 'Failed to access webcam.', 'error'));
            
          scanInterval = setInterval(() => {
            const db = VeriSync.getDB();
            const live = db.attendanceSessions.find(s => s.id === currentSessionId && s.status === 'Live');
            if (!live || live.present >= live.total) return;
            
            // Show fake detection box
            const box = document.createElement('div');
            box.className = 'face-detect-box';
            box.style.left = Math.random() * 60 + 10 + '%';
            box.style.top = Math.random() * 40 + 10 + '%';
            detectionBoxes.appendChild(box);
            setTimeout(() => box.remove(), 1200);

            // Mark a student present
            VeriSync.updateDB(db2 => {
              const live2 = db2.attendanceSessions.find(s => s.id === currentSessionId && s.status === 'Live');
              if(live2 && live2.present < live2.total) {
                live2.present++;
                verifiedInSession++;
              }
              return db2;
            });
            modal.querySelector('#scanPresentCount').textContent = `${verifiedInSession} verified`;
            const liveUpd = VeriSync.getDB().attendanceSessions.find(s => s.id === currentSessionId);
            if (liveUpd) {
              document.getElementById('livePresentCount')?.replaceChildren(String(liveUpd.present));
              document.getElementById('presentKpi')?.replaceChildren(String(liveUpd.present));
              document.getElementById('pendingKpi')?.replaceChildren(String(Math.max(0, liveUpd.total - liveUpd.present)));
              // update student rows
              const students = VeriSync.getDB().students.slice(0, liveUpd.total);
              document.getElementById('liveStudentRows').innerHTML = students.map((s,i)=>{const p=i<liveUpd.present;return `<tr><td>${VeriSync.userCell(s.name,s.roll)}</td><td>${VeriSync.statusBadge(p?'Verified':'Pending')}</td><td>${VeriSync.statusBadge(p?'Valid':'Waiting')}</td><td>${VeriSync.statusBadge(p?'Valid':'Waiting')}</td><td>${VeriSync.attendanceStatusBadge(p?'Present':'Pending Review')}</td><td>${p?new Date().toTimeString().slice(0,5):'—'}</td></tr>`}).join('');
            }
          }, 2500);
          
          modal.querySelector('#stopTeacherScanBtn').onclick = () => {
            if (localStream) localStream.getTracks().forEach(t => t.stop());
            clearInterval(scanInterval);
          };
        }
      });
      document.getElementById('globalModal').addEventListener('click', (e) => {
        if (e.target.matches('[data-modal-close]') || e.target.id === 'globalModal') {
          if (localStream) localStream.getTracks().forEach(t => t.stop());
          clearInterval(scanInterval);
        }
      });
    }
    
    const rec=event.target.closest('[data-recommend]');if(rec){VeriSync.updateDB(db=>{const c=db.corrections.find(x=>x.id===rec.dataset.correctionId);c.teacherRecommendation=rec.dataset.recommend==='approve'?'Recommend Approval':'Recommend Rejection';c.status='Under Admin Review';return db;});VeriSync.showToast('Recommendation submitted','The request is now waiting for the admin’s final decision.');return portal.showView('corrections',false);}
    if(event.target.matches('[data-export-schedule]')){const db=VeriSync.getDB(),ids=teacherCourses(db).map(c=>c.id);return VeriSync.exportCSV('teacher-schedule.csv',db.schedule.filter(s=>ids.includes(s.courseId)));}
    if(event.target.matches('[data-export-records]')){const rows=TEACHER_ATTENDANCE_STUDENTS.map(s=>({Student:s.name,Roll:s.roll,Course:s.course,Status:s.status,Verification:s.verification,Time:s.time}));return VeriSync.exportCSV('teacher-attendance-records.csv',rows);}
    if(event.target.matches('[data-export-analytics]'))return VeriSync.exportCSV('teacher-attendance-summary.csv',VeriSync.getDB().students.map(s=>({Roll:s.roll,Name:s.name,Attendance:s.attendance,Category:s.attendance>=75?'Good':s.attendance>=65?'Warning':'Critical'})));
    if(event.target.id==='teacherExportSheet'){const db=VeriSync.getDB(),courseId=document.getElementById('teacherSheetCourse').value,m=VeriSync.monthlyMatrix(db,courseId,db.students,2026,6);return VeriSync.exportCSV('teacher-july-sheet.csv',m.map(r=>{const row={Roll:r.student.roll,Name:r.student.name};r.values.forEach((v,i)=>row[String(i+1).padStart(2,'0')]=v);row.Present=r.present;row.Conducted=r.conducted;row.Percentage=r.percentage;return row;}));}
    if(event.target.id==='editTeacherProfile')return VeriSync.openModal({title:'Edit Profile',body:`<form class="form-grid"><div class="form-group full"><label class="form-label">Phone number</label><input class="input" value="9876500111"></div><div class="form-group full"><label class="form-label">Qualification</label><input class="input" value="${user.qualification}"></div><div class="form-group full"><label class="form-label">Specialisation</label><input class="input" value="${user.specialisation}"></div></form>`,footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" data-modal-close onclick="VeriSync.showToast('Profile updated','Editable faculty fields were saved in the frontend demo.')">Save</button>`});
    if(event.target.id==='saveTeacherSettings')VeriSync.showToast('Preferences saved','Teacher attendance preferences were updated locally.');
    if(event.target.id==='logoutAllTeacher'){VeriSync.showToast('Other sessions revoked','Only the current frontend session remains active.');}
    if(event.target.id==='changeTeacherPassword'){VeriSync.showToast('Password workflow opened','Production password changes require backend verification.');}

    const teacherViewMore = event.target.closest('[data-teacher-view-more]');
    if (teacherViewMore) return showTeacherDetail(teacherViewMore.dataset.teacherViewMore);
    
    if (event.target.id === 'teacherBackToList') {
      document.getElementById('detailView').style.display = 'none';
      document.getElementById('listView').style.display = 'block';
      return;
    }

    const teacherAttRow = event.target.closest('[data-teacher-att-id]');
    if (teacherAttRow) {
      const id = teacherAttRow.dataset.teacherAttId;
      const existing = document.querySelector('.summary-row');
      const wasOpen = existing && existing.dataset.summaryFor === id;
      if(existing) existing.remove();
      document.querySelectorAll('.student-row.active').forEach(r=>r.classList.remove('active'));
      if(!wasOpen){
        teacherAttRow.classList.add('active');
        const student = TEACHER_ATTENDANCE_STUDENTS.find(s=>s.id===id);
        if(student) teacherAttRow.insertAdjacentHTML('afterend', teacherSummaryRow(student));
      }
      return;
    }
  });

  document.addEventListener('change',event=>{
    if(event.target.id==='courseSubject'){const db=VeriSync.getDB(),s=VeriSync.subjectById(db,event.target.value);document.getElementById('courseCode').value=s?.code||'';document.getElementById('courseCredits').value=s?.credits||'';document.querySelector('#createCourseForm [name="name"]').value=s?.name||'';}
    if(event.target.id==='teacherSheetCourse'){const db=VeriSync.getDB();document.getElementById('teacherSheetRows').innerHTML=sheetRows(VeriSync.monthlyMatrix(db,event.target.value,db.students,2026,6));}
  });

  document.addEventListener('input',event=>{
    if(['recordSearch','recordCourse','recordStatus'].includes(event.target.id)){
      const q = (document.getElementById('recordSearch')?.value || '').toLowerCase();
      const course = document.getElementById('recordCourse')?.value || '';
      const status = document.getElementById('recordStatus')?.value || '';
      const filtered = TEACHER_ATTENDANCE_STUDENTS.filter(s=>{
        const searchMatch = !q || [s.name, s.roll, s.course].some(v=>v.toLowerCase().includes(q));
        const courseMatch = !course || s.course === course;
        const statusMatch = !status || s.status === status;
        return searchMatch && courseMatch && statusMatch;
      });
      document.getElementById('recordRows').innerHTML = filtered.map(teacherStudentRow).join('') || VeriSync.tableEmpty('No students found.',6);
    }
  });

  window.afterViewRender=id=>{
    if(id==='dashboard')VeriSync.drawLineChart(document.getElementById('teacherTrendChart'),['Mon','Tue','Wed','Thu','Fri','Sat'],[78,82,80,86,88,84]);
    if(id==='analytics'){VeriSync.drawBarChart(document.getElementById('teacherBarChart'),['5G','Wireless'],[86,79]);VeriSync.drawLineChart(document.getElementById('teacherAnalyticsLine'),['W1','W2','W3','W4','W5'],[78,80,83,85,86]);}
    if (window.inlineStream) { window.inlineStream.getTracks().forEach(t => t.stop()); window.inlineStream = null; }
    if (window.inlineScanInterval) { clearInterval(window.inlineScanInterval); window.inlineScanInterval = null; }
    if(id==='live-attendance'){const db=VeriSync.getDB(),live=db.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live')||db.attendanceSessions.find(s=>s.teacherId===user.id&&s.status==='Live');if(live){currentSessionId=live.id;if(!liveRemaining)liveRemaining=(live.duration||10)*60;if(live.method==='face'){const video=document.getElementById('teacherWebcamInline');if(video){if(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia){navigator.mediaDevices.getUserMedia({video:true}).then(stream=>{window.inlineStream=stream;video.srcObject=stream;video.play().catch(e=>console.log(e));}).catch(err=>VeriSync.showToast('Camera error','Failed to access webcam. Please check permissions.','error'));}else{VeriSync.showToast('Camera error','Webcam access requires a secure connection (HTTPS or localhost).','error');}window.inlineScanInterval=setInterval(()=>{const db2=VeriSync.getDB(),live2=db2.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live');if(!live2||live2.present>=live2.total)return;const box=document.createElement('div');box.className='face-detect-box';box.style.left=Math.random()*60+10+'%';box.style.top=Math.random()*40+10+'%';document.getElementById('detectionBoxesInline')?.appendChild(box);setTimeout(()=>box.remove(),1200);VeriSync.updateDB(db3=>{const live3=db3.attendanceSessions.find(s=>s.id===currentSessionId&&s.status==='Live');if(live3&&live3.present<live3.total)live3.present++;return db3;});const liveUpd=VeriSync.getDB().attendanceSessions.find(s=>s.id===currentSessionId);if(liveUpd){document.getElementById('livePresentCount')?.replaceChildren(String(liveUpd.present));document.getElementById('presentKpi')?.replaceChildren(String(liveUpd.present));document.getElementById('pendingKpi')?.replaceChildren(String(Math.max(0,liveUpd.total-liveUpd.present)));const students=VeriSync.getDB().students.slice(0,liveUpd.total);document.getElementById('liveStudentRows').innerHTML=students.map((s,i)=>{const p=i<liveUpd.present;return `<tr><td>${VeriSync.userCell(s.name,s.roll)}</td><td>${VeriSync.statusBadge(p?'Verified':'Pending')}</td><td>${VeriSync.statusBadge(p?'Valid':'Waiting')}</td><td>${VeriSync.statusBadge(p?'Valid':'Waiting')}</td><td>${VeriSync.attendanceStatusBadge(p?'Present':'Pending Review')}</td><td>${p?new Date().toTimeString().slice(0,5):'—'}</td></tr>`}).join('');}},2500);}}else if(live.method!=='otp'){VeriSync.renderQR(document.getElementById('liveQR'),live.token);}startLiveClock();}}
  };
  window.afterViewRender(location.hash.replace('#','')||'dashboard');
  window.addEventListener('resize',()=>window.afterViewRender?.(location.hash.replace('#','')||'dashboard'));
})();
