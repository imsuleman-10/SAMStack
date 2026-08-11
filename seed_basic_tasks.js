import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: "C:/Users/Suleman Mughal/Desktop/comp/.env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

const basicTasks = [
  // WEB_DEV
  { track: 'WEB_DEV', w: 1, t: "Build a Personal Portfolio", s: "Create a simple static portfolio using HTML and CSS. Include a header, about me section, and contact form.", c: "Must be responsive on mobile devices and use semantic HTML tags." },
  { track: 'WEB_DEV', w: 2, t: "Interactive To-Do List", s: "Build a to-do list using plain JavaScript. Users should be able to add, delete, and mark tasks as complete.", c: "Use localStorage to save tasks so they persist after a refresh." },
  { track: 'WEB_DEV', w: 3, t: "Weather API App", s: "Fetch weather data from a public API (like OpenWeather) and display the current temperature and forecast.", c: "Must handle API errors gracefully and show a loading state." },
  
  // PYTHON
  { track: 'PYTHON', w: 1, t: "Console Calculator", s: "Write a Python script that takes user input to perform addition, subtraction, multiplication, and division.", c: "Handle zero-division errors and invalid string inputs." },
  { track: 'PYTHON', w: 2, t: "Web Scraper Basics", s: "Use BeautifulSoup to scrape headlines from a news website and save them to a CSV file.", c: "Extract at least 10 headlines and include the publication date." },
  { track: 'PYTHON', w: 3, t: "Flask REST API", s: "Create a simple REST API using Flask that allows CRUD operations on a list of books.", c: "Use Postman to test GET, POST, PUT, and DELETE endpoints." },

  // MERN
  { track: 'MERN', w: 1, t: "React Component Library", s: "Build a set of reusable React components (Button, Card, Navbar) using TailwindCSS.", c: "Use props to make components customizable." },
  { track: 'MERN', w: 2, t: "Express User API", s: "Set up an Express.js server connected to MongoDB. Create routes to register and fetch users.", c: "Hash passwords using bcrypt before saving to MongoDB." },
  { track: 'MERN', w: 3, t: "Fullstack Blog App", s: "Connect your React frontend to the Express backend to create a basic blog where users can post articles.", c: "Implement basic JWT authentication." }
];

async function seed() {
  console.log("Starting seed of basic tasks...");
  
  // Delete existing tasks to start fresh
  const { error: delErr } = await supabaseAdmin.from("track_tasks").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delErr) {
    console.error("Failed to clear tasks. Does table exist? Error:", delErr.message);
    return;
  }

  for (const task of basicTasks) {
    const { error } = await supabaseAdmin.from("track_tasks").insert({
      track_id: task.track,
      title: task.t,
      scope: task.s,
      criteria: task.c,
      week_number: task.w,
    });
    if (error) {
      console.error(`Error inserting ${task.t}:`, error.message);
    } else {
      console.log(`Inserted: ${task.t}`);
    }
  }
  console.log("Seeding complete!");
}

seed();
