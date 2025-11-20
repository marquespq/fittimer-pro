# 🚀 Guia de Deploy - GitHub Pages

## Passo 1: Preparar o Repositório

1. **Certifique-se que está no repositório correto:**
   ```bash
   git remote -v
   ```
   Deve mostrar: `origin  https://github.com/marquespq/fittimer-pro.git`

## Passo 2: Configurar GitHub Pages

1. Vá para o repositório no GitHub: `https://github.com/marquespq/fittimer-pro`

2. Clique em **Settings** (Configurações)

3. No menu lateral, clique em **Pages**

4. Em **Build and deployment**, configure:
   - **Source**: `GitHub Actions`
   - ✅ Isso ativa o workflow automático

## Passo 3: Deploy Automático

### Opção A: Via GitHub Actions (Recomendado)

O deploy acontece **automaticamente** quando você faz push na branch `main`:

```bash
# Adicione todos os arquivos
git add .

# Faça o commit
git commit -m "feat: Setup GitHub Pages deployment"

# Envie para o GitHub
git push origin main
```

✅ **O GitHub Actions vai:**
1. Detectar o push
2. Instalar dependências
3. Build do projeto
4. Deploy automático

🌐 **Acesse em:** `https://marquespq.github.io/fittimer-pro/`

### Opção B: Deploy Manual (Alternativa)

Se preferir deploy manual via gh-pages:

```bash
npm run deploy
```

## Passo 4: Verificar Deploy

1. **Acompanhe o workflow:**
   - Vá em: `https://github.com/marquespq/fittimer-pro/actions`
   - Clique no último workflow "Deploy to GitHub Pages"
   - Aguarde finalizar (≈2-3 minutos)

2. **Acesse o site:**
   - URL: `https://marquespq.github.io/fittimer-pro/`
   - Deve aparecer o FitTimer Pro funcionando!

## Verificação de SEO

Após o deploy, teste:

### 1. Google Search Console
```
https://search.google.com/search-console
```
- Adicione a propriedade: `https://marquespq.github.io/fittimer-pro/`
- Envie o sitemap: `https://marquespq.github.io/fittimer-pro/sitemap.xml`

### 2. Bing Webmaster Tools
```
https://www.bing.com/webmasters
```
- Adicione o site
- Envie o sitemap

### 3. Teste Meta Tags
```
https://www.opengraph.xyz/
https://cards-dev.twitter.com/validator
```

### 4. Performance
```
https://pagespeed.web.dev/
```
- Teste mobile e desktop
- Meta: 90+ em todas as métricas

## Troubleshooting

### ❌ Erro: "Page build failed"
**Solução:**
```bash
npm run build
# Se der erro local, corrija antes de fazer push
```

### ❌ Erro: "404 - Not Found"
**Soluções:**
1. Verifique se o workflow terminou com sucesso
2. Aguarde 5-10 minutos (propagação DNS)
3. Verifique se `base: '/fittimer-pro/'` está no vite.config.ts
4. Force refresh: `Ctrl + Shift + R`

### ❌ Erro: "Assets não carregam"
**Solução:**
```bash
# Verifique a base URL no vite.config.ts
base: process.env.VITE_BASE_URL || '/',

# No GitHub Actions, a variável VITE_BASE_URL é setada para /fittimer-pro/
```

### ❌ Erro: "Workflow não executa"
**Solução:**
1. Vá em Settings > Actions > General
2. Em "Workflow permissions", selecione: "Read and write permissions"
3. Salve e faça novo push

## URLs Importantes

- 🌐 **Site**: https://marquespq.github.io/fittimer-pro/
- 📊 **Actions**: https://github.com/marquespq/fittimer-pro/actions
- ⚙️ **Settings**: https://github.com/marquespq/fittimer-pro/settings/pages
- 📝 **Repo**: https://github.com/marquespq/fittimer-pro

## Próximos Passos (Opcional)

### 1. Custom Domain
Se quiser usar domínio próprio (ex: fittimer.app):

1. Compre o domínio
2. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: marquespq.github.io
   ```
3. No GitHub Settings > Pages > Custom domain: `www.fittimer.app`

### 2. Google Analytics
Adicione tracking no `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 3. PWA Analytics
Monitore instalações do PWA com eventos customizados.

---

## ✅ Checklist Final

- [ ] Código commitado e pushed
- [ ] GitHub Actions configurado
- [ ] Workflow executou com sucesso
- [ ] Site acessível em https://marquespq.github.io/fittimer-pro/
- [ ] Meta tags funcionando (teste com opengraph.xyz)
- [ ] PWA instalável no mobile
- [ ] Sitemap enviado ao Google Search Console
- [ ] Performance 90+ no PageSpeed

---

**🎉 Parabéns! Seu app está no ar!**
