import { supabase } from "../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  // Validate input
  const { data } = req.body;
  if (!data || !data.name) {
    return res.status(400).json({
      status: "error",
      message: "Missing required data fields",
    });
  }

  try {
    // Construct the values array, including "Other" fields if applicable
    const expertiseList = data.expertise.includes("Other")
      ? [...data.expertise.filter((e) => e !== "Other"), data.otherExpertise]
      : data.expertise;

    // Convert interests to an array if it's not already an array
    const interestList = Array.isArray(data.interests)
      ? data.interests
      : [data.interests];

    // Insert data into the 'talent_recruits' table using Supabase
    const { error } = await supabase.from("talent_recruits").insert({
      name: data.name,
      expertise: expertiseList,
      experience: data.experience,
      interests: interestList,
      talents: data.talents,
      languages: data.languages,
      timezone: data.timezone,
      description: data.description,
      email: data.email,
      twitter: data.twitter,
      linkedin: data.linkedin,
      previous_work_links: data.previousWorkLinks,
      logged_in_discord: data.loggedInDiscord,
      logged_in_twitter: data.loggedInTwitter,
      logged_username: data.loggedUsername,
      availability: data.availability,
      work_preference: data.workPreference,
      created_at: new Date().toISOString(), // Add the current timestamp
    });

    if (error) {
      throw error;
    }

    res.status(200).json({
      status: "success",
      message: "Data inserted successfully!",
    });
  } catch (error) {
    console.error("Error inserting data into the database:", error);
    res.status(500).json({
      status: "error",
      error: error.toString(),
    });
  }
}