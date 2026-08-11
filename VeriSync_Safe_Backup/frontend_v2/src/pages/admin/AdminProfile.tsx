import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  User, Mail, Phone, MapPin, Award, BookOpen, FileText, 
  GraduationCap, Briefcase, ExternalLink, Library
} from 'lucide-react';

const publications = [
  { title: 'Augmented Reality: A tool for Interactive Learning Environment', journal: 'SSRN Electronic Journal', year: 2022, link: 'http://DOI: 10.2139/ssrn.4066684' },
  { title: 'Augmented Reality in Education and Learning', journal: 'Explore Journal of Research', year: 2022, link: 'https://patnawomenscollege.in/augmented-reality-in-education-and-learning/' },
  { title: 'Empowering IoT through Improving Technology', journal: 'MOL2NET’22 Conference', year: 2022, link: 'https://doi.org/10.3390/mol2net-08-12633' },
  { title: 'Real Time Face Mask Detection Using Machine Learning', journal: 'Explore Journal of Research', year: 2021 },
  { title: 'Applications of Microwave Remote Sensing of Soil Moisture', journal: 'SSRN Electronic Journal', year: 2020 },
  { title: 'Li-Fi: A Framework for Future IT Environment', journal: 'Journal of Shanghai Jiaotong University', year: 2020 },
  { title: 'Post-COVID Challenges and Opportunities in the Education Sector', journal: 'SSRN Electronic Journal', year: 2020 },
  { title: 'Role of Augmented Reality Application in Higher Education Learning', journal: 'Aegaeum Journal', year: 2020 },
  { title: 'A study on DDoS Attacks, Danger, and Its Prevention', journal: 'International Journal of Research and Analytical Reviews', year: 2019 },
  { title: 'Fuzzy Logic and Network Intrusion Detection System', journal: 'International Journal of Development Research', year: 2019 },
  { title: 'E-Content: An effective tool for Blended Learning', journal: 'IJSER', year: 2018 },
  { title: 'MOOC: The New Trend of Education', journal: 'Explore Journal of Research', year: 2018 },
  { title: 'Accelerating Digital Transformation with the Internet of Everything', journal: 'CSI Communications', year: 2017 },
  { title: 'E-Waste Management “A Potential Route to Green Computing”', journal: 'IJIACS', year: 2017 },
  { title: 'Direct Benefit Transfer: Issues and Challenges', journal: 'Explore Journal of Research', year: 2017 },
  { title: 'Study on Remote File Attacking– Inclusion & Detection', journal: 'IJSEAT', year: 2014 },
  { title: 'Study of Network Intrusion Detection using Fuzzy Logic', journal: 'Journal of Physical Science', year: 2013 },
];

const conferences = [
  { title: 'E-Governance in Higher Education: Issues and Challenges', book: 'Excellence in Higher Education', year: 2020 },
  { title: 'ICT – A Catalyst for Innovation in Higher Education', book: 'Changing Perspectives of Education in India', year: 2020 },
  { title: 'ICT-A Tool for Women Empowerment', book: 'Women Empowerment Conference', year: 2019 },
  { title: 'Intrusion Detection System: Tools and Techniques', book: '6th Bihar Science Conference', year: 2014 },
  { title: 'Garbage Disposal and Solid Waste Management: e-Waste Management', book: 'Urban Infrastructure in India', year: 2017 },
];

const books = [
  { title: 'Core Java Simply In-Depth', year: 2018 },
  { title: 'Computer literacy: An Overview', year: 2014 },
  { title: 'Web Designing', year: 2014 },
  { title: '3 D Animation and Design', year: 2014 },
];

export default function AdminProfile() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        {/* Header Profile Section */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-bl-full -z-10" />
          
          <div className="shrink-0 relative group">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 p-1 shadow-xl">
              <img 
                src="/features/Bhawnasinha.png" 
                alt="Dr. Bhawna Sinha" 
                className="w-full h-full object-cover rounded-full border-4 border-background bg-white"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
              Head of Department
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Dr. Bhawna Sinha</h1>
              <p className="text-lg text-emerald-500 font-semibold mt-1">Ph.D, M.Phil, MCA, MBA</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="https://vidwan.inflibnet.ac.in//profile/339988" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors text-sm font-medium border border-blue-500/20">
                <ExternalLink size={14} /> Vidwan ID: 339988
              </a>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 text-sm font-medium border border-green-500/20">
                ORCID: 0000-0002-5460-3945
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-muted-foreground pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 justify-center md:justify-start"><Mail size={16} className="text-emerald-500"/> bhawna.mca@patnawomenscollege.in</div>
              <div className="flex items-center gap-2 justify-center md:justify-start"><Phone size={16} className="text-emerald-500"/> +91 9973261668</div>
              <div className="flex items-center gap-2 justify-center md:justify-start sm:col-span-2"><MapPin size={16} className="text-emerald-500"/> Patna Women’s College, Bailey Road, Patna, Bihar 800001</div>
            </div>
          </div>
        </div>

        {/* Info Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <SectionCard title="Expertise" icon={<Briefcase />}>
              <p className="text-foreground font-medium">Computer Science Software Engineering & Applications</p>
            </SectionCard>

            <SectionCard title="Education" icon={<GraduationCap />}>
              <div className="space-y-4">
                <TimelineItem year="2016" title="Ph.D." subtitle="Babasaheb Bhimrao Ambedkar Bihar University" />
                <TimelineItem year="2008" title="MCA" subtitle="Sikkim Manipal University" />
                <TimelineItem year="2000" title="MBA" subtitle="Symbiosis Centre for Management Studies" />
              </div>
            </SectionCard>

            <SectionCard title="Honours & Awards" icon={<Award />}>
              <div className="space-y-3">
                <AwardItem title="Best Researcher Award (CS & ICT)" org="Patna Women’s College" year="2020" />
                <AwardItem title="Best Digital Educator Award" org="Patna Women’s College" year="2020" />
                <AwardItem title="Mother Teresa Excellence Award" org="India International Friendship Society" year="2017" />
                <AwardItem title="Exemplary Teacher Award" org="Patna Women’s College" year="2015" />
                <AwardItem title="Active Participation (Women)" org="Computer Society of India" year="2015" />
              </div>
            </SectionCard>

            <SectionCard title="Committees & Memberships" icon={<User />}>
              <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
                <li>Life Member, Computer Society of India (2013)</li>
                <li>Research Coordinator, R&D Cell PWC (2018)</li>
                <li>IQAC Member, Patna Women’s College (2011)</li>
              </ul>
            </SectionCard>
          </div>

          {/* Right Column (Publications) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <FileText size={20} />
                </div>
                <h2 className="text-xl font-bold">Journal Publications ({publications.length})</h2>
              </div>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {publications.map((pub, i) => (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-orange-500/10 text-orange-500 rounded-xl">
                    <Library size={20} />
                  </div>
                  <h2 className="text-lg font-bold">Conference Proceedings</h2>
                </div>
                <div className="space-y-4">
                  {conferences.map((conf, i) => (
                    <div key={i} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <h3 className="font-medium text-sm text-foreground leading-snug mb-1">{conf.title}</h3>
                      <p className="text-xs text-muted-foreground">{conf.book} • {conf.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-fit">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-pink-500/10 text-pink-500 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <h2 className="text-lg font-bold">Books Edited</h2>
                </div>
                <div className="space-y-3">
                  {books.map((book, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <BookOpen size={16} className="text-pink-500 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-sm text-foreground">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">{book.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
        <div className="text-emerald-500">
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
      <div className="absolute left-[1px] top-2 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-background" />
      <span className="text-xs font-bold text-emerald-500">{year}</span>
      <h3 className="font-semibold text-foreground text-sm mt-0.5">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function AwardItem({ title, org, year }: any) {
  return (
    <div className="flex items-start justify-between gap-4 pb-3 border-b border-border/50 last:border-0 last:pb-0">
      <div>
        <h3 className="font-medium text-sm text-foreground leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{org}</p>
      </div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded shrink-0">{year}</span>
    </div>
  );
}
