import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const signInWithEmail = async (email: string, password: string) => {
  // Attempt login
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw new Error("Invalid email or password");
  }

  const userId = data.user.id; // Get the authenticated user's ID

  // Fetch user details from "public.users"
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", userId) // Query by UUID
    .single();

  if (userError || !userData) {
    console.error("User query error:", userError);
    throw new Error("User not found in database.");
  }

  return userData; // Return user details
};


export const signUpWithEmail = async (name: string, email: string, password: string, role: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;

  // Get the newly created user
  const { data: userSession } = await supabase.auth.getUser();
  if (!userSession || !userSession.user) throw new Error("User authentication failed");

  if (!data.user) throw new Error("User authentication failed");
  const userId = data.user.id; // Use authenticated user's ID

  // Insert user details into "users" table
  const { error: insertError } = await supabase.from("users").insert([
    { id: userId, name, email, role }
  ]);

  if (insertError) throw insertError;

  // Add a slight delay to ensure the user data is available in the database
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Fetch user details from "users" table to confirm insertion
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("name, role")
    .eq("id", userId)
    .single();

  if (userError || !userData) throw new Error("User not found in database");

  return { name, role };
};
