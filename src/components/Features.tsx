import React from 'react';
import { TiltCard } from './ui/Card';
import {
  HeartHandshake,
  ClipboardCheck,
  Layers,
  FileText,
  BrainCircuit,
  Users,
  LineChart,
  GraduationCap,
} from 'lucide-react';
import designSystem from '../design-system.json';

const coreSkills = [
  {
    title: 'Life Skills',
    description:
      'Communication, storytelling, leadership and time management labs to unlock confident field execution.',
  },
  {
    title: 'Project Management',
    description: 'Agile planning, milestone tracking, and quality assurance inspired by upGrad playbooks.',
  },
  {
    title: 'Documentation & Reporting',
    description: 'Research-backed documentation rituals that mirror Coursera and BYJU’S cohort expectations.',
  },
  {
    title: 'Professional Presence',
    description:
      'LinkedIn, resume, and CRM hygiene to demonstrate employability in every interaction.',
  },
];

const specializationTracks = [
  {
    title: 'Sales Executive',
    bullets: [
      'CRM navigation & pipeline reporting',
      'Lead research, nurturing, & pitch rehearsals',
      'Listening frameworks to uncover latent needs',
    ],
  },
  {
    title: 'Digital Curriculum Development',
    bullets: [
      'Backward design lesson planning',
      'Interactive content prototyping aligned to NEP 2020',
      'Rapid authoring of micro-learning objects',
    ],
  },
  {
    title: 'Tuition Center Manager',
    bullets: [
      'Ops dashboards for scheduling & footfall',
      'Marketing funnels tailored to neighbourhood centers',
      '360° leadership for tutors, guardians, and students',
    ],
  },
];

const edtechInsights = [
  {
    company: 'BYJU’S',
    insight: 'Personalised pathways anchored in measurable mastery keep completion high.',
    action: 'We mapped weekly OKRs for each cohort member with mentors to mirror this focus.',
  },
  {
    company: 'Coursera',
    insight: 'Top-tier industry briefs plus capstones accelerate hiring confidence.',
    action: 'Participants ship real deliverables for Aveti verticals and partner NGOs.',
  },
  {
    company: 'upGrad',
    insight: 'Career services must start on day one, not after graduation.',
    action: 'We embed weekly career studios, mock interviews, and portfolio rituals.',
  },
  {
    company: 'Vedantu',
    insight: 'Live-first pedagogy powered by analytics fuels learner motivation.',
    action: 'Every session blends in-person facilitation with live dashboards & reflection loops.',
  },
];

export function Features() {
  return (
    <section id="curriculum" className="py-24 px-6 bg-white">
      <div className="container mx-auto max-w-6xl space-y-16">
        <div className="text-center max-w-3xl mx-auto">
          <p
            className="text-sm font-semibold uppercase tracking-[0.4em] text-primary mb-3"
            style={{ letterSpacing: designSystem.typography.scale.eyebrow.tracking }}
          >
            What you will learn
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Core skills that make you impact-ready
          </h2>
          <p className="text-neutral-dark text-lg leading-relaxed">
            Our blended learning model weaves physical classrooms, online content, and fieldwork
            sprints. Every graduate leaves with the core skills top EdTech employers repeatedly
            prioritise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreSkills.map((skill) => (
            <TiltCard
              key={skill.title}
              className="h-full p-8 text-left border border-neutral-light/70 bg-neutral-light/60"
            >
              <div className="flex items-center gap-3 mb-4 text-primary">
                <HeartHandshake size={20} />
                <span className="text-sm font-semibold uppercase tracking-wide">{skill.title}</span>
              </div>
              <p className="text-neutral-dark leading-relaxed">{skill.description}</p>
            </TiltCard>
          ))}
        </div>

        <div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h3 className="text-2xl font-bold text-secondary">Specialization cohorts</h3>
              <p className="text-neutral-dark mt-2 max-w-2xl">
                After the foundational month, choose the vertical that aligns with your ambition. A
                gentle tilt effect spotlights each path so you can explore outcomes before you pick.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-light px-4 py-2 text-sm text-neutral-gray">
              <Layers size={16} /> Choose 1 of 3 tracks
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specializationTracks.map((track) => (
              <TiltCard
                key={track.title}
                className="h-full p-7 border border-primary/20 bg-white"
              >
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <ClipboardCheck size={18} />
                  <h4 className="text-lg font-bold text-secondary">{track.title}</h4>
                </div>
                <ul className="space-y-3 text-sm text-neutral-dark">
                  {track.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-neutral-light bg-neutral-light/80 p-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary mb-2">
                Industry intelligence
              </p>
              <h3 className="text-2xl font-bold text-secondary">
                Insights from top EdTech leaders guiding this curriculum
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-neutral-gray border border-neutral-light shadow-sm">
              <LineChart size={16} /> Competitive benchmarking
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {edtechInsights.map((item) => (
              <div
                key={item.company}
                className="rounded-3xl border border-neutral-light bg-white/80 p-6 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <BrainCircuit className="text-primary" size={18} />
                  <p className="text-base font-semibold text-secondary">{item.company}</p>
                </div>
                <p className="text-sm font-semibold text-neutral-dark mb-2">{item.insight}</p>
                <p className="text-sm text-neutral-gray">{item.action}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-gray">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-neutral-light">
              <Users size={16} className="text-primary" /> Community leadership labs
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-neutral-light">
              <GraduationCap size={16} className="text-primary" /> Capstone with Aveti mentors
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-neutral-light">
              <FileText size={16} className="text-primary" /> Portfolio-ready documentation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
