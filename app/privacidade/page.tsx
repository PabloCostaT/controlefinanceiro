import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Eye, Lock, Users, Database, FileText, Clock, Mail, Phone } from "lucide-react"
import Link from "next/link"

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Início
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Política de Privacidade</h1>
            <div className="flex justify-center items-center gap-4 mb-6">
              <Badge variant="secondary" className="text-sm">
                <FileText className="mr-1 h-3 w-3" />
                Versão 1.0
              </Badge>
              <Badge variant="outline" className="text-sm">
                <Clock className="mr-1 h-3 w-3" />
                Atualizada em: {new Date().toLocaleDateString("pt-BR")}
              </Badge>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações
              pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>

        {/* Resumo Executivo */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Shield className="mr-2 h-5 w-5" />
              Resumo dos Seus Direitos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Seus Dados</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Você controla seus dados pessoais</li>
                  <li>• Pode solicitar acesso, correção ou exclusão</li>
                  <li>• Pode revogar consentimentos a qualquer momento</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-700">Nossa Responsabilidade</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Protegemos seus dados com segurança</li>
                  <li>• Usamos apenas para finalidades específicas</li>
                  <li>• Não vendemos ou compartilhamos sem consentimento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo Principal */}
        <div className="space-y-8">
          {/* 1. Definições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                1. Definições
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold">Dados Pessoais</h4>
                  <p className="text-sm text-muted-foreground">
                    Qualquer informação relacionada a pessoa natural identificada ou identificável, como nome, email,
                    telefone, dados financeiros e de uso da plataforma.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Titular dos Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Controlador</h4>
                  <p className="text-sm text-muted-foreground">
                    Controle de Despesas Familiares, responsável pelas decisões referentes ao tratamento de dados
                    pessoais.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Dados Coletados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                2. Dados Pessoais Coletados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Coletamos apenas os dados necessários para o funcionamento da plataforma e prestação dos nossos
                  serviços.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700">Dados de Identificação</h4>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• Nome completo</li>
                    <li>• Endereço de email</li>
                    <li>• Telefone (opcional)</li>
                    <li>• Foto de perfil (opcional)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-700">Dados Financeiros</h4>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• Despesas registradas</li>
                    <li>• Categorias de gastos</li>
                    <li>• Valores e datas de transações</li>
                    <li>• Métodos de pagamento utilizados</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-purple-700">Dados de Uso</h4>
                  <ul className="text-sm text-muted-foreground ml-4 mt-2 space-y-1">
                    <li>• Logs de acesso e navegação</li>
                    <li>• Endereço IP e localização aproximada</li>
                    <li>• Dispositivo e navegador utilizados</li>
                    <li>• Preferências e configurações</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Finalidades do Tratamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                3. Finalidades do Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Prestação de Serviços</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Gerenciamento de despesas familiares</li>
                    <li>• Divisão de custos entre membros</li>
                    <li>• Geração de relatórios financeiros</li>
                    <li>• Controle de orçamentos</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Melhoria da Plataforma</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Análise de uso e performance</li>
                    <li>• Desenvolvimento de novas funcionalidades</li>
                    <li>• Correção de bugs e problemas</li>
                    <li>• Personalização da experiência</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Comunicação</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Notificações sobre a conta</li>
                    <li>• Atualizações de segurança</li>
                    <li>• Suporte técnico</li>
                    <li>• Informações sobre novidades</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Segurança</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Prevenção de fraudes</li>
                    <li>• Detecção de atividades suspeitas</li>
                    <li>• Backup e recuperação de dados</li>
                    <li>• Auditoria e conformidade</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Base Legal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                4. Base Legal para o Tratamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800">Consentimento</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Para dados não essenciais como preferências, comunicações promocionais e análises de uso avançadas.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800">Execução de Contrato</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Para dados necessários à prestação dos serviços contratados, como gerenciamento de despesas e
                    relatórios financeiros.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800">Legítimo Interesse</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    Para segurança da plataforma, prevenção de fraudes e melhoria dos serviços oferecidos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5. Compartilhamento de Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                5. Compartilhamento de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Não vendemos seus dados pessoais.</strong> Compartilhamos apenas quando necessário para
                  prestação dos serviços ou por obrigação legal.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Dentro da Família</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados de despesas são compartilhados entre membros da mesma família para permitir o controle
                    conjunto das finanças.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Prestadores de Serviços</h4>
                  <p className="text-sm text-muted-foreground">
                    Compartilhamos dados com fornecedores de infraestrutura, segurança e suporte técnico, sempre sob
                    contratos de confidencialidade.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Autoridades Competentes</h4>
                  <p className="text-sm text-muted-foreground">
                    Quando exigido por lei, ordem judicial ou para proteção de direitos e segurança de usuários.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 6. Segurança dos Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                6. Segurança e Proteção dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Medidas Técnicas</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Criptografia de dados em trânsito e repouso</li>
                    <li>• Autenticação de dois fatores</li>
                    <li>• Monitoramento de segurança 24/7</li>
                    <li>• Backups regulares e seguros</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Medidas Organizacionais</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Treinamento de equipe em privacidade</li>
                    <li>• Controle de acesso por função</li>
                    <li>• Políticas de segurança rigorosas</li>
                    <li>• Auditorias regulares de segurança</li>
                  </ul>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Em caso de incidente de segurança que possa afetar seus dados, você será notificado em até 72 horas
                  conforme exigido pela LGPD.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 7. Retenção de Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                7. Retenção e Exclusão de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Dados de Conta Ativa</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantemos seus dados enquanto sua conta estiver ativa e você utilizar nossos serviços.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Dados Financeiros</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados de despesas são mantidos por até 5 anos após o encerramento da conta para fins de auditoria e
                    conformidade fiscal.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Dados de Logs</h4>
                  <p className="text-sm text-muted-foreground">
                    Logs de acesso e segurança são mantidos por até 1 ano para fins de segurança e investigação de
                    incidentes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Exclusão Automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados são automaticamente excluídos após os períodos de retenção, exceto quando há obrigação legal
                    de manutenção.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Seus Direitos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="mr-2 h-5 w-5" />
                8. Seus Direitos como Titular dos Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Acesso</h4>
                    <p className="text-xs text-blue-600">
                      Solicitar informações sobre quais dados pessoais tratamos sobre você.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 rounded border border-green-200">
                    <h4 className="font-semibold text-green-800">Correção</h4>
                    <p className="text-xs text-green-600">
                      Solicitar a correção de dados incompletos, inexatos ou desatualizados.
                    </p>
                  </div>

                  <div className="p-3 bg-red-50 rounded border border-red-200">
                    <h4 className="font-semibold text-red-800">Exclusão</h4>
                    <p className="text-xs text-red-600">
                      Solicitar a eliminação de dados pessoais desnecessários ou tratados ilicitamente.
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-800">Portabilidade</h4>
                    <p className="text-xs text-purple-600">
                      Solicitar a transferência de dados para outro fornecedor de serviços.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-orange-50 rounded border border-orange-200">
                    <h4 className="font-semibold text-orange-800">Oposição</h4>
                    <p className="text-xs text-orange-600">Opor-se ao tratamento de dados em situações específicas.</p>
                  </div>

                  <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
                    <h4 className="font-semibold text-indigo-800">Revogação</h4>
                    <p className="text-xs text-indigo-600">
                      Revogar consentimento para tratamento de dados a qualquer momento.
                    </p>
                  </div>

                  <div className="p-3 bg-teal-50 rounded border border-teal-200">
                    <h4 className="font-semibold text-teal-800">Informação</h4>
                    <p className="text-xs text-teal-600">
                      Obter informações sobre compartilhamento de dados com terceiros.
                    </p>
                  </div>

                  <div className="p-3 bg-pink-50 rounded border border-pink-200">
                    <h4 className="font-semibold text-pink-800">Revisão</h4>
                    <p className="text-xs text-pink-600">
                      Solicitar revisão de decisões automatizadas que afetem seus interesses.
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  Para exercer seus direitos, entre em contato conosco através do email:
                  <strong> privacidade@despesasfamiliares.com.br</strong>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 9. Cookies e Tecnologias */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                9. Cookies e Tecnologias Similares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Cookies Essenciais</h4>
                  <p className="text-sm text-muted-foreground">
                    Necessários para o funcionamento básico da plataforma, como autenticação e preferências de sessão.
                    Não podem ser desabilitados.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Cookies de Performance</h4>
                  <p className="text-sm text-muted-foreground">
                    Coletam informações sobre como você usa a plataforma para melhorar a performance e experiência do
                    usuário.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Cookies de Funcionalidade</h4>
                  <p className="text-sm text-muted-foreground">
                    Permitem que a plataforma lembre suas preferências e configurações para personalizar sua
                    experiência.
                  </p>
                </div>
              </div>

              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  Você pode gerenciar suas preferências de cookies nas configurações do seu navegador ou através do
                  nosso painel de preferências.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* 10. Transferência Internacional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                10. Transferência Internacional de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Seus dados são processados e armazenados no Brasil. Qualquer transferência internacional seguirá as
                  exigências da LGPD.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Serviços de Nuvem</h4>
                  <p className="text-sm text-muted-foreground">
                    Utilizamos provedores de nuvem que mantêm data centers no Brasil e seguem padrões internacionais de
                    segurança.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Garantias de Proteção</h4>
                  <p className="text-sm text-muted-foreground">
                    Quando necessária transferência internacional, garantimos nível adequado de proteção através de
                    cláusulas contratuais padrão.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 11. Menores de Idade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                11. Proteção de Menores de Idade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Nossa plataforma é destinada a maiores de 18 anos. Não coletamos intencionalmente dados de menores de
                  idade.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Consentimento dos Pais</h4>
                  <p className="text-sm text-muted-foreground">
                    Caso um menor seja incluído como membro da família, é necessário consentimento expresso dos pais ou
                    responsáveis legais.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Proteção Especial</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados de menores recebem proteção especial e são tratados apenas para finalidades específicas e com
                    consentimento adequado.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 12. Alterações na Política */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                12. Alterações nesta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">Notificação de Mudanças</h4>
                  <p className="text-sm text-muted-foreground">
                    Você será notificado sobre alterações significativas nesta política através do email cadastrado e
                    avisos na plataforma.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Período de Adaptação</h4>
                  <p className="text-sm text-muted-foreground">
                    Alterações entram em vigor 30 dias após a notificação, permitindo tempo para revisão e exercício de
                    direitos.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold">Histórico de Versões</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantemos histórico das versões anteriores desta política para transparência e consulta.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 13. Contato e DPO */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                13. Contato e Encarregado de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Encarregado de Proteção de Dados (DPO)</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>dpo@despesasfamiliares.com.br</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>(11) 9999-9999</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Suporte Geral</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>suporte@despesasfamiliares.com.br</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>(11) 8888-8888</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <h4 className="font-semibold mb-2">Autoridade Nacional de Proteção de Dados (ANPD)</h4>
                <p className="text-sm text-muted-foreground">
                  Você também pode entrar em contato com a ANPD para questões sobre proteção de dados:
                  <br />
                  <strong>https://www.gov.br/anpd</strong>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer da Política */}
        <div className="mt-12 text-center">
          <Separator className="mb-6" />
          <p className="text-sm text-muted-foreground">
            Esta Política de Privacidade foi elaborada em conformidade com a Lei Geral de Proteção de Dados Pessoais
            (Lei nº 13.709/2018) e demais normas aplicáveis.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Última atualização: {new Date().toLocaleDateString("pt-BR")} • Versão 1.0
          </p>
        </div>
      </div>
    </div>
  )
}
