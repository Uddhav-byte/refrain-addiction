import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Activity,
  Compass,
  ChevronDown,
  ArrowUpRight,
  ArrowDown,
  Sparkles,
  FileText,
  Clock,
  Play
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useAuth } from '@/lib/auth';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MindoDashboardProps {
  onOpenUrgeSurfing?: () => void;
  onOpenMoodLog?: () => void;
  onOpenDetailedAnalytics?: () => void;
}

const weeklyChartData = [
  { day: 'MON', value: 38 },
  { day: 'TUE', value: 52 },
  { day: 'WED', value: 45 },
  { day: 'THU', value: 62 },
  { day: 'FRI', value: 85 }, // Peak
  { day: 'SAT', value: 58 },
  { day: 'SUN', value: 72 },
];

export const MindoDashboard: React.FC<MindoDashboardProps> = ({
  onOpenUrgeSurfing,
  onOpenMoodLog,
  onOpenDetailedAnalytics,
}) => {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showWeekMenu, setShowWeekMenu] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState('Week');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const userName = user?.full_name ? user.full_name.split(' ')[0] : 'Sara';

  const reports = [
    {
      id: 1,
      title: 'Cognitive Therapy',
      date: '17-08-25',
      doctor: 'Dr. Jasmin',
      doctorRole: 'Lead Cognitive Psychologist',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80',
      summary: 'Patient exhibited significant improvement in automatic negative thought reframing. Craving intensity decreased by 34% with strong distress tolerance.',
      metrics: 'Impulse Control: 88% | Coping Readiness: High',
    },
    {
      id: 2,
      title: 'Stress Management',
      date: '15-08-25',
      doctor: 'Dr. Jonshon',
      doctorRole: 'Neuropsychiatrist',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
      summary: 'Biometric stress marker synthesis shows stabilized cortisol rhythms and sustained calm during afternoon trigger intervals.',
      metrics: 'Stress Regulation: 79% | Cortisol Rhythm: Stable',
    },
    {
      id: 3,
      title: 'Sleep Therapy',
      date: '12-08-25',
      doctor: 'Dr. Samira',
      doctorRole: 'Somatic Sleep Specialist',
      avatar: 'https://images.unsplash.com/photo-1594824813583-b78b0f9f30b9?w=120&auto=format&fit=crop&q=80',
      summary: 'Deep delta wave duration increased by 45 minutes following nightly urge surf breathing routines. Restlessness down markedly.',
      metrics: 'REM Recovery: 84% | Sleep Quality: Optimal',
    },
  ];

  const handleDownloadReport = (e: React.MouseEvent, report: any) => {
    e.stopPropagation();
    toast.success(`Clinical summary for "${report.title}" downloaded!`, {
      icon: '📄',
      duration: 3500,
    });
    setSelectedReport(report);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 pb-12 space-y-7">
      {/* Top Row: Greeting & Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left / Center Column: Greeting & 3D Brain Stats (Span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Greeting Typography matching screenshot */}
          <div className="pt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-normal tracking-tight text-slate-800 leading-[1.18]">
              Hello, <span className="font-bold text-slate-900">{userName}</span> 👋 How are
              <br />
              you <span className="font-bold text-slate-900">feeling</span> today?
            </h1>
          </div>

          {/* 3D Brain Display with Connected Stat Cards */}
          <div className="relative w-full min-h-[380px] sm:min-h-[420px] flex items-center justify-center select-none pt-4">
            
            {/* Center 3D Brain graphic */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="relative z-10 w-[240px] sm:w-[310px] lg:w-[350px] drop-shadow-[0_20px_35px_rgba(168,85,247,0.18)]"
            >
              <img
                src="/assets/brain.png"
                alt="3D Mental Wellness Brain"
                className="w-full h-auto object-contain filter saturate-[1.05]"
              />
            </motion.div>

            {/* Floating Card 1: Goal Progress (Left) */}
            <div className="absolute left-0 sm:left-2 top-[32%] z-20">
              <div className="relative group">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-purple-100/90 hover:shadow-lg transition-all w-[150px] sm:w-[170px]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-800">Goal Progress</span>
                    <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-600">
                      <Target className="w-3 h-3 text-slate-700" />
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-normal mt-3">
                    Status: <span className="font-medium text-slate-600">Standard</span>
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                    65%
                  </p>
                </div>

                {/* SVG Pointer Line connecting Goal Progress card to Brain */}
                <div className="hidden sm:block absolute -right-16 top-1/2 -translate-y-1/2 w-16 h-8 pointer-events-none">
                  <svg className="w-full h-full overflow-visible">
                    <line
                      x1="0"
                      y1="16"
                      x2="52"
                      y2="16"
                      stroke="#CBD5E1"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="56"
                      cy="16"
                      r="4"
                      fill="#FFFFFF"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Floating Card 2: Stress Level (Top Right) */}
            <div className="absolute right-0 sm:right-4 top-[10%] z-20">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-purple-100/90 hover:shadow-lg transition-all w-[140px] sm:w-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Stress Level</span>
                  <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-600">
                    <Activity className="w-3 h-3 text-slate-700" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-normal mt-3">
                  Status: <span className="font-medium text-slate-600">Low</span>
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900 mt-0.5">
                  70%
                </p>
              </div>
            </div>

            {/* Floating Card 3: Focus Power (Bottom Right) */}
            <div className="absolute right-0 sm:right-4 bottom-[8%] z-20">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-purple-100/90 hover:shadow-lg transition-all w-[140px] sm:w-[160px]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Focus Power</span>
                  <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-600">
                    <Compass className="w-3 h-3 text-slate-700" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-normal mt-3">
                  Status: <span className="font-medium text-slate-600">Standard</span>
                </p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  42 <span className="text-sm font-normal text-slate-600">mins</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Health Improvement Chart Card (Span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-purple-100/80 flex flex-col justify-between h-full min-h-[460px]">
            
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Health Improvement</h3>
                <p className="text-xs text-slate-400 font-normal mt-0.5">This week</p>
              </div>

              {/* Week Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowWeekMenu(!showWeekMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9FF] border border-purple-100 text-xs font-semibold text-slate-700 hover:bg-purple-50 transition-colors shadow-xs"
                >
                  <span>{selectedWeek}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showWeekMenu && (
                  <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-2xl shadow-xl border border-purple-100 py-1.5 z-30">
                    {['This Week', 'Last Week', 'Monthly'].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => {
                          setSelectedWeek(w);
                          setShowWeekMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-purple-50"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Smooth Curve Area Chart with Friday Peak Badge */}
            <div className="relative w-full h-[280px] sm:h-[310px] mt-4">
              
              {/* Highlight Peak Badge above Friday */}
              <div className="absolute top-4 right-[25%] sm:right-[26%] z-20 flex flex-col items-center">
                <div className="bg-[#6D28D9] text-white px-3.5 py-1.5 rounded-2xl shadow-lg text-center flex flex-col items-center">
                  <span className="text-xs font-bold tracking-tight whitespace-nowrap">
                    80%+ Imp
                  </span>
                  <span className="text-[10px] text-purple-200 font-medium">
                    6 Aug 2025
                  </span>
                </div>
                {/* Pointer tip */}
                <div className="w-2.5 h-2.5 bg-[#6D28D9] rotate-45 -mt-1 shadow-sm" />
                {/* Vertical dotted guide line */}
                <div className="w-[1.5px] h-32 border-r-2 border-dotted border-purple-400/80 -mt-0.5" />
                {/* Circle point */}
                <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-[#6D28D9] -mt-1 shadow-md" />
              </div>

              {/* Recharts Area */}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyChartData}
                  margin={{ top: 50, right: 15, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="mindoPurpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C4B5FD" stopOpacity={0.45} />
                      <stop offset="50%" stopColor="#DDD6FE" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#FAF5FF" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="day"
                    stroke="#94A3B8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis hide domain={[20, 100]} />

                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-lg">
                            <p className="font-semibold">{payload[0].payload.day}</p>
                            <p className="text-purple-300 font-bold">{payload[0].value}% Improvement</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Area
                    type="natural"
                    dataKey="value"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#mindoPurpleGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Insight Footer */}
            <div className="pt-2 border-t border-purple-50 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium text-purple-700">
                <Sparkles className="w-3.5 h-3.5" /> +24% higher focus vs previous week
              </span>
              <button 
                type="button"
                onClick={onOpenDetailedAnalytics}
                className="text-slate-400 hover:text-purple-600 font-medium transition-colors"
              >
                View trends →
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Row: 3 Modern Rounded Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Card 1: Reports (Span 5) */}
        <div className="lg:col-span-5 bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-purple-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reports</h3>
              
              {/* Filters Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9FF] border border-purple-100 text-xs font-semibold text-slate-700 hover:bg-purple-50 transition-colors shadow-xs"
                >
                  <span>{selectedFilter === 'All' ? 'Filters' : selectedFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-purple-100 py-1.5 z-30">
                    {['All Reports', 'Therapy Only', 'Recent Month'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => {
                          setSelectedFilter(f);
                          setShowFilterMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-purple-50"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* List of Report Pills */}
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="p-3 sm:p-3.5 rounded-2xl border border-purple-100/70 bg-[#FAF9FF] hover:bg-purple-50/50 hover:border-purple-200 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                >
                  {/* Left: Title & Date */}
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-purple-700 transition-colors">
                      {report.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{report.date}</p>
                  </div>

                  {/* Middle: Doctor Avatar + Name */}
                  <div className="flex items-center gap-2 shrink-0">
                    <img
                      src={report.avatar}
                      alt={report.doctor}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-purple-200"
                    />
                    <span className="text-xs font-semibold text-slate-700 hidden sm:inline">
                      {report.doctor}
                    </span>
                  </div>

                  {/* Right: Circular Download Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDownloadReport(e, report)}
                    className="w-8 h-8 rounded-full border border-purple-200 bg-white flex items-center justify-center text-slate-600 hover:text-purple-700 hover:border-purple-400 shadow-xs transition-colors shrink-0"
                    title="Download clinical summary"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: Upcoming Session (Span 3) */}
        <div className="lg:col-span-3 bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-purple-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug tracking-tight">
                  Upcoming
                  <br />
                  Session
                </h3>
              </div>

              {/* Action arrow button */}
              <button
                type="button"
                onClick={() => setShowSessionModal(true)}
                className="w-9 h-9 rounded-2xl border border-purple-100 bg-[#FAF9FF] flex items-center justify-center text-slate-700 hover:text-purple-700 hover:bg-purple-100/60 shadow-xs transition-colors"
                title="View session details"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Remaining Subtitle */}
            <p className="text-xs text-slate-400 font-normal mt-7">Remaining</p>

            {/* Large Timer Display */}
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-4xl sm:text-[42px] font-bold text-slate-900 tracking-tight">
                6
              </span>
              <span className="text-base text-slate-500 font-medium mr-2">hr</span>
              <span className="text-4xl sm:text-[42px] font-bold text-slate-900 tracking-tight">
                52
              </span>
              <span className="text-base text-slate-500 font-medium">min</span>
            </div>
          </div>

          {/* Quick Launch SOS / Session */}
          <div className="pt-4 border-t border-purple-50 mt-4">
            <Button
              onClick={() => {
                if (onOpenUrgeSurfing) onOpenUrgeSurfing();
                else setShowSessionModal(true);
              }}
              size="sm"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full text-xs font-semibold shadow-sm gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Urge Surfing
            </Button>
          </div>
        </div>

        {/* Card 3: Active path this week (Span 4) */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-md rounded-[28px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-purple-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Active path this week
              </h3>
              <span className="text-2xl font-bold text-slate-900">
                76%
              </span>
            </div>

            {/* Progress Bar Capsules */}
            <div className="space-y-4">
              
              {/* Meditation (50% lavender gradient) */}
              <div className="space-y-1.5">
                <div className="relative w-full h-11 bg-[#F5F2FE] rounded-2xl overflow-hidden p-1 flex items-center border border-purple-100/60">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-purple-200 to-purple-300 flex items-center justify-between px-4 transition-all duration-700"
                    style={{ width: '50%' }}
                  >
                    <span className="text-xs font-semibold text-purple-900">Meditation</span>
                    <span className="text-xs font-bold text-purple-900">50%</span>
                  </div>
                </div>
              </div>

              {/* Exercise (85% rich purple gradient) */}
              <div className="space-y-1.5">
                <div className="relative w-full h-11 bg-[#F5F2FE] rounded-2xl overflow-hidden p-1 flex items-center border border-purple-100/60">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-between px-4 transition-all duration-700"
                    style={{ width: '85%' }}
                  >
                    <span className="text-xs font-semibold text-white">Exercise</span>
                    <span className="text-xs font-bold text-white">85%</span>
                  </div>
                </div>
              </div>

              {/* Urge Resistance & Mindfulness */}
              <div className="space-y-1.5">
                <div className="relative w-full h-11 bg-[#F5F2FE] rounded-2xl overflow-hidden p-1 flex items-center border border-purple-100/60">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-between px-4 transition-all duration-700"
                    style={{ width: '92%' }}
                  >
                    <span className="text-xs font-semibold text-white">Mindfulness & Urge Log</span>
                    <span className="text-xs font-bold text-white">92%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Check-in CTA */}
          <div className="pt-4 border-t border-purple-50 mt-4 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Daily Streak: 14 Days</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMoodLog}
              className="rounded-full text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              + Daily Check-In
            </Button>
          </div>
        </div>

      </div>

      {/* Report Summary Modal */}
      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="max-w-lg bg-white rounded-3xl p-6 border border-purple-100 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              Clinical Therapy Evaluation
            </div>
            <DialogTitle className="text-2xl font-bold text-slate-900">
              {selectedReport?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Session evaluated on {selectedReport?.date} with {selectedReport?.doctor}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-purple-50/60 border border-purple-100">
              <img
                src={selectedReport?.avatar}
                alt={selectedReport?.doctor}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedReport?.doctor}</h4>
                <p className="text-xs text-purple-700 font-medium">{selectedReport?.doctorRole}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-purple-100">
              <h5 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Physician Notes</h5>
              <p className="text-sm text-slate-700 leading-relaxed">{selectedReport?.summary}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">Biometric Clinical Indicators</span>
              <span className="text-xs font-bold text-emerald-700">{selectedReport?.metrics}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="rounded-full text-xs border-purple-200"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </Button>
              <Button
                className="rounded-full text-xs bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  toast.success('Report PDF prepared and downloaded!');
                  setSelectedReport(null);
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Details Modal */}
      <Dialog open={showSessionModal} onOpenChange={setShowSessionModal}>
        <DialogContent className="max-w-md bg-white rounded-3xl p-6 border border-purple-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Upcoming Therapy & Mindful Session
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Starts in 6 hours 52 minutes with Dr. Jasmin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-3">
            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-slate-700 space-y-2">
              <p className="font-semibold text-purple-900 text-sm">Session Focus: Craving Deconstruction</p>
              <p>• Review of trigger log and urge intensity shifts</p>
              <p>• Guided 4-7-8 somatic breathing calibration</p>
              <p>• Dopamine sensitivity baseline reassessment</p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold text-xs py-5"
                onClick={() => {
                  setShowSessionModal(false);
                  if (onOpenUrgeSurfing) onOpenUrgeSurfing();
                }}
              >
                Open Urge Surfing Breathing Pacer Now
              </Button>
              <Button
                variant="ghost"
                className="rounded-full text-xs text-slate-500"
                onClick={() => setShowSessionModal(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
