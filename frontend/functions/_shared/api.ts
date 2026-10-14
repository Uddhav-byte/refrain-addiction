import { hashPassword, verifyPassword, createJWT, verifyJWT } from './auth';

export interface Env {
  refrain_db: D1Database;
  JWT_SECRET?: string;
}

export const ASSESSMENT_QUESTIONS = [
  { id: "t1", category: "triggers", text: "How often do you encounter your primary trigger?" },
  { id: "t2", category: "triggers", text: "How strong are environmental cues?" },
  { id: "t3", category: "triggers", text: "Rate social pressure to use" },
  { id: "t4", category: "triggers", text: "How often do you find yourself thinking about your triggers?" },
  { id: "s1", category: "severity", text: "Current withdrawal severity" },
  { id: "s2", category: "severity", text: "Physical dependency rating" },
  { id: "s3", category: "severity", text: "Tolerance level" },
  { id: "s4", category: "severity", text: "Impact on daily functioning" },
  { id: "e1", category: "emotional", text: "Current stress level" },
  { id: "e2", category: "emotional", text: "Anxiety frequency" },
  { id: "e3", category: "emotional", text: "Emotional regulation ability" },
  { id: "e4", category: "emotional", text: "Support network strength" },
  { id: "r1", category: "relapse_risk", text: "Confidence in staying sober" },
  { id: "r2", category: "relapse_risk", text: "Past relapse frequency" },
  { id: "r3", category: "relapse_risk", text: "Access to support resources" },
  { id: "r4", category: "relapse_risk", text: "Motivation to maintain recovery" }
];

export const MILESTONES = [
  { badge_id: "first_step", name: "First Step", description: "1 day clean", icon: "🌱", days_required: 1 },
  { badge_id: "getting_started", name: "Getting Started", description: "3 days clean", icon: "🌿", days_required: 3 },
  { badge_id: "one_week", name: "One Week Strong", description: "7 days clean", icon: "💪", days_required: 7 },
  { badge_id: "two_weeks", name: "Two Weeks", description: "14 days clean", icon: "⭐", days_required: 14 },
  { badge_id: "monthly_warrior", name: "Monthly Warrior", description: "30 days clean", icon: "🛡️", days_required: 30 },
  { badge_id: "two_months", name: "Two Months", description: "60 days clean", icon: "🔥", days_required: 60 },
  { badge_id: "quarter_champion", name: "Quarter Champion", description: "90 days clean", icon: "👑", days_required: 90 },
  { badge_id: "half_year", name: "Half Year Hero", description: "180 days clean", icon: "🌟", days_required: 180 },
  { badge_id: "one_year", name: "One Year Legend", description: "365 days clean", icon: "🏆", days_required: 365 }
];

function corsHeaders(origin: string = '*'): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };
}

function jsonResponse(data: any, status: number = 200, origin: string = '*'): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin)
  });
}

function errorResponse(message: string, status: number = 400, origin: string = '*'): Response {
  return jsonResponse({ detail: message, error: message }, status, origin);
}

// In-memory fallback if D1 binding is not configured in Pages project dashboard yet
const memoryUsers = new Map<string, any>();
const memoryAssessments = new Map<string, any[]>();
const memoryUrges = new Map<string, any[]>();
const memoryMoods = new Map<string, any[]>();
const memoryMessages: any[] = [];

async function getUserFromAuth(request: Request, env: Env): Promise<any | null> {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload || !payload.sub) return null;

  const d1 = env.refrain_db || (env as any).REFRAIN_DB || (env as any).DB;
  if (d1) {
    try {
      const user = await d1.prepare('SELECT id, email, username, full_name, streak_days, longest_streak, created_at FROM users WHERE id = ?')
        .bind(payload.sub)
        .first();
      if (user) return user;
    } catch (e) {
      console.warn('D1 query error:', e);
    }
  }

  return memoryUsers.get(payload.sub) || null;
}

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const origin = request.headers.get('Origin') || '*';

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin)
    });
  }

  const d1 = env.refrain_db || (env as any).REFRAIN_DB || (env as any).DB;

  // Health check
  if (path === '/health' || path === '/api/v1/health' || path === '/api/health') {
    return jsonResponse({
      status: 'ok',
      name: 'Refrain Cloudflare API',
      version: '1.0.0',
      has_d1: !!d1,
      env_keys: Object.keys(env || {})
    }, 200, origin);
  }

  // ---------------- AUTH ROUTES ----------------
  if ((path === '/api/v1/auth/register' || path === '/api/auth/register') && request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const { email, username, password, full_name } = body;
      if (!email || !password || !username) {
        return errorResponse('Email, username, and password are required', 400, origin);
      }

      if (d1) {
        try {
          const existing = await d1.prepare('SELECT id FROM users WHERE email = ? OR username = ?')
            .bind(email, username)
            .first();
          if (existing) {
            return errorResponse('User with this email or username already exists', 400, origin);
          }
        } catch (e) {
          console.warn('D1 check error:', e);
        }
      }

      const id = crypto.randomUUID();
      const password_hash = await hashPassword(password);
      const created_at = new Date().toISOString();
      const userData = { id, email, username, password_hash, full_name: full_name || username, streak_days: 0, longest_streak: 0, created_at };

      if (d1) {
        try {
          await d1.prepare(
            'INSERT INTO users (id, email, username, password_hash, full_name, streak_days, longest_streak, created_at) VALUES (?, ?, ?, ?, ?, 0, 0, ?)'
          ).bind(id, email, username, password_hash, full_name || username, created_at).run();
        } catch (e) {
          console.warn('D1 insert error:', e);
        }
      }
      memoryUsers.set(id, userData);

      const access_token = await createJWT({ sub: id, email, username }, env.JWT_SECRET, 86400 * 7);
      const refresh_token = await createJWT({ sub: id, type: 'refresh' }, env.JWT_SECRET, 86400 * 30);

      return jsonResponse({
        access_token,
        refresh_token,
        token_type: 'bearer'
      }, 201, origin);
    } catch (err: any) {
      return errorResponse(err.message || 'Registration failed', 500, origin);
    }
  }

  if ((path === '/api/v1/auth/login' || path === '/api/auth/login') && request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const { email, password } = body;
      if (!email || !password) {
        return errorResponse('Email and password required', 400, origin);
      }

      let user: any = null;
      if (d1) {
        try {
          user = await d1.prepare('SELECT * FROM users WHERE email = ?')
            .bind(email)
            .first();
        } catch (e) {
          console.warn('D1 query error:', e);
        }
      }

      if (!user) {
        for (const u of memoryUsers.values()) {
          if (u.email === email) {
            user = u;
            break;
          }
        }
      }

      if (!user) {
        return errorResponse('Invalid email or password', 401, origin);
      }

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return errorResponse('Invalid email or password', 401, origin);
      }

      const access_token = await createJWT({ sub: user.id, email: user.email, username: user.username }, env.JWT_SECRET, 86400 * 7);
      const refresh_token = await createJWT({ sub: user.id, type: 'refresh' }, env.JWT_SECRET, 86400 * 30);

      return jsonResponse({
        access_token,
        refresh_token,
        token_type: 'bearer'
      }, 200, origin);
    } catch (err: any) {
      return errorResponse(err.message || 'Login failed', 500, origin);
    }
  }

  if ((path === '/api/v1/auth/profile' || path === '/api/v1/auth/me' || path === '/api/auth/profile') && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);
    return jsonResponse(user, 200, origin);
  }

  if ((path === '/api/v1/auth/refresh' || path === '/api/auth/refresh') && request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const { refresh_token } = body;
      const payload = await verifyJWT(refresh_token, env.JWT_SECRET);
      if (!payload || !payload.sub) return errorResponse('Invalid refresh token', 401, origin);

      const access_token = await createJWT({ sub: payload.sub }, env.JWT_SECRET, 86400 * 7);
      return jsonResponse({ access_token, token_type: 'bearer' }, 200, origin);
    } catch {
      return errorResponse('Invalid refresh token', 401, origin);
    }
  }

  // ---------------- ASSESSMENTS ----------------
  if ((path === '/api/v1/assessments/questions' || path === '/api/assessments/questions') && request.method === 'GET') {
    return jsonResponse(ASSESSMENT_QUESTIONS, 200, origin);
  }

  if ((path === '/api/v1/assessments' || path === '/api/assessments') && request.method === 'POST') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    try {
      const body = await request.json() as any;
      const rawAnswers = body.answers || {};
      
      let answersList: Array<{ question_id: string; score: number }> = [];
      if (Array.isArray(rawAnswers)) {
        answersList = rawAnswers.map(a => ({
          question_id: a.question_id || a.id,
          score: Number(a.answer_value ?? a.score ?? 5)
        }));
      } else {
        answersList = Object.entries(rawAnswers).map(([qid, val]) => ({
          question_id: qid,
          score: Number(val)
        }));
      }

      const qMap: Record<string, string> = {};
      ASSESSMENT_QUESTIONS.forEach(q => { qMap[q.id] = q.category; });

      const triggerScores: number[] = [];
      const severityScores: number[] = [];
      const emotionalScores: number[] = [];

      answersList.forEach(a => {
        const cat = qMap[a.question_id];
        if (cat === 'triggers') triggerScores.push(a.score);
        else if (cat === 'severity') severityScores.push(a.score);
        else if (cat === 'emotional') emotionalScores.push(a.score);
      });

      const avgTrigger = triggerScores.length ? triggerScores.reduce((a, b) => a + b, 0) / triggerScores.length : 5;
      const avgSeverity = severityScores.length ? severityScores.reduce((a, b) => a + b, 0) / severityScores.length : 5;
      const avgEmotional = emotionalScores.length ? emotionalScores.reduce((a, b) => a + b, 0) / emotionalScores.length : 5;

      const dopamine_sensitivity = Math.min(100, Math.round(((avgSeverity + avgTrigger) / 2) * 10));
      const stress_rating = Math.min(100, Math.round(avgEmotional * 10));
      const trigger_frequency = Math.round(avgTrigger);
      const relapse_risk_index = Math.min(100, Math.max(0, Math.round((dopamine_sensitivity * 0.4) + (stress_rating * 0.35) + (trigger_frequency * 2.5))));

      const signal_vector = {
        dopamine_sensitivity,
        stress_rating,
        trigger_frequency,
        relapse_risk_index
      };

      const daily_insights = [];
      if (dopamine_sensitivity > 60) {
        daily_insights.push({
          id: 'ins-1',
          priority: 'high',
          category: 'Dopamine Protocol',
          title: 'High Dopamine Sensitivity Detected',
          description: 'Consider taking a 24h digital detox and substituting instant gratification loops with physical exercise or breathwork.'
        });
      }
      if (stress_rating > 60) {
        daily_insights.push({
          id: 'ins-2',
          priority: 'high',
          category: 'Stress Regulation',
          title: 'Elevated Stress Level',
          description: 'Practice the 4-7-8 breathing technique twice today. Cortisol spikes are the #1 catalyst for recovery slips.'
        });
      }
      if (trigger_frequency > 5) {
        daily_insights.push({
          id: 'ins-3',
          priority: 'medium',
          category: 'Environmental Cues',
          title: 'Frequent Triggers Encountered',
          description: 'Modify your daily transit route or screen habits to bypass familiar trigger locations and prompts.'
        });
      }
      daily_insights.push({
        id: 'ins-4',
        priority: 'low',
        category: 'Affirmation & Anchor',
        title: 'Daily Anchor & Commitment',
        description: 'You are rebuilding neural resilience with each resisted urge. Stay connected with the community today.'
      });

      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();

      if (d1) {
        try {
          await d1.prepare(
            'INSERT INTO assessments (id, user_id, answers_json, signal_vector_json, insights_json, created_at) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(id, user.id, JSON.stringify(answersList), JSON.stringify(signal_vector), JSON.stringify(daily_insights), created_at).run();
        } catch (e) {
          console.warn('D1 assessment error:', e);
        }
      }

      const userAssessments = memoryAssessments.get(user.id) || [];
      userAssessments.unshift({ id, signal_vector, daily_insights, created_at });
      memoryAssessments.set(user.id, userAssessments);

      return jsonResponse({
        id,
        signal_vector,
        daily_insights,
        created_at
      }, 201, origin);
    } catch (err: any) {
      return errorResponse(err.message || 'Assessment submission failed', 500, origin);
    }
  }

  if ((path === '/api/v1/assessments/latest' || path === '/api/assessments/latest') && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    if (d1) {
      try {
        const row = await d1.prepare('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
          .bind(user.id)
          .first() as any;
        if (row) {
          return jsonResponse({
            id: row.id,
            signal_vector: JSON.parse(row.signal_vector_json || '{}'),
            daily_insights: JSON.parse(row.insights_json || '[]'),
            created_at: row.created_at
          }, 200, origin);
        }
      } catch (e) {
        console.warn('D1 query error:', e);
      }
    }

    const mem = memoryAssessments.get(user.id);
    if (mem && mem.length > 0) {
      return jsonResponse(mem[0], 200, origin);
    }

    return errorResponse('No assessment found', 404, origin);
  }

  if ((path === '/api/v1/assessments/insights' || path === '/api/assessments/insights') && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    if (d1) {
      try {
        const row = await d1.prepare('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
          .bind(user.id)
          .first() as any;
        if (row) {
          return jsonResponse({
            insights: JSON.parse(row.insights_json || '[]'),
            signal_vector: JSON.parse(row.signal_vector_json || '{}')
          }, 200, origin);
        }
      } catch (e) {
        console.warn('D1 query error:', e);
      }
    }

    const mem = memoryAssessments.get(user.id);
    if (mem && mem.length > 0) {
      return jsonResponse({
        insights: mem[0].daily_insights,
        signal_vector: mem[0].signal_vector
      }, 200, origin);
    }

    return jsonResponse({ insights: [], signal_vector: {} }, 200, origin);
  }

  // ---------------- ANALYTICS & DASHBOARD ----------------
  if ((path === '/api/v1/analytics/dashboard' || path === '/api/analytics/dashboard') && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    const userCreatedAt = new Date(user.created_at || Date.now());
    const daysSinceJoin = Math.max(1, Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 86400)));

    let streakDays = daysSinceJoin;
    let totalResisted = 0;
    let riskLevel = 'Low';

    if (d1) {
      try {
        const lastRelapse = await d1.prepare('SELECT created_at FROM urges WHERE user_id = ? AND resisted = 0 ORDER BY created_at DESC LIMIT 1')
          .bind(user.id)
          .first() as any;

        if (lastRelapse && lastRelapse.created_at) {
          const relapseTime = new Date(lastRelapse.created_at).getTime();
          streakDays = Math.max(0, Math.floor((Date.now() - relapseTime) / (1000 * 86400)));
        }

        const totalResistedRes = await d1.prepare('SELECT COUNT(*) as count FROM urges WHERE user_id = ? AND resisted = 1')
          .bind(user.id)
          .first() as any;
        totalResisted = totalResistedRes ? totalResistedRes.count : 0;

        const latestAssess = await d1.prepare('SELECT signal_vector_json FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1')
          .bind(user.id)
          .first() as any;
        if (latestAssess && latestAssess.signal_vector_json) {
          const vec = JSON.parse(latestAssess.signal_vector_json);
          const rri = vec.relapse_risk_index || 0;
          if (rri > 70) riskLevel = 'High';
          else if (rri > 40) riskLevel = 'Moderate';
        }
      } catch (e) {
        console.warn('D1 dashboard error:', e);
      }
    }

    const milestones = MILESTONES.map(m => ({
      ...m,
      earned: streakDays >= m.days_required,
      earned_at: streakDays >= m.days_required ? user.created_at : undefined
    }));

    return jsonResponse({
      streak_days: streakDays,
      longest_streak: Math.max(user.longest_streak || 0, streakDays),
      total_urges_resisted: totalResisted,
      total_days_tracked: daysSinceJoin,
      current_milestones: milestones,
      relapse_risk_level: riskLevel,
      badges: milestones,
      streak: {
        current: streakDays,
        longest: Math.max(user.longest_streak || 0, streakDays),
        nextMilestone: MILESTONES.find(m => m.days_required > streakDays)?.days_required || 365
      },
      stats: {
        urgesResisted: totalResisted,
        daysTracked: daysSinceJoin,
        riskLevel
      }
    }, 200, origin);
  }

  if ((path === '/api/v1/analytics/mood' || path === '/api/analytics/mood') && request.method === 'POST') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    try {
      const body = await request.json() as any;
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();

      if (d1) {
        try {
          await d1.prepare(
            'INSERT INTO moods (id, user_id, mood_score, craving_score, energy_level, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(id, user.id, body.mood_score || 5, body.craving_score || 5, body.energy_level || 5, body.notes || '', created_at).run();
        } catch (e) {
          console.warn('D1 mood error:', e);
        }
      }

      const mList = memoryMoods.get(user.id) || [];
      mList.push({ id, ...body, created_at });
      memoryMoods.set(user.id, mList);

      return jsonResponse({ id, ...body, created_at }, 201, origin);
    } catch (err: any) {
      return errorResponse(err.message, 500, origin);
    }
  }

  if ((path.includes('/analytics/mood/trends') || path.includes('/analytics/mood-trends')) && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    let rows: any[] = [];
    if (d1) {
      try {
        const moods = await d1.prepare('SELECT * FROM moods WHERE user_id = ? ORDER BY created_at ASC LIMIT 30')
          .bind(user.id)
          .all();
        rows = moods.results || [];
      } catch (e) {
        console.warn('D1 query error:', e);
      }
    }
    if (rows.length === 0) {
      rows = memoryMoods.get(user.id) || [];
    }

    const dataPoints = rows.map((m: any) => ({
      date: m.created_at,
      mood: m.mood_score,
      craving: m.craving_score,
      energy: m.energy_level
    }));

    return jsonResponse({ period: '30d', data_points: dataPoints }, 200, origin);
  }

  if ((path.includes('/analytics/triggers/heatmap') || path.includes('/analytics/trigger-heatmap')) && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    let urgesList: any[] = [];
    if (d1) {
      try {
        const urges = await d1.prepare('SELECT created_at, intensity FROM urges WHERE user_id = ?')
          .bind(user.id)
          .all();
        urgesList = urges.results || [];
      } catch (e) {
        console.warn('D1 heatmap error:', e);
      }
    }
    if (urgesList.length === 0) {
      urgesList = memoryUrges.get(user.id) || [];
    }

    const map: Record<string, { count: number; totalIntensity: number }> = {};
    urgesList.forEach((u: any) => {
      const d = new Date(u.created_at);
      const day = d.getDay();
      const hour = d.getHours();
      const key = `${day}-${hour}`;
      if (!map[key]) map[key] = { count: 0, totalIntensity: 0 };
      map[key].count++;
      map[key].totalIntensity += (u.intensity || 5);
    });

    const data = Object.entries(map).map(([key, val]) => {
      const [day, hour] = key.split('-').map(Number);
      return {
        day_of_week: day,
        day,
        hour,
        count: val.count,
        intensity: Math.round(val.totalIntensity / val.count)
      };
    });

    return jsonResponse({ data, grid: data }, 200, origin);
  }

  // ---------------- URGES ----------------
  if ((path === '/api/v1/urges' || path === '/api/urges') && request.method === 'POST') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    try {
      const body = await request.json() as any;
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();
      const intensity = Number(body.intensity || 5);
      const triggers = JSON.stringify(body.triggers || []);
      const emotions = JSON.stringify(body.emotions || []);
      const coping = body.coping_strategy_used || body.copingStrategyUsed || '';
      const duration = Number(body.duration_minutes || body.durationMinutes || 0);
      const notes = body.notes || '';
      const resisted = body.resisted !== false ? 1 : 0;

      if (d1) {
        try {
          await d1.prepare(
            'INSERT INTO urges (id, user_id, intensity, triggers_json, emotions_json, coping_strategy_used, duration_minutes, notes, resisted, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(id, user.id, intensity, triggers, emotions, coping, duration, notes, resisted, created_at).run();
        } catch (e) {
          console.warn('D1 urges error:', e);
        }
      }

      const uList = memoryUrges.get(user.id) || [];
      const logEntry = {
        id,
        intensity,
        triggers: body.triggers || [],
        emotions: body.emotions || [],
        coping_strategy_used: coping,
        duration_minutes: duration,
        durationMinutes: duration,
        notes,
        resisted: resisted === 1,
        created_at,
        timestamp: created_at
      };
      uList.unshift(logEntry);
      memoryUrges.set(user.id, uList);

      return jsonResponse(logEntry, 201, origin);
    } catch (err: any) {
      return errorResponse(err.message, 500, origin);
    }
  }

  if ((path === '/api/v1/urges' || path === '/api/urges') && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    if (d1) {
      try {
        const rows = await d1.prepare('SELECT * FROM urges WHERE user_id = ? ORDER BY created_at DESC LIMIT 50')
          .bind(user.id)
          .all();
        if (rows.results && rows.results.length > 0) {
          const result = rows.results.map((r: any) => ({
            id: r.id,
            intensity: r.intensity,
            triggers: JSON.parse(r.triggers_json || '[]'),
            emotions: JSON.parse(r.emotions_json || '[]'),
            coping_strategy_used: r.coping_strategy_used,
            duration_minutes: r.duration_minutes,
            durationMinutes: r.duration_minutes,
            notes: r.notes,
            resisted: r.resisted === 1,
            created_at: r.created_at,
            timestamp: r.created_at
          }));
          return jsonResponse(result, 200, origin);
        }
      } catch (e) {
        console.warn('D1 query error:', e);
      }
    }

    const mem = memoryUrges.get(user.id) || [];
    return jsonResponse(mem, 200, origin);
  }

  if ((path.includes('/urges/trends')) && request.method === 'GET') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);

    const mem = memoryUrges.get(user.id) || [];
    const dataPoints = mem.map((r: any) => ({
      date: r.created_at,
      intensity: r.intensity,
      duration: r.duration_minutes,
      resisted: r.resisted
    }));

    return jsonResponse({ period: '30d', data_points: dataPoints }, 200, origin);
  }

  // ---------------- CHAT & COMMUNITY ----------------
  if ((path.includes('/chat/rooms')) && !path.includes('/messages') && request.method === 'GET') {
    const defaultRooms = [
      { id: 'general', room_id: 'general', name: 'General Recovery', description: 'A safe, supportive place for general recovery conversations and daily reflections.', type: 'general', room_type: 'general', online_count: 5, onlineCount: 5, is_active: true },
      { id: 'urge-surfing', room_id: 'urge-surfing', name: 'Urge Surfing Station', description: 'Emergency check-ins and live support when cravings or urges strike.', type: 'emergency', room_type: 'emergency', online_count: 8, onlineCount: 8, is_active: true },
      { id: 'mindfulness', room_id: 'mindfulness', name: 'Mindfulness & Meditation', description: 'Share breathing exercises, meditation practices, and calm moments.', type: 'support', room_type: 'support', online_count: 3, onlineCount: 3, is_active: true },
      { id: 'milestones', room_id: 'milestones', name: 'Celebrations & Milestones', description: 'Share your streak victories and inspire others in the community.', type: 'general', room_type: 'general', online_count: 4, onlineCount: 4, is_active: true }
    ];
    return jsonResponse(defaultRooms, 200, origin);
  }

  const roomMessagesMatch = path.match(/chat\/rooms\/([^/]+)\/messages/);
  if (roomMessagesMatch && request.method === 'GET') {
    const roomId = roomMessagesMatch[1];
    let msgs: any[] = [];
    if (d1) {
      try {
        const rows = await d1.prepare('SELECT * FROM chat_messages WHERE room_id = ? ORDER BY created_at ASC LIMIT 50')
          .bind(roomId)
          .all();
        msgs = rows.results || [];
      } catch (e) {
        console.warn('D1 chat error:', e);
      }
    }
    if (msgs.length === 0) {
      msgs = memoryMessages.filter(m => m.room_id === roomId);
    }
    return jsonResponse(msgs, 200, origin);
  }

  if (roomMessagesMatch && request.method === 'POST') {
    const user = await getUserFromAuth(request, env);
    if (!user) return errorResponse('Unauthorized', 401, origin);
    const roomId = roomMessagesMatch[1];
    try {
      const body = await request.json() as any;
      const id = crypto.randomUUID();
      const created_at = new Date().toISOString();
      const msg = {
        id,
        room_id: roomId,
        user_id: user.id,
        username: user.username,
        content: body.content,
        message_type: 'text',
        created_at
      };

      if (d1) {
        try {
          await d1.prepare(
            'INSERT INTO chat_messages (id, room_id, user_id, username, content, message_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
          ).bind(id, roomId, user.id, user.username, body.content || '', 'text', created_at).run();
        } catch (e) {
          console.warn('D1 chat error:', e);
        }
      }
      memoryMessages.push(msg);

      return jsonResponse(msg, 201, origin);
    } catch (err: any) {
      return errorResponse(err.message, 500, origin);
    }
  }

  return errorResponse(`Route not found: ${request.method} ${path}`, 404, origin);
}
