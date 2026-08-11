import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

async function checkColumn() {
  const { data, error } = await supabase.from("track_tasks").select("week_number").limit(1);
  if (error) {
    console.error("Column check failed:", error.message);
  } else {
    console.log("Column exists!", data);
  }
}

checkColumn().catch(console.error);
