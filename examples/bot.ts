//BASE CODADA PELO ClassicX-O-BRABO - TODOS OS DIREITOS RESERVADOS!
//AVISO: ESTA BASE ESTÁ DESCRIPTOGRAFADA MAS AINDA SIM NÃO FOI CRIADA PRA SER EDITAVEL,SÓ EDITE SE SOUBER O QUE ESTÁ FAZENDO!
//QUALQUER ALTERAÇÃO NESTE ARQUIVO PODE QUEBRAR O BOT!
import { text } from 'stream/consumers';
import { BaileysClass } from '../lib/baileys.js';
import { Console } from 'console';
const puppeteer = require('puppeteer');
const cheerio = require('cheerio'); // Certifique-se de que o pacote cheerio está instalado

const botBaileys = new BaileysClass({});

botBaileys.on('auth_failure', async (error) => console.log("ERRO BOT: ", error));
botBaileys.on('qr', (qr) => console.log("UTILIZE O QR CODE ABAIXO PARA SE CONECTAR AO BOT\n: ", qr));
botBaileys.on('ready', async () => console.log('WANTED CC STORE BOT v1 - By ClassicX-O-BRABO\n\nBOT CONECTADO COM SUCESSO!'))

let awaitingResponse = false;
function gerarSenhaAleatoria(length) {
    const caracteres = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let senha = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * caracteres.length);
      senha += caracteres.charAt(randomIndex);
    }
  
    return senha;
  }

botBaileys.on('message', async (message) => {
    const useratual = `${(message.from.split('@'))[0]}`;
    const parametros = message.body.split(' ');
    const logsender = 'Usuário: ' + useratual;
    const logcomando = 'Comando: ' + parametros;
    const comandoprinc = parametros[0];
    const valorcomand = parametros[1];
    const comandokkj = message.body.toLowerCase().trim();
    console.log(comandoprinc)
    console.log(valorcomand)
    console.log('Novo Comando!\n')
    console.log(logsender)
    console.log(logcomando)
// Função para verificar se o usuário existe no banco de dados
const verificarUsuario = async (logado) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navega até a URL desejada
    await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');

    // Obtém o conteúdo da página como JSON
    const content = await page.evaluate(() => {
        return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
            .then(response => response.json())
            .then(data => data);
    });

    let usuarioEncontrado = false;
    let usuarioInfo;

    // Itera pelos blocos no JSON
    for (const bloco in content) {
        if (content.hasOwnProperty(bloco)) {
            if (content[bloco].numero === logado) {
                usuarioInfo = content[bloco];
                usuarioEncontrado = true;
                break;
            }
        }
    }

    return { usuarioEncontrado, usuarioInfo };
};

// Função para enviar o menu
const enviarMenu = async (message, usuarioInfo) => {
    console.log(`Enviando Menu!\nUsuário: ${message.from}\n`);
    
    const saldoAtual = usuarioInfo ? usuarioInfo.saldo : "Não Cadastrado";
    
    const menuText = `Wanted Store\n\n◆ ━━━━❪✪❫━━━━ ◆\n❖ Seu número: ${(message.from.split('@'))[0]}\n❖ Saldo Atual: R$: ${saldoAtual}\n◆ ━━━━❪✪❫━━━━ ◆\n\nATENDIMENTO ON 24 HRS⏰\nGARANTIMOS LIVE E MELHOR PREÇO✅\nTODAS AS INFO SÃO TESTADAS✅\n\n🤖WANTED STORE A MELHOR STORE DA ATUALIDADE🤖\nQUALIDADE,PREÇO JUSTO E AGILIDADE`;

    await botBaileys.sendPoll(message.from, menuText, {
        options: ['🤑ADICIONAR SALDO🤑', '💳COMPRAR INFO💳', '🔧SUPORTE DESTE BOT🔧', '⚙️DESENVOLVEDOR DO BOT⚙️'],
        multiselect: false
    });

    awaitingResponse = true;
};

if (message.body === '💳PACOTES MIX') {
  (async () => {
    const usuario = message.from;
    const logado = usuario.split('@s.whatsapp.net')[0];
    const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
    const email_do_usuario = usuarioInfo.numero;
    const senha_do_usuario = usuarioInfo.senha;
    if (usuarioEncontrado) {
      console.log("Dados de Usuário Capturados!")
    } else {
      // Se o usuário não existe, envia mensagem de erro
      await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Configurar os dados do POST
    const postData = {
      email: email_do_usuario,
      senha: senha_do_usuario
    };
  
    // Fazer a solicitação POST
    await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
      waitUntil: 'networkidle0',
    });
  
    const response = await page.evaluate(async (postData) => {
      const formData = new FormData();
      formData.append('email', postData.email);
      formData.append('senha', postData.senha);
  
      const fetchOptions = {
        method: 'POST',
        body: formData,
      };
  
      const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
      const text = await response.text();
  
      return text;
    }, postData);

    if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
      console.log('Login bem-sucedido');
      // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
      //await botBaileys.sendText(message.from, response);

      // Crie um novo PageContext na mesma instância do navegador
      const page2 = await browser.newPage();
      await page2.goto('https://wanted-store.42web.io/loja/listaiptv.php');
      const response2 = await page2.content();

      // Extrair elementos do tipo <option> da resposta da segunda página
      const options = response2.match(/<option[^>]*>.*?<\/option>/g);
      
      if (options && options.length > 0) {
        const pollOptions = options.map((option) => {
          // Extrair o texto dentro da tag <option>
          const text = option.replace(/<[^>]*>/g, '');
          return text;
        });
      
        // Filtrar a opção "💳ESCOLHA UM CARTÃO AQUI💳" antes de enviar a enquete
        const filteredOptions = pollOptions.filter((option) => option !== '✅ESCOLHA UMA CATEGORIA AQUI!✅');
      
        if (filteredOptions.length > 2) {
          // Enviar enquete para o usuário com as opções filtradas
          await botBaileys.sendPoll(message.from, '*💳Escolha um Pacote Mix Abaixo💳*', {
            options: filteredOptions,
            multiselect: false
          });
        } else {
          await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
        }
      } else {
        await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
      }
    } else {
      await botBaileys.sendText(message.from, 'Erro ao fazer login');
      // Aqui você pode enviar uma mensagem de erro
    }
    await browser.close();
  })();
  awaitingResponse = true;
}
if (comandoprinc.startsWith('R$')) {
  (async () => {
    try {
      const nomeDaEnquete = message.voters.pollCreationMessage.name;
      let itemselecionado = '';

      // Concatenar todos os elementos do array parametros com espaço
      for (let i = 0; i < parametros.length; i++) {
        itemselecionado += parametros[i];
        if (i < parametros.length - 1) {
          itemselecionado += ' '; // Adicionar um espaço em branco após cada elemento, exceto o último
        }
      }

      // Remover o final indesejado "| Quantidade: 4"
      itemselecionado = itemselecionado.replace(/\| Quantidade: \d+/g, '');

      // Remover emojis, incluindo o '💳' do início
      itemselecionado = itemselecionado.replace(/[\u{1F600}-\u{1F6FF}💳]/gu, '');

      // Remover espaços em branco no final do texto
      itemselecionado = itemselecionado.trim();
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (usuarioEncontrado) {
        console.log("Dados de Usuário Capturados!");
      } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        return; // Saia da função se o usuário não estiver cadastrado
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Configurar os dados do POST
      const postData = {
        email: email_do_usuario,
        senha: senha_do_usuario
      };

      // Fazer a solicitação POST para o login
      await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
        waitUntil: 'networkidle0',
      });

      const loginResponse = await page.evaluate(async (postData) => {
        const formData = new FormData();
        formData.append('email', postData.email);
        formData.append('senha', postData.senha);

        const fetchOptions = {
          method: 'POST',
          body: formData,
        };

        const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
        const text = await response.text();

        return text;
      }, postData);

      if (loginResponse.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
        console.log('Login bem-sucedido');
      
        // Agora, faça a requisição POST para https://wanted-store.42web.io/func/comprarloginkk.php
        const compraData = {
          usuario: email_do_usuario,
          tipo: itemselecionado
        };
      
        const compraResponse = await page.evaluate(async (compraData) => {
          const formData = new FormData();
          formData.append('usuario', compraData.usuario);
          formData.append('tipo', compraData.tipo);
      
          const fetchOptions = {
            method: 'POST',
            body: formData,
          };
      
          const response = await fetch('https://wanted-store.42web.io/func/comprariptvkk.php', fetchOptions);
          const text = await response.text();
      
          return text;
        }, compraData);
      
        // Feche o navegador após o uso
        await browser.close();
      
        // Use cheerio para analisar a resposta HTML
        const $ = cheerio.load(compraResponse);
      
        // Extrair os valores usando seletores CSS
        const compraEfetuada = $('form').text().trim();
        const conteudo = compraEfetuada.split('Compra Efetuada com Sucesso!')[1].trim();
      
        const informacoes = conteudo.split('\n');
        const tipo = informacoes[0];
        const suporte = informacoes[1];
        const preco = informacoes[2];
        const dataCompra = informacoes[3];
        const vendidoPara = informacoes[4];
        const saldoRestante = informacoes[5];
      
        // Enviar uma mensagem ao usuário com os valores extraídos
        const mensagemAoUsuario = `Compra Efetuada com Sucesso!\n\nConteúdo:\n${conteudo}\n\n${tipo}\n${suporte}\n${preco}\n${dataCompra}\n\n${vendidoPara}\nSaldo Restante: ${saldoRestante}`;
      
        await botBaileys.sendMedia(message.from, 'https://i.ibb.co/X2xgBW7/compra.jpg', '');
        await botBaileys.sendText(message.from, mensagemAoUsuario);
      } else {
        console.log('Erro ao efetuar o login');
        // Feche o navegador após o uso
        await browser.close();
      }
      } catch (error) {
      console.error('Ocorreu um erro:', error);
      }
      })();
      }

if (comandoprinc.startsWith('💳R$')) {
  (async () => {
    try {
      const nomeDaEnquete = message.voters.pollCreationMessage.name;
      console.log(nomeDaEnquete)
      let itemselecionado = '';

      // Concatenar todos os elementos do array parametros com espaço
      for (let i = 0; i < parametros.length; i++) {
        itemselecionado += parametros[i];
        if (i < parametros.length - 1) {
          itemselecionado += ' '; // Adicionar um espaço em branco após cada elemento, exceto o último
        }
      }
      
      // Remover o final indesejado "| Quantidade: 4"
      itemselecionado = itemselecionado.replace(/\| Quantidade: \d+/g, '');
      
      // Remover emojis, incluindo o '💳' do início
      itemselecionado = itemselecionado.replace(/[\u{1F600}-\u{1F6FF}💳]/gu, '');
      
      // Converter para minúsculas
      itemselecionado = itemselecionado.toLowerCase();
      
      // Remover espaços em branco no final do texto
      itemselecionado = itemselecionado.trim();
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (usuarioEncontrado) {
        console.log("Dados de Usuário Capturados!");
      } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        return; // Saia da função se o usuário não estiver cadastrado
      }

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // Configurar os dados do POST
      const postData = {
        email: email_do_usuario,
        senha: senha_do_usuario
      };

      // Fazer a solicitação POST para o login
      await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
        waitUntil: 'networkidle0',
      });

      const loginResponse = await page.evaluate(async (postData) => {
        const formData = new FormData();
        formData.append('email', postData.email);
        formData.append('senha', postData.senha);

        const fetchOptions = {
          method: 'POST',
          body: formData,
        };

        const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
        const text = await response.text();

        return text;
      }, postData);

      if (loginResponse.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
        console.log('Login bem-sucedido');

        let compraUrl = ''; // Variável para armazenar a URL da compra
        
        // Definir a URL da compra com base no valor de nomeDaEnquete
        if (nomeDaEnquete === '*💳Escolha um Cartão Por Nível Abaixo💳*') {
          compraUrl = 'https://wanted-store.42web.io/func/comprarloginkk.php';
          console.log(nomeDaEnquete)
          console.log(compraUrl)
        } else if (nomeDaEnquete === '*💳Escolha um Cartão Por Banco Abaixo💳*') {
          compraUrl = 'https://wanted-store.42web.io/func/comprarloginbancokk.php';
          console.log(nomeDaEnquete)
          console.log(compraUrl)
        } else if (nomeDaEnquete === '*💳Escolha uma BIN Abaixo💳*') {
          compraUrl = 'https://wanted-store.42web.io/func/comprarloginbinkk.php';
          console.log(nomeDaEnquete)
          console.log(compraUrl)
        }

        // Verificar se a URL de compra foi definida
        if (compraUrl !== '') {
          // Agora, faça a requisição POST para a URL da compra
          const compraData = {
            usuario: email_do_usuario,
            tipo: itemselecionado
          };

          const compraResponse = await page.evaluate(async (compraUrl, compraData) => {
            const formData = new FormData();
            formData.append('usuario', compraData.usuario);
            formData.append('tipo', compraData.tipo);
          
            const fetchOptions = {
              method: 'POST',
              body: formData,
            };
          
            const response = await fetch(compraUrl, fetchOptions);
            const text = await response.text();
          
            return text;
          }, compraUrl, compraData);
          
          // Feche o navegador após o uso
          await browser.close();
          
          // Use cheerio para analisar a resposta HTML
          const $ = cheerio.load(compraResponse);
          if (compraResponse.includes('Nenhuma Info Disponível No Momento...')) {
            await botBaileys.sendText(message.from, '*⚠️Nenhuma Info Deste Tipo em Estoque!⚠️*');
            return
          }

          if (compraResponse.includes('Saldo insuficiente para realizar a compra.')) {
            await botBaileys.sendText(message.from, '*⚠️Seu Saldo é Insuficiente Para Realizar a Comprar⚠️*');
            return
          }
          
          // Extrair os valores usando seletores CSS
          const nome = $('th:contains("NOME:")').next().text().trim();
          const cpf = $('th:contains("CPF:")').next().text().trim();
          const numero = $('th:contains("Número:")').next().text().trim();
          const mes = $('th:contains("Mês:")').next().text().trim();
          const ano = $('th:contains("Ano:")').next().text().trim();
          const cvv = $('th:contains("CVV:")').next().text().trim();
          const banco = $('th:contains("Banco:")').next().text().trim();
          const bandeira = $('th:contains("Bandeira:")').next().text().trim();
          const tipo = $('th:contains("Tipo:")').next().text().trim();
          const nivel = $('th:contains("Nível:")').next().text().trim();
          const pais = $('th:contains("País:")').next().text().trim();
          const dataCompra = $('th:contains("Data da Compra:")').next().text().trim();
          const vendidoPara = $('th:contains("Vendido Para:")').next().text().trim();
          const saldoRestante = $('th:contains("Saldo Restante:")').next().text().trim();
          
          // Enviar uma mensagem ao usuário com os valores extraídos
          const mensagemAoUsuario = `*💳COMPRA EFETUADA COM SUCESSO!💳*
          
*Nome*: ${nome}
*CPF*: ${cpf}
*Número*: ${numero}
*Mês*: ${mes}
*Ano*: ${ano}
*CVV*: ${cvv}
*Banco*: ${banco}
*Bandeira*: ${bandeira}
*Tipo*: ${tipo}
*Nível*: ${nivel}
*País*: ${pais}
*Data da Compra*: ${dataCompra}
*Usuário*: ${vendidoPara}
*Saldo Restante*: ${saldoRestante}`;
          
          await botBaileys.sendMedia(message.from, 'https://i.ibb.co/X2xgBW7/compra.jpg' , '');
          await botBaileys.sendText(message.from, mensagemAoUsuario);
        } else {
          console.log('URL de compra não definida');
          // Feche o navegador após o uso
          await browser.close();
        }
      } else {
        console.log('Erro ao efetuar o login');
        // Feche o navegador após o uso
        await browser.close();
      }
    } catch (error) {
      console.error('Ocorreu um erro:', error);
    }
  })();
}

if (comandoprinc === 'pix') {
  const valorkk = valorcomand;
  if (valorkk === undefined) {
    await botBaileys.sendText(message.from, '*⚠️ INSIRA O VALOR DO PIX! ⚠️*\n\nExemplo: *pix 10*');
  } else {
    (async () => {
      const usuario = message.from;
      const logado = usuario.split('@s.whatsapp.net')[0];
      const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
      const email_do_usuario = usuarioInfo.numero;
      const senha_do_usuario = usuarioInfo.senha;

      if (usuarioEncontrado) {
        console.log("Dados de Usuário Capturados!");

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // Configurar os dados do POST para fazer login
        const postData = {
          email: email_do_usuario,
          senha: senha_do_usuario
        };

        // Fazer a solicitação POST para fazer login
        await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
          waitUntil: 'networkidle0',
        });

        const response = await page.evaluate(async (postData) => {
          const formData = new FormData();
          formData.append('email', postData.email);
          formData.append('senha', postData.senha);

          const fetchOptions = {
            method: 'POST',
            body: formData,
          };

          const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
          const text = await response.text();

          return text;
        }, postData);

        if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
          console.log('Login bem-sucedido');

          // Configurar os dados do POST para gerar o Pix
          const postData2 = {
            valor: valorkk
          };

          // Fazer a solicitação POST para gerar o Pix
          await page.goto('https://wanted-store.42web.io/func/pixgen.php', {
            waitUntil: 'networkidle0',
          });

          const response2 = await page.evaluate(async (postData2) => {
            const formData2 = new FormData();
            formData2.append('valor', postData2.valor);

            const fetchOptions2 = {
              method: 'POST',
              body: formData2,
            };

            const response2 = await fetch('https://wanted-store.42web.io/func/pixgen.php', fetchOptions2);
            const text2 = await response2.text();

            return text2;
          }, postData2);

          // Extrair dados relevantes da resposta da API
          const qrCode = response2.match(/<span id="qr-code".*?>(.*?)<\/span>/);
          const idPagamento = response2.match(/<span id="codigo-pagamento".*?>(.*?)<\/span>/);
          const valorPagamento = response2.match(/<h4 style="color: white;">Valor do Pagamento: (.*?)<\/h4>/);
          const pixGerado = response2.includes('<h1>PAGAMENTO GERADO COM SUCESSO!</h1><br>');

          if (pixGerado) {
            const dadospixkk = `*PIX GERADO COM SUCESSO!*\n\n*Valor*: ${valorPagamento ? valorPagamento[1] : 'N/A'}\n\nUtilize o Pix Copia e Cola Abaixo para pagar o pix,Assim que o pix for pago envie *paguei o pix* para creditar o seu saldo,todo processo é 100% Automatico`;

            await botBaileys.sendText(message.from, dadospixkk);
          } else {
            await botBaileys.sendText(message.from, 'Erro ao Gerar o Pix');
          }

          if (qrCode && qrCode[1]) {
            await botBaileys.sendText(message.from, qrCode[1]);
          } else {
            await botBaileys.sendText(message.from, 'Erro ao Gerar o Pix Copia e Cola!');
          }
        } else {
          await botBaileys.sendText(message.from, 'Erro ao fazer login.');
        }
        await browser.close();
      } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌ Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
      }
    })();
  }
}
// Verifique se a mensagem é 'menu' e envie o menu se o usuário existir no banco de dados
if (comandokkj === 'menu') {
    console.log("Menu Acionado!")
    const usuario = message.from;
    const logado = usuario.split('@s.whatsapp.net')[0];

    // Verifica se o usuário existe no banco de dados
    const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);

    if (usuarioEncontrado) {
        await enviarMenu(message, usuarioInfo);
    } else {
        // Se o usuário não existe, envia mensagem de erro
        await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
    }
}
    if (message.body === '❌VOLTAR AO MENU❌') {
        const usuario = message.from;
        const logado = usuario.split('@s.whatsapp.net')[0];
    
        // Verifica se o usuário existe no banco de dados
        const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
    
        if (usuarioEncontrado) {
            await enviarMenu(message, usuarioInfo);
        } else {
            // Se o usuário não existe, envia mensagem de erro
            await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        }
    }   
    if (message.body === '🤑ADICIONAR SALDO🤑') {
        console.log(`Indo ao menu de Adicionar Saldo...\nUsuário: ${message.from}\n`);
        const menuText = `💰COMO ADICIONAR SALDO VIA PIX💰\n\nUtilize "pix" Seguido do Valor Desejado no Formato 0.00\n\nExemplo:\n\n*pix 15*\n\n*pix 22.70* `;
        await botBaileys.sendText(message.from, menuText);    
        awaitingResponse = true;
    }
    if (message.body === '💳COMPRAR INFO💳') {
        console.log(`Indo ao menu de Escolher Info...\nUsuário: ${message.from}\n`);
        const menuText = `💳MENU DE DE CARTÕES💳\n\nTODAS AS INFOS ACOMPANHAM NOME E CPF!\n\nESCOLHA ABAIXO O TIPO DESEJADO`;
    
        await botBaileys.sendPoll(message.from, menuText, {
            options: ['💳CARTÕES POR NÍVEL', '💳CARTÕES POR BANCO', '💳CARTÕES POR BIN', '💳PACOTES MIX', '❌VOLTAR AO MENU❌'],
            multiselect: false
        });
    
        awaitingResponse = true;
    }
    if (message.body === '💳CARTÕES POR BIN') {
        (async () => {
            const usuario = message.from;
            const logado = usuario.split('@s.whatsapp.net')[0];
            const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
            const email_do_usuario = usuarioInfo.numero;
            const senha_do_usuario = usuarioInfo.senha;
            if (usuarioEncontrado) {
              console.log("Dados de Usuário Capturados!")
            } else {
              // Se o usuário não existe, envia mensagem de erro
              await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
          
            // Configurar os dados do POST
            const postData = {
              email: email_do_usuario,
              senha: senha_do_usuario
            };
          
            // Fazer a solicitação POST
            await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
              waitUntil: 'networkidle0',
            });
          
            const response = await page.evaluate(async (postData) => {
              const formData = new FormData();
              formData.append('email', postData.email);
              formData.append('senha', postData.senha);
          
              const fetchOptions = {
                method: 'POST',
                body: formData,
              };
          
              const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
              const text = await response.text();
          
              return text;
            }, postData);
        
            if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
              console.log('Login bem-sucedido');
              // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
              //await botBaileys.sendText(message.from, response);
        
              // Crie um novo PageContext na mesma instância do navegador
              const page2 = await browser.newPage();
              await page2.goto('https://wanted-store.42web.io/loja/listaloginsbin.php');
              const response2 = await page2.content();
        
              // Extrair elementos do tipo <option> da resposta da segunda página
              const options = response2.match(/<option[^>]*>.*?<\/option>/g);
              
              if (options && options.length > 0) {
                const pollOptions = options.map((option) => {
                  // Extrair o texto dentro da tag <option>
                  const text = option.replace(/<[^>]*>/g, '');
                  return text;
                });
              
                // Filtrar a opção "💳ESCOLHA UM CARTÃO AQUI💳" antes de enviar a enquete
                //const filteredOptions = pollOptions.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
              
                if (pollOptions.length > 2) {
                  // Enviar enquete para o usuário com as opções filtradas
                  await botBaileys.sendPoll(message.from, '*💳Escolha uma BIN Abaixo💳*', {
                    options: pollOptions,
                    multiselect: false
                  });
                } else {
                  await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
                }
              } else {
                await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
              }
            } else {
              await botBaileys.sendText(message.from, 'Erro ao fazer login');
              // Aqui você pode enviar uma mensagem de erro
            }
            await browser.close();
          })();
          awaitingResponse = true;
        }
    if (message.body === '💳CARTÕES POR BANCO') {
        (async () => {
            const usuario = message.from;
            const logado = usuario.split('@s.whatsapp.net')[0];
            const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
            const email_do_usuario = usuarioInfo.numero;
            const senha_do_usuario = usuarioInfo.senha;
            if (usuarioEncontrado) {
              console.log("Dados de Usuário Capturados!")
            } else {
              // Se o usuário não existe, envia mensagem de erro
              await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
            }
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
          
            // Configurar os dados do POST
            const postData = {
              email: email_do_usuario,
              senha: senha_do_usuario
            };
          
            // Fazer a solicitação POST
            await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
              waitUntil: 'networkidle0',
            });
          
            const response = await page.evaluate(async (postData) => {
              const formData = new FormData();
              formData.append('email', postData.email);
              formData.append('senha', postData.senha);
          
              const fetchOptions = {
                method: 'POST',
                body: formData,
              };
          
              const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
              const text = await response.text();
          
              return text;
            }, postData);
        
            if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
              console.log('Login bem-sucedido');
              // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
              //await botBaileys.sendText(message.from, response);
        
              // Crie um novo PageContext na mesma instância do navegador
              const page2 = await browser.newPage();
              await page2.goto('https://wanted-store.42web.io/loja/listaloginsbanco.php');
              const response2 = await page2.content();
        
              // Extrair elementos do tipo <option> da resposta da segunda página
              const options = response2.match(/<option[^>]*>.*?<\/option>/g);
              
              if (options && options.length > 0) {
                const pollOptions = options.map((option) => {
                  // Extrair o texto dentro da tag <option>
                  const text = option.replace(/<[^>]*>/g, '');
                  return text;
                });
              
                // Filtrar a opção "💳ESCOLHA UM CARTÃO AQUI💳" antes de enviar a enquete
                //const filteredOptions = pollOptions.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
              
                if (pollOptions.length > 2) {
                  // Enviar enquete para o usuário com as opções filtradas
                  await botBaileys.sendPoll(message.from, '*💳Escolha um Cartão Por Banco Abaixo💳*', {
                    options: pollOptions,
                    multiselect: false
                  });
                } else {
                  await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
                }
              } else {
                await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
              }
            } else {
              await botBaileys.sendText(message.from, 'Erro ao fazer login');
              // Aqui você pode enviar uma mensagem de erro
            }
            await browser.close();
          })();
          awaitingResponse = true;
        }
    if (message.body === '💳CARTÕES POR NÍVEL') {
      (async () => {
        const usuario = message.from;
        const logado = usuario.split('@s.whatsapp.net')[0];
        const { usuarioEncontrado, usuarioInfo } = await verificarUsuario(logado);
        const email_do_usuario = usuarioInfo.numero;
        const senha_do_usuario = usuarioInfo.senha;
        if (usuarioEncontrado) {
          console.log("Dados de Usuário Capturados!")
        } else {
          // Se o usuário não existe, envia mensagem de erro
          await botBaileys.sendText(message.from, '❌Você não está cadastrado. Por favor, registre-se\n\nApenas Digite *registrar*');
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
      
        // Configurar os dados do POST
        const postData = {
          email: email_do_usuario,
          senha: senha_do_usuario
        };
      
        // Fazer a solicitação POST
        await page.goto('https://wanted-store.42web.io/func/logarbotapi.php', {
          waitUntil: 'networkidle0',
        });
      
        const response = await page.evaluate(async (postData) => {
          const formData = new FormData();
          formData.append('email', postData.email);
          formData.append('senha', postData.senha);
      
          const fetchOptions = {
            method: 'POST',
            body: formData,
          };
      
          const response = await fetch('https://wanted-store.42web.io/func/logarbotapi.php', fetchOptions);
          const text = await response.text();
      
          return text;
        }, postData);
    
        if (response.includes('Login Efetuado Com Sucesso! Cookies Salvos!')) {
          console.log('Login bem-sucedido');
          // Redirecionar para https://wanted-store.42web.io/loja/listalogins.php
          //await botBaileys.sendText(message.from, response);
    
          // Crie um novo PageContext na mesma instância do navegador
          const page2 = await browser.newPage();
          await page2.goto('https://wanted-store.42web.io/loja/listalogins.php');
          const response2 = await page2.content();
    
          // Extrair elementos do tipo <option> da resposta da segunda página
          const options = response2.match(/<option[^>]*>.*?<\/option>/g);
          
          if (options && options.length > 0) {
            const pollOptions = options.map((option) => {
              // Extrair o texto dentro da tag <option>
              const text = option.replace(/<[^>]*>/g, '');
              return text;
            });
          
            // Filtrar a opção "💳ESCOLHA UM CARTÃO AQUI💳" antes de enviar a enquete
            //const filteredOptions = pollOptions.filter((option) => option !== '💳ESCOLHA UM CARTÃO AQUI💳');
          
            if (pollOptions.length > 2) {
              //console.log(filteredOptions)
              // Enviar enquete para o usuário com as opções filtradas
              await botBaileys.sendPoll(message.from, '*💳Escolha um Cartão Por Nível Abaixo💳*', {
                options: pollOptions,
                multiselect: false
              });
            } else {
              await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
            }
          } else {
            await botBaileys.sendText(message.from, '*⚠️Nenhum Cartão Da Categoria Selecionada Disponível no Estoque!⚠️*\n\nTente Novamente Mais Tarde <3');
          }
        } else {
          await botBaileys.sendText(message.from, 'Erro ao fazer login');
          // Aqui você pode enviar uma mensagem de erro
        }
        await browser.close();
      })();
      awaitingResponse = true;
    } else {
        const command = message.body.toLowerCase().trim();
        //console.log(command)
        switch (command) {
            case 'adicionar pix00':
                await botBaileys.sendText(message.from, 'Obvio que é obvio ?');
                break;
            case 'comprar info':
                await botBaileys.sendText(message.from, 'Agora Sim é Um Comando ?');
                break;    
            case 'falar com o suporte':
                await botBaileys.sendMedia(message.from, 'https://github.com/Diikk55/sdgs/blob/main/imagens/compra.jpeg?raw=true', 'test');
                break;
            case 'sobre o bot':
                await botBaileys.sendFile(message.from, 'https://github.com/pedrazadixon/sample-files/raw/main/sample_pdf.pdf');
                break;
            case 'sticker':
                await botBaileys.sendSticker(message.from, 'https://gifimgs.com/animations/anime/dragon-ball-z/Goku/goku_34.gif', { pack: 'User', author: 'Me' });
                break;
                case 'testezz':
                    const usuario = message.from;
                    const logado = usuario.split('@s.whatsapp.net')[0];
                    //const logado = '5521997208858';
                    (async () => {
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                
                        // Navega até a URL desejada
                        await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');
                
                        // Obtém o conteúdo da página como JSON
                        const content = await page.evaluate(() => {
                            return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
                                .then(response => response.json())
                                .then(data => data);
                        });
                
                        let usuarioEncontrado = false;
                
                        // Itera pelos blocos no JSON
                        for (const bloco in content) {
                            if (content.hasOwnProperty(bloco)) {
                                if (content[bloco].numero === logado) {
                                    const usuarioInfo = content[bloco];
                                    usuarioEncontrado = true;
                
                                    // Armazena as informações em variáveis
                                    const numero = usuarioInfo.numero;
                                    const senha = usuarioInfo.senha;
                                    const saldo = usuarioInfo.saldo;
                                    const codigoDeConvite = usuarioInfo.codigo_de_convite;
                                    const convidadoPor = usuarioInfo.convidado_por;
                
                                    // Envia as informações via WhatsApp
                                    await botBaileys.sendText(message.from, `Logado Como: ${logado}`);
                                    await botBaileys.sendText(message.from, `Número: ${numero}`);
                                    await botBaileys.sendText(message.from, `Senha: ${senha}`);
                                    await botBaileys.sendText(message.from, `Saldo: ${saldo}`);
                                    await botBaileys.sendText(message.from, `Código de Convite: ${codigoDeConvite}`);
                                    await botBaileys.sendText(message.from, `Convidado Por: ${convidadoPor}`);
                                    break;
                                }
                            }
                        }
                
                        if (!usuarioEncontrado) {
                            console.log(content);
                            // Usuário não encontrado no JSON
                            await botBaileys.sendText(message.from, `BEM VINDO A WANTED STORE\n\n⚠️Usuário ${logado} Não Cadastrado!⚠️\n\nUtilize registrar Para Se Registrar No Bot!\n\nExemplo:\n\n*registrar*\n\n✅Nosso Bot é Integrado Também Com Nossa Store Via Site,Seu Numero(com o 55) e Senha Gerada Após o Registro Podem também ser Usados para login no nosso Site!`);
                        }
                
                        await browser.close();
                    })();
                
                    break;
                    case 'registrar':
                        if (command === 'registrar') {
                            const usuario = message.from;
                            const logado = usuario.split('@s.whatsapp.net')[0];
                    
                            async function realizarRegistro() {
                                const browser = await puppeteer.launch();
                                const page = await browser.newPage();
                    
                                // Navega até a URL desejada
                                await page.goto('https://wanted-store.42web.io/dados/usuariosbot.json');
                    
                                // Obtém o conteúdo da página como JSON
                                const content = await page.evaluate(() => {
                                    return fetch('https://wanted-store.42web.io/dados/usuariosbot.json')
                                        .then(response => response.json())
                                        .then(data => data);
                                });
                    
                                let usuarioEncontrado = false;
                    
                                // Itera pelos blocos no JSON
                                for (const bloco in content) {
                                    if (content.hasOwnProperty(bloco)) {
                                        if (content[bloco].numero === logado) {
                                            const usuarioInfo = content[bloco];
                                            usuarioEncontrado = true;
                    
                                            // Armazena as informações em variáveis
                                            const numero = usuarioInfo.numero;
                                            const senha = usuarioInfo.senha;
                                            const saldo = usuarioInfo.saldo;
                                            const codigoDeConvite = usuarioInfo.codigo_de_convite;
                                            const convidadoPor = usuarioInfo.convidado_por;
                    
                                            // Envia as informações via WhatsApp
                                            await botBaileys.sendText(message.from, `*⚠️Usuário ${logado} Já Existe No Banco de Dados!⚠️*\n\nDigite *menu*`);
                                            break;
                                        }
                                    }
                                }
                    
                                await browser.close();
                    
                                // Verifica se o usuário foi encontrado antes de continuar
                                if (!usuarioEncontrado) {
                                    // SEGUNDA ETAPA DO PUPPETEER ABAIXO
                                    const useratual = `${(message.from.split('@'))[0]}`;
                                    const senha = gerarSenhaAleatoria(8);
                    
                                    const browser2 = await puppeteer.launch();
                                    const page2 = await browser2.newPage();
                    
                                    // Preencher o formulário
                                    await page2.goto('https://wanted-store.42web.io/formbotusr.php', {
                                        waitUntil: 'domcontentloaded',
                                    });
                    
                                    await page2.type('#email', useratual);
                                    await page2.type('#senha', senha);
                                    await page2.type('#convidado', '44444');
                    
                                    // Enviar o formulário
                                    await Promise.all([
                                        page2.waitForNavigation(), // Aguardar o redirecionamento
                                        page2.click('button[name="enviarCadastro"]'), // Clicar no botão de envio
                                    ]);
                    
                                    // Capturar o código-fonte da página redirecionada
                                    const response = await page2.content();
                                    if (response === '<html><head></head><body>Usuário salvo com sucesso!</body></html>') {
                                        const confcadastro = `*✅CADASTRADO COM SUCESSO!*\n\nUsuario: ${useratual}\nSenha De Login: ${senha}\n\nO Login Neste Bot é Automático,Seu Numero(No Formato 55) e Senha Servem para acessar sua conta atráves de nossa loja via Site,Guarde Sua Senha em um Local Seguro!`;                                                                        
                                        // Enviar a resposta ao usuário
                                        await botBaileys.sendText(message.from, confcadastro);
                                    }
                                    
                    
                                    // Fechar o navegador
                                    await browser2.close();
                                }
                            }
                    
                            realizarRegistro().catch((error) => {
                                console.error('Erro:', error);
                                botBaileys.sendText(message.from, 'Erro ao realizar o registro.');
                            });
                        } else {
                            await botBaileys.sendText(message.from, 'Erro:Erro Inesperado!');
                        }
                        break;
                    }                    
        awaitingResponse = false;
    }
});



