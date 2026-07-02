# 🍔 SARON BURGUER — Site completo

Site profissional para hamburgueria com cardápio digital, pedidos online, painel admin e assistente virtual.

---

## 🚀 Deploy na Vercel (passo a passo)

### 1. Banco de dados — Neon (grátis, recomendado para Vercel)

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Crie um novo projeto → copie a `Connection string` (formato `postgresql://...`)
3. No painel do Neon, abra o **SQL Editor** e cole e execute o conteúdo de `scripts/setup-db.sql`

### 2. GitHub

```bash
git init
git add .
git commit -m "SARON BURGUER - deploy inicial"
# Crie um repositório no GitHub e faça push
git remote add origin https://github.com/seu-usuario/saron-burguer.git
git push -u origin main
```

### 3. Vercel

1. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repositório do GitHub
2. Em **Environment Variables**, adicione:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Qualquer string longa e aleatória |

3. Clique em **Deploy** ✅

### 4. Popular o banco (após deploy)

Acesse no navegador:
```
https://seu-site.vercel.app/api/seed?key=saron
https://seu-site.vercel.app/api/seed-real-menu?key=saron
```

---

## 🔑 Acesso ao painel admin

- URL: `https://seu-site.vercel.app/admin`
- **Usuário:** `admin`
- **Senha:** `saron123`

> O acesso ao admin está discretamente no rodapé do site (ícone ⛮ no canto inferior esquerdo)

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Home — cardápio, depoimentos, galeria, contato
│   ├── checkout/             # Fluxo de pedido
│   ├── tracking/             # Acompanhamento do pedido
│   ├── admin/                # Painel administrativo
│   └── api/                  # API REST
│       ├── categories/       # CRUD de categorias
│       ├── products/         # CRUD de produtos
│       ├── orders/           # Pedidos (GET/POST/PUT/DELETE)
│       ├── settings/         # CMS do site
│       ├── media/            # Biblioteca de mídias
│       ├── coupons/          # Cupons de desconto
│       ├── testimonials/     # Depoimentos
│       ├── auth/             # Login/logout/change-password
│       ├── admin/stats       # Dashboard stats
│       ├── seed/             # Popular banco (admin/usuários/settings)
│       └── seed-real-menu/   # Popular cardápio completo
├── components/
│   ├── Navbar.tsx
│   ├── CartSidebar.tsx
│   ├── ProductCard.tsx
│   ├── AdminPanel.tsx
│   └── VirtualAssistant.tsx  # Assistente digital com NLP
├── context/
│   ├── CartContext.tsx
│   └── ToastContext.tsx
├── db/
│   ├── schema.ts             # Tabelas Drizzle ORM
│   └── index.ts              # Conexão PostgreSQL
└── lib/
    └── utils.ts              # Helpers (bcrypt, JWT, formatadores)
```

---

## ⚡ Tempo real (SSE) na Vercel

O sistema usa **Server-Sent Events** para push instantâneo de pedidos (cliente → admin) e status (admin → cliente).

Na Vercel (serverless), as conexões SSE são reiniciadas a cada ~60s e instâncias diferentes não compartilham memória. Por isso o sistema tem **camada dupla**:

1. **SSE** — push instantâneo quando funciona (mesma instância)
2. **Polling de fallback** — admin recarrega a cada 15s, cliente a cada 10s (sempre garante a sincronia)

Resultado: o pedido do celular **sempre chega** ao PC do admin, no pior caso em ~15 segundos, normalmente instantâneo.

---

## ⚠️ Upload de mídias na Vercel

A Vercel não persiste arquivos gravados em disco entre deploys.  
Para upload permanente de fotos/vídeos, use uma URL externa:

**Opções gratuitas:**
- [Cloudinary](https://cloudinary.com) — até 25GB grátis
- [Imgur](https://imgur.com) — imagens
- [Bunny.net](https://bunny.net) — CDN barata

No painel admin → Mídias: cole a URL externa diretamente no campo de URL.

---

## 🔧 Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `DATABASE_URL` | ✅ Sim | String de conexão PostgreSQL |
| `JWT_SECRET` | ✅ Sim | Chave para assinar tokens JWT |

---

## 📞 Contato do estabelecimento

- **Telefone:** (82) 98727-5750
- **Endereço:** Cj. Antônio Lins, Rio Largo - AL, 57100-000
- **Horário:** Seg a Dom 06h-00h (exceto quarta-feira)
