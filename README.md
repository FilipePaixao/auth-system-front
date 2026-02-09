# Auth System – Frontend

Frontend independente (React + Vite + Tailwind) que consome a API do backend. Fica no mesmo repositório apenas para referência das rotas; roda e é deployado separadamente.

## Pré-requisitos

- Node.js 18+
- Yarn ou npm

## Instalação

```bash
cd frontend
yarn
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste se precisar:

```bash
cp .env.example .env
```

- **Dev:** deixe `VITE_API_URL` vazio para usar o proxy do Vite (API em `http://localhost:3000`).
- **Produção:** defina `VITE_API_URL` com a URL base da API (ex.: `https://api.seudominio.com`).

## Rodar em desenvolvimento

Com o backend rodando em outra aba (ex.: `yarn dev` na raiz do repo):

```bash
yarn dev
```

Abre em [http://localhost:5173](http://localhost:5173). O proxy encaminha `/authorizers` e `/users` para o backend (porta 3000).

## Build

```bash
yarn build
```

Saída em `dist/`. Para preview local:

```bash
yarn preview
```

## Scripts

| Script   | Descrição              |
|----------|------------------------|
| `yarn dev`    | Sobe o dev server (Vite) |
| `yarn build`  | Build de produção        |
| `yarn preview`| Servir o build localmente |
| `yarn lint`   | ESLint (se configurado)   |
