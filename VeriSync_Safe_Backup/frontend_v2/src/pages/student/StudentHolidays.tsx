import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Palmtree, Calendar as CalendarIcon, CalendarCheck2, History
} from 'lucide-react';

const mockHolidays = [
  { id: '1', name: 'Kabir Jayanti', date: '2026-06-29', type: 'OFFICIAL_HOLIDAY' },
  { id: '2', name: 'Mt. Carmel Feast Day', date: '2026-07-16', type: 'INSTITUTIONAL' },
  { id: '3', name: 'Chehallum', date: '2026-08-04', type: 'OFFICIAL_HOLIDAY' },
  { id: '4', name: 'Independence Day', date: '2026-08-15', type: 'NATIONAL' },
  { id: '5', name: 'Savan Last Somwar', date: '2026-08-24', type: 'OFFICIAL_HOLIDAY' },
  { id: '6', name: 'Hazrat Mohammad Sahab ka Janam Diwas', date: '2026-08-26', type: 'OFFICIAL_HOLIDAY' },
  { id: '7', name: 'Raksha Bandhan', date: '2026-08-28', type: 'FESTIVAL' },
  { id: '8', name: 'Sri Krishna Janmashtami', date: '2026-09-04', type: 'FESTIVAL' },
  { id: '9', name: 'Vishwakarma Puja', date: '2026-09-17', type: 'FESTIVAL' },
  { id: '10', name: 'Anant Chaturdashi', date: '2026-09-25', type: 'FESTIVAL' },
  { id: '11', name: 'Mahatma Gandhi Jayanti', date: '2026-10-02', type: 'NATIONAL' },
  { id: '12', name: 'Durga Puja Kalash Sthapan', date: '2026-10-11', type: 'FESTIVAL' },
  { id: '13', name: 'Feast of St. Teresa of Avila', date: '2026-10-15', type: 'INSTITUTIONAL' },
  { id: '14', name: 'Durga Puja / Sri Krishna Singh Jayanti', date: '2026-10-17', type: 'FESTIVAL' },
  { id: '15', name: 'Dussehra Holiday Period', date: '2026-10-19 to 2026-10-21', type: 'BREAK' },
  { id: '16', name: 'Diwali / Chhath Puja Holiday Period', date: '2026-11-08 to 2026-11-16', type: 'BREAK' },
  { id: '17', name: 'Guru Nanak Jayanti / Kartik Purnima', date: '2026-11-24', type: 'OFFICIAL_HOLIDAY' },
  { id: '18', name: 'Dr. Rajendra Prasad Jayanti', date: '2026-12-03', type: 'OFFICIAL_HOLIDAY' },
  { id: '19', name: 'Christmas Day', date: '2026-12-25', type: 'FESTIVAL' },
  { id: '20', name: 'Winter Vacation', date: '2026-12-26 to 2026-12-31', type: 'BREAK' },
  { id: '21', name: 'New Year', date: '2027-01-01', type: 'OFFICIAL_HOLIDAY' },
  { id: '22', name: 'Makar Sankranti', date: '2027-01-14', type: 'FESTIVAL' },
  { id: '23', name: 'Karpuri Thakur Jayanti / Shab-e-Barat', date: '2027-01-24', type: 'OFFICIAL_HOLIDAY' },
  { id: '24', name: 'Republic Day', date: '2027-01-26', type: 'NATIONAL' },
  { id: '25', name: 'Basant Panchmi', date: '2027-02-11', type: 'FESTIVAL' },
  { id: '26', name: 'Sant Ravidas Jayanti', date: '2027-02-20', type: 'OFFICIAL_HOLIDAY' },
  { id: '27', name: 'Maha Shivratri', date: '2027-03-06', type: 'FESTIVAL' },
  { id: '28', name: 'Eid ul-Fitr', date: '2027-03-10', type: 'FESTIVAL' },
  { id: '29', name: 'Bihar Diwas / Holi', date: '2027-03-22', type: 'FESTIVAL' },
  { id: '30', name: 'Holi', date: '2027-03-23', type: 'FESTIVAL' },
  { id: '31', name: 'Good Friday', date: '2027-03-26', type: 'FESTIVAL' },
  { id: '32', name: 'Samrat Ashoka Jayanti / Dr. B.R. Ambedkar Jayanti', date: '2027-04-14', type: 'OFFICIAL_HOLIDAY' },
  { id: '33', name: 'Ram Navami', date: '2027-04-15', type: 'FESTIVAL' },
  { id: '34', name: 'Mahavir Jayanti', date: '2027-04-19', type: 'FESTIVAL' },
  { id: '35', name: 'Veer Kunwar Singh Jayanti', date: '2027-04-23', type: 'OFFICIAL_HOLIDAY' },
  { id: '36', name: 'May Day', date: '2027-05-01', type: 'OFFICIAL_HOLIDAY' },
  { id: '37', name: 'Janaki Navami', date: '2027-05-14', type: 'FESTIVAL' },
  { id: '38', name: 'Eid ul-Adha / Bakrid', date: '2027-05-17 to 2027-05-18', type: 'FESTIVAL' },
  { id: '39', name: 'Buddha Purnima', date: '2027-05-20', type: 'FESTIVAL' },
  { id: '40', name: 'Summer Vacation', date: '2027-05-22 to 2027-05-31', type: 'BREAK' },
];

const getBadgeStyles = (type: string) => {
  switch (type) {
    case 'NATIONAL': return 'bg-student-500/10 text-student-500 border-student-500/20';
    case 'FESTIVAL': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    case 'BREAK': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    case 'INSTITUTIONAL': return 'bg-student-500/10 text-student-500 border-student-500/20';
    default: return 'bg-orange-500/10 text-orange-500 border-orange-500/20'; // OFFICIAL_HOLIDAY
  }
};

// Utilities for grouping
const getFirstDate = (dateStr: string) => new Date(dateStr.split(' ')[0]);

const isPassed = (dateStr: string) => {
  const date = getFirstDate(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare without time
  return date < now;
};

const groupByMonth = (holidays: typeof mockHolidays) => {
  const groups: Record<string, typeof mockHolidays> = {};
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  holidays.forEach(h => {
    const dateStr = h.date.split(' ')[0];
    const [year, month] = dateStr.split('-');
    const monthName = `${months[parseInt(month, 10) - 1]} ${year}`;
    if (!groups[monthName]) groups[monthName] = [];
    groups[monthName].push(h);
  });
  
  return groups;
};

const HolidayTable = ({ items }: { items: typeof mockHolidays }) => (
  <div className="overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm mb-6">
    <table className="w-full text-sm text-left">
      <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border/50">
        <tr>
          <th className="px-6 py-3 font-medium w-1/3">Holiday Name</th>
          <th className="px-6 py-3 font-medium w-1/4">Date(s)</th>
          <th className="px-6 py-3 font-medium w-1/4">Type</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/50">
        {items.map((holiday) => (
          <tr key={holiday.id} className="hover:bg-muted/30 transition-colors group">
            <td className="px-6 py-3 font-semibold text-foreground">{holiday.name}</td>
            <td className="px-6 py-3 text-muted-foreground font-mono text-xs">{holiday.date}</td>
            <td className="px-6 py-3">
              <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getBadgeStyles(holiday.type)}`}>
                {holiday.type.replace('_', ' ')}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function StudentHolidays() {
  const upcomingHolidays = mockHolidays.filter(h => !isPassed(h.date));
  const completedHolidays = mockHolidays.filter(h => isPassed(h.date));

  const upcomingGrouped = groupByMonth(upcomingHolidays);
  const completedGrouped = groupByMonth(completedHolidays);

  return (
    <DashboardLayout role="student">
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-student-500/10 text-student-600 text-xs font-semibold mb-3 border border-student-500/20">
              <Palmtree size={14} /> Schedule
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Holidays & Breaks</h1>
            <p className="text-muted-foreground mt-1">View non-working days where classes are officially suspended.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          
          {/* Summary / Stats View */}
          <div className="col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm h-fit text-center space-y-4 sticky top-6">
               <CalendarIcon className="size-10 mx-auto text-student-500" />
               <h3 className="font-semibold text-foreground">Academic Year 26-27</h3>
               <p className="text-xs text-muted-foreground">The system automatically halts all scheduled attendance sessions on these days.</p>
               <div className="pt-4 border-t border-border/50">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-muted-foreground">Completed</span>
                   <span className="font-bold">{completedHolidays.length}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Upcoming</span>
                   <span className="font-bold text-student-600">{upcomingHolidays.length}</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Holidays Lists */}
          <div className="md:col-span-3 flex flex-col gap-8">
            
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck2 className="text-student-500" size={20} />
                <h2 className="text-xl font-bold">Upcoming Holidays</h2>
              </div>
              
              {Object.keys(upcomingGrouped).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  No upcoming holidays scheduled.
                </div>
              ) : (
                Object.entries(upcomingGrouped).map(([month, items]) => (
                  <div key={month} className="mb-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 pl-2">
                      {month}
                    </h3>
                    <HolidayTable items={items} />
                  </div>
                ))
              )}
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4 mt-8">
                <History className="text-muted-foreground" size={20} />
                <h2 className="text-xl font-bold text-muted-foreground">Completed</h2>
              </div>
              
              {Object.keys(completedGrouped).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                  No completed holidays yet.
                </div>
              ) : (
                Object.entries(completedGrouped).map(([month, items]) => (
                  <div key={month} className="mb-4 opacity-75 grayscale-[0.2]">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2 pl-2">
                      {month}
                    </h3>
                    <HolidayTable items={items} />
                  </div>
                ))
              )}
            </section>

          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}
