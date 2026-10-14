import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';
import { isSupabaseConfigured, api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Mail,
  Calendar,
  Flame,
  Trophy,
  LogOut,
  Save,
  Download,
  RotateCcw,
  Database,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout, updateProfile, resetStreak } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!user) {
    return (
      <div className="p-6 space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim()) {
      toast.error('Full name and username cannot be blank');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        username: username.trim(),
      });
      setEditing(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResetStreak = async () => {
    try {
      await resetStreak();
      setShowResetConfirm(false);
    } catch (err) {
      toast.error('Failed to reset streak');
    }
  };

  const handleExportData = async () => {
    try {
      const [urges, moodTrend, assessment] = await Promise.all([
        api.urges.getUrgeLogs(0, 500),
        api.analytics.getMoodTrends(90),
        api.assessments.getLatestAssessment(),
      ]);

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        profile: user,
        urges,
        moodTrend,
        assessment,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `refrain-recovery-data-${user.username}-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success('Your complete recovery data was exported!');
    } catch (err) {
      toast.error('Failed to export data');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-8 max-w-3xl mx-auto space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account and monitor milestones</p>
        </div>

        {isSupabaseConfigured ? (
          <Badge variant="outline" className="gap-1.5 py-1 text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
            <Database className="h-3.5 w-3.5" /> Supabase Synced
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1.5 py-1 text-muted-foreground">
            <CheckCircle2 className="h-3.5 w-3.5" /> Local Persistent
          </Badge>
        )}
      </div>

      {/* Profile Card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <Avatar className="w-20 h-20 bg-primary/10 text-primary text-2xl font-bold rounded-full flex items-center justify-center border-2 border-primary/20 shrink-0">
              {user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h2 className="text-2xl font-bold">{user.full_name}</h2>
                <Badge variant="secondary" className="font-mono text-xs">@{user.username}</Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-muted-foreground text-sm mt-2">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Zero-knowledge client encryption enabled</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak & Milestone Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 text-center">
            <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="text-3xl font-extrabold">{user.streak_days}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Current Clean Days</p>
          </CardContent>
        </Card>
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-3xl font-extrabold">{user.longest_streak}</p>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Longest Record</p>
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Form */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your display name and public username</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Full Name
              </label>
              <Input
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setEditing(true);
                }}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                Username
              </label>
              <Input
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setEditing(true);
                }}
                placeholder="Your username"
              />
            </div>
          </div>

          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end pt-2"
            >
              <Button onClick={handleSave} disabled={saving} className="gap-2 font-medium">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Data Management & Streak Actions */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle>Recovery Journey Management</CardTitle>
          <CardDescription>Data portability and streak accountability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-muted/30 border border-border">
            <div>
              <h4 className="font-semibold text-sm">Export Full Recovery Archive</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Download your habit logs, urge histories, and assessments as JSON.</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2 shrink-0">
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-destructive/5 border border-destructive/20">
            <div>
              <h4 className="font-semibold text-sm text-destructive">Had a Slip? Reset Clean Streak</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Recovery is not a straight line. Resetting your count allows honest tracking without erasing past growth.
              </p>
            </div>
            {!showResetConfirm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 shrink-0"
              >
                <RotateCcw className="h-4 w-4" /> Reset Streak
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="destructive" size="sm" onClick={handleResetStreak}>
                  Confirm Reset
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logout */}
      <Button
        variant="outline"
        onClick={logout}
        className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 font-medium py-6"
      >
        <LogOut className="h-4 w-4" />
        Sign Out of Refrain
      </Button>
    </motion.div>
  );
}
