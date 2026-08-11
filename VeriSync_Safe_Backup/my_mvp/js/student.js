'use strict';

(() => {
  const session = VeriSync.requireRole('student');
  if (!session) return;
  const db0 = VeriSync.getDB();
  const user = db0.users.student;
  document.getElementById('topAvatar').textContent = VeriSync.initials(user.name);
  document.getElementById('topName').textContent = user.name;

  let verifyStage = 0;
  let verifyTimer = null;

  const nav = [
    {section:'Overview',id:'dashboard',label:'Dashboard',icon:'dashboard',subtitle:'Your courses, schedule and attendance health'},
    {section:'Courses',id:'courses',label:'Enrolled Courses',icon:'course',subtitle:'Google Classroom-inspired attendance course cards'},
    {section:'Courses',id:'schedule',label:'Class Schedule',icon:'calendar',subtitle:'Upcoming, completed and cancelled classes'},
    {section:'Attendance',id:'mark-attendance',label:'Mark Attendance',icon:'qr',subtitle:'Dynamic QR and face-verification workflow'},
    {section:'Attendance',id:'history',label:'Attendance History',icon:'database',subtitle:'Your personal attendance records'},
    {section:'Attendance',id:'analytics',label:'Attendance Analytics',icon:'chart',subtitle:'Daily, weekly, monthly and subject-wise charts'},
    {section:'Attendance',id:'corrections',label:'Correction Requests',icon:'correction',subtitle:'Submit and track attendance corrections',badge:String(db0.corrections.filter(c=>c.studentId==='stu-1').length)},
    {section:'Calendar',id:'calendar',label:'Academic Calendar',icon:'calendar',subtitle:'Teaching days, holidays and attendance dates'},
    {section:'Calendar',id:'holidays',label:'Holidays',icon:'holiday',subtitle:'Official non-working days and vacations'},
    {section:'Account',id:'profile',label:'My Profile',icon:'profile',subtitle:'Verified student identity and academic details'},
    {section:'Account',id:'security',label:'Security',icon:'shield',subtitle:'Login activity and face-enrolment status'},
    {section:'Account',id:'settings',label:'Settings',icon:'settings',subtitle:'Attendance notification and display preferences'}
  ];

  const views = {
    dashboard:renderDashboard,courses:renderCourses,schedule:renderSchedule,'mark-attendance':renderMarkAttendance,
    history:renderHistory,analytics:renderAnalytics,corrections:renderCorrections,calendar:renderCalendar,
    holidays:renderHolidays,profile:renderProfile,security:renderSecurity,settings:renderSettings
  };

  const portal = VeriSync.initPortal({role:'student',nav,views,user});

  function pageHeader(title,subtitle,actions=''){return `<div class="page-header"><div class="page-title"><h2>${VeriSync.escapeHTML(title)}</h2><p>${VeriSync.escapeHTML(subtitle)}</p></div><div class="header-actions">${actions}</div></div>`;}
  function demoStudent(db){return db.students.find(s=>s.roll===user.roll)||db.students[0];}
  function enrolledCourses(db){return db.courses.filter(c=>c.status==='Active');}
  function myRecordStudentId(db){return demoStudent(db).id;}
  function myRecords(db){const id=myRecordStudentId(db);return db.attendanceRecords.filter(r=>r.studentId===id);}
  function subjectAttendance(db,courseId){const records=myRecords(db).filter(r=>r.courseId===courseId),present=records.filter(r=>r.status==='Present').length;return VeriSync.percentage(present,records.length)||Math.round((75+((courseId.charCodeAt(courseId.length-1)*7)%20))*10)/10;}

  function renderDashboard(){
    const db=VeriSync.getDB(),student=demoStudent(db),courses=enrolledCourses(db),records=myRecords(db),present=records.filter(r=>r.status==='Present').length,overall=records.length?VeriSync.percentage(present,records.length):student.attendance;
    const low=courses.filter(c=>subjectAttendance(db,c.id)<db.settings.attendanceThreshold).length;
    const active=db.attendanceSessions.find(s=>s.status==='Live');
    return `${pageHeader('Student Dashboard','Your verified attendance workspace for MCA second year.',active?`<button class="btn btn-primary" data-nav="mark-attendance">${VeriSync.icons.qr} Active Session</button>`:'')}
      <div class="attendance-hero"><span class="eyebrow" style="background:rgba(255,255,255,.16);color:white">${user.session} · Semester ${user.semester} · Section ${user.section}</span><h2 class="mt-2">Welcome back, ${VeriSync.escapeHTML(user.name)}</h2><p>Complete attendance verification during the teacher’s active session and review only your own official attendance data.</p><div class="hero-actions"><button class="btn btn-secondary" data-nav="mark-attendance">${VeriSync.icons.qr} Mark Attendance</button><button class="btn btn-secondary" data-nav="analytics">${VeriSync.icons.chart} View Analytics</button></div></div>
      <div class="stats-grid mt-3">
        ${VeriSync.statCard('Enrolled courses',courses.length,'Current active semester','course')}
        ${VeriSync.statCard('Overall attendance',`${overall}%`,overall>=75?'Above institutional threshold':'Attendance action required','attendance',overall>=75?'trend-up':'trend-down')}
        ${VeriSync.statCard('Subjects below threshold',low,`Minimum required: ${db.settings.attendanceThreshold}%`,'alert',low?'trend-down':'trend-up')}
        ${VeriSync.statCard('Face verification',user.faceStatus,'Identity ready for attendance','shield')}
      </div>
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Today’s classes</h3><p>Open attendance only while the teacher session is active</p></div><button class="btn btn-ghost btn-sm" data-nav="schedule">View schedule</button></div><div class="card-body"><div class="list">${db.schedule.slice(0,4).map(item=>{const c=VeriSync.courseById(db,item.courseId),t=VeriSync.teacherById(db,c.teacherId);return `<div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.clock}</span><div><p class="list-title">${c.name}</p><p class="list-subtitle">${item.start}–${item.end} · ${item.room} · ${t.name}</p></div></div>${VeriSync.statusBadge(item.status)}</div>`}).join('')}</div></div></article>
      <article class="card chart-card"><div class="card-header"><div><h3>Weekly attendance</h3><p>Your recent attendance percentage</p></div></div><div class="card-body"><canvas id="studentDashboardChart"></canvas></div></article></div>
      <article class="card mt-3"><div class="card-header"><div><h3>Enrolled courses</h3><p>Attendance overview for your current semester</p></div><button class="btn btn-ghost btn-sm" data-nav="courses">View all</button></div><div class="card-body"><div class="course-grid">${courses.slice(0,3).map(c=>VeriSync.courseCard(c,VeriSync.teacherById(db,c.teacherId),subjectAttendance(db,c.id),`<button class="btn btn-soft btn-sm" data-open-course="${c.id}">${VeriSync.icons.eye} Open</button>`)).join('')}</div></div></article>`;
  }

  function renderCourses(){
    const db=VeriSync.getDB(),courses=enrolledCourses(db);
    return `${pageHeader('Enrolled Courses','Course cards are focused only on schedule and attendance information.')}
      <div class="course-grid">${courses.map(c=>VeriSync.courseCard(c,VeriSync.teacherById(db,c.teacherId),subjectAttendance(db,c.id),`<button class="btn btn-ghost btn-sm" data-course-attendance="${c.id}">${VeriSync.icons.chart} Attendance</button><button class="btn btn-soft btn-sm" data-open-course="${c.id}">${VeriSync.icons.eye} Open</button>`)).join('')}</div>`;
  }

  function renderSchedule(){
    const db=VeriSync.getDB();
    return `${pageHeader('Class Schedule','Daily and weekly schedule for enrolled attendance courses.',`<button class="btn btn-secondary" data-export-schedule>${VeriSync.icons.download} Export</button>`)}
      <article class="card"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Date</th><th>Time</th><th>Course</th><th>Teacher</th><th>Room</th><th>Type</th><th>Status</th><th>Attendance</th></tr></thead><tbody>${db.schedule.map(i=>{const c=VeriSync.courseById(db,i.courseId),t=VeriSync.teacherById(db,c.teacherId),live=db.attendanceSessions.find(s=>s.courseId===c.id&&s.status==='Live');return `<tr><td>${VeriSync.formatDate(i.date)}</td><td>${i.start}–${i.end}</td><td><strong>${c.name}</strong><br><span class="text-muted">${c.code}</span></td><td>${t.name}</td><td>${i.room}</td><td>${i.type}</td><td>${VeriSync.statusBadge(live?'Attendance Open':i.status)}</td><td>${live?`<button class="btn btn-primary btn-sm" data-nav="mark-attendance">Mark now</button>`:'—'}</td></tr>`}).join('')}</tbody></table></div></div></article>`;
  }

  function renderMarkAttendance(){
    const db=VeriSync.getDB(),live=db.attendanceSessions.find(s=>s.status==='Live'),course=live?VeriSync.courseById(db,live.courseId):null,teacher=course?VeriSync.teacherById(db,course.teacherId):null;
    if(!live)return `${pageHeader('Mark Attendance','Dynamic QR and face verification are available only during an active teacher session.')}<article class="card"><div class="empty-state"><div class="empty-icon">${VeriSync.icons.qr}</div><h3>No active attendance session</h3><p>When your teacher starts a session, the course will appear here automatically.</p><button class="btn btn-secondary" data-nav="schedule">View Class Schedule</button></div></article>`;
    return `${pageHeader('Mark Attendance',`${course.name} · ${teacher.name}`)}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Step 1 · Validate ${live.method==='otp'?'Email OTP':'dynamic QR'}</h3><p>Enter the code ${live.method==='otp'?'sent to your email':'displayed in the classroom'} for this frontend demo</p></div>${VeriSync.statusBadge('Open')}</div><div class="card-body">${live.method==='otp'?`<div class="form-group"><label class="form-label">Email OTP Code</label><input class="input" id="studentOtpCode" placeholder="Enter the 6-digit OTP code"><span class="form-hint">Demo OTP code: <strong>${live.token}</strong></span></div><button class="btn btn-primary btn-block mt-3" id="validateStudentOTP">Verify OTP</button>`:`<div class="qr-code" id="studentQRPreview"></div><div class="form-group"><label class="form-label">Attendance session code</label><input class="input" id="studentAttendanceCode" placeholder="Enter the six-character code" maxlength="12"><span class="form-hint">Demo live code: <strong>${live.token}</strong></span></div><button class="btn btn-primary btn-block mt-3" id="validateStudentQR">Validate QR Session</button>`}</div></article>
      <article class="card"><div class="card-header"><div><h3>Verification progress</h3><p>Every check must succeed before attendance is recorded</p></div></div><div class="card-body"><div class="verification-steps"><div class="verify-step" id="verifyQrStep"><span class="step-number">1</span><div><strong>${live.method==='otp'?'Email OTP Verification':'Dynamic QR'}</strong><div class="text-muted">Validate ${live.method==='otp'?'email delivery and code':'class, course and active time window'}.</div></div></div><div class="verify-step" id="verifySubmitStep"><span class="step-number">2</span><div><strong>Attendance confirmation</strong><div class="text-muted">Record Present once all checks succeed.</div></div></div></div></div></article></div>`;
  }

  function renderHistory(){
    const db=VeriSync.getDB(),records=myRecords(db).slice().reverse();
    return `${pageHeader('Attendance History','Only your own attendance records are visible.',`<button class="btn btn-secondary" data-export-history>${VeriSync.icons.download} Download Personal Report</button>`)}
      <article class="card"><div class="card-body"><div class="toolbar"><div class="search-box">${VeriSync.icons.search}<input id="historySearch" placeholder="Search course or date"></div><div class="toolbar-group"><select class="select" id="historyCourse"><option value="">All courses</option>${enrolledCourses(db).map(c=>`<option value="${c.id}">${c.code}</option>`).join('')}</select><select class="select" id="historyStatus"><option value="">All statuses</option><option>Present</option><option>Absent</option></select></div></div><div class="table-wrap"><table><thead><tr><th>Date</th><th>Course</th><th>Teacher</th><th>Status</th><th>Verification</th><th>Time</th><th>Correction</th></tr></thead><tbody id="historyRows">${historyRows(db,records)}</tbody></table></div></div></article>`;
  }
  function historyRows(db,records){const sid=myRecordStudentId(db);return records.map(r=>{const c=VeriSync.courseById(db,r.courseId),t=VeriSync.teacherById(db,c.teacherId),cor=db.corrections.find(x=>x.studentId===sid&&x.courseId===r.courseId&&x.date===r.date);return `<tr><td>${VeriSync.formatDate(r.date)}</td><td><strong>${c.name}</strong><br><span class="text-muted">${c.code}</span></td><td>${t.name}</td><td>${VeriSync.attendanceStatusBadge(r.status)}</td><td>${r.method}</td><td>${r.time}</td><td>${cor?VeriSync.statusBadge(cor.status):r.status==='Absent'?`<button class="btn btn-soft btn-sm" data-correct-record="${r.id}">Request</button>`:'—'}</td></tr>`}).join('')||VeriSync.tableEmpty('Your attendance records will appear after conducted classes.',7);}

  function renderAnalytics(){
    const db=VeriSync.getDB(),courses=enrolledCourses(db),student=demoStudent(db),overall=student.attendance;
    const low=courses.map(c=>({course:c,value:subjectAttendance(db,c.id)})).filter(x=>x.value<db.settings.attendanceThreshold);
    return `${pageHeader('Attendance Analytics','Daily, weekly, monthly and subject-wise views of your personal data.',`<button class="btn btn-secondary" data-export-analytics>${VeriSync.icons.download} Download Summary</button>`)}
      ${low.length?`<div class="alert warning mb-3"><span>${VeriSync.icons.alert}</span><div><h4>${low.length} subject${low.length>1?'s are':' is'} below ${db.settings.attendanceThreshold}%</h4><p>Review the subject table and use the classes-needed estimate to plan attendance.</p></div></div>`:''}
      <div class="stats-grid">${VeriSync.statCard('Overall attendance',`${overall}%`,overall>=75?'Good standing':'Below threshold','attendance')}${VeriSync.statCard('Classes present',31,'Across current subject records','check')}${VeriSync.statCard('Classes absent',5,'Review incorrect entries promptly','alert','trend-down')}${VeriSync.statCard('Current threshold',`${db.settings.attendanceThreshold}%`,'Configured by college admin','shield')}</div>
      <div class="grid grid-2"><article class="card chart-card"><div class="card-header"><div><h3>Weekly trend</h3><p>Attendance percentage by week</p></div></div><div class="card-body"><canvas id="studentWeeklyChart"></canvas></div></article><article class="card chart-card"><div class="card-header"><div><h3>Daily attendance</h3><p>Present classes across the current week</p></div></div><div class="card-body"><canvas id="studentDailyChart"></canvas></div></article></div>
      <article class="card mt-3"><div class="card-header"><div><h3>Subject-wise attendance</h3><p>Classes required to reach or maintain the official threshold</p></div></div><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Subject</th><th>Teacher</th><th>Present</th><th>Conducted</th><th>Attendance</th><th>Status</th><th>Classes needed for 75%</th></tr></thead><tbody>${courses.map((c,i)=>{const t=VeriSync.teacherById(db,c.teacherId),pct=subjectAttendance(db,c.id),conducted=18+i*2,present=Math.round(conducted*pct/100),needed=classesNeeded(present,conducted,db.settings.attendanceThreshold);return `<tr><td><strong>${c.name}</strong><br><span class="text-muted">${c.code}</span></td><td>${t.name}</td><td>${present}</td><td>${conducted}</td><td><div style="min-width:130px"><div class="flex justify-between"><strong>${pct}%</strong></div><div class="progress"><div class="progress-bar ${pct<65?'danger':pct<75?'warning':'success'}" style="width:${pct}%"></div></div></div></td><td>${VeriSync.statusBadge(pct>=75?'Good':pct>=65?'Warning':'Critical')}</td><td>${needed===0?'Maintaining threshold':`${needed} consecutive class${needed>1?'es':''}`}</td></tr>`}).join('')}</tbody></table></div></div></article>`;
  }

  function classesNeeded(present,conducted,target){let n=0;while(n<200&&((present+n)/(conducted+n))*100<target)n++;return n;}

  function renderCorrections(){
    const db=VeriSync.getDB(),studentId=myRecordStudentId(db),items=db.corrections.filter(c=>c.studentId===studentId);
    return `${pageHeader('Correction Requests','Report an incorrect attendance record without modifying official data.',`<button class="btn btn-primary" id="newCorrectionBtn">${VeriSync.icons.plus} New Request</button>`)}
      <article class="card"><div class="card-body"><div class="table-wrap"><table><thead><tr><th>Course & date</th><th>Requested change</th><th>Reason</th><th>Teacher recommendation</th><th>Admin decision</th><th>Status</th></tr></thead><tbody>${items.map(c=>{const course=VeriSync.courseById(db,c.courseId);return `<tr><td><strong>${course?.name||'Course'}</strong><br><span class="text-muted">${VeriSync.formatDate(c.date)}</span></td><td>${c.current} → <strong>${c.requested}</strong></td><td style="max-width:320px">${VeriSync.escapeHTML(c.reason)}</td><td>${VeriSync.statusBadge(c.teacherRecommendation)}</td><td>${VeriSync.statusBadge(c.adminDecision)}</td><td>${VeriSync.statusBadge(c.status)}</td></tr>`}).join('')||VeriSync.tableEmpty('You have not submitted any attendance correction requests.',6)}</tbody></table></div></div></article>`;
  }

  function renderCalendar(){
    const db=VeriSync.getDB();
    const events={15:'Teaching starts',18:'5G class',20:'Cloud class',23:'Attendance review',24:'5G class',25:'Cloud class',27:'IoT practical'};
    return `${pageHeader('Academic Calendar','Dates before teaching start are Not Applicable and holidays are excluded.')}
      <article class="card"><div class="card-header"><div><h3>July 2026</h3><p>Semester IV · MCA Second Year · Section A</p></div><span class="badge badge-primary">Teaching starts 15 Jul</span></div><div class="card-body calendar-scroll"><div class="calendar-grid">${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=>`<div class="calendar-head">${x}</div>`).join('')}${Array.from({length:3},()=>'<div class="calendar-day muted"></div>').join('')}${Array.from({length:31},(_,i)=>{const d=i+1,pre=d<15,sunday=new Date(2026,6,d).getDay()===0;return `<div class="calendar-day ${d===23?'today':''} ${pre?'muted':''}"><span class="calendar-date">${d}</span>${pre?'<div class="calendar-event">NA</div>':sunday?'<div class="calendar-event holiday">Weekly off</div>':events[d]?`<div class="calendar-event">${events[d]}</div>`:''}</div>`}).join('')}</div></div></article>`;
  }

  function renderHolidays(){
    const db=VeriSync.getDB();
    return `${pageHeader('Holidays','Official holidays never count as absence.')}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Upcoming holidays</h3><p>Configured by the admin</p></div></div><div class="card-body"><div class="list">${db.holidays.map(h=>`<div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.holiday}</span><div><p class="list-title">${h.name}</p><p class="list-subtitle">${VeriSync.formatDate(h.start)}${h.end!==h.start?` – ${VeriSync.formatDate(h.end)}`:''} · ${h.type}</p></div></div>${VeriSync.statusBadge(h.status)}</div>`).join('')}</div></div></article><article class="card"><div class="card-header"><div><h3>How holidays affect attendance</h3><p>Clear calculation rules</p></div></div><div class="card-body"><div class="verification-steps"><div class="verify-step complete"><span class="step-number">H</span><div><strong>Holiday</strong><div class="text-muted">Excluded from classes conducted.</div></div></div><div class="verify-step complete"><span class="step-number">C</span><div><strong>Cancelled class</strong><div class="text-muted">Excluded from percentage calculation.</div></div></div><div class="verify-step complete"><span class="step-number">NA</span><div><strong>Not applicable</strong><div class="text-muted">Used before the teaching start date.</div></div></div><div class="verify-step complete"><span class="step-number">1</span><div><strong>Special working day</strong><div class="text-muted">Attendance is counted when a class is officially scheduled.</div></div></div></div></div></article></div>`;
  }

  function renderProfile(){
    return `${pageHeader('My Profile','Your official academic identity used for attendance verification.')}
      <div class="profile-hero"><div class="profile-identity"><span class="avatar lg">${VeriSync.initials(user.name)}</span><div><h2>${user.name}</h2><p>${user.roll} · ${user.programme} ${user.year} · Semester ${user.semester}</p></div></div></div>
      <article class="card mt-3"><div class="card-header"><div><h3>Verified academic details</h3><p>Restricted fields require an admin change request</p></div><button class="btn btn-secondary" id="editStudentProfile">${VeriSync.icons.edit} Edit allowed fields</button></div><div class="card-body"><div class="detail-grid"><div class="detail-item"><span>Registration number</span><strong>${user.registration}</strong></div><div class="detail-item"><span>Verified email</span><strong>${user.email}</strong></div><div class="detail-item"><span>Phone</span><strong>${user.phone}</strong></div><div class="detail-item"><span>Department</span><strong>${user.department}</strong></div><div class="detail-item"><span>Session / Semester</span><strong>${user.session} / ${user.semester}</strong></div><div class="detail-item"><span>Section</span><strong>${user.section}</strong></div><div class="detail-item"><span>Face verification</span><strong>${user.faceStatus}</strong></div><div class="detail-item"><span>Account status</span><strong>Active</strong></div></div></div></article>`;
  }

  function renderSecurity(){
    return `${pageHeader('Security & Face Enrolment','Protect your student account and verification identity.')}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Face verification</h3><p>Attendance identity status</p></div>${VeriSync.statusBadge(user.faceStatus)}</div><div class="card-body"><div class="face-frame" style="min-height:260px"><div class="face-outline" style="width:125px;height:170px"></div><span class="badge badge-success" style="position:absolute;bottom:18px">Enrolment status: ${user.faceStatus}</span></div><button class="btn btn-primary btn-block mt-3" id="startFaceRegistration">Register Face via Webcam</button></div></article><article class="card"><div class="card-header"><div><h3>Login activity</h3><p>Recent account access</p></div></div><div class="card-body"><div class="list"><div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.shield}</span><div><p class="list-title">Windows · Edge</p><p class="list-subtitle">Current session · Patna, India</p></div></div>${VeriSync.statusBadge('Active')}</div><div class="list-item"><div class="list-main"><span class="list-icon">${VeriSync.icons.profile}</span><div><p class="list-title">Android · Chrome</p><p class="list-subtitle">Yesterday at 19:12</p></div></div>${VeriSync.statusBadge('Closed')}</div></div><button class="btn btn-secondary btn-block mt-3" id="logoutAllStudent">Logout from all other devices</button><button class="btn btn-primary btn-block mt-2" id="changeStudentPassword">Change password</button></div></article></div>`;
  }

  function renderSettings(){
    return `${pageHeader('Student Settings','Manage attendance alerts, display and account preferences.',`<button class="btn btn-primary" id="saveStudentSettings">Save Settings</button>`)}
      <div class="grid grid-2"><article class="card"><div class="card-header"><div><h3>Attendance notifications</h3><p>Important attendance alerts remain available</p></div></div><div class="card-body"><div class="setting-row"><div><h4>Attendance session alerts</h4><p>Notify when a teacher opens attendance.</p></div><label class="switch"><input type="checkbox" checked><span class="switch-slider"></span></label></div><div class="setting-row"><div><h4>Low-attendance warnings</h4><p>Notify when a subject falls below threshold.</p></div><label class="switch"><input type="checkbox" checked><span class="switch-slider"></span></label></div><div class="setting-row"><div><h4>Correction updates</h4><p>Notify when teacher or admin reviews a request.</p></div><label class="switch"><input type="checkbox" checked><span class="switch-slider"></span></label></div></div></article><article class="card"><div class="card-header"><div><h3>Display preferences</h3><p>Improve accessibility and readability</p></div></div><div class="card-body"><div class="form-group"><label class="form-label">Default analytics period</label><select class="select"><option>Weekly</option><option selected>Monthly</option><option>Semester</option></select></div><div class="setting-row"><div><h4>Reduced animation</h4><p>Use fewer visual transitions.</p></div><label class="switch"><input type="checkbox"><span class="switch-slider"></span></label></div><div class="setting-row"><div><h4>Large text</h4><p>Increase the size of interface labels.</p></div><label class="switch"><input type="checkbox"><span class="switch-slider"></span></label></div></div></article></div>`;
  }

  function openCourse(courseId){
    const db=VeriSync.getDB(),c=VeriSync.courseById(db,courseId),t=VeriSync.teacherById(db,c.teacherId),pct=subjectAttendance(db,c.id);
    VeriSync.openModal({title:'Attendance Course',large:true,body:`<div class="course-classroom-hero"><div><h2>${c.name}</h2><p>${c.code} · Semester ${c.semester} · Section ${c.section}</p></div></div><div class="tabs mt-3"><button class="tab active">Overview</button><button class="tab">Schedule</button><button class="tab">Attendance</button><button class="tab">People</button></div><div class="grid grid-3 mt-3"><div class="detail-item"><span>Teacher</span><strong>${t.name}</strong></div><div class="detail-item"><span>My attendance</span><strong>${pct}%</strong></div><div class="detail-item"><span>Next class</span><strong>${c.nextClass}</strong></div></div><div class="alert ${pct>=75?'success':'warning'} mt-3"><span>${pct>=75?VeriSync.icons.check:VeriSync.icons.alert}</span><div><h4>${pct>=75?'Attendance in good standing':'Attendance below threshold'}</h4><p>This course view intentionally contains attendance and schedule information only.</p></div></div>`});
  }

  function openCorrectionForm(record=null){
    const db=VeriSync.getDB(),courses=enrolledCourses(db),sid=myRecordStudentId(db),selectedCourse=record?.courseId||courses[0].id,selectedDate=record?.date||VeriSync.todayISO(),current=record?.status||'Absent';
    VeriSync.openModal({title:'New Attendance Correction Request',body:`<form id="studentCorrectionForm" class="form-grid"><div class="form-group full"><label class="form-label">Course</label><select class="select" name="courseId">${courses.map(c=>`<option value="${c.id}" ${c.id===selectedCourse?'selected':''}>${c.name} · ${c.code}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Class date</label><input class="input" type="date" name="date" value="${selectedDate}"></div><div class="form-group"><label class="form-label">Current status</label><select class="select" name="current"><option ${current==='Absent'?'selected':''}>Absent</option><option ${current==='Pending Review'?'selected':''}>Pending Review</option></select></div><div class="form-group"><label class="form-label">Requested status</label><select class="select" name="requested"><option>Present</option><option>Excused Absence</option></select></div><div class="form-group full"><label class="form-label">Reason</label><textarea class="textarea" name="reason" placeholder="Explain the technical or attendance issue clearly." required></textarea><span class="form-hint">Requests must be submitted within ${db.settings.correctionDeadlineHours} hours unless special approval is granted.</span></div></form>`,footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" id="submitCorrection">Submit Request</button>`,onOpen(modal){modal.querySelector('#submitCorrection').onclick=()=>{const data=Object.fromEntries(new FormData(modal.querySelector('#studentCorrectionForm')));if(!data.reason.trim())return VeriSync.showToast('Reason required','Explain why the attendance record should be reviewed.','error');VeriSync.updateDB(db2=>{db2.corrections.push({...data,id:VeriSync.uid('cor'),studentId:sid,teacherRecommendation:'Pending',adminDecision:'Pending',status:'Under Teacher Review'});return db2;});VeriSync.closeModal();VeriSync.showToast('Correction request submitted','The assigned teacher will review it before admin decision.');portal.showView('corrections',false);};}});
  }

  function markVerificationComplete(live){
    const db=VeriSync.getDB(),sid=myRecordStudentId(db),existing=db.attendanceRecords.find(r=>r.studentId===sid&&r.courseId===live.courseId&&r.date===live.date);
    if(existing&&existing.status==='Present'){VeriSync.showToast('Attendance already recorded','This class already has a successful Present record.');return;}
    VeriSync.updateDB(db2=>{const record=db2.attendanceRecords.find(r=>r.studentId===sid&&r.courseId===live.courseId&&r.date===live.date);if(record){Object.assign(record,{status:'Present',value:1,method:'QR Verification',time:new Date().toTimeString().slice(0,5)});}else db2.attendanceRecords.push({id:VeriSync.uid('att'),studentId:sid,courseId:live.courseId,date:live.date,status:'Present',value:1,method:'QR Verification',time:new Date().toTimeString().slice(0,5)});const sess=db2.attendanceSessions.find(s=>s.id===live.id);if(sess)sess.present=Math.min(sess.total,(sess.present||0)+1);return db2;});
    ['verifyQrStep','verifySubmitStep'].forEach(id=>document.getElementById(id)?.classList.add('complete'));
    VeriSync.showToast('Attendance marked successfully',`${VeriSync.courseById(db,live.courseId).code} was recorded as Present.`);
    setTimeout(()=>portal.showView('history'),1200);
  }

  document.addEventListener('click',event=>{
    const navEl=event.target.closest('[data-nav]');if(navEl)return portal.showView(navEl.dataset.nav);
    const open=event.target.closest('[data-open-course]');if(open)return openCourse(open.dataset.openCourse);
    const ca=event.target.closest('[data-course-attendance]');if(ca){portal.showView('analytics');return;}
    if(event.target.id==='validateStudentQR'){
      const db=VeriSync.getDB(),live=db.attendanceSessions.find(s=>s.status==='Live'),input=document.getElementById('studentAttendanceCode').value.trim();
      if(!live||input.toUpperCase()!==live.token.toUpperCase())return VeriSync.showToast('QR validation failed','The code is invalid, expired or belongs to another session.','error');
      document.getElementById('verifyQrStep').classList.add('complete');
      event.target.disabled=true;
      event.target.textContent='Marking attendance...';
      setTimeout(()=>markVerificationComplete(live), 1000);
    }
    if(event.target.id==='validateStudentOTP'){
      const db=VeriSync.getDB(),live=db.attendanceSessions.find(s=>s.status==='Live'),input=document.getElementById('studentOtpCode').value.trim();
      if(!live||input.toUpperCase()!==live.token.toUpperCase())return VeriSync.showToast('OTP validation failed','The OTP is invalid or expired.','error');
      document.getElementById('verifyQrStep').classList.add('complete');
      event.target.disabled=true;
      event.target.textContent='Verifying OTP...';
      setTimeout(()=>markVerificationComplete(live), 1000);
    }
    if(event.target.id==='newCorrectionBtn')return openCorrectionForm();
    const correction=event.target.closest('[data-correct-record]');if(correction){const db=VeriSync.getDB(),record=db.attendanceRecords.find(r=>r.id===correction.dataset.correctRecord);return openCorrectionForm(record);}
    if(event.target.matches('[data-export-schedule]'))return VeriSync.exportCSV('student-class-schedule.csv',VeriSync.getDB().schedule);
    if(event.target.matches('[data-export-history]')){const db=VeriSync.getDB();return VeriSync.exportCSV('my-attendance-history.csv',myRecords(db).map(r=>{const c=VeriSync.courseById(db,r.courseId);return {Date:r.date,Course:c.name,Code:c.code,Status:r.status,Verification:r.method,Time:r.time};}));}
    if(event.target.matches('[data-export-analytics]')){const db=VeriSync.getDB();return VeriSync.exportCSV('my-attendance-summary.csv',enrolledCourses(db).map(c=>({Course:c.name,Code:c.code,Attendance:subjectAttendance(db,c.id),Threshold:db.settings.attendanceThreshold})));}
    if(event.target.id==='editStudentProfile')return VeriSync.openModal({title:'Edit Allowed Profile Fields',body:`<form class="form-grid"><div class="form-group full"><label class="form-label">Phone number</label><input class="input" value="${user.phone}"></div><div class="form-group full"><label class="form-label">Recovery email</label><input class="input" type="email" placeholder="Optional recovery email"></div></form>`,footer:`<button class="btn btn-secondary" data-modal-close>Cancel</button><button class="btn btn-primary" data-modal-close onclick="VeriSync.showToast('Profile updated','Editable student fields were saved in this frontend demo.')">Save</button>`});
    
    if(event.target.id==='startFaceRegistration'){
      let localStream = null;
      VeriSync.openModal({
        title: 'Webcam Face Registration',
        large: true,
        body: `<div class="webcam-container"><video id="studentWebcam" autoplay playsinline muted></video><div class="webcam-overlay"><div class="face-guide"></div><div class="scan-line hidden" id="studentScanLine"></div></div></div><p class="text-center mt-2 text-muted">Please look directly into the camera</p>`,
        footer: `<button class="btn btn-secondary" data-modal-close id="cancelWebcamBtn">Cancel</button><button class="btn btn-primary" id="captureFaceBtn">Register Face</button>`,
        onOpen: (modal) => {
          const video = modal.querySelector('#studentWebcam');
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => { localStream = stream; video.srcObject = stream; })
            .catch(err => VeriSync.showToast('Camera error', 'Failed to access webcam.', 'error'));
            
          modal.querySelector('#captureFaceBtn').onclick = (e) => {
            const btn = e.target;
            btn.disabled = true;
            btn.textContent = 'Scanning...';
            modal.querySelector('#studentScanLine').classList.remove('hidden');
            setTimeout(() => {
              VeriSync.updateDB(db2 => {
                db2.users.student.faceStatus = 'Verified';
                return db2;
              });
              user.faceStatus = 'Verified';
              VeriSync.showToast('Face Registered', 'Your face has been successfully registered via webcam.');
              VeriSync.closeModal();
              portal.showView('security');
            }, 2500);
          };
          
          modal.querySelector('#cancelWebcamBtn').onclick = () => {
            if (localStream) localStream.getTracks().forEach(t => t.stop());
          };
        }
      });
      document.getElementById('globalModal').addEventListener('click', (e) => {
        if (e.target.matches('[data-modal-close]') || e.target.id === 'globalModal') {
          if (localStream) localStream.getTracks().forEach(t => t.stop());
        }
      });
    }
    if(event.target.id==='logoutAllStudent')VeriSync.showToast('Other sessions revoked','Only the current frontend session remains active.');
    if(event.target.id==='changeStudentPassword')VeriSync.showToast('Password workflow opened','Production password changes require backend verification.');
    if(event.target.id==='saveStudentSettings')VeriSync.showToast('Settings saved','Your attendance and display preferences were stored locally.');
  });

  document.addEventListener('input',event=>{
    if(['historySearch','historyCourse','historyStatus'].includes(event.target.id)){
      const db=VeriSync.getDB(),q=(document.getElementById('historySearch')?.value||'').toLowerCase(),course=document.getElementById('historyCourse')?.value||'',status=document.getElementById('historyStatus')?.value||'';
      const records=myRecords(db).filter(r=>{const c=VeriSync.courseById(db,r.courseId);return(!q||[c?.name,c?.code,r.date].some(v=>(v||'').toLowerCase().includes(q)))&&(!course||r.courseId===course)&&(!status||r.status===status)}).reverse();document.getElementById('historyRows').innerHTML=historyRows(db,records);
    }
  });

  window.afterViewRender=id=>{
    if(id==='dashboard')VeriSync.drawLineChart(document.getElementById('studentDashboardChart'),['Mon','Tue','Wed','Thu','Fri','Sat'],[80,83,78,88,92,90]);
    if(id==='analytics'){VeriSync.drawLineChart(document.getElementById('studentWeeklyChart'),['W1','W2','W3','W4','W5'],[78,80,84,87,89]);VeriSync.drawBarChart(document.getElementById('studentDailyChart'),['Mon','Tue','Wed','Thu','Fri','Sat'],[80,100,67,100,75,100]);}
    if(id==='mark-attendance'){const live=VeriSync.getDB().attendanceSessions.find(s=>s.status==='Live');if(live&&live.method!=='otp')VeriSync.renderQR(document.getElementById('studentQRPreview'),live.token);}
  };
  window.afterViewRender(location.hash.replace('#','')||'dashboard');
  window.addEventListener('resize',()=>window.afterViewRender?.(location.hash.replace('#','')||'dashboard'));
})();
