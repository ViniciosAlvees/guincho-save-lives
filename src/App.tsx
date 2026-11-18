import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { About, Contact, Enter, FAQ, Home, NotFound } from './pages/PublicPages'
import { Members } from './pages/MembersPage'
import { Search, ProfessionalDetail } from './pages/SearchPages'
import { ClientRegistration, ProfessionalRegistration } from './pages/RegistrationPages'
import { RequestWizard } from './pages/RequestWizard'
import { ClientDashboard, ProfessionalDashboard } from './pages/Dashboards'
import { RequestDetail, RequestChat } from './pages/RequestPages'
import { isApiMode } from './services/towService'
import { ApiModePage } from './pages/ApiModePage'
import { EstimatePage } from './pages/EstimatePage'
import { ClientGate, ClientLogin, DriverGate, DriverLogin, DriverStatus, ServiceGate } from './pages/AccessPages'
import { EmployeeAccessPage, EmployeeApiGate, EmployeeDashboardPage } from './pages/EmployeePages'
import { PitchPage } from './pages/PitchPage'

export default function App() {
  return <Layout><Routes>
    <Route path="/" element={<Home/>}/><Route path="/sobre" element={<About/>}/><Route path="/integrantes" element={<Members/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/contato" element={<Contact/>}/>
    <Route path="/pitch" element={<PitchPage/>}/>
    <Route path="/estimar-guincho" element={<EstimatePage/>}/>
    <Route path="/entrar" element={<Enter/>}/><Route path="/cadastro/cliente" element={isApiMode ? <ApiModePage/> : <ClientRegistration/>}/><Route path="/cadastro/guincheiro" element={isApiMode ? <ApiModePage/> : <ProfessionalRegistration/>}/>
    <Route path="/login/cliente" element={isApiMode ? <ApiModePage/> : <ClientLogin/>}/><Route path="/login/guincheiro" element={isApiMode ? <ApiModePage/> : <DriverLogin/>}/><Route path="/guincheiro/status" element={isApiMode ? <ApiModePage/> : <DriverStatus/>}/>
    <Route path="/funcionarios/acesso" element={<EmployeeAccessPage/>}/><Route path="/funcionarios/painel" element={<EmployeeApiGate><EmployeeDashboardPage/></EmployeeApiGate>}/>
    <Route path="/buscar-guincho" element={isApiMode ? <ApiModePage/> : <Search/>}/><Route path="/guincheiros/:id" element={isApiMode ? <ApiModePage/> : <ProfessionalDetail/>}/>
    <Route path="/solicitar-guincho" element={isApiMode ? <ApiModePage/> : <ClientGate><RequestWizard/></ClientGate>}/><Route path="/cliente/painel" element={isApiMode ? <ApiModePage/> : <ClientGate><ClientDashboard/></ClientGate>}/><Route path="/guincheiro/painel" element={isApiMode ? <ApiModePage/> : <DriverGate><ProfessionalDashboard/></DriverGate>}/>
    <Route path="/solicitacoes/:id" element={isApiMode ? <ApiModePage/> : <ServiceGate><RequestDetail/></ServiceGate>}/><Route path="/solicitacoes/:id/chat" element={isApiMode ? <ApiModePage/> : <ServiceGate><RequestChat/></ServiceGate>}/><Route path="*" element={<NotFound/>}/>
  </Routes></Layout>
}
