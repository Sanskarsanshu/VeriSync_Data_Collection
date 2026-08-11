import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  User, Mail, Phone, Award, BookOpen, FileText, 
  GraduationCap, Briefcase, ExternalLink, Library, ChevronLeft, ShieldCheck, Star
} from 'lucide-react';
import { teacherProfilesData } from '@/data/teacherProfiles';

export default function AdminTeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const profile = id ? teacherProfilesData[id] : null;

  if (!profile) {
    return <Navigate to="/admin/teachers" replace />;
  }

  const journals = profile.publications.filter(p => p.journal);
  const books = profile.publications.filter(p => p.book);

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        <Link to="/admin/teachers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ChevronLeft size={16} className="mr-1" /> Back to Teacher Management
        </Link>

        {/* Header Profile Section */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-bl-full -z-10" />
          
          <div className="shrink-0 relative group">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-500 to-indigo-500 p-1 shadow-xl flex items-center justify-center overflow-hidden">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover rounded-full border-4 border-background bg-white" />
              ) : (
                <div className="w-full h-full rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden text-5xl font-bold text-muted-foreground">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
              {profile.designation.split('/')[0]}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">{profile.name}</h1>
              <p className="text-lg text-violet-500 font-semibold mt-1">{profile.qualifications}</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {profile.vidwanId && (
                <a href={`https://vidwan.inflibnet.ac.in//profile/${profile.vidwanId}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium border border-blue-500/20">
                  <ExternalLink size={14} /> Vidwan ID: {profile.vidwanId}
                </a>
              )}
              {profile.orcidId && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20">
                  ORCID: {profile.orcidId}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail size={16} className="text-violet-500"/> {profile.email}
              </div>
              {profile.phone && (
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone size={16} className="text-violet-500"/> {profile.phone}
                </div>
              )}
              <div className="flex items-center gap-2 justify-center md:justify-start sm:col-span-2 mt-2">
                <Briefcase size={16} className="text-violet-500"/> {profile.department} - Patna Women’s College
              </div>
            </div>
          </div>
        </div>

        {/* Info Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            
            {profile.workExperience.length > 0 && (
              <SectionCard title="Work Experience" icon={<Briefcase />}>
                <div className="space-y-4">
                  {profile.workExperience.map((we, i) => (
                    <TimelineItem key={i} year={we.duration} title={we.role} subtitle={we.org} />
                  ))}
                </div>
              </SectionCard>
            )}

            {profile.achievements.length > 0 && (
              <SectionCard title="Honours & Achievements" icon={<Award />}>
                <div className="space-y-3">
                  {profile.achievements.map((ach, i) => (
                    <div key={i} className="flex items-start gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <Star size={14} className="text-violet-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-foreground leading-snug">{ach}</p>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {profile.committees.length > 0 && (
              <SectionCard title="Committees & Memberships" icon={<User />}>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                  {profile.committees.map((com, i) => (
                    <li key={i}>{com}</li>
                  ))}
                </ul>
              </SectionCard>
            )}
            
            {profile.training && profile.training.length > 0 && (
              <SectionCard title="Training & Workshops" icon={<ShieldCheck />}>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                  {profile.training.map((tr, i) => (
                    <li key={i}>{tr}</li>
                  ))}
                </ul>
              </SectionCard>
            )}
            
            {profile.patents && profile.patents.length > 0 && (
              <SectionCard title="Patents" icon={<FileText />}>
                <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                  {profile.patents.map((pat, i) => (
                    <li key={i}>{pat}</li>
                  ))}
                </ul>
              </SectionCard>
            )}

          </div>

          {/* Right Column (Publications) */}
          <div className="lg:col-span-2 space-y-8">
            
            {journals.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Journal & Conference Publications ({journals.length})</h2>
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                  {journals.map((pub, i) => (
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
                  ))}
                </div>
              </div>
            )}

            {books.length > 0 && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Books & Chapters ({books.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {books.map((book, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                      <BookOpen size={18} className="text-pink-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-sm text-foreground mb-1">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">{book.book}</p>
                        {book.year && book.year !== 'N/A' && (
                          <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 bg-background rounded border border-border">{book.year}</span>
                        )}
                      </div>
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

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-border/50 pb-4">
        <div className="text-violet-500">
          {icon}
        </div>
        <h2 className="text-lg font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function TimelineItem({ year, title, subtitle }: { year: string, title: string, subtitle: string }) {
  return (
    <div className="relative pl-6 before:absolute before:left-1 before:top-2 before:bottom-[-16px] before:w-[2px] before:bg-border last:before:hidden">
      <div className="absolute left-[1px] top-2 w-2 h-2 rounded-full bg-violet-500 ring-4 ring-background" />
      <span className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">{year}</span>
      <h3 className="font-semibold text-foreground text-sm mt-0.5">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}
