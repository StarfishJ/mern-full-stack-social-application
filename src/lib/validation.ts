import { z } from "zod"; 
// zod is a schema declaration and validation library for typescript
// zod can be used  for both frontend and backend validation
// zod is a runtime validation library, it will throw an error if the data is invalid
// zod is a type inference library, it will infer the type of the data based on the schema  

const requiredString = z.string().trim().min(1, "Required"); 
// zod schema for a required string , min 1 character and required error message

// zod schema for a sign up form
export const signUpSchema = z.object({
  email: requiredString.email("Invalid email address"), 
  // zod schema for a required string, email and invalid email address error message
  // schema is a pattern that describes the shape of the data
  // by defining the schema, we can validate the data at runtime
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Only letters, numbers, - and _ allowed", // error message
  ),
  // zod schema for a required string, regex and only letters, numbers, - and _ allowed error message
  password: requiredString.min(8, "Must be at least 8 characters"),
  // zod schema for a required string, min 8 characters and must be at least 8 characters error message
});

export type SignUpValues = z.infer<typeof signUpSchema>;
// zod type for the sign up schema
//z.infer is used to automatically infer the type of the data based on the schema

// zod schema for a login form
export const loginSchema = z.object({
  username: requiredString,
  password: requiredString,
}); // zod schema for a required string, username and password

export type LoginValues = z.infer<typeof loginSchema>;
// zod type for the login schema

// zod schema for a create post form
export const createPostSchema = z.object({
  content: requiredString,
  mediaIds: z.array(z.string()).max(5, "Cannot have more than 5 attachments"),
}); // zod schema for a required string, content and mediaIds

// zod schema for a update user profile form
export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Must be at most 1000 characters"),
});

export type UpdateUserProfileValues = z.infer<typeof updateUserProfileSchema>;
// zod type for the update user profile schema

export const createCommentSchema = z.object({
  content: requiredString,
});
