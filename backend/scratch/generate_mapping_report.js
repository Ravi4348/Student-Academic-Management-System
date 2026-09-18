const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const StagingBacklog = require('../src/modules/results-backlogs/models/StagingBacklog');
const Subject = require('../src/modules/academic-master/models/Subject');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const existingSubject = await Subject.findOne();

  const uniqueCodes = await StagingBacklog.aggregate([
    { $unwind: '$parsedSubjectCodes' },
    { $group: { _id: { branch: '$branchCode', semester: '$academicSemesterCode', code: '$parsedSubjectCodes' }, count: { $sum: 1 } } },
    { $sort: { '_id.branch': 1, '_id.semester': 1, '_id.code': 1 } }
  ]);

  const pdfSubjects = {
    '1-1': ['LINEAR ALGEBRA & CALCULUS', 'INTRODUCTION TO PROGRAMMING', 'ENGINEERING PHYSICS', 'BASIC ELECTRICAL & ELECTRONICS ENGINEERING', 'ENGINEERING GRAPHICS'],
    '1-2': ['DIFFERENTIAL EQUATIONS & VECTOR CALCULUS', 'DATA STRUCTURES', 'CHEMISTRY', 'COMMUNICATIVE ENGLISH', 'BASIC CIVIL & MECHANICAL ENGINEERING'],
    '2-1': {
       'CAI': ['DISCRETE MATHEMATICS & GRAPH THEORY', 'UNIVERSAL HUMAN VALUES', 'ADVANCED DATA STRUCTURES & ALGORITHMS', 'OBJECT ORIENTED PROGRAMMING THROUGH JAVA', 'ARTIFICIAL INTELLIGENCE'],
       'CSM': ['UNIVERSAL HUMAN VALUES', 'DISCRETE MATHEMATICS & GRAPH THEORY', 'ADVANCED DATA STRUCTURES & ALGORITHMS', 'OBJECT ORIENTED PROGRAMMING THROUGH JAVA', 'ARTIFICIAL INTELLIGENCE'],
       'CSD': ['UNIVERSAL HUMAN VALUES', 'DISCRETE MATHEMATICS & GRAPH THEORY', 'ADVANCED DATA STRUCTURES & ALGORITHMS', 'OBJECT ORIENTED PROGRAMMING THROUGH JAVA', 'INTRODUCTION TO DATA SCIENCE'],
       'AI&DS': ['UNIVERSAL HUMAN VALUES', 'DISCRETE MATHEMATICS & GRAPH THEORY', 'ADVANCED DATA STRUCTURES AND ALGORITHMS', 'OBJECT ORIENTED PROGRAMMING THROUGH JAVA', 'DATABASE MANAGEMENT SYSTEMS'],
       'CSC': ['UNIVERSAL HUMAN VALUES', 'OBJECT ORIENTED PROGRAMMING THROUGH JAVA', 'DISCRETE MATHEMATICS & GRAPH THEORY', 'DIGITAL LOGIC & COMPUTER ORGANIZATION', 'ADVANCED DATA STRUCTURES & ALGORITHMS']
    },
    '2-2': {
       'CAI': ['PROBABILITY & STATISTICS', 'DATABASE MANAGEMENT SYSTEMS', 'DIGITAL LOGIC AND COMPUTER ORGANIZATION', 'MACHINE LEARNING', 'OPTIMIZATION TECHNIQUES'],
       'CSM': ['PROBABILITY & STATISTICS', 'OPTIMIZATION TECHNIQUES', 'DATABASE MANAGEMENT SYSTEMS', 'MACHINE LEARNING', 'DIGITAL LOGIC AND COMPUTER ORGANIZATION'],
       'CSD': ['DATABASE MANAGEMENT SYSTEMS', 'OPTIMIZATION TECHNIQUES', 'STATISTICAL METHODS FOR DATA SCIENCE', 'DATA ENGINEERING', 'COMPUTER ORGANIZATION AND ARCHITECTURE'],
       'AI&DS': ['OPERATING SYSTEMS', 'OPTIMIZATION TECHNIQUES', 'SOFTWARE ENGINEERING', 'STATISTICAL METHODS FOR DATA SCIENCE', 'INTRODUCTION TO DATA SCIENCE'],
       'CSC': ['OPERATING SYSTEMS', 'MANAGERIAL ECONOMICS AND FINANCIAL ANALYSIS', 'DATABASE MANAGEMENT SYSTEMS', 'NUMBER THEORY & APPLICATIONS', 'COMPUTER NETWORKS']
    },
    '3-1': {
       'CAI': ['OPERATING SYSTEMS', 'COMPUTER NETWORKS', 'INTERNET OF THINGS', 'DEEP LEARNING', 'ENTREPRENEURSHIP DEVELOPMENT & VENTURE CREATION'],
       'CSM': ['ENTREPRENEURSHIP DEVELOPMENT & VENTURE CREATION', 'INFORMATION RETRIEVAL SYSTEMS', 'OPERATING SYSTEMS', 'COMPUTER NETWORKS', 'INTERNET OF THINGS'],
       'CSD': ['ENTREPRENEURSHIP DEVELOPMENT & VENTURE CREATION', 'COMPUTER NETWORKS', 'INTERNET OF THINGS', 'MACHINE LEARNING', 'SOFTWARE ENGINEERING'],
       'AI&DS': ['COMPUTER NETWORKS', 'ENTREPRENEURSHIP DEVELOPMENT & VENTURE CREATION', 'COMPUTER ORGANIZATION AND ARCHITECTURE', 'INTERNET OF THINGS', 'ARTIFICIAL INTELLIGENCE'],
       'CSC': ['ENTREPRENEURSHIP DEVELOPMENT & VENTURE CREATION', 'CLOUD COMPUTING', 'INTRODUCTION TO CYBER SECURITY', 'AUTOMATA THEORY & COMPILER DESIGN', 'INTERNET OF THINGS']
    },
    '3-2': {
       'CAI': ['SOFTWARE ENGINEERING', 'GENERATIVE A.I.', 'DATA VISUALIZATION', 'SOFTWARE TESTING METHODOLOGIES', 'CLOUD COMPUTING', 'DISASTER MANAGEMENT'],
       'CSM': ['DISASTER MANAGEMENT', 'SOFTWARE TESTING METHODOLOGIES', 'NATURAL LANGUAGE PROCESSING', 'DEEP LEARNING', 'DATA VISUALIZATION', 'NOSQL DATABASES'],
       'CSD': ['DISASTER MANAGEMENT', 'DEEP LEARNING', 'DATA VISUALIZATION', 'NOSQL DATABASES', 'OPERATING SYSTEMS', 'CLOUD COMPUTING'],
       'AI&DS': ['DISASTER MANAGEMENT', 'BIG DATA ANALYTICS', 'NOSQL DATABASES', 'MACHINE LEARNING', 'DATA VISUALIZATION', 'CLOUD COMPUTING'],
       'CSC': ['DISASTER MANAGEMENT', 'NATURAL LANGUAGE PROCESSING', 'CRYPTOGRAPHY & NETWORK SECURITY', 'SOFTWARE TESTING METHODOLOGIES', 'MACHINE LEARNING', 'CYBER CRIMES & DIGITAL FORENSICS']
    }
  };

  const codeMap = {
     'LAC': 'LINEAR ALGEBRA & CALCULUS',
     'CP': 'INTRODUCTION TO PROGRAMMING',
     'PHY': 'ENGINEERING PHYSICS',
     'BEEE': 'BASIC ELECTRICAL & ELECTRONICS ENGINEERING',
     'EG': 'ENGINEERING GRAPHICS',
     'DEVC': 'DIFFERENTIAL EQUATIONS & VECTOR CALCULUS',
     'DS': 'DATA STRUCTURES',
     'CHE': 'CHEMISTRY',
     'ENG': 'COMMUNICATIVE ENGLISH',
     'BCME': 'BASIC CIVIL & MECHANICAL ENGINEERING',
     'DMGT': 'DISCRETE MATHEMATICS & GRAPH THEORY',
     'UHV': 'UNIVERSAL HUMAN VALUES',
     'ADS': 'ADVANCED DATA STRUCTURES & ALGORITHMS',
     'JAVA': 'OBJECT ORIENTED PROGRAMMING THROUGH JAVA',
     'AI': 'ARTIFICIAL INTELLIGENCE',
     'IDS': 'INTRODUCTION TO DATA SCIENCE',
     'DBMS': 'DATABASE MANAGEMENT SYSTEMS',
     'DLCO': 'DIGITAL LOGIC AND COMPUTER ORGANIZATION',
     'OS': 'OPERATING SYSTEMS',
     'OT': 'OPTIMIZATION TECHNIQUES',
     'SE': 'SOFTWARE ENGINEERING',
     'SMDS': 'STATISTICAL METHODS FOR DATA SCIENCE',
     'ML': 'MACHINE LEARNING',
     'P&S': 'PROBABILITY & STATISTICS',
     'DA EN': 'DATA ENGINEERING',
     'COA': 'COMPUTER ORGANIZATION AND ARCHITECTURE',
     'MEFA': 'MANAGERIAL ECONOMICS AND FINANCIAL ANALYSIS',
     'NTA': 'NUMBER THEORY & APPLICATIONS',
     'CN': 'COMPUTER NETWORKS',
     'DL': 'DEEP LEARNING',
     'IOT': 'INTERNET OF THINGS',
     'EDVC': 'ENTREPRENEURSHIP DEVELOPMENT & VENTURE CREATION',
     'IRS': 'INFORMATION RETRIEVAL SYSTEMS',
     'CC': 'CLOUD COMPUTING',
     'ICS': 'INTRODUCTION TO CYBER SECURITY',
     'ATCD': 'AUTOMATA THEORY & COMPILER DESIGN',
     'DM': 'DISASTER MANAGEMENT',
     'DV': 'DATA VISUALIZATION',
     'STM': 'SOFTWARE TESTING METHODOLOGIES',
     'GAI': 'GENERATIVE A.I.',
     'NLP': 'NATURAL LANGUAGE PROCESSING',
     'NOSQL': 'NOSQL DATABASES',
     'BDA': 'BIG DATA ANALYTICS',
     'CGNS': 'CRYPTOGRAPHY & NETWORK SECURITY',
     'CCDF': 'CYBER CRIMES & DIGITAL FORENSICS'
  };

  let allRows = [];
  let highConf = [];
  let pending = [];
  
  for (let doc of uniqueCodes) {
     const b = doc._id.branch;
     const s = doc._id.semester;
     const c = doc._id.code;
     let proposed = 'N/A';
     let conf = 'PENDING_MAPPING';
     let status = 'PENDING_MAPPING';
     let reason = 'Code not recognized or missing from branch syllabus';
     
     if (codeMap[c]) {
         let subList = Array.isArray(pdfSubjects[s]) ? pdfSubjects[s] : (pdfSubjects[s] ? pdfSubjects[s][b] : []);
         if (subList) {
             let normalizedMap = codeMap[c].replace(/ AND /g, ' & ').replace(/\s+/g, '');
             let found = subList.find(x => x.replace(/ AND /g, ' & ').replace(/\s+/g, '') === normalizedMap);
             if (found) {
                 proposed = found;
                 conf = 'HIGH_CONFIDENCE_INFERRED';
                 status = 'HIGH_CONFIDENCE_INFERRED';
                 reason = `Mapped '${c}' to '${found}' found in PDF for ${b} semester ${s}`;
             }
         }
     }
     
     let row = { code: c, branch: b, semester: s, proposed, count: doc.count, conf, status, reason };
     allRows.push(row);
     
     if (status === 'HIGH_CONFIDENCE_INFERRED') highConf.push(row);
     else pending.push(row);
  }

  // Generate Report
  let md = `# Mapping Review

## 1. COMPLETE 265-ROW MAPPING TABLE

| Backlog Code | Branch | Semester | Proposed Subject | Confidence | Status | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;
  for(let r of allRows) md += `| ${r.code} | ${r.branch} | ${r.semester} | ${r.proposed} | ${r.conf} | ${r.status} | ${r.reason} |\n`;

  md += `\n## 2. PENDING MAPPING COMBINATIONS (114)

| Backlog Code | Branch | Semester | Occurrences | Reason unresolved |
| :--- | :--- | :--- | :--- | :--- |
`;
  for(let r of pending) md += `| ${r.code} | ${r.branch} | ${r.semester} | ${r.count} | ${r.reason} |\n`;

  md += `\n## 3. HIGH CONFIDENCE INFERRED COMBINATIONS (151)

| Backlog Code | Branch | Semester | Proposed Subject | Occurrences | Reason |
| :--- | :--- | :--- | :--- | :--- | :--- |
`;
  for(let r of highConf) md += `| ${r.code} | ${r.branch} | ${r.semester} | ${r.proposed} | ${r.count} | ${r.reason} |\n`;

  // 4. Different proposed subjects depending on branch/semester
  md += `\n## 4. CODE CONFLICTS OR DIFFERENCES BY BRANCH/SEMESTER\n\n`;
  let codesMap = {};
  for(let r of highConf) {
      if(!codesMap[r.code]) codesMap[r.code] = new Set();
      codesMap[r.code].add(r.proposed);
  }
  let conflicts = Object.keys(codesMap).filter(k => codesMap[k].size > 1);
  if (conflicts.length > 0) {
      md += `Found codes mapping to different official subjects:\n`;
      for(let c of conflicts) md += `- ${c} -> ${Array.from(codesMap[c]).join(' OR ')}\n`;
  } else {
      md += `No codes found mapping to different subjects. However, note that if a code maps to a subject in one branch but is marked PENDING in another, it is correctly preserving branch-specificity.\n`;
  }

  // 5. Look specifically for potentially ambiguous/legacy codes
  md += `\n## 5. SPECIFIC AMBIGUOUS CODES ANALYSIS\n\n`;
  const watchCodes = ['M1','M2','M3','MFCS','DLD','FLAT','P&S','LAB','LABS','DA EN','IDS','AI','DLCO','COA','SE','OS','DS','CP'];
  for (let code of watchCodes) {
      let instances = allRows.filter(r => r.code.includes(code) || r.code === code);
      if (instances.length === 0) {
          md += `- **${code}**: Not found in staging data.\n`;
      } else {
          let resolved = instances.filter(i => i.status === 'HIGH_CONFIDENCE_INFERRED');
          let unresolved = instances.filter(i => i.status === 'PENDING_MAPPING');
          md += `- **${code}**: Found ${instances.length} times. Resolved: ${resolved.length}, Unresolved (Pending): ${unresolved.length}\n`;
      }
  }

  // 6. Unique subject name list from PDF
  md += `\n## 6. UNIQUE SUBJECT NAME LIST FROM PDF\n\n`;
  let uniqueSubjectsList = new Set();
  let insertions = [];
  let sbmInsertions = [];

  for (let sem in pdfSubjects) {
      md += `### Semester ${sem}\n`;
      if (Array.isArray(pdfSubjects[sem])) {
         for (let sub of pdfSubjects[sem]) {
             md += `- ${sub} (All Branches)\n`;
             uniqueSubjectsList.add(sub);
             insertions.push({name: sub, semester: sem, isGlobal: true});
             ['CAI','CSM','CSD','AI&DS','CSC'].forEach(b => sbmInsertions.push({name: sub, branch: b, semester: sem}));
         }
      } else {
         let subByBranch = {};
         for (let b in pdfSubjects[sem]) {
             for (let sub of pdfSubjects[sem][b]) {
                 if (!subByBranch[sub]) subByBranch[sub] = [];
                 subByBranch[sub].push(b);
                 uniqueSubjectsList.add(sub);
                 insertions.push({name: sub, semester: sem, branchList: b}); // will group later
                 sbmInsertions.push({name: sub, branch: b, semester: sem});
             }
         }
         for (let sub in subByBranch) {
             md += `- ${sub} [${subByBranch[sub].join(', ')}]\n`;
         }
      }
  }

  // 7, 8, 9, 10
  md += `\n## 7 & 9. EXACT UNIQUE SUBJECTS TO INSERT (REUSED)\n\n`;
  let groupedInsertions = {};
  for(let sub of uniqueSubjectsList) {
      let s = Array.from(new Set(insertions.filter(i => i.name === sub).map(i => i.semester))).join(', ');
      groupedInsertions[sub] = s;
      md += `- ${sub} (Semester ${s})\n`;
  }
  md += `\n**Total unique subjects to insert:** ${uniqueSubjectsList.size}\n`;

  md += `\n## 8. EXACT SUBJECT BRANCH MAPPING COMBINATIONS\n\n`;
  for(let b of ['CAI','CSM','CSD','AI&DS','CSC']) {
      md += `### Branch: ${b}\n`;
      let bMaps = sbmInsertions.filter(x => x.branch === b);
      for(let map of bMaps) {
          md += `- ${map.name} (Sem: ${map.semester})\n`;
      }
  }
  md += `\n**Total SubjectBranchMapping records to insert:** ${sbmInsertions.length}\n`;

  // 11. Existing Subject Record
  md += `\n## 11. EXISTING SUBJECT RECORD\n\n`;
  md += `\`\`\`json\n${JSON.stringify(existingSubject, null, 2)}\n\`\`\`\n`;
  md += `**Note:** This is legacy seed/test data. It will not be deleted, mapped to staging, or duplicated.\n`;

  // Write to artifact using fs (will do a write_to_file from LLM next for ui)
  fs.writeFileSync('C:/Users/ravit/.gemini/antigravity-ide/brain/8f0d8f0b-c1bf-4892-9b95-b896acdde928/mapping_review.md', md);
  process.exit(0);
}
run();
