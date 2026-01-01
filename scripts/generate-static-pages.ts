/**
 * Static Page Generator for SEO
 * This script fetches content from Supabase and generates static HTML pages
 * Run this script to regenerate static pages when content changes
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = "https://buaubyytxcniueyfpoip.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1YXVieXl0eGNuaXVleWZwb2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjI1MDEsImV4cCI6MjA3NTMzODUwMX0.hum3wf1skB583dAtGgapo7bb0ZPlkywxBfk2ahRHt58";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Chapter {
  id: string;
  name: string;
  board: string;
  subject: string;
  class_number: number;
}

interface StudyMaterial {
  content: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function convertContentToHtml(content: string): string {
  // Convert markdown-like content to HTML
  let html = escapeHtml(content);
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraph
  html = `<p>${html}</p>`;
  
  return html;
}

async function generateBrowsePages() {
  const { data: chapters } = await supabase
    .from('chapters')
    .select('board, subject, class_number')
    .order('board')
    .order('subject')
    .order('class_number');

  if (!chapters) return;

  // Get unique combinations
  const combinations = new Map<string, { board: string; subject: string; class_number: number; chapters: string[] }>();
  
  for (const ch of chapters) {
    const key = `${ch.board}-${ch.subject}-${ch.class_number}`;
    if (!combinations.has(key)) {
      combinations.set(key, { ...ch, chapters: [] });
    }
  }

  // Fetch all chapters with names
  const { data: allChapters } = await supabase
    .from('chapters')
    .select('*')
    .order('name');

  if (!allChapters) return;

  // Group chapters by combination
  for (const ch of allChapters) {
    const key = `${ch.board}-${ch.subject}-${ch.class_number}`;
    const combo = combinations.get(key);
    if (combo) {
      combo.chapters.push(ch.name);
    }
  }

  // Generate browse pages
  for (const [key, combo] of combinations) {
    const fileName = `browse-${combo.board.toLowerCase()}-${combo.subject.toLowerCase()}-${combo.class_number}.html`;
    const title = `${combo.board} Class ${combo.class_number} ${combo.subject} - Topper Guide`;
    const description = `Free ${combo.board} Class ${combo.class_number} ${combo.subject} study materials including MCQs, notes, NCERT solutions and chapter summaries.`;
    
    const chaptersList = combo.chapters.map(name => `<li>${escapeHtml(name)}</li>`).join('\n');
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${combo.board}, Class ${combo.class_number}, ${combo.subject}, MCQs, notes, NCERT solutions, study material">
  <link rel="canonical" href="https://topperguide.in/browse/${combo.board.toLowerCase()}/${combo.subject.toLowerCase()}/${combo.class_number}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "${combo.board} Class ${combo.class_number} ${combo.subject}",
    "description": "${description}",
    "provider": {
      "@type": "Organization",
      "name": "Topper Guide"
    }
  }
  </script>
</head>
<body>
  <header>
    <h1>${combo.board} Class ${combo.class_number} ${combo.subject} Study Materials</h1>
    <nav>
      <a href="/">Home</a> | 
      <a href="/browse/${combo.board.toLowerCase()}/${combo.subject.toLowerCase()}/${combo.class_number}">View All Chapters</a>
    </nav>
  </header>
  <main>
    <section>
      <h2>Available Chapters</h2>
      <ul>
        ${chaptersList}
      </ul>
    </section>
    <section>
      <h2>About ${combo.board} Class ${combo.class_number} ${combo.subject}</h2>
      <p>Comprehensive study materials for ${combo.board} Class ${combo.class_number} ${combo.subject} including:</p>
      <ul>
        <li>Multiple Choice Questions (MCQs) with detailed answers</li>
        <li>Short answer questions and solutions</li>
        <li>Long answer questions with step-by-step explanations</li>
        <li>NCERT solutions and textbook exercises</li>
        <li>Chapter summaries and revision notes</li>
        <li>Important formulas and concepts</li>
      </ul>
    </section>
  </main>
  <footer>
    <p>&copy; 2025 Topper Guide. Free educational resources for ${combo.board} students.</p>
    <nav>
      <a href="/about">About Us</a> | 
      <a href="/privacy-policy">Privacy Policy</a> | 
      <a href="/terms">Terms & Conditions</a>
    </nav>
  </footer>
  <script>
    window.location.href = '/browse/${combo.board.toLowerCase()}/${combo.subject.toLowerCase()}/${combo.class_number}';
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join('public', fileName), html);
    console.log(`Generated: ${fileName}`);
  }
}

async function generateContentPages() {
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .order('board')
    .order('subject')
    .order('class_number')
    .order('name');

  if (!chapters) return;

  for (const chapter of chapters) {
    const { data: materials } = await supabase
      .from('study_materials')
      .select('content')
      .eq('chapter_id', chapter.id)
      .limit(1);

    const content = materials?.[0]?.content || 'Study material coming soon.';
    const contentPreview = content.substring(0, 2000);
    
    const fileName = `content-${chapter.id}.html`;
    const title = `${chapter.name} - ${chapter.board} Class ${chapter.class_number} ${chapter.subject} | Topper Guide`;
    const description = `Study ${chapter.name} for ${chapter.board} Class ${chapter.class_number} ${chapter.subject}. Access MCQs, notes, and detailed solutions.`;
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="keywords" content="${chapter.name}, ${chapter.board}, Class ${chapter.class_number}, ${chapter.subject}, MCQs, notes, study material">
  <link rel="canonical" href="https://topperguide.in/content/${chapter.id}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="article">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${escapeHtml(chapter.name)}",
    "description": "${escapeHtml(description)}",
    "author": {
      "@type": "Organization",
      "name": "Topper Guide"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Topper Guide"
    }
  }
  </script>
</head>
<body>
  <header>
    <h1>${escapeHtml(chapter.name)}</h1>
    <nav>
      <a href="/">Home</a> | 
      <a href="/browse/${chapter.board.toLowerCase()}/${chapter.subject.toLowerCase()}/${chapter.class_number}">Back to ${chapter.subject}</a>
    </nav>
    <p>${chapter.board} | Class ${chapter.class_number} | ${chapter.subject}</p>
  </header>
  <main>
    <article>
      <h2>Study Material</h2>
      ${convertContentToHtml(contentPreview)}
      ${content.length > 2000 ? '<p><a href="/content/' + chapter.id + '">Continue reading...</a></p>' : ''}
    </article>
  </main>
  <footer>
    <p>&copy; 2025 Topper Guide. Free educational resources.</p>
    <nav>
      <a href="/about">About Us</a> | 
      <a href="/privacy-policy">Privacy Policy</a> | 
      <a href="/terms">Terms & Conditions</a>
    </nav>
  </footer>
  <script>
    window.location.href = '/content/${chapter.id}';
  </script>
</body>
</html>`;

    fs.writeFileSync(path.join('public', fileName), html);
    console.log(`Generated: ${fileName}`);
  }
}

async function main() {
  console.log('Generating static pages for SEO...');
  await generateBrowsePages();
  await generateContentPages();
  console.log('Done!');
}

main().catch(console.error);
