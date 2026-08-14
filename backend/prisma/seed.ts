import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const data = [
  {
    "semester": 1,
    "title": "Semester I - Subject Management",
    "subjects": [
      {
        "subjectName": "Software Engineering",
        "code": "CC101",
        "credits": 5,
        "type": "Theory",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Advanced Database Management System",
        "code": "CC102",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Design & Analysis of Algorithm",
        "code": "CC103",
        "credits": 5,
        "type": "Theory",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Data Communications & Computer Networks",
        "code": "CC104",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Python Programming",
        "code": "CC105",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Data Visualization",
        "code": "SEC101",
        "credits": 3,
        "type": "Theory + Practical",
        "category": "Skill Enhancement Course",
        "department": "MCA"
      },
      {
        "subjectName": "Environmental Sustainability Swachh Bharat Abhiyan Activities",
        "code": "MAEC101",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Ability Enhancement Course",
        "department": "MCA"
      }
    ]
  },
  {
    "semester": 3,
    "title": "Semester III - Subject Management",
    "subjects": [
      {
        "subjectName": "Advanced Web Designing using J2EE",
        "code": "CC310",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Cloud Computing",
        "code": "CC311",
        "credits": 5,
        "type": "Theory",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Big Data Analytics",
        "code": "CC312",
        "credits": 5,
        "type": "Theory",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Mini Project II (Lab)",
        "code": "CC313",
        "credits": 3,
        "type": "Practical",
        "category": "Laboratory",
        "department": "MCA"
      },
      {
        "subjectName": "Digital Marketing and E-Commerce",
        "code": "MDC302",
        "credits": 5,
        "type": "Theory",
        "category": "Multidisciplinary Course",
        "department": "MCA"
      },
      {
        "subjectName": "Human Values & Professional Ethics and Gender Sensitization",
        "code": "MAEC302",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Ability Enhancement Course",
        "department": "MCA"
      },
      {
        "subjectName": "Industrial Visit and Technical Report Writing",
        "code": "SEC303",
        "credits": 3,
        "type": "Theory + Practical",
        "category": "Skill Enhancement Course",
        "department": "MCA"
      }
    ]
  },
  {
    "semester": 2,
    "title": "Semester II - Subject Management",
    "subjects": [
      {
        "subjectName": "Web Technology using .NET",
        "code": "CC206",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Data & Web Mining",
        "code": "CC207",
        "credits": 5,
        "type": "Theory",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Artificial Intelligence and Machine Learning",
        "code": "CC208",
        "credits": 5,
        "type": "Theory + Practical",
        "category": "Core",
        "department": "MCA"
      },
      {
        "subjectName": "Mini Project I (Lab)",
        "code": "CC209",
        "credits": 3,
        "type": "Practical",
        "category": "Laboratory",
        "department": "MCA"
      },
      {
        "subjectName": "Optimization Techniques",
        "code": "MDC201",
        "credits": 5,
        "type": "Theory",
        "category": "Multidisciplinary Course",
        "department": "MCA"
      },
      {
        "subjectName": "Elective-1",
        "code": "DSE201",
        "credits": 5,
        "type": "Theory",
        "category": "Discipline Specific Elective",
        "department": "MCA"
      },
      {
        "subjectName": "Statistical Analysis using R",
        "code": "SEC202",
        "credits": 3,
        "type": "Theory + Practical",
        "category": "Skill Enhancement Course",
        "department": "MCA"
      }
    ]
  },
  {
    "semester": 4,
    "title": "Semester IV - Subject Management",
    "subjects": [
      {
        "subjectName": "MOOCs",
        "code": "DSE402",
        "credits": 5,
        "type": "Theory",
        "category": "Discipline Specific Elective",
        "department": "MCA"
      },
      {
        "subjectName": "OJT and Project Dissertation",
        "code": "CC414",
        "credits": 22,
        "type": "Practical",
        "category": "Project",
        "department": "MCA"
      },
      {
        "subjectName": "Industrial Training and Internship",
        "code": "SEC404",
        "credits": 3,
        "type": "Practical",
        "category": "Internship",
        "department": "MCA"
      }
    ]
  }
];

async function main() {
  const programme = await prisma.programme.findFirst();
  if (!programme) {
    console.log("No programme found to attach subjects to.");
    return;
  }

  const mapToRoman: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V', 6: 'VI' };

  for (const semData of data) {
    const semNum = semData.semester;
    const finalSem = mapToRoman[semNum] || String(semNum);

    for (const sub of semData.subjects) {
      await prisma.subject.upsert({
        where: { code: sub.code },
        update: {
          name: sub.subjectName,
          credits: sub.credits,
          isPractical: sub.type.toLowerCase().includes('practical'),
          type: sub.type,
          semester: finalSem,
        },
        create: {
          code: sub.code,
          name: sub.subjectName,
          credits: sub.credits,
          isPractical: sub.type.toLowerCase().includes('practical'),
          type: sub.type,
          semester: finalSem,
          programmeId: programme.id,
        },
      });
      console.log(`Upserted ${sub.code} - ${sub.subjectName} as ${sub.type}`);
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
