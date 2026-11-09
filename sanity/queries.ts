// GROQ query: all projects, sorted by a simple "sortOrder" number (lower shows
// first), with fields mapped to the names the site's ProjectCard expects.
export const projectsQuery = `*[_type == "project"] | order(sortOrder asc){
  _id,
  title,
  year,
  role,
  "desc": description,
  tech,
  "live": liveUrl,
  "github": githubUrl,
  "image": image.asset->url
}`;
