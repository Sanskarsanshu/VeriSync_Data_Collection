import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  User, Mail, Phone, MapPin, Award, BookOpen, FileText, 
  GraduationCap, Briefcase, ExternalLink, Library
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/store/useAppStore';
import { fetchWithAuth } from '@/store/useDataStore';
import { teacherProfilesData } from '@/data/teacherProfiles';

export default function TeacherMyProfile() {
  const { user } = useAppStore();

  const profile = Object.values(teacherProfilesData).find(
    (t) => t.email.toLowerCase() === user?.email?.toLowerCase()
  );

  const [currentStatus, setCurrentStatus] = React.useState<string>('ACTIVE');
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  React.useEffect(() => {
    fetchWithAuth('/teacher-portal/dashboard')
      .then(d => { if (d.status) setCurrentStatus(d.status); })
      .catch(console.error);
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    setCurrentStatus(newStatus);
    try {
      await fetchWithAuth('/teacher-portal/status', {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const name = profile?.name || user?.name || 'Unknown Teacher';
  const email = profile?.email || user?.email || '';
  const avatarPath = profile?.image || '';
  const designation = profile?.designation || 'Lecturer';
  const qualifications = profile?.qualifications || '';
  const department = profile?.department || 'Department of Computer Applications';
  const phone = profile?.phone || '+91 9876543210';
  const vidwanId = profile?.vidwanId || null;
  const orcidId = profile?.orcidId || null;

  const publications = profile?.publications || [];
  const achievements = profile?.achievements || [];
  const experience = profile?.workExperience || [];
  const committees = profile?.committees || [];

  const journals = publications.filter((p: any) => p.journal);
  const books = publications.filter((p: any) => p.book);

  const getInitials = (n: string) => n.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase();

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        {/* Header Profile Section */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -z-10" />
          
          <div className="shrink-0 relative group">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-cyan-500 p-1 shadow-xl">
              {avatarPath ? (
                <img 
                  src={avatarPath} 
                  alt={name} 
                  className="w-full h-full object-cover rounded-full border-4 border-background bg-white"
                />
              ) : (
                <div className="w-full h-full object-cover rounded-full border-4 border-background bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
                  {getInitials(name)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
              {designation.split('/')[0]}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{name}</h1>
                {qualifications && <p className="text-lg text-blue-500 font-semibold mt-1">{qualifications}</p>}
              </div>
              <div className="flex flex-col items-center md:items-end gap-1.5">
                <Label className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    currentStatus === 'ACTIVE' ? 'text-green-500' :
                    currentStatus === 'ON_LEAVE' ? 'text-yellow-500' :
                    'text-red-500'
                  }`}
                >
                  {currentStatus === 'ACTIVE' ? 'ACTIVE' : currentStatus === 'ON_LEAVE' ? 'ON LEAVE' : 'INACTIVE'}
                </Label>
                <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                  <span className={`text-xs font-medium transition-colors ${currentStatus === 'ACTIVE' ? 'text-green-500' : 'text-muted-foreground'}`}>Normal</span>
                  <Switch 
                    id="teacher-status-toggle"
                    checked={currentStatus === 'ON_LEAVE'}
                    disabled={currentStatus === 'INACTIVE' || isUpdatingStatus}
                    onCheckedChange={(checked) => handleStatusChange(checked ? 'ON_LEAVE' : 'ACTIVE')}
                    className={`transition-colors ${
                      currentStatus === 'ON_LEAVE' ? '!bg-yellow-500' : 
                      currentStatus === 'ACTIVE' ? '!bg-green-500' : '!bg-red-500 opacity-50'
                    }`}
                  />
                  <span className={`text-xs font-medium transition-colors ${currentStatus === 'ON_LEAVE' ? 'text-yellow-500' : 'text-muted-foreground'}`}>On Leave</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {vidwanId && (
                <a href={`https://vidwan.inflibnet.ac.in//profile/${vidwanId}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium border border-blue-500/20">
                  <ExternalLink size={14} /> Vidwan ID: {vidwanId}
                </a>
              )}
              {orcidId && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20">
                  ORCID: {orcidId}
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 text-sm font-medium border border-indigo-500/20">
                <Briefcase size={14} /> {department}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 justify-center md:justify-start"><Mail size={16} className="text-blue-500"/> {email}</div>
              {phone && <div className="flex items-center gap-2 justify-center md:justify-start"><Phone size={16} className="text-blue-500"/> {phone}</div>}
              <div className="flex items-center gap-2 justify-center md:justify-start sm:col-span-2"><MapPin size={16} className="text-blue-500"/> Patna Women’s College, Patna, Bihar</div>
            </div>
          </div>
        </div>

        {/* Info Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <SectionCard title="Experience" icon={<Briefcase />}>
              <div className="space-y-4">
                {experience.length > 0 ? experience.map((exp: any, i: number) => (
                  <TimelineItem key={i} year={exp.duration.split('-')[0].trim()} title={exp.role} subtitle={exp.org} />
                )) : (
                  <p className="text-sm text-muted-foreground">No experience details available.</p>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Honours & Awards" icon={<Award />}>
              <div className="space-y-3">
                {achievements.length > 0 ? achievements.map((ach: string, i: number) => (
                  <AwardItem key={i} title={ach} org="Recognized Award" />
                )) : (
                  <p className="text-sm text-muted-foreground">No awards listed.</p>
                )}
              </div>
            </SectionCard>

            {committees.length > 0 && (
              <SectionCard title="Committees" icon={<User />}>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                  {committees.map((com: string, i: number) => (
                    <li key={i}>{com}</li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </div>

          {/* Right Column (Publications) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold">Journal Publications ({journals.length})</h2>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {journals.length > 0 ? journals.map((pub: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 hover:border-indigo-500/30 transition-colors group relative">
                    <span className="absolute top-4 right-4 text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-1 rounded">{pub.year}</span>
                    <h3 className="font-semibold text-foreground pr-12 leading-snug mb-1">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.journal}</p>
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-500 mt-2 hover:underline">
                        View Publication <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                )) : (
                  <p className="text-muted-foreground">No journal publications available.</p>
                )}
              </div>
            </div>

            {/* Books & Chapters Section */}
            {books.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Books & Chapters ({books.length})</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {books.map((b: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-border/50 bg-background/50 flex flex-col gap-2 hover:border-blue-500/30 transition-colors group">
                      <h3 className="font-semibold text-foreground leading-snug">{b.title}</h3>
                      <p className="text-sm text-muted-foreground mt-auto">{b.book}</p>
                      <div className="text-xs font-bold text-blue-500 mt-1">{b.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

function SectionCard({ title, icon, children }: any) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
        <div className="text-blue-500">
          {icon}
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TimelineItem({ year, title, subtitle }: any) {
  return (
    <div className="relative pl-6 before:absolute before:left-1 before:top-2 before:bottom-[-16px] before:w-[2px] before:bg-border last:before:hidden">
      <div className="absolute left-[1px] top-2 w-2 h-2 rounded-full bg-blue-500 ring-4 ring-background" />
      <span className="text-xs font-bold text-blue-500">{year}</span>
      <h3 className="font-semibold text-foreground text-sm mt-0.5">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function AwardItem({ title, org }: any) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/50 last:border-0 last:pb-0">
      <div>
        <h3 className="font-medium text-sm text-foreground leading-tight">{title}</h3>
      </div>
    </div>
  );
}