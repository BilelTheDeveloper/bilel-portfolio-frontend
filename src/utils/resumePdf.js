import { jsPDF } from 'jspdf';
import { resumeProfile, resumeSkills } from './resume.js';

export function createResumePdf(projects) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setProperties({ title: `${resumeProfile.name} - Resume`, author: resumeProfile.name, subject: 'Experience, skills and portfolio projects' });
  let y = 22;
  const clean = value => String(value || '').replace(/[–—]/g, '-').replace(/·/g, '|').normalize('NFKD').replace(/[^\x20-\x7E\n]/g, '');
  const page = () => { doc.addPage(); y = 23; };
  const reserve = height => { if (y + height > 275) page(); };
  const text = (value, { size = 10, bold = false, color = '#334155', gap = 3 } = {}) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size);
    const lines = doc.splitTextToSize(clean(value), 166);
    const leading = size * 0.47;
    for (const line of lines) {
      reserve(leading);
      doc.setTextColor(color); doc.text(line, 22, y); y += leading;
    }
    y += gap;
  };
  const section = title => {
    reserve(22); y += 5;
    text(title.toUpperCase(), { size: 9, bold: true, color: '#315880', gap: 2 });
    doc.setDrawColor('#dce4ee'); doc.line(22, y, 188, y); y += 7;
  };
  text(resumeProfile.name, { size: 30, bold: true, color: '#14263e', gap: 2 });
  text(resumeProfile.role, { size: 12, color: '#526783' });
  doc.setFontSize(9); doc.setTextColor('#335989');
  doc.textWithLink(resumeProfile.email, 22, y, { url: `mailto:${resumeProfile.email}` }); y += 9;
  doc.setDrawColor('#1e3a5f'); doc.setLineWidth(0.8); doc.line(22, y, 188, y); y += 3;
  section('01 / Profile'); text(resumeProfile.summary);
  section('02 / Experience');
  for (const item of resumeProfile.experience) {
    reserve(30);
    text(item.title, { size: 11, bold: true, color: '#182c47', gap: 1 });
    text(`${item.company} | ${item.period}`, { size: 9, color: '#64748b' });
    text(item.description); y += 2;
  }
  section('03 / Technical toolkit'); text(resumeSkills(projects).join('  /  '), { size: 9 });
  section(`04 / Projects (${projects.length})`);
  if (!projects.length) text('New portfolio projects will appear as they are published.');
  for (const project of projects) {
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    const descriptionHeight = doc.splitTextToSize(clean(project.description), 166).length * 4.7;
    const featureHeight = (project.features || []).slice(0, 3).reduce((height, feature) => height + doc.splitTextToSize(clean(feature), 166).length * 4.3 + 1, 0);
    reserve(Math.min(245, 36 + descriptionHeight + featureHeight));
    text(project.title, { size: 12, bold: true, color: '#182c47', gap: 1 });
    text([project.category, project.duration].filter(Boolean).join(' | '), { size: 9, color: '#64748b' });
    text(project.description);
    for (const feature of (project.features || []).slice(0, 3)) text(`- ${feature}`, { size: 9, gap: 1 });
    if (project.tags?.length) text(project.tags.join(' / '), { size: 8, color: '#526783' });
    if (/^https?:\/\//i.test(project.link || '')) {
      reserve(8); doc.setFontSize(9); doc.setTextColor('#335989');
      doc.textWithLink('View project online', 22, y, { url: project.link }); y += 8;
    }
    y += 5;
  }
  const pages = doc.getNumberOfPages();
  for (let index = 1; index <= pages; index++) {
    doc.setPage(index); doc.setDrawColor('#dce4ee'); doc.setLineWidth(0.2); doc.line(22, 283, 188, 283);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor('#77869a');
    doc.text('BILEL HELAL / RESUME', 22, 289); doc.text(`${index} / ${pages}`, 188, 289, { align: 'right' });
    if (index > 1) { doc.setFontSize(8); doc.text('BILEL HELAL / CONTINUED', 22, 14); }
  }
  return doc;
}
