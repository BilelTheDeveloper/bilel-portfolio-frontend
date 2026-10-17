import { AppWindow, Server, Database, Cloud, ShieldCheck, Palette } from 'lucide-react';

export const techStackGroups = [
  { name: 'Frontend', icon: AppWindow, color: '#67d9f5', description: 'Interfaces, interaction, and motion.', tools: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion'] },
  { name: 'Backend', icon: Server, color: '#a3df9c', description: 'Application logic, APIs, and real-time experiences.', tools: ['Node.js', 'Express.js', 'REST APIs', 'Socket.IO', 'JWT'] },
  { name: 'Database & Storage', icon: Database, color: '#d6b1ff', description: 'Data modeling, caching, and media storage.', tools: ['MongoDB', 'Mongoose', 'Redis', 'Cloudinary', 'S3'] },
  { name: 'Cloud & DevOps', icon: Cloud, color: '#ffca8b', description: 'Version control, deployment, and infrastructure.', tools: ['Git', 'GitHub', 'Docker', 'AWS', 'Vercel', 'Render'] },
  { name: 'Security & Integrations', icon: ShieldCheck, color: '#7ee4c1', description: 'Access control, identity, payments, and notifications.', tools: ['RBAC', 'OAuth', 'OTP', 'KYC', 'Flouci', 'Web Push'] },
  { name: 'Tools & Design', icon: Palette, color: '#ffabcd', description: 'Design, testing, visualization, and discoverability.', tools: ['Figma', 'Postman', 'Recharts', 'VS Code', 'SEO'] },
];
export const techStackIntro = 'A selection from my broader toolkit. These are some of the technologies I work with; I choose the right combination for each project’s goals, constraints, and budget.';
