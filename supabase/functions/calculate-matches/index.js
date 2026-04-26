import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { job_id, profile_id } = await req.json()
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    )

    if (job_id) {
      // Job posted - find matches for this job
      const matches = await findMatchesForJob(job_id, supabase)
      return new Response(JSON.stringify(matches), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else if (profile_id) {
      // Profile updated - find jobs for this member
      const matches = await findJobsForMember(profile_id, supabase)
      return new Response(JSON.stringify(matches), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      return new Response(JSON.stringify({ error: 'job_id or profile_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function findMatchesForJob(jobId, supabase) {
  // 1. Get job details
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single()

  if (!job) {
    throw new Error('Job not found')
  }

  // 2. Get all member profiles with skills and preferences
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      *,
      member_skills!member_skills_profile_id_fkey(
        skill_name,
        proficiency_level,
        endorsement_count
      ),
      member_preferences!member_preferences_profile_id_fkey(
        salary_min,
        salary_max,
        remote_preference,
        preferred_locations,
        willing_to_relocate,
        job_types_interested,
        industries_interested
      )
    `)
    .eq("role", "member")
    .eq("allow_employer_contact", true)

  if (!profiles || profiles.length === 0) {
    return []
  }

  // 3. Calculate match for each profile
  const matches = profiles.map((profile) => {
    const skillsMatch = calculateSkillsScore(profile.member_skills, job.required_skills, job.preferred_skills)
    const interestMatch = calculateInterestScore(profile.member_preferences, job.industry, job.job_type)
    const locationMatch = calculateLocationScore(profile.member_preferences, job.location)
    const salaryMatch = calculateSalaryScore(profile.member_preferences, job.salary_min, job.salary_max)
    const availabilityMatch = calculateAvailabilityScore(profile.current_stage, job.experience_level)

    const totalScore = 
      (skillsMatch * 0.40) +
      (interestMatch * 0.25) +
      (locationMatch * 0.15) +
      (salaryMatch * 0.15) +
      (availabilityMatch * 0.05)

    return {
      job_id: jobId,
      profile_id: profile.id,
      match_score: Math.round(totalScore),
      skills_score: skillsMatch,
      interests_score: interestMatch,
      location_score: locationMatch,
      salary_score: salaryMatch,
      availability_score: availabilityMatch,
      match_reason: generateMatchReason(skillsMatch, interestMatch, locationMatch, salaryMatch, availabilityMatch),
      created_at: new Date().toISOString()
    }
  })

  // 4. Filter matches with minimum threshold (50%)
  const validMatches = matches.filter(match => match.match_score >= 50)

  // 5. Sort by score (highest first)
  validMatches.sort((a, b) => b.match_score - a.match_score)

  // 6. Save matches to database (only top 100)
  if (validMatches.length > 0) {
    await supabase.from("matches").upsert(validMatches.slice(0, 100), {
      onConflict: 'job_id,profile_id'
    })
  }

  // 7. Return top 10 matches
  return validMatches.slice(0, 10)
}

async function findJobsForMember(profileId, supabase) {
  // 1. Get member profile with skills and preferences
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      member_skills!member_skills_profile_id_fkey(
        skill_name,
        proficiency_level,
        endorsement_count
      ),
      member_preferences!member_preferences_profile_id_fkey(
        salary_min,
        salary_max,
        remote_preference,
        preferred_locations,
        willing_to_relocate,
        job_types_interested,
        industries_interested
      )
    `)
    .eq("id", profileId)
    .single()

  if (!profile) {
    throw new Error('Profile not found')
  }

  // 2. Get all open jobs
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .eq("status", "open")

  if (!jobs || jobs.length === 0) {
    return []
  }

  // 3. Calculate match for each job
  const matches = jobs.map((job) => {
    const skillsMatch = calculateSkillsScore(profile.member_skills, job.required_skills, job.preferred_skills)
    const interestMatch = calculateInterestScore(profile.member_preferences, job.industry, job.job_type)
    const locationMatch = calculateLocationScore(profile.member_preferences, job.location)
    const salaryMatch = calculateSalaryScore(profile.member_preferences, job.salary_min, job.salary_max)
    const availabilityMatch = calculateAvailabilityScore(profile.current_stage, job.experience_level)

    const totalScore = 
      (skillsMatch * 0.40) +
      (interestMatch * 0.25) +
      (locationMatch * 0.15) +
      (salaryMatch * 0.15) +
      (availabilityMatch * 0.05)

    return {
      job_id: job.id,
      profile_id: profileId,
      match_score: Math.round(totalScore),
      skills_score: skillsMatch,
      interests_score: interestMatch,
      location_score: locationMatch,
      salary_score: salaryMatch,
      availability_score: availabilityMatch,
      match_reason: generateMatchReason(skillsMatch, interestMatch, locationMatch, salaryMatch, availabilityMatch),
      created_at: new Date().toISOString()
    }
  })

  // 4. Filter matches with minimum threshold (50%)
  const validMatches = matches.filter(match => match.match_score >= 50)

  // 5. Sort by score (highest first)
  validMatches.sort((a, b) => b.match_score - a.match_score)

  // 6. Save matches to database (only top 100)
  if (validMatches.length > 0) {
    await supabase.from("matches").upsert(validMatches.slice(0, 100), {
      onConflict: 'job_id,profile_id'
    })
  }

  // 7. Return all valid matches
  return validMatches
}

function calculateSkillsScore(memberSkills, requiredSkills, preferredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) return 100

  const memberSkillNames = memberSkills ? memberSkills.map(s => s.skill_name.toLowerCase()) : []
  const requiredSkillsLower = requiredSkills ? requiredSkills.map(s => s.toLowerCase()) : []
  const preferredSkillsLower = preferredSkills ? preferredSkills.map(s => s.toLowerCase()) : []

  // Calculate required skills match (70% of skills score)
  const matchedRequired = requiredSkillsLower.filter(skill => 
    memberSkillNames.includes(skill)
  )
  const requiredScore = (matchedRequired.length / requiredSkills.length) * 70

  // Calculate preferred skills match (30% of skills score)
  const matchedPreferred = preferredSkillsLower.filter(skill => 
    memberSkillNames.includes(skill)
  )
  const preferredScore = preferredSkills.length > 0 
    ? (matchedPreferred.length / preferredSkills.length) * 30 
    : 15 // bonus if no preferred skills specified

  return Math.round(requiredScore + preferredScore)
}

function calculateInterestScore(preferences, jobIndustry, jobType) {
  let score = 50 // base score

  // Industry match (15 points)
  if (preferences?.industries_interested?.includes(jobIndustry)) {
    score += 15
  }

  // Job type match (10 points)
  if (preferences?.job_types_interested?.includes(jobType)) {
    score += 10
  }

  return Math.min(score, 100)
}

function calculateLocationScore(preferences, jobLocation) {
  if (!preferences) return 50

  // Remote preference
  if (preferences.remote_preference === "fully_remote" && jobLocation.toLowerCase().includes("remote")) {
    return 100
  }
  
  if (preferences.remote_preference === "fully_remote") {
    return 25 // penalize non-remote jobs
  }

  if (preferences.remote_preference === "hybrid" && (jobLocation.toLowerCase().includes("remote") || jobLocation.toLowerCase().includes("hybrid"))) {
    return 85
  }

  // Preferred locations
  if (preferences.preferred_locations?.includes(jobLocation)) {
    return 100
  }

  // Willing to relocate
  if (preferences.willing_to_relocate) {
    return 75
  }

  return 25
}

function calculateSalaryScore(preferences, jobMin, jobMax) {
  if (!preferences || !jobMin) return 50

  const memberMin = preferences.salary_min || 0
  const memberMax = preferences.salary_max || 999999999

  // Perfect overlap
  if (jobMin >= memberMin && jobMax <= memberMax) {
    return 100
  }

  // Partial overlap
  if (jobMax >= memberMin && jobMin <= memberMax) {
    return 75
  }

  // Job below expectations
  if (jobMax < memberMin) {
    return 25
  }

  // Job above expectations (could be good)
  if (jobMin > memberMax) {
    return 60
  }

  return 50
}

function calculateAvailabilityScore(memberStage, jobLevel) {
  const stageRank = { 
    freshman: 1, sophomore: 2, junior: 3, senior: 4, alumni: 5 
  }
  const jobRank = { 
    entry: 1, mid: 2, senior: 3 
  }
  
  const memberRank = stageRank[memberStage] || 0
  const requiredRank = jobRank[jobLevel] || 1

  // Perfect match or overqualified
  if (memberRank >= requiredRank) {
    return 100
  }

  // Undergraduate but close
  if (requiredRank - memberRank === 1) {
    return 75
  }

  // Significantly underqualified
  return 25
}

function generateMatchReason(skills, interests, location, salary, availability) {
  const reasons = []
  
  if (skills >= 80) reasons.push("Strong skills match")
  else if (skills >= 60) reasons.push("Good skills match")
  else if (skills >= 40) reasons.push("Partial skills match")
  else reasons.push("Limited skills match")

  if (interests >= 80) reasons.push("Excellent industry/type fit")
  else if (interests >= 60) reasons.push("Good industry/type fit")
  else reasons.push("Different industry/type than preferences")

  if (location >= 80) reasons.push("Perfect location match")
  else if (location >= 60) reasons.push("Good location fit")
  else reasons.push("Location doesn't match preferences")

  if (salary >= 80) reasons.push("Salary aligns with expectations")
  else if (salary >= 60) reasons.push("Salary in acceptable range")
  else reasons.push("Salary below expectations")

  if (availability >= 80) reasons.push("Perfect experience level match")
  else if (availability >= 60) reasons.push("Good experience level fit")
  else reasons.push("Experience level may not match")

  return reasons.join("; ")
}
