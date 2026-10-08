export interface ProgramItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  whoItIsFor: string;
  keyBenefits: string[];
  iconName: string;
  category: 'therapy' | 'education' | 'development' | 'lifeskills';
}

export interface AssessmentItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  whatWeEvaluate: string[];
  outcome: string;
  iconName: string;
}

export const PROGRAMS: ProgramItem[] = [
  {
    id: 'occupational-therapy',
    title: 'Occupational Therapy (OT)',
    shortDesc: 'Building fine motor skills, sensory processing balance, hand-eye coordination, and daily independence.',
    fullDesc: 'Occupational therapy helps children develop the foundational motor, sensory, and cognitive skills they need for everyday play, learning, and self-care. Our therapists guide children through tailored sensory gym activities, tactile exercises, and fine-motor tasks.',
    whoItIsFor: 'Children experiencing sensory sensitivities, poor hand grasp, clumsiness, difficulty writing, or struggles with daily routines like buttoning clothes.',
    keyBenefits: [
      'Improves pencil grip, cutting, and handwriting posture',
      'Regulates sensory sensitivities (sounds, textures, movement)',
      'Enhances bilateral hand coordination and body awareness',
      'Builds focus and sitting tolerance for school classroom tasks'
    ],
    iconName: 'Activity',
    category: 'therapy'
  },
  {
    id: 'speech-language-therapy',
    title: 'Speech & Language Therapy',
    shortDesc: 'Supporting clear pronunciation, expressive vocabulary, comprehension, and confident social communication.',
    fullDesc: 'Speech and language therapy empowers children to express their thoughts, understand others, and communicate with joy. We work on speech clarity, receptive understanding, social conversation, and non-verbal communication methods.',
    whoItIsFor: 'Children with speech delays, unclear speech, stammering/stuttering, difficulty following instructions, or challenges interacting with peers.',
    keyBenefits: [
      'Encourages early word formation and vocabulary expansion',
      'Corrects articulation and speech sound errors',
      'Strengthens sentence construction and conversational turn-taking',
      'Improves social communication and confidence among friends'
    ],
    iconName: 'MessageSquare',
    category: 'therapy'
  },
  {
    id: 'special-education',
    title: 'Special Education',
    shortDesc: 'Individualized academic learning plans designed around each child’s unique learning pace and style.',
    fullDesc: 'Our Special Education program bridges the gap between developmental differences and academic learning. With personalized IEPs (Individualized Education Programs), our certified special educators teach literacy, numeracy, and cognitive concepts through multisensory methods.',
    whoItIsFor: 'Children with learning difficulties, ADHD, intellectual developmental delays, or children preparing to transition smoothly into mainstream or specialized schooling.',
    keyBenefits: [
      'Customized learning pace suited to your child’s cognitive profile',
      'Multisensory teaching tools for phonics, reading, and mathematics',
      'Strengthens attention span, memory recall, and task completion',
      'Smooth school-readiness preparation and academic remediation'
    ],
    iconName: 'BookOpen',
    category: 'education'
  },
  {
    id: 'physical-sports',
    title: 'Physical & Sports Activities',
    shortDesc: 'Nurturing gross motor strength, balance, team play, stamina, and healthy physical coordination.',
    fullDesc: 'Structured physical activities help children channel their natural energy into balanced body movement. Through playful obstacle courses, ball games, and balance activities, children gain core strength, rhythm, and self-confidence.',
    whoItIsFor: 'Children who need support with muscle tone, balance, endurance, spatial coordination, or structured group play.',
    keyBenefits: [
      'Strengthens core muscles and physical balance',
      'Develops spatial orientation and safe navigation of playground spaces',
      'Teaches cooperative play, taking turns, and team participation',
      'Releases excess energy and promotes sound sleep and emotional calm'
    ],
    iconName: 'Dumbbell',
    category: 'development'
  },
  {
    id: 'counseling-parent-support',
    title: 'Counseling & Parent Support',
    shortDesc: 'Guidance and emotional care for children, coupled with practical coaching for parents and families.',
    fullDesc: 'Child development thrives when families are supported. Our clinical counselors offer emotional guidance for children navigating frustration or anxiety, while partnering closely with parents through practical strategies for home routines.',
    whoItIsFor: 'Children with behavioral challenges, emotional distress, or low self-esteem, as well as parents seeking guidance and coping strategies.',
    keyBenefits: [
      'Helps children understand and express big emotions constructively',
      'Provides practical positive behavior strategies for home and school',
      'Strengthens parent-child bonding through empathetic communication',
      'Offers regular progress reviews and caregiver empowerment workshops'
    ],
    iconName: 'HeartHandshake',
    category: 'therapy'
  },
  {
    id: 'art-craft-creative',
    title: 'Art, Craft & Creative Development',
    shortDesc: 'Sensory-rich creative expression fostering fine finger control, imagination, and emotional release.',
    fullDesc: 'Creative art sessions provide a relaxing, therapeutic outlet where children experiment with textures, paints, clay, and paper craft. This develops both aesthetic imagination and practical hand dexterity.',
    whoItIsFor: 'Children exploring sensory textures, needing fine-motor strengthening, or seeking creative non-verbal ways to express thoughts.',
    keyBenefits: [
      'Engages tactile sensory exploration through safe, varied mediums',
      'Builds finger strength, pincer grasp, and hand-eye dexterity',
      'Encourages imaginative storytelling and pride in finished creations',
      'Reduces anxiety and provides an enjoyable creative focus'
    ],
    iconName: 'Palette',
    category: 'development'
  },
  {
    id: 'computer-education',
    title: 'Computer Education & Digital Skills',
    shortDesc: 'Age-appropriate digital literacy, keyboard coordination, and assistive educational technology.',
    fullDesc: 'In today’s digital era, computer literacy opens doors to learning and independent communication. We introduce children to intuitive educational software, typing practice, visual puzzles, and assistive digital tools.',
    whoItIsFor: 'Children ready for basic computer skills, visual-spatial problem solving, typing, and assistive technology tools.',
    keyBenefits: [
      'Develops keyboard coordination and visual-motor tracking',
      'Introduces engaging educational software for math and reading',
      'Builds essential foundational skills for modern school classrooms',
      'Empowers non-verbal or minimally verbal children with digital aids'
    ],
    iconName: 'Monitor',
    category: 'education'
  },
  {
    id: 'kitchen-adl-lifeskills',
    title: 'Kitchen Activities & ADL (Life Skills)',
    shortDesc: 'Practical Activities of Daily Living training to foster self-reliance, feeding, and everyday independence.',
    fullDesc: 'Real independence begins with life skills. In our safe, child-oriented practice setup, children learn practical Activities of Daily Living (ADL) such as pouring water, stirring, sorting groceries, personal hygiene, and packing their school bags.',
    whoItIsFor: 'Children who rely heavily on caregivers for routine personal care and need guided practice to build self-sufficiency.',
    keyBenefits: [
      'Builds self-feeding, drinking, and table manner skills',
      'Teaches essential sequencing (step 1, step 2, step 3 of everyday tasks)',
      'Fosters proud self-reliance and reduces daily caregiver burden',
      'Instills safety awareness with everyday household items'
    ],
    iconName: 'UtensilsCrossed',
    category: 'lifeskills'
  }
];

export const ASSESSMENTS: AssessmentItem[] = [
  {
    id: 'clinical-psychologist',
    title: 'Clinical Psychologist Consultation',
    tagline: 'Professional support for emotional, behavioral & developmental well-being',
    description: 'Our certified Clinical Psychologist provides compassionate evaluation and clinical guidance for children experiencing developmental milestones delay, emotional distress, ADHD traits, or behavioral challenges.',
    whatWeEvaluate: [
      'Emotional regulation and mood patterns',
      'Behavioral responses at home and in social settings',
      'Attention span, focus, and impulse control',
      'Parenting guidance and individualized intervention plans'
    ],
    outcome: 'A thorough clinical understanding of your child’s emotional and behavioral needs, along with clear steps for home and school support.',
    iconName: 'Brain'
  },
  {
    id: 'iq-test',
    title: 'Standardized IQ Test & Cognitive Profile',
    tagline: 'Objective insight into your child’s intellectual and learning strengths',
    description: 'Using standardized, child-friendly psychological assessment batteries, we measure intellectual abilities, verbal reasoning, visual-spatial processing, working memory, and cognitive processing speed.',
    whatWeEvaluate: [
      'Verbal comprehension and language reasoning',
      'Fluid visual-spatial logic and pattern recognition',
      'Short-term and working memory retention',
      'Processing speed and academic readiness indicators'
    ],
    outcome: 'An official, comprehensive psychological report recognized for school admissions, remedial accommodations, or specialized educational planning.',
    iconName: 'FileCheck'
  },
  {
    id: 'autism-assessment',
    title: 'Comprehensive Autism Assessment (ASD)',
    tagline: 'Early identification, neurodevelopmental profiling & personalized roadmap',
    description: 'Our clinical Autism Assessment evaluates social communication, sensory reactivity, repetitive behaviors, and interaction patterns using evidence-based clinical observation and standardized diagnostic tools.',
    whatWeEvaluate: [
      'Social interaction, eye contact, and shared attention',
      'Verbal and non-verbal communication nuances',
      'Sensory hyper- or hypo-reactivity (sounds, touch, motion)',
      'Behavioral flexibility, routines, and play patterns'
    ],
    outcome: 'An empathetic, detailed diagnostic report with actionable early intervention recommendations tailored specifically to your child’s unique strengths.',
    iconName: 'Sparkles'
  }
];

export const WHY_CHOOSE_ITEMS = [
  {
    title: 'Individualized & Child-Centered Approach',
    desc: 'No two children are identical. Every program and therapy session is customized around your child’s strengths, learning style, and comfortable pace.'
  },
  {
    title: 'Evidence-Based Therapies & Programs',
    desc: 'We follow modern, research-backed pediatric therapy techniques that deliver meaningful, measurable progress in everyday life.'
  },
  {
    title: 'Experienced & Qualified Professionals',
    desc: 'Our clinical psychologists, occupational therapists, speech therapists, and special educators are certified and deeply dedicated to pediatric care.'
  },
  {
    title: 'Safe, Inclusive & Stimulating Environment',
    desc: 'Our centre in Bhandup is designed specifically for children—equipped with sensory-safe equipment, padded areas, and clean learning corners.'
  },
  {
    title: 'Active Parent Involvement & Training',
    desc: 'We consider parents our most important partners. We provide regular counseling, home exercise programs, and guidance to reinforce growth at home.'
  },
  {
    title: 'Holistic Development of Every Child',
    desc: 'From speech and motor coordination to academic readiness and daily life skills (ADL), we support the entire child, not just isolated symptoms.'
  }
];

export const FAQS = [
  {
    question: 'What age group does Utkarsh Child Development Centre support?',
    answer: 'We support infants, toddlers, young children, and adolescents—typically from 1.5 years up to 16 years of age. Our early intervention programs focus on young toddlers, while our special education, computer learning, and ADL life skills programs cater to school-age children.'
  },
  {
    question: 'Are school admissions currently open for the new session?',
    answer: 'Yes! Admissions are officially open for our specialized school sessions, early intervention batches, and remedial education programs. Parents can book a centre tour and preliminary developmental assessment to secure a seat.'
  },
  {
    question: 'How do I know if my child needs an assessment or therapy?',
    answer: 'If you notice delays in speech (not speaking by 2 years, limited vocabulary), difficulty maintaining eye contact, excessive sensory sensitivity (crying at loud sounds or certain clothes), frequent balance struggles, hyperactivity, or difficulty learning basic concepts in school, an assessment can provide clarity and timely support.'
  },
  {
    question: 'How does an Autism or IQ test session work?',
    answer: 'Assessments are conducted by our qualified Clinical Psychologist in a friendly, low-stress room. Through child-friendly activities, games, questions, and observation, we evaluate skills without putting pressure on the child. A detailed report is provided and discussed thoroughly with parents.'
  },
  {
    question: 'Can parents observe or participate in the therapy sessions?',
    answer: 'Yes, absolutely. We believe parent empowerment is vital. Our therapists guide parents on techniques they can practice at home, and we conduct regular progress review sessions to celebrate milestones together.'
  },
  {
    question: 'What are Kitchen Activities and ADL (Activities of Daily Living)?',
    answer: 'ADL training teaches children real-world independence. In our child-safe practice kitchen and living corner, children learn self-feeding, drinking from a cup, packing their bags, washing hands, buttoning shirts, and simple food prep. This builds invaluable life confidence.'
  },
  {
    question: 'Where is Utkarsh CDC located and how can I book an appointment?',
    answer: 'We are located at Saurabh CHS, B Wing, Hanuman Mandir Road, Datar Colony, Bhandup (East), Mumbai 400042. You can call us directly at 8828551185, email utkarshcdc2026@gmail.com, or fill out the booking form on this website.'
  }
];

export const TRIAGE_CONCERNS = [
  {
    id: 'speech',
    label: 'Speech & Communication Delays',
    description: 'Child speaks few words, stutters, has difficulty making sentences, or does not respond to their name.',
    recommendedPrograms: ['speech-language-therapy', 'counseling-parent-support'],
    recommendedAssessments: ['autism-assessment', 'clinical-psychologist']
  },
  {
    id: 'sensory-motor',
    label: 'Sensory Sensitivities & Motor Coordination',
    description: 'Bothered by loud sounds, sensitive to textures, clumsy walking, weak pencil grip, or constantly moving.',
    recommendedPrograms: ['occupational-therapy', 'physical-sports', 'art-craft-creative'],
    recommendedAssessments: ['clinical-psychologist']
  },
  {
    id: 'learning-school',
    label: 'Learning Struggles & School Readiness',
    description: 'Trouble reading, writing, remembering numbers, staying focused on homework, or passing school exams.',
    recommendedPrograms: ['special-education', 'computer-education', 'occupational-therapy'],
    recommendedAssessments: ['iq-test']
  },
  {
    id: 'behavior-emotions',
    label: 'Emotional Tantrums, Anxiety & Behavioral Concerns',
    description: 'Frequent meltdowns, difficulty adapting to change, social isolation, aggression, or high anxiety.',
    recommendedPrograms: ['counseling-parent-support', 'art-craft-creative', 'occupational-therapy'],
    recommendedAssessments: ['clinical-psychologist', 'autism-assessment']
  },
  {
    id: 'independence-adl',
    label: 'Daily Life Skills & Self-Care Needs',
    description: 'Relies on parents to feed, dress, pack school bag, or manage basic personal hygiene routines.',
    recommendedPrograms: ['kitchen-adl-lifeskills', 'occupational-therapy'],
    recommendedAssessments: ['clinical-psychologist']
  }
];
