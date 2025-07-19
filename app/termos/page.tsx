"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, FileText, Shield, Users, CreditCard, AlertTriangle, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function TermosPage() {
  const lastUpdated = "15 de Janeiro de 2025"
  const version = "1.2"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Termos de Uso</h1>
            <p className="text-slate-600 mb-4">Leia atentamente os termos e condições de uso da nossa plataforma</p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Atualizado em {lastUpdated}
              </div>
              <Badge variant="secondary">Versão {version}</Badge>
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <FileText className="h-5 w-5" />
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <p className="mb-3">
              Este documento estabelece os termos e condições para uso da nossa plataforma de gestão de despesas
              familiares. Ao utilizar nossos serviços, você concorda com estes termos.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Uso familiar e pessoal</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Dados protegidos</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Gratuito com limitações</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <div className="space-y-6">
          {/* 1. Definições */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">1. Definições</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Plataforma</h4>
                <p className="text-slate-600">
                  Refere-se ao sistema de gestão de despesas familiares, incluindo aplicação web, APIs, banco de dados e
                  todos os serviços relacionados.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usuário</h4>
                <p className="text-slate-600">
                  Pessoa física que se cadastra e utiliza a plataforma para gerenciar suas despesas pessoais ou
                  familiares.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Família</h4>
                <p className="text-slate-600">
                  Grupo de usuários conectados na plataforma para compartilhar e gerenciar despesas em conjunto.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Dados Pessoais</h4>
                <p className="text-slate-600">
                  Informações que identificam ou podem identificar um usuário, incluindo nome, email, dados financeiros
                  e de uso da plataforma.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Aceitação dos Termos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">2. Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">Ao acessar ou usar nossa plataforma, você declara que:</p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                <li>Leu, compreendeu e concorda com estes Termos de Uso</li>
                <li>Tem pelo menos 18 anos de idade ou possui autorização dos responsáveis</li>
                <li>Possui capacidade legal para celebrar este acordo</li>
                <li>Fornecerá informações verdadeiras e atualizadas</li>
                <li>Usará a plataforma de forma legal e responsável</li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-800">Importante</p>
                    <p className="text-amber-700 text-sm">
                      Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Descrição do Serviço */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">3. Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Nossa plataforma oferece ferramentas para gestão de despesas pessoais e familiares, incluindo:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Funcionalidades Principais:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                    <li>Registro e categorização de despesas</li>
                    <li>Gestão de membros da família</li>
                    <li>Controle de carteiras e contas</li>
                    <li>Relatórios e análises financeiras</li>
                    <li>Despesas recorrentes</li>
                    <li>Gestão de projetos financeiros</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recursos Administrativos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                    <li>Painel de administração</li>
                    <li>Controle de permissões</li>
                    <li>Sistema de convites</li>
                    <li>Backup e restauração</li>
                    <li>Logs de auditoria</li>
                    <li>Configurações avançadas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Conta do Usuário */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">4. Conta do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">4.1 Criação de Conta</h4>
                <p className="text-slate-600 mb-2">
                  Para usar nossa plataforma, você deve criar uma conta fornecendo informações precisas e completas.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Nome completo</li>
                  <li>Endereço de email válido</li>
                  <li>Senha segura</li>
                  <li>Informações de perfil opcionais</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4.2 Responsabilidades do Usuário</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Manter suas credenciais de acesso seguras</li>
                  <li>Notificar imediatamente sobre uso não autorizado</li>
                  <li>Manter informações da conta atualizadas</li>
                  <li>Não compartilhar sua conta com terceiros</li>
                  <li>Usar a plataforma apenas para fins legítimos</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4.3 Suspensão e Encerramento</h4>
                <p className="text-slate-600">
                  Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, com ou sem aviso
                  prévio, a nosso critério exclusivo.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 5. Uso Aceitável */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Uso Aceitável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">✓ Usos Permitidos</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Gestão de despesas pessoais e familiares</li>
                  <li>Compartilhamento de dados dentro da família</li>
                  <li>Geração de relatórios para uso pessoal</li>
                  <li>Backup de dados financeiros pessoais</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-700">✗ Usos Proibidos</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Uso comercial sem autorização expressa</li>
                  <li>Tentativas de acesso não autorizado</li>
                  <li>Interferência no funcionamento da plataforma</li>
                  <li>Uso para atividades ilegais ou fraudulentas</li>
                  <li>Compartilhamento de dados de terceiros sem consentimento</li>
                  <li>Engenharia reversa ou tentativas de cópia</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 6. Privacidade e Proteção de Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="h-5 w-5" />
                6. Privacidade e Proteção de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">6.1 Coleta de Dados</h4>
                <p className="text-slate-600 mb-2">Coletamos apenas os dados necessários para:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Autenticar e autorizar usuários</li>
                  <li>Gerar relatórios e análises</li>
                  <li>Comunicar-se com usuários quando necessário</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6.2 Uso de Dados</h4>
                <p className="text-slate-600">
                  Seus dados são usados exclusivamente para os fins declarados e nunca são vendidos ou compartilhados
                  com terceiros sem seu consentimento explícito.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6.3 Segurança</h4>
                <p className="text-slate-600">
                  Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não
                  autorizado, alteração, divulgação ou destruição.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">6.4 Seus Direitos</h4>
                <p className="text-slate-600 mb-2">Você tem direito a:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar exclusão de dados</li>
                  <li>Portabilidade de dados</li>
                  <li>Revogar consentimentos</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 7. Limitações e Responsabilidades */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">7. Limitações e Responsabilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">7.1 Disponibilidade do Serviço</h4>
                <p className="text-slate-600">
                  Embora nos esforcemos para manter a plataforma disponível 24/7, não garantimos disponibilidade
                  ininterrupta. Manutenções programadas serão comunicadas com antecedência.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">7.2 Limitação de Responsabilidade</h4>
                <p className="text-slate-600">
                  Nossa responsabilidade é limitada ao valor pago pelos serviços nos últimos 12 meses. Não somos
                  responsáveis por danos indiretos, lucros cessantes ou perda de dados.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">7.3 Backup de Dados</h4>
                <p className="text-slate-600">
                  Embora façamos backups regulares, recomendamos que você mantenha cópias próprias de dados importantes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 8. Propriedade Intelectual */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">8. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">8.1 Nossa Propriedade</h4>
                <p className="text-slate-600">
                  A plataforma, incluindo código, design, marca e conteúdo, é de nossa propriedade exclusiva e protegida
                  por leis de propriedade intelectual.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">8.2 Seus Dados</h4>
                <p className="text-slate-600">
                  Você mantém todos os direitos sobre os dados que insere na plataforma. Concede-nos apenas licença para
                  processar esses dados conforme necessário para fornecer o serviço.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">8.3 Licença de Uso</h4>
                <p className="text-slate-600">
                  Concedemos-lhe uma licença limitada, não exclusiva e revogável para usar a plataforma conforme estes
                  termos.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 9. Modificações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">9. Modificações dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão
                comunicadas com pelo menos 30 dias de antecedência.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Como você será notificado:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm ml-4">
                  <li>Email para o endereço cadastrado</li>
                  <li>Notificação na plataforma</li>
                  <li>Atualização desta página com nova data</li>
                </ul>
              </div>

              <p className="text-slate-600">
                O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
              </p>
            </CardContent>
          </Card>

          {/* 10. Rescisão */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">10. Rescisão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">10.1 Por Sua Parte</h4>
                <p className="text-slate-600">
                  Você pode encerrar sua conta a qualquer momento através das configurações da plataforma ou entrando em
                  contato conosco.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">10.2 Por Nossa Parte</h4>
                <p className="text-slate-600">
                  Podemos encerrar ou suspender sua conta em caso de violação destes termos, com aviso prévio quando
                  possível.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">10.3 Efeitos da Rescisão</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm ml-4">
                  <li>Acesso à plataforma será imediatamente suspenso</li>
                  <li>Dados podem ser mantidos por período legal obrigatório</li>
                  <li>Você pode solicitar exportação de dados antes do encerramento</li>
                  <li>Obrigações de confidencialidade permanecem em vigor</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 11. Disposições Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">11. Disposições Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">11.1 Lei Aplicável</h4>
                <p className="text-slate-600">
                  Estes termos são regidos pelas leis brasileiras, especialmente pela Lei Geral de Proteção de Dados
                  (LGPD) e Código de Defesa do Consumidor.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">11.2 Foro</h4>
                <p className="text-slate-600">
                  Fica eleito o foro da comarca de [Sua Cidade] para dirimir quaisquer controvérsias decorrentes destes
                  termos.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">11.3 Divisibilidade</h4>
                <p className="text-slate-600">
                  Se qualquer disposição destes termos for considerada inválida, as demais permanecerão em pleno vigor.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">11.4 Acordo Integral</h4>
                <p className="text-slate-600">
                  Estes termos constituem o acordo integral entre as partes, substituindo quaisquer acordos anteriores.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl text-green-900 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="text-green-800">
              <p className="mb-4">Para dúvidas sobre estes termos ou nossa plataforma, entre em contato:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@exemplo.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 9999-9999</span>
                </div>
              </div>
              <p className="text-sm mt-4">Responderemos em até 48 horas úteis.</p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>
            Última atualização: {lastUpdated} • Versão {version}
          </p>
          <p className="mt-2">© 2025 Gestão de Despesas Familiares. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  )
}
