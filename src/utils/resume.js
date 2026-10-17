export const resumeProfile = {
  name: 'Bilel Helal',
  role: 'Full-Stack Web Developer · MERN Stack',
  email: 'bilel.thedeveloper@gmail.com',
  summary: 'Full-stack web developer specializing in the MERN stack. I build responsive, secure web applications, from interface design and API development to deployment. Available for freelance projects worldwide.',
  skills: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'TypeScript', 'REST API', 'JWT Auth', 'Cloudinary', 'Vercel', 'AWS', 'Git', 'Docker'],
  experience: [
    { period: '2024 - Present', title: 'Full-Stack Developer', company: 'Freelance', description: 'Building MERN stack web applications for clients, from UI design to deployment on Vercel and AWS.' },
    { period: '2022 - 2024', title: 'Frontend Developer', company: 'Personal Projects', description: 'Developed responsive React interfaces with a focus on performance, accessibility, and clean code.' },
  ],
};
export function sortResumeProjects(projects) {
  return [...projects].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0) || String(a._id).localeCompare(String(b._id)));
}
export function resumeSkills(projects) {
  const skills = [...resumeProfile.skills, ...projects.flatMap(project => project.tags || [])];
  return [...new Map(skills.filter(Boolean).map(skill => [skill.toLowerCase(), skill])).values()];
}
