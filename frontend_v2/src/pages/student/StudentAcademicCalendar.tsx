import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Calendar as CalendarIcon } from 'lucide-react';
import { EventManager, type Event } from "@/components/ui/event-manager";

const pwcEvents: Event[] = [
  // Academic Milestones
  { id: "e1", title: "Regular Classes Begin", startTime: new Date(2026, 6, 1, 9, 0), endTime: new Date(2026, 6, 1, 15, 0), color: "blue", category: "Academic" },
  { id: "e2", title: "College Re-opens", startTime: new Date(2026, 9, 22, 9, 0), endTime: new Date(2026, 9, 22, 15, 0), color: "blue", category: "Academic" },
  { id: "e3", title: "College Re-opens", startTime: new Date(2026, 10, 17, 9, 0), endTime: new Date(2026, 10, 17, 15, 0), color: "blue", category: "Academic" },

  // Examinations
  { id: "ex1", title: "Mid Semester Examination", startTime: new Date(2026, 8, 7, 9, 0), endTime: new Date(2026, 8, 12, 16, 0), color: "purple", category: "Examination", tags: ["Sem II, III, IV, VII, VIII"] },
  { id: "ex2", title: "End Semester Examination (UG)", startTime: new Date(2026, 9, 26, 9, 0), endTime: new Date(2026, 9, 31, 16, 0), color: "purple", category: "Examination", tags: ["Sem V, VII"] },
  { id: "ex3", title: "End Semester Examination", startTime: new Date(2026, 10, 1, 9, 0), endTime: new Date(2026, 10, 7, 16, 0), color: "purple", category: "Examination", tags: ["Sem III"] },
  { id: "ex4", title: "End Semester Examination", startTime: new Date(2026, 10, 21, 9, 0), endTime: new Date(2026, 10, 28, 16, 0), color: "purple", category: "Examination", tags: ["Sem I"] },
  { id: "ex5", title: "Mid Semester Examination", startTime: new Date(2027, 1, 16, 9, 0), endTime: new Date(2027, 1, 23, 16, 0), color: "purple", category: "Examination", tags: ["Sem II, IV, VI, VIII"] },
  { id: "ex6", title: "End Semester Examination", startTime: new Date(2027, 3, 29, 9, 0), endTime: new Date(2027, 3, 30, 16, 0), color: "purple", category: "Examination", tags: ["Sem IV"] },
  { id: "ex7", title: "End Semester Examination", startTime: new Date(2027, 4, 2, 9, 0), endTime: new Date(2027, 4, 8, 16, 0), color: "purple", category: "Examination", tags: ["Sem IV"] },
  { id: "ex8", title: "End Semester Examination", startTime: new Date(2027, 4, 9, 9, 0), endTime: new Date(2027, 4, 15, 16, 0), color: "purple", category: "Examination", tags: ["Sem II"] },
  
  // Holidays
  { id: 'h1', title: 'Kabir Jayanti', startTime: new Date(2026, 5, 29, 0, 0), endTime: new Date(2026, 5, 29, 23, 59), color: "green", category: "Holiday" },
  { id: 'h2', title: 'Mt. Carmel Feast Day', startTime: new Date(2026, 6, 16, 0, 0), endTime: new Date(2026, 6, 16, 23, 59), color: "green", category: "Holiday", tags: ["Institutional"] },
  { id: 'h3', title: 'Chehallum', startTime: new Date(2026, 7, 4, 0, 0), endTime: new Date(2026, 7, 4, 23, 59), color: "green", category: "Holiday" },
  { id: 'h4', title: 'Independence Day', startTime: new Date(2026, 7, 15, 0, 0), endTime: new Date(2026, 7, 15, 23, 59), color: "green", category: "Holiday", tags: ["National"] },
  { id: 'h5', title: 'Savan Last Somwar', startTime: new Date(2026, 7, 24, 0, 0), endTime: new Date(2026, 7, 24, 23, 59), color: "green", category: "Holiday" },
  { id: 'h6', title: 'Hazrat Mohammad Sahab ka Janam Diwas', startTime: new Date(2026, 7, 26, 0, 0), endTime: new Date(2026, 7, 26, 23, 59), color: "green", category: "Holiday" },
  { id: 'h7', title: 'Raksha Bandhan', startTime: new Date(2026, 7, 28, 0, 0), endTime: new Date(2026, 7, 28, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h8', title: 'Sri Krishna Janmashtami', startTime: new Date(2026, 8, 4, 0, 0), endTime: new Date(2026, 8, 4, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h9', title: 'Vishwakarma Puja', startTime: new Date(2026, 8, 17, 0, 0), endTime: new Date(2026, 8, 17, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h10', title: 'Anant Chaturdashi', startTime: new Date(2026, 8, 25, 0, 0), endTime: new Date(2026, 8, 25, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h11', title: 'Mahatma Gandhi Jayanti', startTime: new Date(2026, 9, 2, 0, 0), endTime: new Date(2026, 9, 2, 23, 59), color: "green", category: "Holiday", tags: ["National"] },
  { id: 'h12', title: 'Durga Puja Kalash Sthapan', startTime: new Date(2026, 9, 11, 0, 0), endTime: new Date(2026, 9, 11, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h13', title: 'Feast of St. Teresa of Avila', startTime: new Date(2026, 9, 15, 0, 0), endTime: new Date(2026, 9, 15, 23, 59), color: "green", category: "Holiday", tags: ["Institutional"] },
  { id: 'h14', title: 'Durga Puja / Sri Krishna Singh Jayanti', startTime: new Date(2026, 9, 17, 0, 0), endTime: new Date(2026, 9, 17, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h15', title: 'Dussehra Holiday Period', startTime: new Date(2026, 9, 19, 0, 0), endTime: new Date(2026, 9, 21, 23, 59), color: "orange", category: "Vacation" },
  { id: 'h16', title: 'Diwali / Chhath Puja Holiday Period', startTime: new Date(2026, 10, 8, 0, 0), endTime: new Date(2026, 10, 16, 23, 59), color: "orange", category: "Vacation" },
  { id: 'h17', title: 'Guru Nanak Jayanti / Kartik Purnima', startTime: new Date(2026, 10, 24, 0, 0), endTime: new Date(2026, 10, 24, 23, 59), color: "green", category: "Holiday" },
  { id: 'h18', title: 'Dr. Rajendra Prasad Jayanti', startTime: new Date(2026, 11, 3, 0, 0), endTime: new Date(2026, 11, 3, 23, 59), color: "green", category: "Holiday" },
  { id: 'h19', title: 'Christmas Day', startTime: new Date(2026, 11, 25, 0, 0), endTime: new Date(2026, 11, 25, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h20', title: 'Winter Vacation', startTime: new Date(2026, 11, 26, 0, 0), endTime: new Date(2026, 11, 31, 23, 59), color: "orange", category: "Vacation" },
  { id: 'h21', title: 'New Year', startTime: new Date(2027, 0, 1, 0, 0), endTime: new Date(2027, 0, 1, 23, 59), color: "green", category: "Holiday" },
  { id: 'h22', title: 'Makar Sankranti', startTime: new Date(2027, 0, 14, 0, 0), endTime: new Date(2027, 0, 14, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h23', title: 'Karpuri Thakur Jayanti / Shab-e-Barat', startTime: new Date(2027, 0, 24, 0, 0), endTime: new Date(2027, 0, 24, 23, 59), color: "green", category: "Holiday" },
  { id: 'h24', title: 'Republic Day', startTime: new Date(2027, 0, 26, 0, 0), endTime: new Date(2027, 0, 26, 23, 59), color: "green", category: "Holiday", tags: ["National"] },
  { id: 'h25', title: 'Basant Panchmi', startTime: new Date(2027, 1, 11, 0, 0), endTime: new Date(2027, 1, 11, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h26', title: 'Sant Ravidas Jayanti', startTime: new Date(2027, 1, 20, 0, 0), endTime: new Date(2027, 1, 20, 23, 59), color: "green", category: "Holiday" },
  { id: 'h27', title: 'Maha Shivratri', startTime: new Date(2027, 2, 6, 0, 0), endTime: new Date(2027, 2, 6, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h28', title: 'Eid ul-Fitr', startTime: new Date(2027, 2, 10, 0, 0), endTime: new Date(2027, 2, 10, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h29', title: 'Bihar Diwas / Holi', startTime: new Date(2027, 2, 22, 0, 0), endTime: new Date(2027, 2, 22, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h30', title: 'Holi', startTime: new Date(2027, 2, 23, 0, 0), endTime: new Date(2027, 2, 23, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h31', title: 'Good Friday', startTime: new Date(2027, 2, 26, 0, 0), endTime: new Date(2027, 2, 26, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h32', title: 'Samrat Ashoka / Dr. B.R. Ambedkar Jayanti', startTime: new Date(2027, 3, 14, 0, 0), endTime: new Date(2027, 3, 14, 23, 59), color: "green", category: "Holiday" },
  { id: 'h33', title: 'Ram Navami', startTime: new Date(2027, 3, 15, 0, 0), endTime: new Date(2027, 3, 15, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h34', title: 'Mahavir Jayanti', startTime: new Date(2027, 3, 19, 0, 0), endTime: new Date(2027, 3, 19, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h35', title: 'Veer Kunwar Singh Jayanti', startTime: new Date(2027, 3, 23, 0, 0), endTime: new Date(2027, 3, 23, 23, 59), color: "green", category: "Holiday" },
  { id: 'h36', title: 'May Day', startTime: new Date(2027, 4, 1, 0, 0), endTime: new Date(2027, 4, 1, 23, 59), color: "green", category: "Holiday" },
  { id: 'h37', title: 'Janaki Navami', startTime: new Date(2027, 4, 14, 0, 0), endTime: new Date(2027, 4, 14, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h38', title: 'Eid ul-Adha / Bakrid', startTime: new Date(2027, 4, 17, 0, 0), endTime: new Date(2027, 4, 18, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h39', title: 'Buddha Purnima', startTime: new Date(2027, 4, 20, 0, 0), endTime: new Date(2027, 4, 20, 23, 59), color: "green", category: "Holiday", tags: ["Festival"] },
  { id: 'h40', title: 'Summer Vacation', startTime: new Date(2027, 4, 22, 0, 0), endTime: new Date(2027, 4, 31, 23, 59), color: "orange", category: "Vacation" },
];

export default function StudentAcademicCalendar() {
  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 text-xs font-semibold mb-3 border border-violet-500/20">
              <CalendarIcon size={14} /> Academic Calendar
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Academic Events</h1>
            <p className="text-muted-foreground mt-1">View institutional events, exams, and milestones.</p>
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl p-4 sm:p-6">
          <EventManager 
            events={pwcEvents} 
            categories={["Academic", "Examination", "Holiday", "Vacation", "Event"]}
            availableTags={["National", "Festival", "Institutional", "Sem I", "Sem II", "Sem III", "Sem IV", "Sem V", "Sem VI", "Sem VII", "Sem VIII"]}
            defaultView="month"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
