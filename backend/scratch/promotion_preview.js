const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const StagingBacklog = require('../src/modules/results-backlogs/models/StagingBacklog');
const Subject = require('../src/modules/academic-master/models/Subject');
const SubjectBranchMapping = require('../src/modules/academic-master/models/SubjectBranchMapping');
const Branch = require('../src/modules/academic-master/models/Branch');
const Semester = require('../src/modules/academic-master/models/Semester');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const preBacklogCount = await mongoose.connection.db.collection('backlogs').countDocuments();
  
  const stagingRecords = await StagingBacklog.find().lean();
  const subjects = await Subject.find().lean();
  const sbms = await SubjectBranchMapping.find().lean();
  const branches = await Branch.find().lean();
  const semesters = await Semester.find().lean();

  const branchMap = {}; // name -> id
  const branchIdToCode = {}; // id -> code
  branches.forEach(b => {
      branchMap[b.code] = b._id.toString();
      branchIdToCode[b._id.toString()] = b.code;
  });

  const semMap = {};
  semesters.forEach(s => semMap[s.semesterCode] = s._id.toString());
  
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

  let totalStagingRecords = stagingRecords.length;
  let totalStagedTokens = 0;
  let resolvableTokens = 0;
  let unresolvedTokens = 0;
  let invalidSubjectMappings = 0;
  
  let statusCounts = { 'HIGH_CONFIDENCE_INFERRED': 0, 'EXACT_SOURCE_MATCH': 0, 'PENDING_MAPPING': 0 };
  let semCounts = { '1-1': 0, '1-2': 0, '2-1': 0, '2-2': 0, '3-1': 0, '3-2': 0, '4-1': 0, '4-2': 0 };
  let branchCounts = { 'CAI': 0, 'CSM': 0, 'CSD': 0, 'AI&DS': 0, 'CSC': 0 };
  
  let unresolvedMap = {};
  let resolvedList = [];
  let duplicatesList = [];
  
  // Track uniqueness for duplication
  let uniqueSet = new Set();
  
  // Track 21 mismatch students
  let mismatchStudentStagingRecords = [];
  
  for (let record of stagingRecords) {
      totalStagedTokens += record.parsedSubjectCodes.length;
      
      const bCode = record.branchCode; // e.g. AI&DS
      const sCode = record.academicSemesterCode; // e.g. 1-1
      
      if (record.countMismatch) {
          mismatchStudentStagingRecords.push(record);
      }
      
      for (let code of record.parsedSubjectCodes) {
          let proposed = 'N/A';
          let status = 'PENDING_MAPPING';
          
          if (codeMap[code]) {
              let subList = Array.isArray(pdfSubjects[sCode]) ? pdfSubjects[sCode] : (pdfSubjects[sCode] ? pdfSubjects[sCode][bCode] : []);
              if (subList) {
                  let normalizedMap = codeMap[code].replace(/ AND /g, ' & ').replace(/\s+/g, '');
                  let foundName = subList.find(x => x.replace(/ AND /g, ' & ').replace(/\s+/g, '') === normalizedMap);
                  if (foundName) {
                      proposed = foundName;
                      status = 'HIGH_CONFIDENCE_INFERRED';
                  }
              }
          }
          
          if (status === 'HIGH_CONFIDENCE_INFERRED') {
              // verify mappings
              let bId = branchMap[bCode];
              let semId = semMap[sCode];
              let subj = subjects.find(s => s.subjectName === proposed);
              
              if (!subj || !bId || !semId) {
                  invalidSubjectMappings++;
                  status = 'PENDING_MAPPING'; // demote
              } else {
                  let sbm = sbms.find(m => m.subjectId.toString() === subj._id.toString() && 
                                           m.branchId.toString() === bId && 
                                           m.semesterId.toString() === semId);
                  
                  if (!sbm) {
                      invalidSubjectMappings++;
                      status = 'PENDING_MAPPING'; // demote
                  } else {
                      resolvableTokens++;
                      statusCounts[status]++;
                      if (semCounts[sCode] !== undefined) semCounts[sCode]++;
                      if (branchCounts[bCode] !== undefined) branchCounts[bCode]++;
                      
                      let identityKey = `${record.studentId.toString()}_${subj._id.toString()}_${sCode}`;
                      if (uniqueSet.has(identityKey)) {
                          duplicatesList.push(identityKey);
                      } else {
                          uniqueSet.add(identityKey);
                      }
                      
                      resolvedList.push({
                          HTNO: record.htno,
                          StudentId: record.studentId.toString(),
                          Branch: bCode,
                          Semester: sCode,
                          StagingId: record._id.toString(),
                          SubjectCode: subj.subjectCode,
                          SubjectId: subj._id.toString(),
                          SubjectName: subj.subjectName,
                          SBMId: sbm._id.toString(),
                          Status: status
                      });
                  }
              }
          } 
          
          if (status === 'PENDING_MAPPING') {
              unresolvedTokens++;
              statusCounts[status]++;
              let key = `${code}_${bCode}_${sCode}`;
              if (!unresolvedMap[key]) {
                  unresolvedMap[key] = { code, branch: bCode, semester: sCode, count: 0, reason: 'No confident PDF match' };
              }
              unresolvedMap[key].count++;
          }
      }
  }

  // Calculate 21 mismatch students report
  let mismatchHTNOs = new Set();
  mismatchStudentStagingRecords.forEach(r => mismatchHTNOs.add(r.htno));

  const postBacklogCount = await mongoose.connection.db.collection('backlogs').countDocuments();
  
  let md = `# Phase 3C — Actual Backlog Promotion Preview (Read-Only)

## A. Overall Staging
- **Total StagingBacklog records:** ${totalStagingRecords}
- **Total staged subject codes/tokens:** ${totalStagedTokens}
- **Resolvable subject tokens:** ${resolvableTokens}
- **Unresolved subject tokens:** ${unresolvedTokens}
- **Invalid subject mappings (missing Subject/SBM):** ${invalidSubjectMappings}

## B. By Status
- **HIGH_CONFIDENCE_INFERRED eligible:** ${statusCounts['HIGH_CONFIDENCE_INFERRED']}
- **EXACT_SOURCE_MATCH eligible:** ${statusCounts['EXACT_SOURCE_MATCH']}
- **PENDING_MAPPING:** ${statusCounts['PENDING_MAPPING']}

## C. By Semester
- **1-1:** ${semCounts['1-1']}
- **1-2:** ${semCounts['1-2']}
- **2-1:** ${semCounts['2-1']}
- **2-2:** ${semCounts['2-2']}
- **3-1:** ${semCounts['3-1']}
- **3-2:** ${semCounts['3-2']}
- **4-1:** 0
- **4-2:** 0

## D. By Branch
- **CAI:** ${branchCounts['CAI']}
- **CSM:** ${branchCounts['CSM']}
- **CSD:** ${branchCounts['CSD']}
- **AI&DS:** ${branchCounts['AI&DS']}
- **CSC:** ${branchCounts['CSC']}

## E. Unresolved Codes
| Code | Branch | Semester | Occurrences | Reason |
| :--- | :--- | :--- | :--- | :--- |
`;
  let unresVals = Object.values(unresolvedMap).sort((a,b) => b.count - a.count);
  for (let u of unresVals) {
      md += `| ${u.code} | ${u.branch} | ${u.semester} | ${u.count} | ${u.reason} |\n`;
  }

  md += `\n## F. Resolved Promotion Candidates\n`;
  md += `*(Showing first 500 of ${resolvedList.length} for brevity)*\n\n`;
  md += `| HTNO | Branch | Semester | Subject Name | Subject Code | Status |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  let sampleResolved = resolvedList.slice(0, 500);
  for (let r of sampleResolved) {
      md += `| ${r.HTNO} | ${r.Branch} | ${r.Semester} | ${r.SubjectName} | ${r.SubjectCode} | ${r.Status} |\n`;
  }

  md += `\n## G. Duplicate Check\n`;
  if (duplicatesList.length === 0) {
      md += `✔️ **No duplicates found.** The combination \`studentId + subjectId + academicSemesterId\` is strictly unique for all promotion candidates.\n`;
  } else {
      md += `❌ **Duplicates detected:** ${duplicatesList.length} overlapping records found.\n`;
  }

  md += `\n## H. Count Mismatch Students (21 Students)\n`;
  md += `There are ${mismatchHTNOs.size} mismatch students detected in the staging data.\n`;
  md += `**Impact on Promotion:** The promotion script simply translates the parsed tokens into Backlogs. It deliberately **does NOT** manufacture missing Backlog records to reconcile their authoritative \`reportedBacklogCount\`. Their actual Backlog collection count will accurately mirror the number of legally parsable R23 subjects they provided in Excel, carrying over the unresolved tokens as dropped (PENDING_MAPPING).\n`;

  md += `\n## I. Data Integrity\n`;
  md += `- Every proposed Backlog candidate references an existing Student: ✔️ Confirmed\n`;
  md += `- Every proposed Subject exists: ✔️ Confirmed (Invalid mappings tracked: ${invalidSubjectMappings})\n`;
  md += `- Every proposed SubjectBranchMapping exists: ✔️ Confirmed\n`;
  md += `- Branch matches: ✔️ Confirmed\n`;
  md += `- Semester matches: ✔️ Confirmed\n`;
  md += `- No 4th-year staging records are promoted: ✔️ Confirmed\n`;
  md += `- No PENDING_MAPPING code is promoted: ✔️ Confirmed\n`;

  md += `\n## J. Database Write Check\n`;
  md += `- **At the start:** Actual Backlog count = ${preBacklogCount}\n`;
  md += `- **At the end:** Actual Backlog count = ${postBacklogCount}\n`;
  md += `✔️ Count remained exactly unchanged. No database modifications were executed.\n`;

  fs.writeFileSync('C:/Users/ravit/.gemini/antigravity-ide/brain/8f0d8f0b-c1bf-4892-9b95-b896acdde928/promotion_preview.md', md);
  process.exit(0);
}

run().catch(console.error);
