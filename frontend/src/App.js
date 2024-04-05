import './App.css';
import './Style/StyleProperty.css'
import './Style/Style.css'
import './Style/Loading.css';
import './Style/Home.css'
import React, { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import AppContact from './Components/Contact';
import AppHeader from './Components/Header';
import AppHome from './Components/Home';
import AppProfile from './Components/Profile';
import AppSingIn from './Components/SingIn';
import AppSingUp from './Components/SingUp';

import AppToolsDropZone from './Components/Tools/ToolsDropZone';
import AppToolsImg from './Components/Tools/ToolsImg';
import AppToolsSweetAlert from './Components/Tools/ToolsSweetAlert';

import AppSubject from './Components/Subject/Subject';
import AppCreateSubject from './Components/Subject/CreateSubject';
import AppUpdateSubject from './Components/Subject/UpdateSubject';
import AppSubjectNo from './Components/Subject/SubjectNo';
import AppCreateExam from './Components/Subject/CreateExam';
import AppUpdateExam from './Components/Subject/UpdateExam';
import AppExam from './Components/Subject/Exam';
import AppUploadStudent from './Components/Subject/UploadStudent';
import AppQuestionnaire from './Components/Questionnaire/Questionnaire';
import AppCreateQuestionnaire from './Components/Questionnaire/CreateQuestionnaire';
import AppCreateAnswerSheet from './Components/Subject/CreateAnswerSheet';
import AppExamAnswer from './Components/Subject/ExamAnswer';
import AppCreateExamAnswer from './Components/Subject/CreateExamAnswer';
import AppCheckAnswerSheet from './Components/Subject/CheckAnswerSheet';
import AppUploadAnswerSheet from './Components/Subject/UploadAnswerSheet';
import AppUpdateExamAnswer from './Components/Subject/UpdateExamAnswer';
import AppScoreResults from './Components/Subject/ScoreResults';
import AppUploadQuestionnaire from './Components/Questionnaire/UploadQuestionnaire';
import AppUpdateQuetionaire from './Components/Questionnaire/UpdateQuetionaire';
import AppQuestionnaireNo from './Components/Questionnaire/QuestionnaireNo';
import AppShowQuestionaire from './Components/Questionnaire/ShowQuestionaire';
import AppSetDateTimeQuesionnaire from './Components/Questionnaire/SetDateTimeQuesionnaire';
import AppOnlineQuestionnaire from './Components/Questionnaire/OnlineQuestionnaire';
import Appverify from './Components/verify';
import AppAnalyzeResults from './Components/Subject/AnalyzeResults';
import AppCheckQuestionaire from './Components/Questionnaire/CheckQuestionaire';
import AppAnalyzeResultsQue from './Components/Questionnaire/AnalyzeResultsQue';
import AppType from './Components/Admin/Type';
import AppCreateType from './Components/Admin/CreateType';
import AppUpdateType from './Components/Admin/UpdateType';
import AppRequest from './Components/Admin/Request';
import AppRespond from './Components/Admin/Respond';
import AppUpdateRequest from './Components/Admin/UpdateRequest';
import AppUser from './Components/Admin/User';
import AppAdminSubject from './Components/Admin/AdminSubject';
import AppAdminSubjectNo from './Components/Admin/AdminSubjectNo';
import AppAdminUpdateExam from './Components/Admin/AdminUpdateExam';
import AppCreateUser from './Components/Admin/CreateUser';
import AppAdminQuestionnaire from './Components/Admin/AdminQuestionnaire';
import AppAdminUpdateQuestionnaire from './Components/Admin/AdminUpdateQuestionnaire';
import AppUpdateUser from './Components/Admin/UpdateUser';
import AppShowScores from './Components/ShowScores';
import AppScores from './Components/Scores';
import AppAdminExam from './Components/Admin/AdminExam';
import AppAdminQuestionnaireNo from './Components/Admin/AdminQuestionnaireno';
import AppUsermanual from './Components/Usermanual';


function App() {

  useEffect(() => {
    document.title = "MCQAS"; // Set the document title
  }, []);

  return (
      <Router>
      <Routes>
        <Route path='/ToolsDropZone' element={<AppToolsDropZone />}></Route>
        <Route path='/ToolsImg' element={<AppToolsImg />}></Route>
        <Route path='/ToolsSweetAlert' element={<AppToolsSweetAlert />}></Route>

        
        <Route path='/verify/:id' element={<Appverify />}></Route>
        <Route path='/SingIn' element={<AppSingIn />}></Route>
        <Route path='/SingUp' element={<AppSingUp />}></Route>
        <Route path='/OnlineQuestionnaire/:id' element={<AppOnlineQuestionnaire />}></Route>
        <Route path='*' element={<AppHeader />}></Route>
      </Routes>
      <Routes>
        <Route path='/' element={<AppHome />}></Route>
        <Route path='/Home' element={<AppHome />}></Route>

        <Route path='/Subject' element={<AppSubject />}></Route>
        <Route path='/CreateSubject' element={<AppCreateSubject />}></Route>
        <Route path='/Subject/UpdateSubject/:id' element={<AppUpdateSubject />}></Route>
        <Route path='/Subject/SubjectNo/:id' element={<AppSubjectNo />}></Route>
        <Route path='/Subject/SubjectNo/CreateExam/:id' element={<AppCreateExam />}></Route>
        <Route path='/Subject/SubjectNo/UpdateExam/:id' element={<AppUpdateExam />}></Route>
        <Route path='/Subject/SubjectNo/Exam/:id' element={<AppExam />}></Route>
        <Route path='/Subject/SubjectNo/Exam/UploadStudent/:id' element={<AppUploadStudent />}></Route>
        <Route path='/Subject/SubjectNo/Exam/CreateAnswerSheet/:id' element={<AppCreateAnswerSheet />}></Route>
        <Route path='/Subject/SubjectNo/Exam/ExamAnswer/:id' element={<AppExamAnswer />}></Route>
        <Route path='/Subject/SubjectNo/Exam/ExamAnswer/CreateExamAnswer/:id/:idsetexam/:idstatus/:idexamanswersid' element={<AppCreateExamAnswer />}></Route>
        <Route path='/Subject/SubjectNo/Exam/ExamAnswer/UpdateExamAnswer/:id/:idexam/:idsetexam' element={<AppUpdateExamAnswer />}></Route>
        <Route path='/Subject/SubjectNo/Exam/UploadAnswerSheet/:id' element={<AppUploadAnswerSheet />}></Route>
        <Route path='/Subject/SubjectNo/Exam/CheckAnswerSheet/:id' element={<AppCheckAnswerSheet />}></Route>
        <Route path='/Subject/SubjectNo/Exam/ScoreResults/:id' element={<AppScoreResults />}></Route>
        <Route path='/Subject/SubjectNo/Exam/AnalyzeResults/:id' element={<AppAnalyzeResults />}></Route>
        
        

        <Route path='/Questionnaire' element={<AppQuestionnaire />}></Route>
        <Route path='/CreateQuestionnaire' element={<AppCreateQuestionnaire />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/:id' element={<AppQuestionnaireNo />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/ShowQuestionnaire/:id' element={<AppShowQuestionaire />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/SetDateTimeQuestionnaire/:id' element={<AppSetDateTimeQuesionnaire />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/UploadQuestionnaire/:id' element={<AppUploadQuestionnaire />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/ShowQuestionnaire/UpdateQuestionnaire/:id' element={<AppUpdateQuetionaire />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/CheckQuestionaire/:id' element={<AppCheckQuestionaire />}></Route>
        <Route path='/Questionnaire/QuestionnaireNo/AnalyzeResultsQue/:id' element={<AppAnalyzeResultsQue />}></Route>

        
        <Route path='/Profile' element={<AppProfile />}></Route>
        <Route path='/Contact' element={<AppContact />}></Route>
        <Route path='/Usermanual' element={<AppUsermanual />}></Route>
        <Route path='/Scores' element={<AppScores />}></Route>
        <Route path='/Scores/ShowScores/:id' element={<AppShowScores />}></Route>
        

        <Route path='/Admin/AdminSubject' element={<AppAdminSubject />}></Route>
        <Route path='/Admin/AdminSubject/SubjectExam/:id' element={<AppAdminSubjectNo />}></Route>
        <Route path='/Admin/AdminSubject/SubjectExam/AppAdminUpdateExam/:id' element={<AppAdminUpdateExam />}></Route>
        <Route path='/Admin/AdminSubject/SubjectExam/Exam/:id' element={<AppAdminExam />}></Route>
        <Route path='/Admin/AdminSubject/SubjectExam/Exam/ScoreResults/:id' element={<AppScoreResults />}></Route>
        <Route path='/Admin/AdminSubject/SubjectExam/Exam/AnalyzeResults/:id' element={<AppAnalyzeResults />}></Route>
        <Route path='/Admin/AdminQuestionnaire' element={<AppAdminQuestionnaire />}></Route>
        <Route path='/Admin/AdminQuestionnaire/AdminUpdateQuestionnaire/:id' element={<AppAdminUpdateQuestionnaire />}></Route>
        <Route path='/Admin/AdminQuestionnaire/QuestionnaireNo/:id' element={<AppAdminQuestionnaireNo />}></Route>
        <Route path='/Admin/AdminQuestionnaire/QuestionnaireNo/AnalyzeResultsQue/:id' element={<AppAnalyzeResultsQue />}></Route>

        /Admin/AdminQuestionnaire/AnalyzeResultsQue/
        <Route path='/Admin/User' element={<AppUser />}></Route>
        <Route path='/Admin/User/CreateUser/' element={<AppCreateUser />}></Route>
        <Route path='/Admin/User/UpdateUser/:id' element={<AppUpdateUser />}></Route>
        
        <Route path='/Admin/Type' element={<AppType />}></Route>
        <Route path='/Admin/Type/CreateType' element={<AppCreateType />}></Route>
        <Route path='/Admin/Type/UpdateType/:id' element={<AppUpdateType />}></Route>
        <Route path='/Admin/Request' element={<AppRequest />}></Route>
        <Route path='/Admin/Request/Respond/:id' element={<AppRespond />}></Route>
        <Route path='/Admin/Request/UpdateRequest/:id' element={<AppUpdateRequest />}></Route>

        
      </Routes>
    </Router>

  );
}

export default App;
