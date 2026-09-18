const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const Student = require('../src/modules/academic-master/models/Student');
const StagingBacklog = require('../src/modules/results-backlogs/models/StagingBacklog');
const Subject = require('../src/modules/academic-master/models/Subject');
const SubjectBranchMapping = require('../src/modules/academic-master/models/SubjectBranchMapping');
const Backlog = require('../src/modules/results-backlogs/models/Backlog');

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const stuCount = await Student.countDocuments();
  const stagingCount = await StagingBacklog.countDocuments();
  const subCount = await Subject.countDocuments();
  const sbmCount = await SubjectBranchMapping.countDocuments();
  const backlogCount = await Backlog.countDocuments();

  console.log('--- Phase 3 Collections Verification ---');
  console.log(`Student count: ${stuCount}`);
  console.log(`StagingBacklog count: ${stagingCount}`);
  console.log(`Subject count: ${subCount}`);
  console.log(`SubjectBranchMapping count: ${sbmCount}`);
  console.log(`Backlog count: ${backlogCount}`);

  // Confirm expectations
  const expectedStu = 2117;
  const expectedStaging = 3250;
  const expectedSub = 48;
  const expectedSbm = 155;
  const expectedBacklog = 6741;

  if (stuCount === expectedStu && stagingCount === expectedStaging && subCount === expectedSub && sbmCount === expectedSbm && backlogCount === expectedBacklog) {
    console.log('\n✔️ SUCCESS: Phase 3 collections are completely unchanged.');
  } else {
    console.log('\n❌ ERROR: Phase 3 collections were modified!');
    process.exit(1);
  }

  process.exit(0);
}

run();
