import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { tracks } from "./src/lib/curriculum";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTasks() {
  console.log("Fetching admin user...");
  // Let's get the first admin or mentor to assign these default tasks to
  const { data: adminData } = await supabase
    .from("users")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .single();

  const mentorId = adminData?.id || null;

  console.log(`Using Mentor/Admin ID: ${mentorId}`);

  console.log("Seeding track_tasks...");

  let totalInserted = 0;

  for (const trackKey of Object.keys(tracks)) {
    const track = (tracks as any)[trackKey];
    console.log(`Processing track: ${track.id}`);
    
    // Each track has 5 tasks. Let's assign them to weeks 1 to 5
    for (let i = 0; i < track.tasks.length; i++) {
      const task = track.tasks[i];
      const weekNumber = i + 1; // Assuming 5 tasks -> 5 weeks
      
      const { data, error } = await supabase.from("track_tasks").insert({
        track_id: track.id,
        mentor_id: mentorId,
        title: task.title,
        scope: task.scope,
        criteria: task.criteria,
        week_number: weekNumber,
      });

      if (error) {
        console.error(`Error inserting ${task.title}:`, error.message);
      } else {
        totalInserted++;
      }
    }
  }

  console.log(`Successfully seeded ${totalInserted} default tasks.`);
}

seedTasks().catch(console.error);
