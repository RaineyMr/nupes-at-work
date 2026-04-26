import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmrtrxdrshkryfgjluqw.supabase.co';
const supabaseAnonKey = 'sb_publishable_Q4m4RXoRacNIM5QXpZ-zgg_st4Ot4A4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common operations
export const supabaseHelpers = {
  // Profile operations
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  // Job operations
  async getJobs(filters = {}) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!employer_id(
          company_name,
          industry,
          logo_url,
          location
        )
      `)
      .eq('status', 'open');

    // Apply filters
    if (filters.job_type) {
      query = query.eq('job_type', filters.job_type);
    }
    if (filters.industry) {
      query = query.eq('industry', filters.industry);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.salary_min) {
      query = query.gte('salary_min', filters.salary_min);
    }
    if (filters.salary_max) {
      query = query.lte('salary_max', filters.salary_max);
    }

    const { data, error } = await query.order('posted_at', { ascending: false });
    
    return { data, error };
  },

  async getJob(jobId) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        employer:profiles!employer_id(
          company_name,
          industry,
          logo_url,
          location,
          website
        )
      `)
      .eq('id', jobId)
      .single();
    
    return { data, error };
  },

  async createJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();
    
    return { data, error };
  },

  // Application operations
  async createApplication(applicationData) {
    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select()
      .single();
    
    return { data, error };
  },

  async getUserApplications(userId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(
          title,
          company_name,
          location,
          job_type,
          status
        )
      `)
      .eq('profile_id', userId)
      .order('applied_at', { ascending: false });
    
    return { data, error };
  },

  // Skills operations
  async getUserSkills(userId) {
    const { data, error } = await supabase
      .from('member_skills')
      .select('*')
      .eq('profile_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async addSkill(skillData) {
    const { data, error } = await supabase
      .from('member_skills')
      .insert(skillData)
      .select()
      .single();
    
    return { data, error };
  },

  async removeSkill(skillId) {
    const { error } = await supabase
      .from('member_skills')
      .delete()
      .eq('id', skillId);
    
    return { error };
  },

  // Message operations
  async getMessages(userId) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        from_user:profiles!from_user_id(
          first_name,
          last_name,
          profile_photo_url
        ),
        to_user:profiles!to_user_id(
          first_name,
          last_name,
          profile_photo_url
        )
      `)
      .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
      .order('sent_at', { ascending: false });
    
    return { data, error };
  },

  async sendMessage(messageData) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select()
      .single();
    
    return { data, error };
  },

  // Match operations
  async getJobMatches(jobId) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        profile:profiles!profile_id(
          first_name,
          last_name,
          headline,
          profile_photo_url,
          current_stage
        )
      `)
      .eq('job_id', jobId)
      .order('match_score', { ascending: false })
      .limit(10);
    
    return { data, error };
  },

  async getUserMatches(userId) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        job:jobs(
          title,
          company_name,
          location,
          job_type,
          salary_min,
          salary_max
        )
      `)
      .eq('profile_id', userId)
      .order('match_score', { ascending: false });
    
    return { data, error };
  },

  // Preferences operations
  async getUserPreferences(userId) {
    const { data, error } = await supabase
      .from('member_preferences')
      .select('*')
      .eq('profile_id', userId)
      .single();
    
    return { data, error };
  },

  async updateUserPreferences(userId, preferences) {
    const { data, error } = await supabase
      .from('member_preferences')
      .upsert({ profile_id: userId, ...preferences })
      .select()
      .single();
    
    return { data, error };
  }
};

export default supabase;
