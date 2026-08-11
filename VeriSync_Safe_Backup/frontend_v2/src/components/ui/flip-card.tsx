'use client';

import { cn } from '@/lib/utils';
import { BookOpen, Clock, Users, Eye, QrCode } from 'lucide-react';
import { useState } from 'react';

export interface CardFlipProps {
  course: any;
  teacher: any;
  color?: string;
  // Included these so we don't break anything if they are passed
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
}

export default function CardFlip({
  course,
  teacher,
  color = '#2563eb'
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const initials = teacher?.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'T';

  return (
    <div
      style={{
        ['--primary' as any]: color,
      }}
      className="group relative h-[380px] w-full [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(0deg)] [backface-visibility:hidden]',
            'overflow-hidden rounded-3xl',
            'bg-gradient-to-br from-white via-slate-50 to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800',
            'border border-slate-200 dark:border-zinc-800/50',
            'shadow-lg dark:shadow-xl',
            'transition-all duration-700',
            'group-hover:shadow-xl dark:group-hover:shadow-2xl',
            'group-hover:border-primary/20 dark:group-hover:border-primary/30',
            isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {/* Background gradient effect */}
          <div className="from-primary/5 dark:from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

          {/* Animated background blocks */}
          <div className="absolute inset-0 flex items-center justify-center pt-8">
            <div className="relative flex h-[140px] w-full max-w-[240px] flex-col items-center justify-center gap-2.5">
              {/* Animation blocks */}
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-3.5 w-full rounded-md',
                    'from-primary/20 via-primary/30 to-primary/20 bg-gradient-to-r',
                    'opacity-0',
                  )}
                  style={{
                    width: `${50 + Math.random() * 50}%`,
                    animation: 'slideIn 2s ease-in-out infinite',
                    animationDelay: `${i * 0.15}s`,
                    marginLeft: `${Math.random() * 20}%`,
                  }}
                />
              ))}

              {/* Central Avatar */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={cn(
                    'h-24 w-24 rounded-full',
                    'from-primary via-primary/90 to-primary/80 bg-gradient-to-br',
                    'flex items-center justify-center p-1.5',
                    'shadow-primary/25 shadow-xl',
                    'transition-all duration-500 group-hover:scale-110 group-hover:rotate-12',
                  )}
                >
                  <div className="size-full rounded-full bg-card overflow-hidden flex items-center justify-center border-2 border-background">
                    {teacher?.image ? (
                      <img src={teacher.image} alt={teacher.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-primary">{initials}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 pr-2">
                <h3 className="text-xl leading-snug font-bold tracking-tight text-zinc-900 transition-all duration-500 ease-out group-hover:translate-y-[-4px] dark:text-white">
                  {course?.name}
                </h3>
                <p className="line-clamp-2 text-sm font-medium tracking-tight text-zinc-600 transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px] dark:text-zinc-300">
                  {course?.code} • Semester {course?.semester} • {course?.section}
                </p>
              </div>
              <div className="group/icon relative shrink-0">
                <div
                  className={cn(
                    'absolute inset-[-8px] rounded-lg transition-opacity duration-300',
                    'from-primary/20 via-primary/10 bg-gradient-to-br to-transparent',
                    'opacity-0 group-hover/icon:opacity-100',
                  )}
                />
                <BookOpen className="text-primary relative z-10 h-6 w-6 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            'absolute inset-0 h-full w-full',
            '[transform:rotateY(180deg)] [backface-visibility:hidden]',
            'rounded-3xl p-6',
            'bg-gradient-to-br from-white via-slate-50 to-slate-100',
            'dark:from-zinc-900 dark:via-zinc-900/95 dark:to-zinc-800',
            'border border-slate-200 dark:border-zinc-800',
            'shadow-lg dark:shadow-xl',
            'flex flex-col',
            'transition-all duration-700',
            'group-hover:shadow-xl dark:group-hover:shadow-2xl',
            'group-hover:border-primary/20 dark:group-hover:border-primary/30',
            !isFlipped ? 'opacity-0' : 'opacity-100',
          )}
        >
          {/* Background gradient */}
          <div className="from-primary/5 dark:from-primary/10 absolute inset-0 rounded-3xl bg-gradient-to-br via-transparent to-blue-500/5 dark:to-blue-500/10" />

          <div className="relative z-10 flex-1 flex flex-col h-full">
            <div className="space-y-2 mb-6">
              <div className="mb-2 flex items-center gap-3">
                <div className="from-primary via-primary/90 to-primary/80 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg leading-snug font-bold tracking-tight text-zinc-900 transition-all duration-500 ease-out group-hover:translate-y-[-2px] dark:text-white line-clamp-2">
                  {course?.name}
                </h3>
              </div>
            </div>

            <div className="space-y-4 pt-2 flex-1">
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3"
                style={{
                  transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: isFlipped ? 1 : 0,
                  transitionDelay: `100ms`,
                  transition: 'all 0.5s'
                }}>
                <span className="text-muted-foreground font-medium flex items-center gap-2"><Users size={16} /> Students</span>
                <span className="font-bold text-foreground">{course?.studentsCount} Enrolled</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3"
                style={{
                  transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: isFlipped ? 1 : 0,
                  transitionDelay: `200ms`,
                  transition: 'all 0.5s'
                }}>
                <span className="text-muted-foreground font-medium flex items-center gap-2"><Clock size={16} /> Next class</span>
                <span className="font-bold text-foreground">{course?.nextClass}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-border/50 pb-3"
                style={{
                  transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                  opacity: isFlipped ? 1 : 0,
                  transitionDelay: `300ms`,
                  transition: 'all 0.5s'
                }}>
                <span className="text-muted-foreground font-medium flex items-center gap-2">Teacher</span>
                <span className="font-bold text-foreground text-right">{teacher?.name}</span>
              </div>
            </div>

            <div className="relative z-10 mt-auto pt-4 flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 text-foreground font-bold rounded-xl transition-colors shadow-sm">
                <Eye size={16} /> Details
              </button>
              <button className={cn(
                "flex-[1.5] flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-xl text-white transition-all shadow-md hover:shadow-lg",
                "from-primary via-primary/90 to-primary/80 bg-gradient-to-br hover:scale-[1.02]"
              )}>
                <QrCode size={16} /> Start Class
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          0% {
            transform: translateX(-100px);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
