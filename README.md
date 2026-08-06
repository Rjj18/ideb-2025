# Painel IDEB 2025

Este projeto é uma página web simples para consultar indicadores do SAEB/IDEB de escolas brasileiras em 2025. A interface permite buscar uma escola por nome ou INEP e visualizar informações dos anos iniciais e finais em cards e gráficos.

## Funcionalidades

- Busca de escolas por nome ou INEP
- Exibição de indicadores de IDEB, Matemática e Português
- Separação entre anos iniciais e anos finais
- Gráficos comparativos para cada etapa

## Estrutura do projeto

- `index.html`: estrutura principal da interface
- `style.css`: estilos da aplicação
- `script.js`: lógica de busca, carregamento de dados e renderização dos gráficos
- `ideb_iniciais_2025.json`: base de dados dos anos iniciais
- `ideb_finais_2025.json`: base de dados dos anos finais

## Como usar

1. Clone ou baixe este repositório.
2. Abra a pasta do projeto em um terminal.
3. Inicie um servidor local, por exemplo:

```bash
python -m http.server 8000
```

4. Acesse `http://localhost:8000` no navegador.

## Tecnologias

- HTML
- CSS
- JavaScript
- Chart.js

## Demo no GitHub Pages

A versão publicada deste projeto está disponível em:

- https://[seu-usuario].github.io/ideb-2025/

> Substitua [seu-usuario] pelo nome do usuário ou organização do repositório no GitHub.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Observação

Como o projeto carrega arquivos JSON via JavaScript, a execução em um servidor local é recomendada para evitar problemas de acesso aos dados no navegador.
