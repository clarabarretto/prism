# 🚀 Guia de Deploy - DataGuard AI

## 📋 Pré-requisitos para Deploy

### Backend (Server)
1. **Variável de ambiente obrigatória:**
   ```
   GEMINI_API_KEY=sua_chave_do_gemini_aqui
   ```

2. **Dependências instaladas:**
   ```bash
   cd server
   npm install
   ```

### Frontend (Client)
1. **Configurar a URL da API:**
   - Edite o arquivo `client/.env`
   - Substitua `VITE_API_URL` pela URL do seu backend deployado

## 🌐 Configuração para Deploy

### 1. Deploy do Backend (exemplo: Vercel, Railway, Heroku)

**Exemplo para Vercel:**
```bash
cd server
vercel --prod
```

**Variáveis de ambiente a configurar:**
- `GEMINI_API_KEY`: Sua chave da API do Google Gemini
- `NODE_ENV`: production
- `PORT`: (opcional, auto-detectado pela maioria das plataformas)

### 2. Deploy do Frontend (exemplo: Vercel, Netlify)

**Antes do deploy, configure:**
```bash
cd client
# Edite o .env com a URL do backend deployado
VITE_API_URL=https://seu-backend-deployado.vercel.app
```

**Para Vercel:**
```bash
cd client
vercel --prod
```

**Para Netlify:**
```bash
cd client
npm run build
# Upload da pasta 'dist' para o Netlify
```

## ⚙️ Configurações Específicas por Plataforma

### Vercel (Recomendado)

**Backend (server/):**
- Crie um arquivo `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ]
}
```

**Frontend (client/):**
- Configuração automática para Vite
- Apenas configure a variável `VITE_API_URL` no dashboard da Vercel

### Railway

**Backend:**
- Deploy direto do repositório
- Configure `GEMINI_API_KEY` no dashboard

**Frontend:**
- Configure build command: `npm run build`
- Configure `VITE_API_URL` nas variáveis de ambiente

## 🔧 Checklist de Deploy

### Antes do Deploy:
- [ ] Gemini API Key configurada
- [ ] Backend testado localmente
- [ ] Frontend testado localmente
- [ ] URLs de API configuradas no frontend

### Após o Deploy:
- [ ] Backend acessível via URL pública
- [ ] Frontend carrega corretamente
- [ ] Análises funcionando (texto, URL, PDF)
- [ ] Download de PDF funcionando
- [ ] Health check respondendo: `GET /api/health`

## 🧪 Testando após Deploy

1. **Teste o backend:**
   ```bash
   curl https://seu-backend.vercel.app/api/health
   ```

2. **Teste o frontend:**
   - Acesse a URL do frontend
   - Teste uma análise simples
   - Verifique se o download de PDF funciona

## 🚨 Problemas Comuns

### CORS Issues
Se houver problemas de CORS, certifique-se de que o backend está configurado para aceitar requisições do domínio do frontend.

### Variáveis de Ambiente
- **Frontend**: Deve começar com `VITE_`
- **Backend**: Configure no dashboard da plataforma de deploy

### URLs
- **Frontend**: Use apenas a variável `VITE_API_URL`
- **Backend**: Certifique-se de que todas as rotas estão funcionando

## 📞 URLs de Exemplo

Após o deploy, suas URLs ficarão assim:
- **Backend**: `https://dataGuard-api.vercel.app`
- **Frontend**: `https://dataGuard-ai.vercel.app`
- **API Health**: `https://dataGuard-api.vercel.app/api/health`
