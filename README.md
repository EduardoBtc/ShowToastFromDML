# ShowToastFromTrigger - Componente LWC

[![Salesforce](https://img.shields.io/badge/Salesforce-Lightning%20Web%20Component-00A1E0?style=flat&logo=salesforce)](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0-blue.svg)](CHANGELOG.md)

> **🚀 Um componente Lightning Web Component invisível que monitora mudanças em campos e exibe notificações toast automaticamente usando Change Data Capture (CDC)**

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração Rápida](#-configuração-rápida)
- [Configuração](#-configuração)
- [Campos de Mesclagem Disponíveis](#-campos-de-mesclagem-disponíveis)
- [Casos de Uso Comuns](#-casos-de-uso-comuns)
- [Solução de Problemas](#-solução-de-problemas)
- [Limitações Conhecidas](#-limitações-conhecidas)
- [Performance](#-performance)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 📋 Visão Geral

O **ShowToastFromTrigger** é um componente Lightning Web Component invisível que monitora mudanças em campos específicos de registros e exibe automaticamente notificações toast quando o campo é atualizado, independentemente da fonte da mudança (Apex, Flow, UI, DML).

### ✨ Principais Recursos

- 🔄 **Monitoramento em Tempo Real**: Usa Change Data Capture (CDC) para detectar mudanças instantaneamente
- 🎨 **Totalmente Configurável**: Personalize título, mensagem, cor, modo e comportamento via App Builder
- 🔗 **Campos de Mesclagem Dinâmicos**: Use tokens como `{newValue}`, `{oldValue}`, `{recordId}` nas mensagens
- 🔄 **Atualização Automática**: Opção para atualizar automaticamente a página após exibir o toast
- 🐛 **Modo Debug**: Logs detalhados para solução de problemas

## 🛠️ Tecnologias Utilizadas

- **Salesforce Lightning Web Components (LWC)** - Framework JavaScript moderno para Salesforce
- **Change Data Capture (CDC)** - Monitoramento de mudanças de dados em tempo real
- **Lightning App Builder** - Configuração visual de páginas
- **Salesforce Platform Events** - Arquitetura orientada a eventos
- **JavaScript ES6+** - Recursos modernos de JavaScript
- **CSS3** - Estilização e animações
- **HTML5** - Marcação semântica

## 📋 Requisitos

### Pré-requisitos

- **Org Salesforce** com permissões apropriadas
- **Change Data Capture** habilitado (requer licenciamento)
- **Acesso ao Lightning App Builder**
- **Administrador do Sistema** ou permissão **Customize Application**

### Edições do Salesforce

| Edição | Suporte CDC | Limite de Objetos |
|---------|-------------|------------------|
| Developer Edition | ✅ | 5 objetos |
| Professional | ❌ | Não disponível |
| Enterprise | ✅ | 10 objetos |
| Unlimited | ✅ | 20 objetos |

## 🚀 Instalação

### Deploy via SF CLI (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone https://github.com/EduardoBtc/showToastFromDML.git
   cd showToastFromDML
   ```

2. **Autentique com o Salesforce**
   ```bash
   sf org login web --set-default --alias myorg
   ```

3. **Faça deploy para sua org**
   ```bash
   sf project deploy start --source-dir force-app/main/default/lwc/showToastFromDML
   ```


## 🚀 Configuração Rápida

### Passo 1: Habilitar Change Data Capture

1. Vá para **Configuração** → **Change Data Capture**  
2. Selecione o objeto que deseja monitorar  
3. Clique em **Habilitar** para ativar o CDC

> **⚠️ Importante**: CDC requer licenciamento e pode ser limitado a 5 objetos por org (Developer Edition)

### Passo 2: Adicionar Componente à Página de Registro

1. Abra o **Lightning App Builder**  
2. Edite a Página de Registro desejada  
3. Arraste o componente **Show Toast From DML** para qualquer região  
4. Configure as propriedades conforme necessário

### Passo 3: Configurar Propriedades

O componente oferece um conjunto abrangente de opções de configuração organizadas por funcionalidade:

#### 1️⃣ **CONFIGURAÇÃO BÁSICA** (Obrigatório)

| Propriedade | Descrição | Exemplo |
|-------------|-----------|---------|
| **Campo Monitorado** | Nome da API do campo a ser monitorado | `Status__c`, `ApprovalStatus__c` |

#### 2️⃣ **CONTEÚDO DA NOTIFICAÇÃO** (Essencial)

| Propriedade | Tipo | Descrição | Padrão |
|-------------|------|-----------|--------|
| **Título do Toast** | String | Título com processamento automático de campos de mesclagem | "Notificação" |
| **Mensagem do Toast** | String | Mensagem com processamento automático de campos de mesclagem | "Campo foi atualizado" |

> **✨ Processamento Automático**: O componente detecta automaticamente tokens como `{newValue}`, `{oldValue}`, `{recordId}`, `{objectName}` e os substitui por valores reais.

#### 3️⃣ **APARÊNCIA** (Visual)

| Propriedade | Tipo | Opções | Descrição | Padrão |
|-------------|------|--------|-----------|--------|
| **Tipo de Notificação** | Picklist | success/error/warning/info | Cor e ícone do toast | "info" |
| **Modo de Exibição** | Picklist | dismissable/pester/sticky | Como o toast é fechado | "dismissable" |

#### 4️⃣ **COMPORTAMENTO** (Funcional)

| Propriedade | Tipo | Descrição | Padrão |
|-------------|------|-----------|--------|
| **Forçar Atualização da Página** | Boolean | Se marcado, atualiza a página após o toast | false |
| **Delay da Atualização (ms)** | Integer | Tempo de espera antes da atualização | 1000 |
| **Exibir Apenas Uma Vez** | Boolean | Mostra o toast apenas na primeira mudança | false |

#### 5️⃣ **AJUDA** (Suporte)

| Propriedade | Descrição |
|-------------|-----------|
| **📋 Variáveis Disponíveis** | Lista de todas as variáveis dinâmicas |
| **📝 Exemplos de Uso** | Exemplos práticos de como usar as variáveis |
| **💡 Dica de Uso** | Dica importante para usar as variáveis |

#### 6️⃣ **AVANÇADO** (Técnico)

| Propriedade | Tipo | Descrição | Padrão |
|-------------|------|-----------|--------|
| **Modo Debug** | Boolean | Mostra logs detalhados no console | false |

## 🔗 Campos de Mesclagem Disponíveis

Use estes tokens nas mensagens para valores dinâmicos:

| Token | Descrição | Exemplo |
|-------|-----------|---------|
| `{newValue}` | Valor atual do campo | "Aprovado" |
| `{oldValue}` | Valor anterior do campo | "Pendente" |
| `{recordId}` | ID do registro | "001XX000004DHPY" |
| `{objectName}` | Nome do objeto | "Account" |

### 📋 Ajuda Integrada no App Builder

O componente inclui uma **propriedade de ajuda integrada** que mostra todas as variáveis dinâmicas disponíveis diretamente no App Builder:

```
📋 VARIÁVEIS DINÂMICAS DISPONÍVEIS:

🔹 {newValue} - Valor atual do campo
🔹 {oldValue} - Valor anterior do campo  
🔹 {recordId} - ID do registro
🔹 {objectName} - Nome do objeto

📝 EXEMPLOS DE USO:

Título: "Status Atualizado"
Mensagem: "Campo mudou de {oldValue} para {newValue}"

Título: "Aprovação Concluída!"
Mensagem: "Registro {recordId} foi aprovado"

Título: "{objectName} Modificado"
Mensagem: "Novo valor: {newValue}"

💡 DICA: O processamento é automático! Apenas use os tokens nas mensagens.
```

**Como usar:**
1. No App Builder, role até a seção "📋 Variáveis Dinâmicas Disponíveis"
2. **Copie** as variáveis que deseja usar
3. **Cole** elas no título ou mensagem do toast
4. **Pronto!** O processamento é automático - não precisa ativar nada

### 🎨 Interface Visual no App Builder

```
┌─────────────────────────────────────────────┐
│ SHOW TOAST FROM TRIGGER                     │
├─────────────────────────────────────────────┤
│                                             │
│ Campo Monitorado *                          │
│ [Status__c                            ]     │
│                                             │
│ Título do Toast                             │
│ [Status Atualizado                   ]     │
│                                             │
│ Mensagem do Toast                           │
│ [Campo mudou de {oldValue} para {newValue}] │
│                                             │
│ ✨ Processamento Automático Ativo           │
│                                             │
│ ── 📋 AJUDA COM VARIÁVEIS ──               │
│                                             │
│ 📋 Variáveis Disponíveis                    │
│ [{newValue} - Valor atual | {oldValue}...]  │
│                                             │
│ 📝 Exemplos de Uso                          │
│ [Título: 'Status Atualizado' | Mensagem...] │
│                                             │
│ 💡 Dica de Uso                              │
│ [Processamento automático - apenas use...]  │
│                                             │
│ ── Opções Avançadas ──                      │
│ ☐ Exibir Apenas Uma Vez                     │
│ ☐ Modo Debug                                │
│                                             │
└─────────────────────────────────────────────┘
```

### 📝 Exemplos de Campos de Mesclagem

```
Título: "Status Atualizado"
Mensagem: "Campo mudou de {oldValue} para {newValue}"

Título: "Aprovação Concluída!"
Mensagem: "O registro {recordId} foi aprovado com sucesso."

Título: "{objectName} Modificado"
Mensagem: "Novo valor: {newValue}"
```

## 🎯 Casos de Uso Comuns

### 1. Notificação de Aprovação

```
Campo Monitorado: ApprovalStatus__c
Título: Aprovação Concluída!
Mensagem: Status mudou para {newValue}
Tipo de Notificação: success
Modo de Exibição: pester
☑ Forçar Atualização da Página: true
Delay da Atualização: 2000
```

**Resultado**: Toast verde "Aprovação Concluída! Status mudou para Aprovado", fecha após 3s, depois atualiza a página

### 2. Alerta de Erro Crítico

```
Campo Monitorado: ValidationError__c
Título: Erro de Validação
Mensagem: {newValue}
Tipo de Notificação: error
Modo de Exibição: sticky
☐ Forçar Atualização da Página: false
```

**Resultado**: Toast vermelho com a mensagem de erro, permanece na tela até o usuário fechar

### 3. Informação de Status com Histórico

```
Campo Monitorado: Status
Título: {objectName} Atualizado
Mensagem: Status mudou de {oldValue} para {newValue}
Tipo de Notificação: info
Modo de Exibição: dismissable
☐ Forçar Atualização da Página: false
```

**Resultado**: Toast cinza "Account Atualizado: Status mudou de Aberto para Fechado"

## 📖 Exemplo Completo

Aqui está um exemplo completo de configuração do componente para um processo de aprovação:

### Cenário: Fluxo de Aprovação de Oportunidade

```javascript
// Configuração do Componente
{
  "monitoredField": "ApprovalStatus__c",
  "toastTitle": "Status de Aprovação Atualizado",
  "toastMessage": "Oportunidade {recordId} status mudou de {oldValue} para {newValue}",
  "notificationType": "success",
  "displayMode": "pester",
  "forcePageRefresh": true,
  "refreshDelayMs": 2000,
  "showOnlyOnce": false,
  "debugMode": false
}
```

### Comportamento Esperado

1. **Usuário atualiza** `ApprovalStatus__c` de "Pendente" para "Aprovado"
2. **CDC detecta** a mudança em 1-2 segundos
3. **Toast aparece** com estilo de sucesso verde
4. **Mensagem exibe**: "Oportunidade 006XX000004DHPY status mudou de Pendente para Aprovado"
5. **Página atualiza** após 2 segundos para mostrar dados atualizados

## 🔧 Solução de Problemas

### ❌ Toast não aparece

**Possíveis causas:**
1. **CDC não habilitado**: Verifique se o Change Data Capture está ativo para o objeto  
2. **Campo errado**: Confirme se o nome da API do campo está correto  
3. **Permissões**: Usuário precisa ter acesso ao campo monitorado  
4. **Modo Debug**: Habilite para ver logs detalhados no console

**Solução:**
```javascript
// Habilite o modo debug para ver logs
debugMode: true
```

### ⏱️ Latência de detecção

**Causa**: CDC tem uma latência natural de ~1-2 segundos

**Solução**: Isso é normal—é uma limitação da plataforma. Para casos críticos, considere Platform Events.

### 🔄 Atualização não funciona

**Possíveis causas:**
1. **Delay muito baixo**: Aumente o delay da atualização  
2. **Navegador**: Alguns navegadores podem bloquear atualização automática

**Solução:**
```javascript
// Aumente o delay se necessário
refreshDelayMs: 2000
```

### 📊 Múltiplas instâncias

**Problema**: Múltiplos toasts aparecem para o mesmo campo

**Solução**: Use apenas uma instância do componente por página, ou configure `showOnlyOnce: true`

## 🚨 Limitações Conhecidas

| Limitação | Descrição | Solução Alternativa |
|-----------|-----------|-------------------|
| **Latência CDC** | Delay de ~1-2 segundos | Limitação da plataforma |
| **Limite CDC** | 5 objetos por org (Dev Edition) | Upgrade de licença |

## 🔍 Modo Debug

Habilite o modo debug para solução de problemas avançada:

```javascript
// No App Builder, marque:
Modo Debug: ☑
```

**Logs disponíveis:**
- Inicialização do componente  
- Valores iniciais dos campos  
- Detecção de mudanças  
- Processamento de campos de mesclagem  
- Exibição do toast  
- Atualização da view  
- Erros e exceções

## 📈 Performance

### ✅ Otimizações Implementadas

- **CDC ao invés de polling**: Máxima eficiência  
- **RefreshApex**: Atualiza apenas dados necessários  
- **Logs condicionais**: Debug apenas quando habilitado  
- **Limpeza automática**: Remove subscriptions ao desconectar

### 📊 Consumo de Recursos

- **CPU**: Mínimo (apenas escutando eventos)  
- **Memória**: Baixa (sem polling ativo)  
- **Rede**: CDC usa uma conexão WebSocket eficiente   

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### O que isso significa:

- ✅ **Uso comercial** - Use em projetos comerciais
- ✅ **Modificação** - Modifique o código conforme necessário
- ✅ **Distribuição** - Compartilhe e distribua
- ✅ **Uso privado** - Use em projetos privados
- ❌ **Responsabilidade** - Nenhuma garantia fornecida
- ❌ **Garantia** - Nenhuma garantia fornecida


- **Documentação**: Consulte este README e comentários inline
- **Meu Trailhead**: [Eduardo Martins](https://github.com/your-username/showToastFromDML/issues)
---

<div align="center">

**⭐ Se este componente te ajudou, por favor dê uma estrela! ⭐**

Feito com ❤️ para a comunidade Salesforce

</div>