// Edit this file to update your portfolio content.

export const hero = {
  name: 'Sundram Pathak',
  tagline: 'The OG Developer',
  ctaPrimary: 'View My Work',
  ctaSecondary: 'Download Resume',
}

export const about =
  'Electronics engineering undergrad, efficient in web development, learner of new tech, enthusiastic about AI/ML and generative AI, problem solver.'

export const skills = [
  { name: 'React', lvl: 90 },
  { name: 'Node.js', lvl: 85 },
  { name: 'MongoDB', lvl: 80 },
  { name: 'Three.js', lvl: 70 },
  { name: 'Tailwind', lvl: 90 },
  { name: 'Testing', lvl: 75 },
]

export const experience = [
  { role: 'Full-stack Dev', org: 'Freelance', when: '2024–2025', desc: 'Built production-grade apps with React, Node, and Mongo.' },
  { role: 'Frontend Dev', org: 'Open Source', when: '2023–2024', desc: 'Contributed to UI libraries and DX tooling.' },
]

export const achievements = [
  { label: 'Projects Delivered', n: 18 },
  { label: 'Open Source PRs', n: 42 },
  { label: 'Cups of Coffee', n: 999 },
]

// Used as a fallback if the API is not reachable.
export const fallbackProjects = [
  { title: 'Resume Analyzer', shortDesc: 'AI-assisted resume analysis tool', tech: ['React', 'Node', 'AI'], liveUrl: 'https://01resumeanalyzer06.netlify.app/', metrics: ['Improved review speed by 40%'] },
  { title: 'Portfolio', shortDesc: 'Animated portfolio with 3D hero', tech: ['React', 'R3F', 'Tailwind'], metrics: ['Lighthouse 95+ A11y'] },
  { title: 'Data Dashboard', shortDesc: 'Analytics and charts', tech: ['Express', 'MongoDB', 'Charts'], metrics: ['P95 latency < 120ms'] },
]
