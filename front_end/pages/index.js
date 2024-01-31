//import styles from './page.module.css'
import React, {useState} from 'react';

export default function Home() {

  //const [dados, setDados] = useState(undefined)
  const apiUrl = 'http://127.0.0.1:8000/clientes/'

  const dadosParaCadastrar = {
    nome: 'sonia',
    endereco: 'Rua do açude 2',
    idade: '20',
    // Adicione mais campos conforme necessário
  };

  const carregaDados = async () => {
    console.log('entrou no carrega')

    fetch(apiUrl)
      .then(response => {
        // Verifica se a requisição foi bem-sucedida (código de status 2xx)
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        // Converte a resposta para JSON
        return response.json();
      })
      .then(data => {
        // Manipula os dados recebidos
        console.log('deu certo')
        console.log(data[0].nome);
      })
      .catch(error => {
        // Trata erros durante a requisição
        console.error('Erro durante a requisição:', error);
      });  
  }

  const cadastrarDados = async () => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Adicione outros cabeçalhos, como tokens de autenticação, se necessário
      },
      body: JSON.stringify(dadosParaCadastrar),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Dados cadastrados com sucesso:', data);
      })
      .catch(error => {
        console.error('Erro durante a requisição POST:', error);
      });
  }

  //carregaDados()
  //cadastrarDados()

  return (
    <h1>Hello, word</h1>
  )
}
