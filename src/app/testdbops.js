const { insertIntoTable, updateTable, deleteFromTable, selectFromTable } = require('./dbos');

const testDbOperations = async () => {
  try {
    // 1. Insert a user into gkc_qz_tbl_users
    const userData = {
      email: 'testuser@example.com',
      phone_number: '1234567890',
      password_hash: 'hashedpassword123',
    };
    const insertedUser = await insertIntoTable('gkc_qz_tbl_users', userData);
    console.log('Inserted User:', insertedUser);

    // 2. Insert a quiz for the inserted user
    const quizData = {
      user_id: insertedUser.user_id,
      quiz_name: 'Sample Quiz',
      status: 'draft',
    };
    const insertedQuiz = await insertIntoTable('gkc_qz_tbl_quizzes', quizData);
    console.log('Inserted Quiz:', insertedQuiz);

    // 3. Insert a question for the inserted quiz
    const questionData = {
      quiz_id: insertedQuiz.quiz_id,
      question_text: 'What is the capital of France?',
    };
    const insertedQuestion = await insertIntoTable('gkc_qz_tbl_questions', questionData);
    console.log('Inserted Question:', insertedQuestion);

    // 4. Insert options for the question
    const optionData1 = {
      question_id: insertedQuestion.question_id,
      option_text: 'Paris',
      is_correct: true,
    };
    const optionData2 = {
      question_id: insertedQuestion.question_id,
      option_text: 'London',
      is_correct: false,
    };
    const insertedOption1 = await insertIntoTable('gkc_qz_tbl_options', optionData1);
    const insertedOption2 = await insertIntoTable('gkc_qz_tbl_options', optionData2);
    console.log('Inserted Options:', insertedOption1, insertedOption2);

    // 5. Select all users to verify data insertion
    const selectedUsers = await selectFromTable('gkc_qz_tbl_users');
    console.log('Selected Users:', selectedUsers);

    // 6. Update the quiz status to 'submitted'
    const updateQuizData = { status: 'submitted' };
    const updateCondition = { quiz_id: insertedQuiz.quiz_id };
    const updatedQuiz = await updateTable('gkc_qz_tbl_quizzes', updateQuizData, updateCondition);
    console.log('Updated Quiz:', updatedQuiz);

    // 7. Delete the question (to test deletion)
    const deleteCondition = { question_id: insertedQuestion.question_id };
    const deleteResult = await deleteFromTable('gkc_qz_tbl_questions', deleteCondition);
    console.log('Deleted Question:', deleteResult);

  } catch (err) {
    console.error('Error in database operations test:', err);
  }
};

// Run the test
testDbOperations();