import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { FileWarning, CheckCircle2, XCircle, Search, Filter, Clock, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    studentName: 'Bhavya Sharma',
    initials: 'BS',
    rollNumber: 'MCA004',
    courseCode: 'EC202',
    date: '21 Jul 2026',
    requestedChange: 'Absent → Present',
    reason: 'Face verification failed because of camera permission issue.',
    status: 'Pending', // Pending, Recommended, Rejected
    recommendation: null // 'Approval', 'Rejection'
  },
  {
    id: 'REQ-002',
    studentName: 'Praveen Kumar',
    initials: 'PK',
    rollNumber: 'MCA012',
    courseCode: 'CS101',
    date: '20 Jul 2026',
    requestedChange: 'Late → Present',
    reason: 'Arrived on time but the QR scanner was not functioning correctly.',
    status: 'Recommended',
    recommendation: 'Approval'
  }
];

export default function TeacherCorrectionRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRecommendation = (id: string, recommendation: 'Approval' | 'Rejection') => {
    setRequests(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, status: 'Recommended', recommendation } 
          : req
      )
    );
  };

  const filteredRequests = requests.filter(req => 
    req.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role="teacher">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 font-sans p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
                <FileWarning className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Correction Requests</h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Review evidence and send a recommendation to the admin. Your recommendations help administrators process attendance disputes efficiently.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search requests..." 
                className="pl-9 bg-card border-border/50 rounded-xl focus-visible:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-xl border-border/50 bg-card hover:bg-muted/50 gap-2">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Requests Table */}
        <Card className="rounded-2xl border border-border shadow-sm bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</th>
                  <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course & Date</th>
                  <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Requested Change</th>
                  <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[150px]">Reason</th>
                  <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                  <th className="py-4 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredRequests.map((req) => (
                    <motion.tr 
                      key={req.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Student */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold border border-blue-500/20 flex-shrink-0 shadow-sm">
                            {req.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground whitespace-nowrap">{req.studentName}</p>
                            <p className="text-xs text-muted-foreground">{req.rollNumber}</p>
                          </div>
                        </div>
                      </td>

                      {/* Course & Date */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <p className="text-sm font-medium text-foreground">{req.courseCode}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {req.date}
                        </p>
                      </td>

                      {/* Requested Change */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-sm font-medium">
                          <span className="text-rose-500">{req.requestedChange.split(' → ')[0]}</span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          <span className="text-emerald-500">{req.requestedChange.split(' → ')[1]}</span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-4 align-top">
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px] line-clamp-3 group-hover:line-clamp-none transition-all">
                          {req.reason}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top text-center">
                        {req.status === 'Pending' ? (
                          <Badge variant="outline" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border-orange-500/20 font-medium px-2.5 py-0.5">
                            Pending
                          </Badge>
                        ) : req.status === 'Recommended' ? (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 font-medium px-2.5 py-0.5">
                            Reviewed
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2.5 py-0.5">
                            Approved
                          </Badge>
                        )}
                      </td>

                      {/* Recommendation Actions */}
                      <td className="py-4 px-4 align-top">
                        {req.recommendation ? (
                          <div className="flex flex-col gap-2">
                            {req.recommendation === 'Approval' ? (
                              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 text-xs font-bold uppercase tracking-wider whitespace-nowrap w-fit mx-auto">
                                <CheckCircle2 className="w-4 h-4" />
                                Recommended Approval
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-rose-600 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/20 text-xs font-bold uppercase tracking-wider whitespace-nowrap w-fit mx-auto">
                                <XCircle className="w-4 h-4" />
                                Recommended Rejection
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRecommendation(req.id, 'Approval')}
                              className="h-8 w-full max-w-[180px] text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:text-emerald-700 transition-colors justify-start"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                              Recommend Approval
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRecommendation(req.id, 'Rejection')}
                              className="h-8 w-full max-w-[180px] text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-rose-500/5 hover:bg-rose-500/10 border-rose-500/20 text-rose-600 hover:text-rose-700 transition-colors justify-start"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                              Recommend Rejection
                            </Button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-8 h-8 opacity-20 mb-3" />
                        <p>No correction requests found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}