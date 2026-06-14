import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// Questions array definitions
const QS = [
  { id:'q1', cat:'Work Style', n:1, q:'When you start a new project, what do you do first?', hint:'Trust your gut — no wrong answer.', type:'c', opts:[
    { e:'🗺️', l:'Map it all out', s:'Plans and structure before anything', v:'planner' },
    { e:'🌊', l:'Dive straight in', s:'Start doing and figure it out as you go', v:'doer' },
    { e:'💬', l:'Talk to people first', s:'Ask questions, gather input, collaborate', v:'collaborator' },
    { e:'🔬', l:'Research everything', s:'Gather evidence before moving', v:'analyst' }
  ]},
  { id:'q2', cat:'Thinking', n:2, q:'How do you usually solve a difficult problem?', hint:null, type:'c', opts:[
    { e:'📊', l:'Break it into data', s:'Analyse patterns and evidence', v:'analytical' },
    { e:'💡', l:'Brainstorm freely', s:'Generate ideas and see what sticks', v:'creative' },
    { e:'🤝', l:'Bring people together', s:'Facilitate discussion and find consensus', v:'social' },
    { e:'🎯', l:'Work back from the goal', s:'Define the outcome, reverse-engineer', v:'strategic' }
  ], fact:'Analytical and creative thinkers both lead successful careers. Your style shapes your method, not your ceiling.'},
  { id:'q3', cat:'Energy', n:3, q:'After an intense week, what genuinely recharges you?', hint:null, type:'c', opts:[
    { e:'🏠', l:'Quiet solo time', s:'Reading, walks, personal hobbies', v:'introvert' },
    { e:'🎉', l:'Being around people', s:'Friends, gatherings, social energy', v:'extrovert' },
    { e:'🌿', l:'Nature and movement', s:'Physical activity, fresh air', v:'kinesthetic' },
    { e:'🎨', l:'Creative expression', s:'Art, music, writing, making things', v:'creative' }
  ], fact:'Introverts and extroverts are equally likely to reach leadership. Self-awareness is the real edge.'},
  { id:'q4', cat:'Motivation', n:4, q:'What would make you feel proudest at the end of your career?', hint:'Be honest — this reveals your core driver.', type:'c', opts:[
    { e:'🌍', l:'Changed the world', s:'Social impact and real systemic change', v:'impact' },
    { e:'💰', l:'Built real wealth', s:'Financial freedom and lasting security', v:'wealth' },
    { e:'🏆', l:'Became truly excellent', s:'Deep mastery and expertise', v:'mastery' },
    { e:'🏛️', l:'Built something lasting', s:'A company, community, or legacy', v:'legacy' }
  ], fact:'Values alignment is the single biggest predictor of long-term career satisfaction. (Harvard Business Review, 2024)'},
  { id:'q5', cat:'Team Role', n:5, q:'What role do you naturally fall into in a group?', hint:null, type:'c', opts:[
    { e:'🎤', l:'The Leader', s:'Set direction, inspire, make the calls', v:'leader' },
    { e:'🔧', l:'The Executor', s:'Get things done reliably and precisely', v:'executor' },
    { e:'🌟', l:'The Visionary', s:'See the big picture and future possibilities', v:'visionary' },
    { e:'🙌', l:'The Enabler', s:'Help others do their absolute best work', v:'supporter' }
  ]},
  { id:'q6', cat:'Risk', n:6, q:'How comfortable are you with uncertainty?', hint:'Rate yourself from 1 (safe) to 5 (bold).', type:'s', sMin:'Play it safe', sMax:'Embrace the unknown', opts:[1,2,3,4,5], fact:'Moderate risk tolerance (3–4) correlates with the highest career earnings over time.'},
  { id:'q7', cat:'Communication', n:7, q:'How do you prefer to share your ideas?', hint:null, type:'c', opts:[
    { e:'🎤', l:'Speaking and presenting', s:'Talks, pitches, live storytelling', v:'verbal' },
    { e:'✍️', l:'Writing and content', s:'Articles, essays, detailed documents', v:'written' },
    { e:'📈', l:'Visuals and data', s:'Slides, charts, visual frameworks', v:'visual' },
    { e:'🗣️', l:'One-on-one conversations', s:'Deep discussions and dialogue', v:'interpersonal' }
  ]},
  { id:'q8', cat:'Challenge', n:8, q:'Which challenge excites you most?', hint:null, type:'c', opts:[
    { e:'🚀', l:'Building from nothing', s:'Creating something that did not exist', v:'builder' },
    { e:'🔄', l:'Transforming the existing', s:'Taking good things and making them great', v:'transformer' },
    { e:'🌐', l:'Solving at global scale', s:'Problems that affect millions', v:'global' },
    { e:'🎓', l:'Developing people', s:'Mentoring, coaching, and teaching', v:'developer' }
  ], fact:'Growth mindset — believing skills are learnable — predicts success more than raw talent. (Carol Dweck, Stanford)'},
  { id:'q9', cat:'Environment', n:9, q:'What kind of work environment makes you thrive?', hint:null, type:'c', opts:[
    { e:'🏢', l:'Structured and stable', s:'Clear processes, defined roles', v:'structured' },
    { e:'🌪️', l:'Fast-paced and dynamic', s:'Constant change, new challenges daily', v:'dynamic' },
    { e:'🏡', l:'Flexible and autonomous', s:'Work your own way and schedule', v:'autonomous' },
    { e:'🌍', l:'Global and diverse', s:'International teams, travel, varied cultures', v:'global_e' }
  ]},
  { id:'q10', cat:'Learning', n:10, q:'How do you grow and learn best?', hint:'Think about when you felt most capable.', type:'c', opts:[
    { e:'📚', l:'Reading and research', s:'Books, papers, courses, deep study', v:'academic' },
    { e:'🛠️', l:'Hands-on practice', s:'Trial, error, doing it yourself', v:'practical' },
    { e:'👥', l:'Learning from people', s:'Mentors, peers, masterminds', v:'social_l' },
    { e:'📓', l:'Reflection and journaling', s:'Processing experiences deeply', v:'reflective' }
  ]},
  { id:'q11', cat:'Strengths', n:11, q:'People most often come to you for…', hint:null, type:'c', opts:[
    { e:'🧮', l:'Problem solving', s:'You find clever, logical solutions', v:'analytical' },
    { e:'❤️', l:'Emotional support', s:'You listen and empathise deeply', v:'empathetic' },
    { e:'🎨', l:'Creative ideas', s:'You think outside every box', v:'creative' },
    { e:'📋', l:'Getting organised', s:'You bring order, clarity, and structure', v:'organised' }
  ], fact:'Strengths identified by others are more accurate than self-assessment alone. (Gallup StrengthsFinder)'},
  { id:'q12', cat:'Time Horizon', n:12, q:'Which timeline excites you most?', hint:null, type:'c', opts:[
    { e:'⚡', l:'Immediate results', s:'See the impact of your work today', v:'short_t' },
    { e:'📅', l:'Monthly milestones', s:'Build and measure in months', v:'med_t' },
    { e:'🌳', l:'Long-term legacy', s:'Plant seeds that grow for years', v:'long_t' },
    { e:'🔄', l:'Ongoing and evolving', s:'Continuous improvement, no finish line', v:'cont_t' }
  ]},
  { id:'q13', cat:'Values', n:13, q:'Which value feels most non-negotiable to you?', hint:'The one you would sacrifice a pay rise for.', type:'c', opts:[
    { e:'🆓', l:'Freedom and autonomy', s:'Control over your work and your time', v:'freedom' },
    { e:'🌟', l:'Purpose and meaning', s:'Knowing your work genuinely matters', v:'purpose' },
    { e:'💻', l:'Innovation and progress', s:'Working on cutting-edge new things', v:'innovation' },
    { e:'🌱', l:'Growth and learning', s:'Constantly expanding your abilities', v:'growth_v' }
  ], fact:'Purpose-driven professionals report 3× higher engagement and resilience in hard times.'},
  { id:'q14', cat:'Passions', n:14, q:'Which topic could you talk about for hours?', hint:null, type:'c', opts:[
    { e:'🧬', l:'Science and health', s:'Medicine, biology, wellbeing, research', v:'hlth_t' },
    { e:'💼', l:'Business and markets', s:'Strategy, economics, entrepreneurship', v:'biz_t' },
    { e:'🎭', l:'Arts and culture', s:'Media, design, storytelling, fashion', v:'arts_t' },
    { e:'⚖️', l:'Society and justice', s:'Policy, law, community, social change', v:'soc_t' }
  ]},
  { id:'q15', cat:'Technology', n:15, q:'How do you relate to technology in your work?', hint:null, type:'c', opts:[
    { e:'🤖', l:'I build technology', s:'I create tools, code, or systems', v:'tech_b' },
    { e:'📊', l:'I leverage technology', s:'Data and digital tools strategically', v:'tech_u' },
    { e:'👥', l:'Tech is just a means', s:'I focus on people, not tools', v:'tech_n' },
    { e:'🎨', l:'I create with technology', s:'Tech powers my creative expression', v:'tech_c' }
  ], fact:'Tech-integrated careers have shown 40% higher salary growth over the past decade. (McKinsey, 2024)'},
  { id:'q16', cat:'Impact', n:16, q:'Where do you want your impact to be felt most?', hint:null, type:'c', opts:[
    { e:'🏘️', l:'My community', s:'City, neighbourhood, immediate world', v:'local_i' },
    { e:'🏢', l:'My organisation', s:'Transform the company I work inside', v:'org_i' },
    { e:'🌍', l:'National or global', s:'Policy, movements, mass-scale change', v:'global_i' },
    { e:'🧑', l:'Individual lives', s:'Deep, lasting impact on specific people', v:'ind_i' }
  ]},
  { id:'q17', cat:'Life Balance', n:17, q:'How do you see career and personal life?', hint:'Be real — this shapes every decision.', type:'c', opts:[
    { e:'⚖️', l:'Clear separation', s:'Firm work hours and personal boundaries', v:'balanced' },
    { e:'🌊', l:'Fluid integration', s:'Life and work blend naturally', v:'integrated' },
    { e:'🚀', l:'Career first for now', s:'Big push while young, balance later', v:'career_f' },
    { e:'🧘', l:'Wellbeing always first', s:'Health and peace are never sacrificed', v:'well_f' }
  ]},
  { id:'q18', cat:'Superpower', n:18, q:'Your greatest superpower at work is…', hint:'Final question — make it count.', type:'c', opts:[
    { e:'🔍', l:'Seeing what others miss', s:'Patterns, opportunities, hidden truths', v:'insight' },
    { e:'🤝', l:'Bringing people together', s:'Unity, trust, powerful collaboration', v:'connection' },
    { e:'💥', l:'Making things happen', s:'Execution, momentum, real results', v:'execution' },
    { e:'🎨', l:'Imagining what could be', s:'Vision, creativity, possibility', v:'imagination' }
  ]}
];

// Career profiles definitions
const CAREERS = {
  entrepreneur: {
    name:'Entrepreneur & Founder', icon:'🚀', grad:'linear-gradient(135deg,#6B21A8,#EC4899)',
    tag:'Built to build. Your ownership mindset and restless energy make you a natural creator.',
    skills:['Business strategy','Fundraising','Team building','Sales','Product thinking'],
    desc:'Your profile points unmistakably toward entrepreneurship. You combine a high tolerance for ambiguity with a strong drive to create from scratch — two traits that are rare individually and explosive together.',
    whyDetail:'The way you approached every question in this assessment — from how you start projects to what energises you — reveals someone who does not wait for permission. You are energised by uncertainty rather than paralysed by it. You instinctively set direction rather than follow it. And when you imagine the end of your career, you see something you built with your name on it, not a job title someone gave you. That\'s the entrepreneurial DNA.',
    whyHighlights:[
      {label:'Core Driver', val:'Ownership & Legacy'},
      {label:'Thinking Style', val:'Visionary + Executer'},
      {label:'Energy Source', val:'Creating new things'},
      {label:'Risk Profile', val:'Embraces uncertainty'}
    ],
    steps:['Start a side project in your passion area','Build your network before you need it','Learn the fundamentals of finance and marketing','Find a co-founder who complements your gaps','Apply for an accelerator or mentorship programme'],
    match:0
  },
  creative_leader: {
    name:'Creative Director & Brand Builder', icon:'🎨', grad:'linear-gradient(135deg,#C2410C,#F97316)',
    tag:'Your creative instincts and communication power make you a force in media, brand, and culture.',
    skills:['Brand strategy','Content creation','Visual communication','Audience building','Campaign thinking'],
    desc:'Your results reveal a powerful blend of artistic sensibility and strategic communication. You don\'t just create beautiful things — you create things that move people and build worlds.',
    whyDetail:'Throughout this assessment you showed a consistent pattern: you think in images and narratives before logic and data. You are energised by making things that didn\'t exist, particularly when those things connect emotionally with an audience. Your ideal environment gives you creative freedom, and your deepest satisfaction comes when a piece of work — a brand, a campaign, a piece of content — genuinely resonates. These are the exact traits that define exceptional creative directors and brand builders.',
    whyHighlights:[
      {label:'Core Driver', val:'Aesthetic + Resonance'},
      {label:'Thinking Style', val:'Conceptual + Intuitive'},
      {label:'Energy Source', val:'Creating meaning'},
      {label:'Best Medium', val:'Visual & Narrative'}
    ],
    steps:['Build a strong portfolio of real work','Master one platform deeply before expanding','Study the business side of creativity','Network inside creative industries','Seek roles at the intersection of art and strategy'],
    match:0
  },
  health_leader: {
    name:'Health & Wellness Leader', icon:'❤️', grad:'linear-gradient(135deg,#831843,#DB2777)',
    tag:'Your empathy and commitment to wellbeing drive real change in health and medicine.',
    skills:['Medical knowledge','Psychology','Coaching','Public health','Research'],
    desc:'Your profile reveals one of the most powerful combinations in the wellness space: deep empathy fused with genuine analytical rigour. You care intensely about people\'s wellbeing and you want to understand *why* things work, not just *that* they work.',
    whyDetail:'Your answers show that you are drawn to individual lives and their flourishing — not abstract systems or large-scale change. When others come to you, they come for your emotional intelligence and your ability to truly listen. You\'re motivated by purpose over profit. You thrive when your work produces visible, felt change in a real person. These qualities map perfectly onto health, medicine, therapy, wellness coaching, and public health — fields where the intersection of science and humanity creates the most meaningful careers.',
    whyHighlights:[
      {label:'Core Driver', val:'Human flourishing'},
      {label:'Thinking Style', val:'Empathetic + Systematic'},
      {label:'Energy Source', val:'Helping individuals heal'},
      {label:'Impact Level', val:'One person at a time'}
    ],
    steps:['Get formal credentials in your chosen area','Develop your personal health philosophy','Learn to translate complex information simply','Build a community around your niche','Consider both clinical and non-clinical pathways'],
    match:0
  },
  tech_innovator: {
    name:'Tech Innovator & Digital Builder', icon:'💻', grad:'linear-gradient(135deg,#0E7490,#7C3AED)',
    tag:'Your analytical mind and curiosity for systems make you a natural builder in the digital world.',
    skills:['Technology platforms','Data analysis','Product management','Systems thinking','Digital strategy'],
    desc:'Your results place you firmly in the world of technology and digital innovation. You think in systems, spot patterns others miss, and are genuinely excited by the mechanics of how things work at scale.',
    whyDetail:'The clearest signal in your results is your combination of analytical thinking, comfort with technology, and a desire to build things that didn\'t exist before. You approach problems like a scientist — you want evidence, patterns, and logic — but you also have the builder\'s itch: you don\'t just want to understand the world, you want to improve it. In today\'s economy, that combination is among the most valuable in any industry. Whether your path leads to engineering, product management, data science, or AI, you have the instincts to thrive there.',
    whyHighlights:[
      {label:'Core Driver', val:'Systems + Innovation'},
      {label:'Thinking Style', val:'Analytical + Logical'},
      {label:'Energy Source', val:'Solving complex problems'},
      {label:'Best Environment', val:'Fast-paced tech culture'}
    ],
    steps:['Identify your niche: data, product, engineering, or UX','Build real projects, not just finish courses','Contribute to open source or startup projects','Attend tech communities and connect with builders','Find a mentor in your target role'],
    match:0
  },
  changemaker: {
    name:'Social Changemaker & Advocate', icon:'🌍', grad:'linear-gradient(135deg,#065F46,#10B981)',
    tag:'Your desire for justice makes you a powerful voice for communities and causes that matter.',
    skills:['Policy and advocacy','Community organising','Public speaking','Storytelling','Fundraising'],
    desc:'Your profile is defined by purpose. You are motivated not by what you can accumulate but by what you can shift — systems, power structures, narratives, and the lives of communities that need a champion.',
    whyDetail:'From the values you named as non-negotiable to the impact you want to see in the world, your answers consistently pointed toward social change. You are energised by injustice, not in a way that drains you but in a way that fuels you. You think about the global picture, you want your work to ripple far beyond a single organisation, and you are the kind of person others naturally follow when something needs to change. These are the qualities that define the most effective advocates, policy-makers, activists, and nonprofit leaders of our generation.',
    whyHighlights:[
      {label:'Core Driver', val:'Justice & Systemic change'},
      {label:'Thinking Style', val:'Moral + Strategic'},
      {label:'Energy Source', val:'Causes bigger than self'},
      {label:'Impact Level', val:'National or Global'}
    ],
    steps:['Find the one cause that ignites you most','Volunteer to understand the system from inside','Learn policy and systems alongside people skills','Build your public platform and voice','Connect with established advocates and organisations'],
    match:0
  },
  finance_strategist: {
    name:'Finance & Investment Strategist', icon:'💰', grad:'linear-gradient(135deg,#065F46,#F97316)',
    tag:'Your analytical rigour and desire for financial mastery make you formidable in the world of money.',
    skills:['Financial modelling','Investment analysis','Risk management','Business acumen','Negotiation'],
    desc:'Your results reveal a mind that is wired for precision, strategy, and long-term thinking — the exact combination that drives success in finance, investment, and business strategy.',
    whyDetail:'Your answers showed a clear preference for data over gut feel, structured environments where quality matters, and a core motivation around building real, lasting wealth. You are not just interested in money for its own sake — you see financial mastery as a tool for influence, freedom, and legacy. You are the kind of person who reads the fine print, spots the opportunity others dismiss as too complex, and takes measured risks with strong expected returns. The world of finance rewards exactly this profile — and it is dramatically under-represented by women, which means your presence there will matter doubly.',
    whyHighlights:[
      {label:'Core Driver', val:'Wealth + Strategic power'},
      {label:'Thinking Style', val:'Rigorous + Long-term'},
      {label:'Energy Source', val:'Precision and mastery'},
      {label:'Risk Profile', val:'Calculated and disciplined'}
    ],
    steps:['Master financial literacy first','Get certified (CFA, CPA, or equivalent)','Find a mentor inside financial institutions','Build your portfolio of decisions','Explore fintech as a bridge between finance and innovation'],
    match:0
  },
  educator_coach: {
    name:'Educator, Coach & People Developer', icon:'🎓', grad:'linear-gradient(135deg,#4C1D95,#7C3AED)',
    tag:'Your gift for unlocking potential in others makes you an extraordinary developer of human talent.',
    skills:['Curriculum design','Coaching methodology','Active listening','Facilitation','Content creation'],
    desc:'Your results reveal someone whose greatest joy is watching another person have a breakthrough. You are not just good with people — you are exceptional at unlocking what is already inside them.',
    whyDetail:'The most striking pattern across your answers is how consistently you were drawn to the development and flourishing of individuals. You instinctively take the role of enabler in teams. You are energised by teaching, listening, and facilitating. When you imagine impact, you picture a specific person whose life changed because of an encounter with you. That is not the profile of someone who should be stuck in a system. That is the profile of a transformational coach, educator, facilitator, or people-leader — someone who leaves every room better than she found it.',
    whyHighlights:[
      {label:'Core Driver', val:'Human potential'},
      {label:'Thinking Style', val:'Relational + Holistic'},
      {label:'Energy Source', val:'Watching others grow'},
      {label:'Superpower', val:'Deep listening & insight'}
    ],
    steps:['Get certified in coaching or a teaching methodology','Develop your own unique framework','Identify the audience you most love serving','Create free content to demonstrate your approach','Build a programme, workshop, or signature course'],
    match:0
  },
  media_journalist: {
    name:'Journalist & Media Personality', icon:'🎙️', grad:'linear-gradient(135deg,#0E7490,#EC4899)',
    tag:'Your curiosity and natural communication power make you a storytelling force in media.',
    skills:['Writing and editing','On-camera presence','Investigative skills','Audience building','Digital media'],
    desc:'Your results paint the portrait of a natural storyteller — someone who is endlessly curious about the world, can communicate complex ideas with clarity and charisma, and wants their voice to reach as many people as possible.',
    whyDetail:'Across 18 questions, a consistent pattern emerged: you are drawn to ideas and stories rather than systems and processes. You are energised by social connection, by the arts and culture, by the power of narrative to change minds. You prefer verbal and written communication above all other forms. You want your impact to ripple at scale — reaching thousands or millions, not just the person in front of you. These qualities are the foundation of every exceptional journalist, podcaster, presenter, and media entrepreneur. The media world needs more bold, brilliant women willing to own the microphone.',
    whyHighlights:[
      {label:'Core Driver', val:'Ideas & Mass influence'},
      {label:'Thinking Style', val:'Narrative + Curious'},
      {label:'Energy Source', val:'Audience connection'},
      {label:'Best Medium', val:'Voice, writing & video'}
    ],
    steps:['Build a portfolio of real published work','Find your niche topic and own it','Learn digital: video, podcasting, social media','Network with editors, producers, and creators','Pitch widely and build resilience to rejection'],
    match:0
  }
};

export default function FindYourPath({ onShowToast, onNavChange }) {
  const { submitForm } = useApp();
  const containerRef = useRef(null);

  // Layout View State: 'landing' | 'quiz' | 'gate' | 'results'
  const [view, setView] = useState('landing');

  // Form input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [stage, setStage] = useState('');
  const [formError, setFormError] = useState('');

  // Quiz state
  const [answers, setAnswers] = useState({});
  const [currQ, setCurrQ] = useState(0);
  const [rankedResults, setRankedResults] = useState([]);

  // Subscribe Gate State
  const [hasClickedSub, setHasClickedSub] = useState(false);
  const [gateError, setGateError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Results display state
  const [animatedPct, setAnimatedPct] = useState(0);
  const [expandedCareers, setExpandedCareers] = useState({});

  // Reset page position on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view, currQ]);

  // Read sub click state from localStorage
  useEffect(() => {
    try {
      const clicked = localStorage.getItem('bbg_sub_clicked');
      if (clicked) setHasClickedSub(true);
    } catch(e) {}
  }, []);

  // Form submission / Start quiz
  const handleStartQuiz = (e) => {
    e.preventDefault();
    setFormError('');

    if (!firstName.trim()) {
      setFormError('Please enter your first name.');
      return;
    }
    if (!email.trim() || email.indexOf('@') < 1) {
      setView('landing');
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!stage) {
      setFormError('Please select your current career stage.');
      return;
    }

    setAnswers({});
    setCurrQ(0);
    setView('quiz');
  };

  // Quiz Selection Handlers
  const handlePickOpt = (qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
  };

  const handlePickScale = (qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: String(val) }));
  };

  const handleNextQ = () => {
    const q = QS[currQ];
    if (answers[q.id] === undefined) return;

    if (currQ >= QS.length - 1) {
      handleComputeResults();
    } else {
      setCurrQ(prev => prev + 1);
    }
  };

  const handleGoBack = () => {
    if (currQ > 0) {
      setCurrQ(prev => prev - 1);
    }
  };

  // Scoring algorithm
  const handleComputeResults = async () => {
    const sc = {};
    const ckeys = Object.keys(CAREERS);
    ckeys.forEach(k => { sc[k] = 0; });

    const a = answers;
    
    // Q1 Work Style
    if (a.q1 === 'planner') { sc.finance_strategist += 3; sc.educator_coach += 2; sc.changemaker += 1; }
    if (a.q1 === 'doer') { sc.entrepreneur += 3; sc.tech_innovator += 2; sc.creative_leader += 2; }
    if (a.q1 === 'collaborator') { sc.educator_coach += 3; sc.changemaker += 2; sc.media_journalist += 2; }
    if (a.q1 === 'analyst') { sc.tech_innovator += 3; sc.finance_strategist += 3; sc.health_leader += 2; }
    
    // Q2 Thinking
    if (a.q2 === 'analytical') { sc.tech_innovator += 3; sc.finance_strategist += 3; sc.health_leader += 2; }
    if (a.q2 === 'creative') { sc.creative_leader += 4; sc.media_journalist += 3; sc.entrepreneur += 2; }
    if (a.q2 === 'social') { sc.educator_coach += 3; sc.changemaker += 3; sc.media_journalist += 2; }
    if (a.q2 === 'strategic') { sc.entrepreneur += 3; sc.finance_strategist += 2; sc.tech_innovator += 2; }

    // Q3 Energy
    if (a.q3 === 'introvert') { sc.tech_innovator += 2; sc.finance_strategist += 2; sc.health_leader += 2; }
    if (a.q3 === 'extrovert') { sc.entrepreneur += 3; sc.media_journalist += 3; sc.changemaker += 2; }
    if (a.q3 === 'kinesthetic') { sc.health_leader += 2; sc.educator_coach += 2; }
    if (a.q3 === 'creative') { sc.creative_leader += 4; sc.media_journalist += 3; }

    // Q4 Motivation
    if (a.q4 === 'impact') { sc.changemaker += 4; sc.health_leader += 3; sc.educator_coach += 3; }
    if (a.q4 === 'wealth') { sc.finance_strategist += 4; sc.entrepreneur += 3; }
    if (a.q4 === 'mastery') { sc.tech_innovator += 3; sc.health_leader += 3; sc.finance_strategist += 2; }
    if (a.q4 === 'legacy') { sc.entrepreneur += 4; sc.educator_coach += 3; sc.changemaker += 3; }

    // Q5 Team Role
    if (a.q5 === 'leader') { sc.entrepreneur += 4; sc.changemaker += 3; sc.media_journalist += 2; }
    if (a.q5 === 'executor') { sc.finance_strategist += 3; sc.tech_innovator += 3; }
    if (a.q5 === 'visionary') { sc.entrepreneur += 4; sc.creative_leader += 3; sc.tech_innovator += 2; }
    if (a.q5 === 'supporter') { sc.educator_coach += 4; sc.health_leader += 4; }

    // Q6 Risk Scale
    if (a.q6) {
      const rsk = parseInt(a.q6);
      if (rsk >= 4) { sc.entrepreneur += rsk; sc.tech_innovator += (rsk - 1); }
      if (rsk <= 2) { sc.finance_strategist += (4 - rsk); sc.educator_coach += (4 - rsk); }
      if (rsk === 3) { sc.creative_leader += 2; sc.media_journalist += 2; }
    }

    // Q7 Communication
    if (a.q7 === 'verbal') { sc.media_journalist += 4; sc.changemaker += 3; sc.entrepreneur += 2; }
    if (a.q7 === 'written') { sc.media_journalist += 3; sc.educator_coach += 3; sc.creative_leader += 2; }
    if (a.q7 === 'visual') { sc.creative_leader += 4; sc.tech_innovator += 2; }
    if (a.q7 === 'interpersonal') { sc.educator_coach += 4; sc.health_leader += 4; sc.changemaker += 2; }

    // Q8 Challenge
    if (a.q8 === 'builder') { sc.entrepreneur += 4; sc.tech_innovator += 3; }
    if (a.q8 === 'transformer') { sc.changemaker += 3; sc.creative_leader += 3; sc.entrepreneur += 2; }
    if (a.q8 === 'global') { sc.changemaker += 4; sc.media_journalist += 3; sc.tech_innovator += 2; }
    if (a.q8 === 'developer') { sc.educator_coach += 5; sc.health_leader += 3; }

    // Q9 Environment
    if (a.q9 === 'structured') { sc.finance_strategist += 3; sc.health_leader += 2; }
    if (a.q9 === 'dynamic') { sc.entrepreneur += 3; sc.media_journalist += 3; sc.tech_innovator += 2; }
    if (a.q9 === 'autonomous') { sc.creative_leader += 3; sc.tech_innovator += 2; sc.entrepreneur += 2; }
    if (a.q9 === 'global_e') { sc.changemaker += 3; sc.media_journalist += 3; }

    // Q11 Strengths
    if (a.q11 === 'analytical') { sc.tech_innovator += 3; sc.finance_strategist += 3; }
    if (a.q11 === 'empathetic') { sc.health_leader += 4; sc.educator_coach += 4; sc.changemaker += 3; }
    if (a.q11 === 'creative') { sc.creative_leader += 4; sc.media_journalist += 3; sc.entrepreneur += 2; }
    if (a.q11 === 'organised') { sc.finance_strategist += 3; sc.educator_coach += 2; }

    // Q13 Values
    if (a.q13 === 'freedom') { sc.entrepreneur += 4; sc.creative_leader += 3; sc.tech_innovator += 2; }
    if (a.q13 === 'purpose') { sc.changemaker += 4; sc.health_leader += 4; sc.educator_coach += 3; }
    if (a.q13 === 'innovation') { sc.tech_innovator += 4; sc.entrepreneur += 3; }
    if (a.q13 === 'growth_v') { sc.educator_coach += 3; sc.health_leader += 2; sc.tech_innovator += 2; }

    // Q14 Passions
    if (a.q14 === 'hlth_t') { sc.health_leader += 5; sc.educator_coach += 2; }
    if (a.q14 === 'biz_t') { sc.entrepreneur += 4; sc.finance_strategist += 4; sc.tech_innovator += 2; }
    if (a.q14 === 'arts_t') { sc.creative_leader += 5; sc.media_journalist += 4; }
    if (a.q14 === 'soc_t') { sc.changemaker += 5; sc.media_journalist += 3; }

    // Q15 Technology
    if (a.q15 === 'tech_b') { sc.tech_innovator += 5; sc.entrepreneur += 2; }
    if (a.q15 === 'tech_u') { sc.finance_strategist += 3; sc.entrepreneur += 2; sc.tech_innovator += 2; }
    if (a.q15 === 'tech_n') { sc.health_leader += 2; sc.educator_coach += 2; sc.changemaker += 2; }
    if (a.q15 === 'tech_c') { sc.creative_leader += 4; sc.media_journalist += 3; }

    // Q18 Superpower
    if (a.q18 === 'insight') { sc.tech_innovator += 3; sc.finance_strategist += 3; sc.health_leader += 2; }
    if (a.q18 === 'connection') { sc.educator_coach += 4; sc.changemaker += 4; sc.health_leader += 3; }
    if (a.q18 === 'execution') { sc.entrepreneur += 4; sc.finance_strategist += 3; }
    if (a.q18 === 'imagination') { sc.creative_leader += 5; sc.entrepreneur += 3; sc.media_journalist += 3; }

    // Stage weight adjustments
    if (stage === 'student' || stage === 'early') { sc.tech_innovator += 2; sc.entrepreneur += 1; }
    if (stage === 'entrepreneur') { sc.entrepreneur += 5; sc.finance_strategist += 2; }
    if (stage === 'pivot') { sc.creative_leader += 2; sc.changemaker += 2; }

    // Normalize match percentages
    let mx = 1;
    ckeys.forEach(k => {
      if (sc[k] > mx) mx = sc[k];
    });

    ckeys.forEach(k => {
      CAREERS[k].match = Math.round((sc[k] / mx) * 100);
    });

    // Rank paths
    const sorted = ckeys.sort((x, y) => sc[y] - sc[x]);
    setRankedResults(sorted);

    // Submit results to backend
    const payload = {
      firstName,
      lastName,
      email,
      mobile,
      stage,
      answers,
      results: sorted
    };
    try {
      await submitForm('quiz', payload);
    } catch (err) {
      console.error('Quiz submission error:', err);
    }

    // Navigate to subscribe lock gate
    setView('gate');
  };

  // Subscribe Gate Handlers
  const handleSubClick = () => {
    setHasClickedSub(true);
    try {
      localStorage.setItem('bbg_sub_clicked', String(Date.now()));
    } catch(e) {}
  };

  const handleVerifySubscription = () => {
    setGateError('');
    let prevClicked = false;
    try {
      prevClicked = !!localStorage.getItem('bbg_sub_clicked');
    } catch(e) {}

    if (!hasClickedSub && !prevClicked) {
      setGateError('Please tap "Subscribe to Bold & Brilliant Girls" first, then come back here!');
      return;
    }

    setVerifyLoading(true);

    // Simulate verification delay (honor system)
    setTimeout(() => {
      try {
        localStorage.setItem('bbg_sub_verified', '1');
      } catch(e) {}
      setVerifyLoading(false);
      setVerifySuccess(true);

      setTimeout(() => {
        setView('results');
        triggerConfetti();
      }, 1400);
    }, 1800);
  };

  // Trait Scoring Formulas for Strength Profile
  const tScore = (pos, neg) => {
    let s = 48;
    const vals = Object.values(answers);
    pos.forEach(p => {
      if (vals.includes(p)) s += 9;
    });
    neg.forEach(n => {
      if (vals.includes(n)) s -= 5;
    });
    return Math.min(97, Math.max(18, s));
  };

  const tScoreRisk = (pos, neg) => {
    let s = tScore(pos, neg);
    if (answers.q6) {
      s += (parseInt(answers.q6) - 3) * 6;
    }
    return Math.min(97, Math.max(18, s));
  };

  const getTraits = () => {
    return [
      { icon:'📊', name:'Analytical', score: tScore(['analytical','planner','analyst'],['creative','doer']) },
      { icon:'💡', name:'Creative',   score: tScore(['creative','doer','imagination'],['analytical','planner']) },
      { icon:'❤️', name:'Empathetic', score: tScore(['collaborator','supporter','interpersonal','empathetic','connection'],['analytical','tech_b']) },
      { icon:'⚡', name:'Entrepreneurial', score: tScoreRisk(['doer','leader','visionary','freedom'],['structured','balanced']) },
      { icon:'🤝', name:'Collaborative', score: tScore(['collaborator','social','supporter','connection'],['autonomous','introvert']) },
      { icon:'🎯', name:'Strategic',  score: tScore(['planner','strategic','long_t','mastery'],['doer','short_t']) }
    ];
  };

  // Compatibility score countdown animation
  useEffect(() => {
    if (view === 'results' && rankedResults.length > 0) {
      const topCareer = CAREERS[rankedResults[0]];
      const targetScore = parseInt(topCareer.match);
      let startTimestamp = null;

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / 1400, 1);
        setAnimatedPct(Math.floor(progress * targetScore));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setAnimatedPct(targetScore);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [view, rankedResults]);

  // Confetti particles generator
  const triggerConfetti = () => {
    if (!containerRef.current) return;
    const cols = ['#9333EA', '#EC4899', '#F97316', '#EAB308', '#10B981', '#60A5FA'];
    for (let i = 0; i < 55; i++) {
      const el = document.createElement('div');
      el.className = 'cfp';
      el.style.left = (Math.random() * 100) + 'vw';
      el.style.background = cols[Math.floor(Math.random() * cols.length)];
      el.style.animationDuration = (2 + Math.random() * 2.5) + 's';
      el.style.animationDelay = (Math.random() * 2) + 's';
      if (Math.random() > 0.5) {
        el.style.borderRadius = '50%';
      }
      containerRef.current.appendChild(el);
      // Clean up particle
      setTimeout(() => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 5500);
    }
  };

  // Retake Quiz Handler
  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrQ(0);
    setHasClickedSub(false);
    setRankedResults([]);
    setVerifySuccess(false);
    setVerifyLoading(false);
    setExpandedCareers({});
    setAnimatedPct(0);
    setView('landing');
  };

  // Toggle matched career details accordion
  const handleToggleDetail = (index) => {
    setExpandedCareers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const topCareer = rankedResults.length > 0 ? CAREERS[rankedResults[0]] : null;
  const currentQuestionObj = QS[currQ];
  const hasQuestionBeenAnswered = currentQuestionObj ? answers[currentQuestionObj.id] !== undefined : false;

  return (
    <div className="findpath-page-container" ref={containerRef}>
      {/* SCOPED STYLES DECLARATION */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&display=swap');

        .findpath-page-container {
          --purple: #9333EA;
          --pink: #EC4899;
          --gold: #FEF08A;
          --grad: linear-gradient(135deg, #6B21A8, #9333EA 40%, #EC4899 75%, #F97316);
          --card: rgba(255, 255, 255, .045);
          --border: rgba(255, 255, 255, .1);
          --ease: cubic-bezier(.34, 1.56, .64, 1);

          font-family: 'DM Sans', sans-serif;
          background: #16122e;
          color: #fff;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .findpath-page-container * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(.8); }
          70% { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
          0%, 100% { opacity: .5; }
          50% { opacity: 1; }
        }

        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0); opacity: 1; }
          100% { transform: translateY(800px) rotate(540deg); opacity: 0; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes subPop {
          0% { transform: scale(.9); opacity: 0; }
          70% { transform: scale(1.03); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* ──────────── LANDING ──────────── */
        .findpath-page-container .landing {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 20px 80px;
          position: relative;
          overflow: hidden;
        }

        .findpath-page-container .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .findpath-page-container .orb1 {
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(107, 33, 168, .22), transparent 65%);
          top: -160px;
          left: -80px;
        }

        .findpath-page-container .orb2 {
          width: 360px;
          height: 360px;
          background: radial-gradient(circle, rgba(236, 72, 153, .15), transparent 65%);
          bottom: -80px;
          right: -40px;
        }

        .findpath-page-container .landing-inner {
          position: relative;
          z-index: 1;
          max-width: 1040px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 440px;
          gap: 72px;
          align-items: center;
        }

        .findpath-page-container .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(147, 51, 234, .1);
          border: 1px solid rgba(147, 51, 234, .25);
          color: #D8B4FE;
          padding: 6px 15px;
          border-radius: 40px;
          font-size: .68rem;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 28px;
          animation: pulse 3s ease-in-out infinite;
        }

        .findpath-page-container .hero-h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          font-weight: 900;
          line-height: 1.08;
          margin-bottom: 20px;
        }

        .findpath-page-container .hero-h1 em {
          font-style: italic;
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .findpath-page-container .hero-p {
          font-size: .95rem;
          color: rgba(255, 255, 255, .48);
          line-height: 1.8;
          max-width: 400px;
          margin-bottom: 40px;
        }

        .findpath-page-container .hero-stats {
          display: flex;
          gap: 36px;
          flex-wrap: wrap;
          margin-bottom: 36px;
        }

        .findpath-page-container .stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 700;
          display: block;
          line-height: 1;
          color: #fff;
        }

        .findpath-page-container .stat-lbl {
          font-size: .68rem;
          color: rgba(255, 255, 255, .35);
          margin-top: 4px;
          display: block;
        }

        .findpath-page-container .hero-chips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .findpath-page-container .chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, .04);
          border: 1px solid rgba(255, 255, 255, .08);
          color: rgba(255, 255, 255, .45);
          padding: 6px 12px;
          border-radius: 24px;
          font-size: .73rem;
        }

        .findpath-page-container .form-card {
          background: rgba(255, 255, 255, .05);
          border: 1px solid rgba(255, 255, 255, .11);
          border-radius: 20px;
          padding: 36px 32px;
          position: relative;
          animation: fadeUp .6s ease both;
        }

        .findpath-page-container .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--grad);
          border-radius: 20px 20px 0 0;
        }

        .findpath-page-container .fc-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .findpath-page-container .fc-icon {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          background: linear-gradient(135deg, rgba(147, 51, 234, .3), rgba(236, 72, 153, .2));
          border: 1px solid rgba(147, 51, 234, .3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .findpath-page-container .fc-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.15rem;
          font-weight: 700;
        }

        .findpath-page-container .fc-sub {
          font-size: .72rem;
          color: rgba(255, 255, 255, .35);
          margin-top: 2px;
        }

        .findpath-page-container .ferr {
          background: rgba(239, 68, 68, .1);
          border: 1px solid rgba(239, 68, 68, .25);
          border-radius: 8px;
          padding: 9px 13px;
          font-size: .75rem;
          color: #fca5a5;
          margin-bottom: 12px;
        }

        .findpath-page-container .frow {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          align-items: end;
        }

        .findpath-page-container .ff {
          margin-bottom: 12px;
          display: flex;
          flex-direction: column;
        }

        .findpath-page-container .fl {
          display: block;
          font-size: .6rem;
          font-weight: 700;
          color: rgba(255, 255, 255, .35);
          text-transform: uppercase;
          letter-spacing: .1em;
          margin-bottom: 5px;
        }

        .findpath-page-container .fl .req {
          color: #EC4899;
          margin-left: 2px;
        }

        .findpath-page-container .fi {
          width: 100%;
          background: rgba(255, 255, 255, .06);
          border: 1.5px solid rgba(255, 255, 255, .1);
          border-radius: 9px;
          padding: 11px 13px;
          font-family: 'DM Sans', sans-serif;
          font-size: .88rem;
          color: #fff;
          outline: none;
          transition: all .2s;
          -webkit-appearance: none;
          appearance: none;
          height: 44px;
        }

        .findpath-page-container .fi:focus {
          border-color: rgba(147, 51, 234, .6);
          background: rgba(147, 51, 234, .07);
          box-shadow: 0 0 0 3px rgba(147, 51, 234, .12);
        }

        .findpath-page-container .fi::placeholder {
          color: rgba(255, 255, 255, .22);
        }

        .findpath-page-container select.fi {
          background-color: #1e1a42;
          cursor: pointer;
          color-scheme: dark;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
        }

        .findpath-page-container select.fi option {
          background: #1e1a42;
          color: #fff;
        }

        .findpath-page-container .fsub {
          width: 100%;
          padding: 14px;
          background: var(--grad);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: .92rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(107, 33, 168, .38);
          margin-top: 4px;
          letter-spacing: .01em;
        }

        .findpath-page-container .fsub:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 28px rgba(107, 33, 168, .5);
        }

        .findpath-page-container .fprivacy {
          font-size: .58rem;
          color: rgba(255, 255, 255, .18);
          text-align: center;
          margin-top: 9px;
        }

        /* ──────────── QUIZ ──────────── */
        .findpath-page-container .quiz-page {
          min-height: 100vh;
          padding: 110px 0 160px;
        }

        .findpath-page-container .quiz-wrap {
          max-width: 580px;
          margin: 0 auto;
          padding: 0px 20px 20px;
        }

        .findpath-page-container .prog-bar-wrap {
          margin-bottom: 24px;
        }

        .findpath-page-container .prog-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .findpath-page-container .prog-label {
          font-size: .65rem;
          font-weight: 600;
          color: rgba(255, 255, 255, .3);
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .findpath-page-container .prog-frac {
          font-size: .78rem;
          font-weight: 600;
          color: rgba(255, 255, 255, .45);
        }

        .findpath-page-container .prog-frac span {
          color: #fff;
          font-weight: 700;
        }

        .findpath-page-container .prog-steps {
          display: flex;
          gap: 3px;
          flex-wrap: nowrap;
          overflow: hidden;
        }

        .findpath-page-container .ps {
          flex: 1;
          height: 4px;
          border-radius: 3px;
          background: rgba(255, 255, 255, .1);
          transition: background .3s;
        }

        .findpath-page-container .ps.done {
          background: rgba(147, 51, 234, .65);
        }

        .findpath-page-container .ps.cur {
          background: var(--grad);
        }

        .findpath-page-container .q-card {
          background: rgba(255, 255, 255, .045);
          border: 1px solid rgba(255, 255, 255, .1);
          border-radius: 18px;
          padding: 26px 24px;
          position: relative;
          margin-bottom: 14px;
          animation: fadeUp .4s ease both;
        }

        .findpath-page-container .q-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--grad);
          border-radius: 18px 18px 0 0;
        }

        .findpath-page-container .q-cat {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(147, 51, 234, .12);
          border: 1px solid rgba(147, 51, 234, .22);
          color: rgba(216, 180, 254, .8);
          padding: 3px 10px;
          border-radius: 20px;
          font-size: .62rem;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: 13px;
        }

        .findpath-page-container .q-num {
          font-size: .78rem;
          color: rgba(255, 255, 255, .22);
          font-style: italic;
          margin-bottom: 7px;
          font-family: 'Playfair Display', serif;
        }

        .findpath-page-container .q-text {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.05rem, 2.5vw, 1.32rem);
          font-weight: 700;
          line-height: 1.38;
          color: #fff;
          margin-bottom: 6px;
        }

        .findpath-page-container .q-hint {
          font-size: .74rem;
          color: rgba(255, 255, 255, .3);
          font-style: italic;
          margin-bottom: 20px;
        }

        .findpath-page-container .q-nohint {
          margin-bottom: 20px;
        }

        .findpath-page-container .opts {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .findpath-page-container .opt {
          background: rgba(255, 255, 255, .04);
          border: 1.5px solid rgba(255, 255, 255, .09);
          border-radius: 12px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all .18s;
          display: flex;
          align-items: center;
          gap: 13px;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .findpath-page-container .opt:active {
          transform: scale(.98);
        }

        .findpath-page-container .opt:hover {
          border-color: rgba(147, 51, 234, .4);
          background: rgba(147, 51, 234, .07);
        }

        .findpath-page-container .opt.sel {
          border-color: rgba(147, 51, 234, .6);
          background: rgba(147, 51, 234, .13);
        }

        .findpath-page-container .opt-icon {
          font-size: 1.4rem;
          flex-shrink: 0;
          width: 40px;
          text-align: center;
        }

        .findpath-page-container .opt-body {
          flex: 1;
        }

        .findpath-page-container .opt-lbl {
          font-size: .9rem;
          font-weight: 600;
          color: #fff;
          display: block;
          line-height: 1.3;
        }

        .findpath-page-container .opt-sub {
          font-size: .72rem;
          color: rgba(255, 255, 255, .4);
          margin-top: 2px;
          display: block;
        }

        .findpath-page-container .opt-chk {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1.5px solid rgba(255, 255, 255, .22);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background .15s, border-color .15s;
          background: transparent;
        }

        .findpath-page-container .opt.sel .opt-chk {
          background: #9333EA;
          border-color: #9333EA;
        }

        .findpath-page-container .opt.sel .opt-chk::after {
          content: '';
          display: block;
          width: 5px;
          height: 3.5px;
          border-left: 1.5px solid #fff;
          border-bottom: 1.5px solid #fff;
          transform: rotate(-45deg) translateY(-1px);
        }

        .findpath-page-container .scale-wrap {
          margin-bottom: 4px;
        }

        .findpath-page-container .scale-btns {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .findpath-page-container .s-btn {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          border: 1.5px solid rgba(255, 255, 255, .12);
          background: rgba(255, 255, 255, .05);
          cursor: pointer;
          font-weight: 700;
          font-size: 1.1rem;
          color: rgba(255, 255, 255, .6);
          transition: all .18s;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-tap-highlight-color: transparent;
        }

        .findpath-page-container .s-btn:hover {
          border-color: rgba(147, 51, 234, .5);
          color: #fff;
          background: rgba(147, 51, 234, .1);
        }

        .findpath-page-container .s-btn.sel {
          background: var(--grad);
          border-color: transparent;
          color: #fff;
          transform: scale(1.08);
        }

        .findpath-page-container .scale-labels {
          display: flex;
          justify-content: space-between;
          font-size: .63rem;
          color: rgba(255, 255, 255, .28);
          margin-top: 8px;
          padding: 0 4px;
        }

        .findpath-page-container .q-fact {
          background: rgba(147, 51, 234, .07);
          border: 1px solid rgba(147, 51, 234, .14);
          border-radius: 9px;
          padding: 10px 13px;
          font-size: .72rem;
          color: rgba(255, 255, 255, .4);
          line-height: 1.6;
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        /* ── FIXED NAV ── */
        .findpath-page-container .quiz-nav-sticky {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: rgba(22, 18, 46, .98);
          border-top: 1px solid rgba(255, 255, 255, .12);
          padding: 12px 20px;
          padding-bottom: max(12px, env(safe-area-inset-bottom));
        }

        .findpath-page-container .quiz-nav-sticky .nav-inner {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 580px;
          margin: 0 auto;
          width: 100%;
        }

        .findpath-page-container .quiz-nav-sticky button {
          cursor: pointer;
          border: none;
          background: none;
          font-family: inherit;
        }

        .findpath-page-container #navBack {
          flex-shrink: 0;
          background: rgba(255, 255, 255, .07);
          border: 1.5px solid rgba(255, 255, 255, .15);
          color: rgba(255, 255, 255, .8);
          padding: 13px 26px;
          border-radius: 12px;
          font-size: .9rem;
          font-weight: 600;
          transition: all .18s;
          white-space: nowrap;
        }

        .findpath-page-container #navBack:hover {
          background: rgba(255, 255, 255, .13);
          color: #fff;
        }

        .findpath-page-container #navBack.hidden {
          visibility: hidden;
          pointer-events: none;
        }

        .findpath-page-container #navNext {
          flex: 1;
          background: var(--grad);
          color: #fff;
          padding: 13px 20px;
          border-radius: 12px;
          font-size: .92rem;
          font-weight: 700;
          transition: transform .18s, box-shadow .18s, opacity .18s;
          box-shadow: 0 4px 18px rgba(107, 33, 168, .38);
          white-space: nowrap;
          opacity: .3;
          pointer-events: none;
          text-align: center;
        }

        .findpath-page-container #navNext.active {
          opacity: 1;
          pointer-events: all;
        }

        .findpath-page-container #navNext.active:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 26px rgba(107, 33, 168, .5);
        }

        /* ──────────── SUBSCRIBE GATE ──────────── */
        .findpath-page-container .gate-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 80px;
        }

        .findpath-page-container .gate-card {
          background: rgba(255, 255, 255, .05);
          border: 1px solid rgba(255, 255, 255, .11);
          border-radius: 24px;
          padding: 44px 36px;
          max-width: 480px;
          width: 100%;
          position: relative;
          text-align: center;
          animation: subPop .45s var(--ease) both;
        }

        .findpath-page-container .gate-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--grad);
          border-radius: 24px 24px 0 0;
        }

        .findpath-page-container .gate-icon {
          font-size: 3.2rem;
          margin-bottom: 18px;
          display: block;
        }

        .findpath-page-container .gate-h {
          font-family: 'Playfair Display', serif;
          font-size: 1.7rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 12px;
        }

        .findpath-page-container .gate-h em {
          font-style: italic;
          background: var(--grad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .findpath-page-container .gate-p {
          font-size: .88rem;
          color: rgba(255, 255, 255, .48);
          line-height: 1.75;
          margin-bottom: 28px;
          max-width: 360px;
          margin-left: auto;
          margin-right: auto;
        }

        .findpath-page-container .gate-perks {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 28px;
          text-align: left;
        }

        .findpath-page-container .gate-perk {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: .82rem;
          color: rgba(255, 255, 255, .6);
        }

        .findpath-page-container .gate-perk-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--grad);
          flex-shrink: 0;
        }

        .findpath-page-container .btn-yt {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 15px;
          background: #FF0000;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform .18s, box-shadow .18s;
          box-shadow: 0 4px 20px rgba(255, 0, 0, .35);
          margin-bottom: 16px;
          text-decoration: none;
        }

        .findpath-page-container .btn-yt:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 28px rgba(255, 0, 0, .5);
        }

        .findpath-page-container .btn-yt svg {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
        }

        .findpath-page-container .btn-verify {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px;
          background: rgba(255, 255, 255, .06);
          border: 1.5px solid rgba(255, 255, 255, .12);
          color: rgba(255, 255, 255, .75);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          margin-bottom: 10px;
        }

        .findpath-page-container .btn-verify:hover {
          border-color: rgba(147, 51, 234, .5);
          background: rgba(147, 51, 234, .08);
          color: #fff;
        }

        .findpath-page-container .gate-note {
          font-size: .62rem;
          color: rgba(255, 255, 255, .2);
          line-height: 1.6;
        }

        .findpath-page-container .gate-err {
          background: rgba(239, 68, 68, .1);
          border: 1px solid rgba(239, 68, 68, .25);
          border-radius: 8px;
          padding: 9px 13px;
          font-size: .75rem;
          color: #fca5a5;
          margin-bottom: 14px;
        }

        .findpath-page-container .gate-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .findpath-page-container .gate-success-icon {
          font-size: 3rem;
        }

        .findpath-page-container .gate-success-txt {
          font-size: 1rem;
          font-weight: 700;
          color: #4ade80;
        }

        .findpath-page-container .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255, 255, 255, .2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
          display: inline-block;
        }

        /* ──────────── RESULTS ──────────── */
        .findpath-page-container .res-page {
          min-height: 100vh;
          padding: 120px 20px 80px;
        }

        .findpath-page-container .res-wrap {
          max-width: 600px;
          margin: 0 auto;
        }

        .findpath-page-container .res-hero {
          text-align: center;
          margin-bottom: 40px;
          animation: fadeUp .5s ease both;
        }

        .findpath-page-container .res-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(234, 179, 8, .08);
          border: 1px solid rgba(234, 179, 8, .2);
          color: #FEF08A;
          padding: 5px 14px;
          border-radius: 40px;
          font-size: .66rem;
          font-weight: 800;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .findpath-page-container .res-icon-box {
          width: 88px;
          height: 88px;
          border-radius: 22px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.6rem;
          animation: popIn .5s var(--ease) both;
          color: #fff;
        }

        .findpath-page-container .res-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.7rem, 4vw, 2.4rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .findpath-page-container .res-tagline {
          font-size: .9rem;
          color: rgba(255, 255, 255, .45);
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto 24px;
        }

        .findpath-page-container .match-box {
          background: rgba(255, 255, 255, .04);
          border: 1px solid rgba(255, 255, 255, .08);
          border-radius: 12px;
          padding: 16px 20px;
          max-width: 320px;
          margin: 0 auto;
        }

        .findpath-page-container .match-lbl {
          font-size: .6rem;
          font-weight: 700;
          color: rgba(255, 255, 255, .3);
          text-transform: uppercase;
          letter-spacing: .09em;
          margin-bottom: 8px;
        }

        .findpath-page-container .match-track {
          height: 6px;
          background: rgba(255, 255, 255, .07);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 7px;
        }

        .findpath-page-container .match-fill {
          height: 100%;
          background: var(--grad);
          border-radius: 6px;
          width: 0;
          transition: width 1.4s cubic-bezier(.22, 1, .36, 1) .3s;
        }

        .findpath-page-container .match-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .findpath-page-container .match-pct {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #FEF08A;
        }

        .findpath-page-container .match-note {
          font-size: .6rem;
          color: rgba(255, 255, 255, .22);
        }

        /* Why you box */
        .findpath-page-container .why-box {
          background: rgba(147, 51, 234, .07);
          border: 1px solid rgba(147, 51, 234, .18);
          border-radius: 14px;
          padding: 22px 20px;
          margin-bottom: 28px;
        }

        .findpath-page-container .why-title {
          font-family: 'Playfair Display', serif;
          font-size: .95rem;
          font-weight: 700;
          color: #D8B4FE;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .findpath-page-container .why-body {
          font-size: .84rem;
          color: rgba(255, 255, 255, .58);
          line-height: 1.8;
        }

        .findpath-page-container .why-highlights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 16px;
        }

        .findpath-page-container .why-highlight {
          background: rgba(255, 255, 255, .04);
          border: 1px solid rgba(255, 255, 255, .07);
          border-radius: 10px;
          padding: 12px 13px;
        }

        .findpath-page-container .wh-label {
          font-size: .62rem;
          font-weight: 700;
          color: rgba(255, 255, 255, .28);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 4px;
        }

        .findpath-page-container .wh-val {
          font-size: .82rem;
          font-weight: 600;
          color: rgba(255, 255, 255, .8);
        }

        .findpath-page-container .sh {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 36px 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .findpath-page-container .str-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 8px;
        }

        .findpath-page-container .str-card {
          background: rgba(255, 255, 255, .04);
          border: 1px solid rgba(255, 255, 255, .09);
          border-radius: 13px;
          padding: 16px 12px;
          text-align: center;
        }

        .findpath-page-container .str-icon {
          font-size: 1.4rem;
          margin-bottom: 8px;
          display: block;
        }

        .findpath-page-container .str-name {
          font-size: .75rem;
          font-weight: 700;
          color: rgba(255, 255, 255, .8);
          margin-bottom: 8px;
          display: block;
        }

        .findpath-page-container .str-bar {
          height: 4px;
          background: rgba(255, 255, 255, .08);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 4px;
        }

        .findpath-page-container .str-fill {
          height: 100%;
          border-radius: 4px;
          background: var(--grad);
          transition: width 1.2s ease .6s;
        }

        .findpath-page-container .str-pct {
          font-size: .68rem;
          color: rgba(255, 255, 255, .4);
          font-weight: 600;
        }

        .findpath-page-container .career-card {
          background: rgba(255, 255, 255, .04);
          border: 1px solid rgba(255, 255, 255, .09);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          gap: 14px;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
        }

        .findpath-page-container .career-card.top-match {
          border-color: rgba(147, 51, 234, .3);
        }

        .findpath-page-container .career-card.top-match::before {
          content: 'Best Match';
          position: absolute;
          top: 0;
          right: 16px;
          background: var(--grad);
          color: #fff;
          font-size: .55rem;
          font-weight: 800;
          padding: 3px 9px;
          border-radius: 0 0 7px 7px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .findpath-page-container .cc-icon {
          width: 48px;
          height: 48px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
          color: #fff;
        }

        .findpath-page-container .cc-body {
          flex: 1;
          min-width: 0;
        }

        .findpath-page-container .cc-name {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 3px;
        }

        .findpath-page-container .cc-tag {
          font-size: .76rem;
          color: rgba(255, 255, 255, .4);
          margin-bottom: 10px;
          line-height: 1.4;
        }

        .findpath-page-container .cc-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 10px;
        }

        .findpath-page-container .cc-skill {
          font-size: .61rem;
          font-weight: 600;
          color: rgba(216, 180, 254, .7);
          background: rgba(147, 51, 234, .1);
          border: 1px solid rgba(147, 51, 234, .18);
          padding: 2px 8px;
          border-radius: 20px;
        }

        .findpath-page-container .cc-match {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .findpath-page-container .cc-pct {
          font-size: .75rem;
          font-weight: 700;
          color: #FEF08A;
          white-space: nowrap;
        }

        .findpath-page-container .cc-mbar {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, .07);
          border-radius: 3px;
          overflow: hidden;
        }

        .findpath-page-container .cc-mfill {
          height: 100%;
          background: var(--grad);
          border-radius: 3px;
          transition: width 1s ease .8s;
        }

        .findpath-page-container .cc-expand {
          background: none;
          border: 1px solid rgba(255, 255, 255, .08);
          color: rgba(255, 255, 255, .35);
          padding: 6px 11px;
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: .67rem;
          font-weight: 600;
          cursor: pointer;
          transition: all .18s;
          margin-top: 10px;
          display: block;
        }

        .findpath-page-container .cc-expand:hover {
          border-color: rgba(147, 51, 234, .3);
          color: rgba(216, 180, 254, .8);
        }

        .findpath-page-container .cc-detail {
          display: none;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, .06);
          margin-top: 12px;
        }

        .findpath-page-container .cc-detail.open {
          display: block;
        }

        .findpath-page-container .cc-dtxt {
          font-size: .82rem;
          color: rgba(255, 255, 255, .55);
          line-height: 1.8;
          margin-bottom: 14px;
        }

        .findpath-page-container .cc-why-section {
          background: rgba(255, 255, 255, .03);
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 12px;
        }

        .findpath-page-container .cc-why-label {
          font-size: .62rem;
          font-weight: 700;
          color: rgba(216, 180, 254, .6);
          text-transform: uppercase;
          letter-spacing: .08em;
          margin-bottom: 8px;
        }

        .findpath-page-container .cc-why-txt {
          font-size: .8rem;
          color: rgba(255, 255, 255, .5);
          line-height: 1.75;
        }

        .findpath-page-container .cc-steps {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .findpath-page-container .cc-step {
          font-size: .76rem;
          color: rgba(255, 255, 255, .5);
          padding-left: 14px;
          position: relative;
          line-height: 1.5;
        }

        .findpath-page-container .cc-step::before {
          content: '→';
          position: absolute;
          left: 0;
          color: rgba(147, 51, 234, .6);
          font-size: .7rem;
        }

        .findpath-page-container .res-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 32px;
        }

        .findpath-page-container .btn-prim {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: var(--grad);
          color: #fff;
          padding: 13px 24px;
          border-radius: 11px;
          font-weight: 700;
          font-size: .88rem;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          box-shadow: 0 4px 20px rgba(107, 33, 168, .38);
          transition: transform .18s;
        }

        .findpath-page-container .btn-prim:hover {
          transform: translateY(-2px);
        }

        .findpath-page-container .btn-sec {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: rgba(255, 255, 255, .05);
          color: rgba(255, 255, 255, .65);
          padding: 13px 20px;
          border-radius: 11px;
          font-weight: 600;
          font-size: .88rem;
          border: 1.5px solid rgba(255, 255, 255, .1);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all .18s;
        }

        .findpath-page-container .btn-sec:hover {
          border-color: rgba(147, 51, 234, .35);
          color: #fff;
        }

        .findpath-page-container .cfp {
          position: fixed;
          width: 7px;
          height: 7px;
          top: -10px;
          border-radius: 2px;
          pointer-events: none;
          z-index: 9999;
          animation: confettiFall 3s ease-in forwards;
        }

        /* ──────────── RESPONSIVE ──────────── */
        @media (max-width: 860px) {
          .findpath-page-container .landing {
            padding: 100px 16px 60px;
          }
          .findpath-page-container .landing-inner {
            grid-template-columns: 1fr;
            gap: 36px;
            padding: 0;
          }
          .findpath-page-container .hero-h1 {
            font-size: 2.4rem;
          }
          .findpath-page-container .hero-copy {
            text-align: center;
          }
          .findpath-page-container .hero-stats {
            justify-content: center;
          }
          .findpath-page-container .hero-chips {
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .findpath-page-container .landing {
            padding: 90px 14px 48px;
          }
          .findpath-page-container .hero-h1 {
            font-size: 2rem;
          }
          .findpath-page-container .quiz-page {
            padding: 90px 0 140px;
          }
          .findpath-page-container .quiz-wrap {
            padding: 0px 14px 20px;
          }
          .findpath-page-container .q-card {
            padding: 20px 16px 18px;
            border-radius: 14px;
          }
          .findpath-page-container .q-text {
            font-size: 1.05rem;
          }
          .findpath-page-container .q-hint, .findpath-page-container .q-nohint {
            margin-bottom: 16px;
          }
          .findpath-page-container .opt {
            padding: 12px 14px;
            gap: 11px;
            border-radius: 11px;
          }
          .findpath-page-container .opt-icon {
            font-size: 1.25rem;
            width: 32px;
          }
          .findpath-page-container .opt-lbl {
            font-size: .88rem;
          }
          .findpath-page-container .opt-sub {
            font-size: .69rem;
          }
          .findpath-page-container .opt-chk {
            width: 20px;
            height: 20px;
          }
          /* Nav mobile tweaks */
          .findpath-page-container .quiz-nav-sticky {
            padding: 10px 14px;
            padding-bottom: max(14px, env(safe-area-inset-bottom));
          }
          .findpath-page-container #navBack {
            padding: 13px 18px;
            font-size: .85rem;
          }
          .findpath-page-container #navNext {
            font-size: .87rem;
          }
          .findpath-page-container .prog-steps {
            gap: 2px;
          }
          .findpath-page-container .ps {
            height: 2px;
          }
          .findpath-page-container .res-page {
            padding: 90px 14px 60px;
          }
          .findpath-page-container .str-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
          .findpath-page-container .str-card {
            padding: 13px 8px;
          }
          .findpath-page-container .str-name {
            font-size: .7rem;
          }
          .findpath-page-container .why-highlights {
            grid-template-columns: 1fr 1fr;
          }
          .findpath-page-container .res-actions {
            flex-direction: column;
          }
          .findpath-page-container .btn-prim, .findpath-page-container .btn-sec {
            justify-content: center;
            width: 100%;
          }
          .findpath-page-container .form-card {
            padding: 28px 20px;
          }
          .findpath-page-container .frow {
            grid-template-columns: 1fr 1fr;
          }
          .findpath-page-container .gate-page {
            padding: 90px 14px 60px;
          }
          .findpath-page-container .gate-card {
            padding: 32px 20px;
          }
          .findpath-page-container .gate-h {
            font-size: 1.45rem;
          }
        }

        @media (max-width: 380px) {
          .findpath-page-container .str-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .findpath-page-container .frow {
            grid-template-columns: 1fr;
          }
          .findpath-page-container .why-highlights {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* 1. LANDING VIEW */}
      {view === 'landing' && (
        <section className="landing">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
          <div className="landing-inner">
            <div className="hero-copy">
              <div className="hero-badge">✦ Career Path Discovery</div>
              <h1 className="hero-h1">What Kind of<br /><em>Brilliant</em><br />Are You?</h1>
              <p className="hero-p">18 research-backed questions that reveal your strengths and the career where you'll genuinely thrive.</p>
              <div className="hero-stats">
                <div><span className="stat-num">50K+</span><span className="stat-lbl">Women assessed</span></div>
                <div><span class="stat-num">8</span><span className="stat-lbl">Career paths</span></div>
                <div><span className="stat-num">93%</span><span className="stat-lbl">Accuracy rate</span></div>
                <div><span className="stat-num">5 min</span><span className="stat-lbl">To complete</span></div>
              </div>
              <div className="hero-chips">
                <span className="chip">⚡ Science-backed</span>
                <span className="chip">✦ Made just for you</span>
                <span className="chip">🔒 Confidential</span>
              </div>
            </div>
            
            <div className="form-card">
              <div className="fc-head">
                <div className="fc-icon">✨</div>
                <div>
                  <div className="fc-title">Start Your Assessment</div>
                  <div className="fc-sub">Free · Takes about 5 minutes</div>
                </div>
              </div>

              {formError && <div className="ferr">{formError}</div>}

              <form onSubmit={handleStartQuiz}>
                <div className="frow">
                  <div className="ff">
                    <label className="fl">First Name<span className="req">*</span></label>
                    <input
                      type="text"
                      className="fi"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                  <div className="ff">
                    <label className="fl">Last Name</label>
                    <input
                      type="text"
                      className="fi"
                      placeholder="Optional"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      maxLength={50}
                    />
                  </div>
                </div>
                <div className="ff">
                  <label className="fl">Email Address<span className="req">*</span></label>
                  <input
                    type="email"
                    className="fi"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="ff">
                  <label className="fl">Mobile</label>
                  <input
                    type="tel"
                    className="fi"
                    placeholder="Optional — +1 234 567 8900"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="ff">
                  <label className="fl">Where are you right now?<span className="req">*</span></label>
                  <select
                    className="fi"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="">Select your stage…</option>
                    <option value="student">Student / Just starting out</option>
                    <option value="early">Early career (0–3 years)</option>
                    <option value="mid">Mid career (3–10 years)</option>
                    <option value="senior">Senior / Leadership</option>
                    <option value="pivot">Career pivot / Transition</option>
                    <option value="entrepreneur">Entrepreneur / Founder</option>
                  </select>
                </div>
                <button type="submit" className="fsub">Begin My Career Assessment →</button>
              </form>
              <div className="fprivacy">🔒 Your data is private. We never sell it.</div>
            </div>
          </div>
        </section>
      )}

      {/* 2. QUIZ VIEW */}
      {view === 'quiz' && currentQuestionObj && (
        <section className="quiz-page">
          <div className="quiz-wrap">
            <div className="prog-bar-wrap">
              <div className="prog-row">
                <span className="prog-label">Career Assessment</span>
                <span className="prog-frac"><span>{currQ + 1}</span> of 18</span>
              </div>
              <div className="prog-steps">
                {QS.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`ps ${idx < currQ ? 'done' : idx === currQ ? 'cur' : ''}`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="q-card">
              <div className="q-cat">{currentQuestionObj.cat}</div>
              <div className="q-num">Question {currentQuestionObj.n} of 18</div>
              <div className="q-text">{currentQuestionObj.q}</div>
              {currentQuestionObj.hint ? (
                <div className="q-hint">{currentQuestionObj.hint}</div>
              ) : (
                <div className="q-nohint"></div>
              )}

              {/* Multiple Option Selection (Type 'c') */}
              {currentQuestionObj.type === 'c' && (
                <div className="opts">
                  {currentQuestionObj.opts.map((op) => {
                    const isSelected = answers[currentQuestionObj.id] === op.v;
                    return (
                      <div
                        key={op.v}
                        className={`opt ${isSelected ? 'sel' : ''}`}
                        onClick={() => handlePickOpt(currentQuestionObj.id, op.v)}
                      >
                        <span className="opt-icon">{op.e}</span>
                        <div className="opt-body">
                          <span className="opt-lbl">{op.l}</span>
                          <span className="opt-sub">{op.s}</span>
                        </div>
                        <div className="opt-chk"></div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Slider Scale Selection (Type 's') */}
              {currentQuestionObj.type === 's' && (
                <div className="scale-wrap">
                  <div className="scale-btns">
                    {currentQuestionObj.opts.map((val) => {
                      const isSelected = answers[currentQuestionObj.id] === String(val);
                      return (
                        <div
                          key={val}
                          className={`s-btn ${isSelected ? 'sel' : ''}`}
                          onClick={() => handlePickScale(currentQuestionObj.id, val)}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                  <div className="scale-labels">
                    <span>{currentQuestionObj.sMin}</span>
                    <span>{currentQuestionObj.sMax}</span>
                  </div>
                </div>
              )}
            </div>

            {currentQuestionObj.fact && (
              <div className="q-fact">
                <span>💡</span>
                <span>{currentQuestionObj.fact}</span>
              </div>
            )}
          </div>

          {/* Quiz Bottom Sticky Nav */}
          <div className="quiz-nav-sticky">
            <div className="nav-inner">
              <button
                id="navBack"
                className={currQ === 0 ? 'hidden' : ''}
                onClick={handleGoBack}
              >
                ← Back
              </button>
              <button
                id="navNext"
                className={hasQuestionBeenAnswered ? 'active' : ''}
                onClick={handleNextQ}
              >
                {currQ === QS.length - 1 ? 'See My Results ✨' : 'Next →'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. SUBSCRIBE GATE VIEW */}
      {view === 'gate' && (
        <section className="gate-page">
          <div className="gate-card">
            {!verifySuccess ? (
              <>
                <span className="gate-icon">🎉</span>
                <h2 className="gate-h">You're <em>Almost There!</em></h2>
                <p className="gate-p">Your personalised career results are ready. Join our Bold & Brilliant community on YouTube to unlock your full report — it's completely free!</p>
                <div className="gate-perks">
                  <div className="gate-perk"><div className="gate-perk-dot"></div><span>Weekly career strategy videos for ambitious women</span></div>
                  <div className="gate-perk"><div className="gate-perk-dot"></div><span>Real stories from women who made bold leaps</span></div>
                  <div className="gate-perk"><div className="gate-perk-dot"></div><span>Free resources, templates and mentorship tips</span></div>
                  <div className="gate-perk"><div className="gate-perk-dot"></div><span>Be first to know about live events and masterclasses</span></div>
                </div>

                {gateError && <div className="gate-err">{gateError}</div>}

                <div id="gateActions">
                  <a
                    className="btn-yt"
                    href="https://www.youtube.com/@BoldandBrilliantgirl?sub_confirmation=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSubClick}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>
                    Subscribe to Bold &amp; Brilliant Girls
                  </a>
                  <button
                    className="btn-verify"
                    onClick={handleVerifySubscription}
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? (
                      <span><span className="spinner"></span> Verifying…</span>
                    ) : (
                      <span>✓ I've Subscribed — Show My Results</span>
                    )}
                  </button>
                </div>
                <p className="gate-note" style={{ marginTop: '16px' }}>After subscribing on YouTube, tap the button above to unlock your results. We can't auto-verify YouTube subscriptions — this is on the honour system. Thank you for supporting our community! 💜</p>
              </>
            ) : (
              <div className="gate-success">
                <span className="gate-success-icon">✅</span>
                <span className="gate-success-txt">Subscribed! Loading your results…</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. RESULTS VIEW */}
      {view === 'results' && topCareer && (
        <section className="res-page">
          <div className="res-wrap">
            <div className="res-hero">
              <div className="res-badge">✨ Your Career Path Report</div>
              <div className="res-icon-box" style={{ background: topCareer.grad }}>{topCareer.icon}</div>
              <h2 className="res-title">{topCareer.name}</h2>
              <p className="res-tagline">{topCareer.tag}</p>
              
              <div className="match-box">
                <div className="match-lbl">Compatibility Score</div>
                <div className="match-track">
                  <div className="match-fill" style={{ width: `${animatedPct}%` }}></div>
                </div>
                <div className="match-row">
                  <span className="match-pct">{animatedPct}%</span>
                  <span className="match-note">18 psychometric dimensions</span>
                </div>
              </div>
            </div>

            {/* Why You Section */}
            <div className="why-box">
              <div className="why-title">🔍 Why This Is Your Path</div>
              <div className="why-body" style={{ marginBottom: '12px' }}>{topCareer.desc}</div>
              <div className="why-body">{topCareer.whyDetail}</div>
              <div className="why-highlights">
                {topCareer.whyHighlights.map((wh, idx) => (
                  <div key={idx} className="why-highlight">
                    <div className="wh-label">{wh.label}</div>
                    <div className="wh-val">{wh.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strength Profile */}
            <div className="sh">📊 Your Strength Profile</div>
            <div className="str-grid">
              {getTraits().map((tr) => (
                <div key={tr.name} className="str-card">
                  <span className="str-icon">{tr.icon}</span>
                  <span className="str-name">{tr.name}</span>
                  <div className="str-bar">
                    <div className="str-fill" style={{ width: `${tr.score}%` }}></div>
                  </div>
                  <div className="str-pct">{tr.score}%</div>
                </div>
              ))}
            </div>

            {/* Top Career Matches list */}
            <div className="sh">🌟 Your Top Career Matches</div>
            {rankedResults.slice(0, 3).map((ck, pi) => {
              const cp = CAREERS[ck];
              const isExpanded = !!expandedCareers[pi];
              return (
                <div key={ck} className={`career-card ${pi === 0 ? 'top-match' : ''}`}>
                  <div className="cc-icon" style={{ background: cp.grad }}>{cp.icon}</div>
                  <div className="cc-body">
                    <div className="cc-name">{cp.name}</div>
                    <div className="cc-tag">{cp.tag}</div>
                    <div className="cc-skills">
                      {cp.skills.map((skill) => (
                        <span key={skill} className="cc-skill">{skill}</span>
                      ))}
                    </div>
                    <div className="cc-match">
                      <span className="cc-pct">{cp.match}% match</span>
                      <div className="cc-mbar">
                        <div className="cc-mfill" style={{ width: `${cp.match}%` }}></div>
                      </div>
                    </div>
                    <button
                      className="cc-expand"
                      onClick={() => handleToggleDetail(pi)}
                    >
                      {isExpanded ? '− Hide Analysis' : '+ See Full Analysis & Roadmap'}
                    </button>
                    <div className={`cc-detail ${isExpanded ? 'open' : ''}`}>
                      <div className="cc-why-section">
                        <div className="cc-why-label">Why this fits you</div>
                        <div className="cc-why-txt">{cp.desc}</div>
                      </div>
                      <p className="cc-dtxt">{cp.whyDetail}</p>
                      <div className="cc-why-label" style={{ marginBottom: '8px' }}>Your 5-step action plan</div>
                      <ul className="cc-steps">
                        {cp.steps.map((step, sIdx) => (
                          <li key={sIdx} className="cc-step">{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Action buttons */}
            <div className="res-actions">
              <button
                className="btn-prim"
                onClick={() => {
                  if (onNavChange) {
                    onNavChange('mentorship'); // Route to mentorship anchor/page
                  } else {
                    onShowToast('✨', 'Mentorship', 'Mentorship portal loading...');
                  }
                }}
              >
                ✨ Apply for Mentorship
              </button>
              <button className="btn-sec" onClick={handleRetakeQuiz}>
                ↩ Retake Quiz
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
