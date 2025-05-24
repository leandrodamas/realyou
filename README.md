
# RealYou App

Uma aplicação de rede social com autenticação facial, reconhecimento de usuários por foto, gerenciamento de perfil profissional e agendamento de serviços.

## Recursos

- Autenticação e reconhecimento facial com tecnologia KBY-AI
- Busca de usuários através de reconhecimento facial
- Perfil profissional completo com serviços e agenda
- Notificações em tempo real para solicitações de amizade e agendamentos
- Busca 3D de profissionais por localização
- Agenda visual integrada
- Compartilhamento de posts e stories
- Controle de disponibilidade e precificação de serviços

## Tecnologias Utilizadas

- React com TypeScript
- Supabase para backend e autenticação
- SDK KBY-AI para reconhecimento facial
- WebAssembly (WASM) para processamento de imagem em tempo real
- Notificações em tempo real via Supabase Realtime

## Como iniciar

Siga estas etapas para configurar o projeto localmente:

```bash
# Clone o repositório
git clone https://github.com/leandrodamas/realyou.git

# Entre no diretório
cd realyou

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local com as seguintes variáveis:
# VITE_SUPABASE_URL=sua_url_do_supabase
# VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
# VITE_FACIAL_RECOGNITION_API_KEY=sua_chave_api_kbyai (opcional)

# Inicie o servidor de desenvolvimento
npm run dev
```

## Configuração do SDK KBY-AI

O projeto utiliza o SDK KBY-AI para reconhecimento facial. Os arquivos do SDK (`.js`, `.wasm`, `.data`) estão localizados em `/public/kbyai_sdk/`. Para utilizar sua própria chave de API:

1. Obtenha uma chave de API da KBY-AI
2. Configure a variável de ambiente `VITE_FACIAL_RECOGNITION_API_KEY` com sua chave
3. Ou atualize diretamente no arquivo `/src/services/sdk/initializeSDK.ts`

## Fluxo de Reconhecimento Facial

1. O usuário inicia a captura facial na página de autenticação ou busca
2. O sistema solicita permissão para acessar a câmera
3. O SDK KBY-AI analisa a qualidade da imagem em tempo real (posição, iluminação, nitidez)
4. Quando a imagem atinge a qualidade ideal, é capturada automaticamente
5. A imagem é enviada para processamento e comparação com o banco de dados
6. Em caso de reconhecimento, o sistema notifica o usuário encontrado

## Estrutura do projeto

O projeto segue uma arquitetura baseada em componentes React com TypeScript:

- `/src/components` - Componentes reutilizáveis da interface
- `/src/hooks` - Custom hooks React, incluindo hooks de reconhecimento facial
- `/src/pages` - Páginas da aplicação
- `/src/services` - Serviços de integração com APIs e SDK
- `/src/utils` - Funções utilitárias
- `/public/kbyai_sdk` - Arquivos do SDK KBY-AI (WASM, JS)

## Permissões Necessárias

- **Câmera**: Necessária para o reconhecimento facial
- **Localização**: Opcional, utilizada para a busca 3D de profissionais próximos
- **Notificações**: Recomendada para receber alertas de solicitações e agendamentos

## Contribuindo

Confira nosso [Guia de Contribuição](./CONTRIBUTING.md) para saber como contribuir para este projeto.

## Licença

MIT
