# Assistente Financeiro — Fase 1 (MVP)

App de controle financeiro pessoal: login, categorias personalizadas, registro de entradas/saídas e saldo em tempo real. Feito com React + Vite + Tailwind CSS + Supabase.

## Setup

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Rodar o schema no Supabase**
   No SQL Editor do seu projeto Supabase, rode o arquivo `schema-fase1.sql` (gerado junto com este projeto). Ele cria as tabelas `categories` e `transactions` já com RLS habilitado.

3. **Configurar variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os dados do seu projeto (Project Settings → API no painel do Supabase).

4. **Rodar em desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Build de produção**
   ```bash
   npm run build
   ```

## Estrutura

```
src/
  lib/supabaseClient.js     cliente do Supabase
  context/AuthContext.jsx   sessão do usuário (login/logout/cadastro)
  components/
    ProtectedRoute.jsx      redireciona pra /login se não autenticado
    BalanceCard.jsx         card de saldo + entradas/saídas
    TransactionForm.jsx     formulário de registrar transação
    TransactionList.jsx     histórico estilo recibo
    CategoryManager.jsx     criar/excluir categorias
  pages/
    Login.jsx               login e cadastro
    Dashboard.jsx           tela principal, junta tudo
```

## O que já funciona (Fase 1)

- [x] Cadastro e login (Supabase Auth)
- [x] RLS — cada usuário só vê os próprios dados
- [x] Criar/excluir categorias próprias
- [x] Registrar entrada ou saída (valor, categoria, descrição, data)
- [x] Ver saldo atual e histórico
- [x] Excluir transação

## Próximos passos (Fase 2+)

Ver o arquivo `plano-fases-assistente-financeiro.md` do projeto para o roteiro completo (gráficos, metas, WhatsApp, IA).
