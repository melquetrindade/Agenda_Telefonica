import React, {useState} from "react";
import styles from '../styles/create_contacts.module.css'
import {notification, message} from 'antd'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function DeleteContacts(){

  const [inputValue, setInput] = useState({
    nome: '',
    endereco: '',
    idade: '',
  })

  const [api, contextHolder] = notification.useNotification();
  const openNotification = ({placement, title, descricao}) => {
    api.info({
        message: `${title}`,
        description: `${descricao}`,
        placement,
    });
  }

  const [messageApi, contextHolder2] = message.useMessage();
  const key = 'updatable';

  const openMessage = () => {
      messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
      });
      setTimeout(() => {
          messageApi.open({
              key,
              type: 'success',
              content: 'Loaded!',
              duration: 2,
          });
      }, 1000);
  };

  const apiUrl = 'http://127.0.0.1:8000/clientes/'

  const formatData = () => {

    const registerData = {
      nome: document.getElementById('formGridName').value,
      endereco: document.getElementById('formGridAddress').value,
      idade: document.getElementById('formGridAge').value,
    };

    if(!registerData.nome){
      openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
    }
    else if(!registerData.endereco){
      openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
    }
    else if(!registerData.idade){
      openNotification({placement: 'topRight', title: 'ERRO', descricao: 'Preencha os Campos Obrigatórios'})
    }
    else{
      console.log('chama função de cadastrar')
      cadastrarDados({objData: registerData})
    }
    //console.log(document.getElementById('formGridName').value)
    //console.log(document.getElementById('formGridAge').value)
    //console.log(document.getElementById('formGridAddress').value)
  }

  const cadastrarDados = async ({objData}) => {
    openMessage()
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(objData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        openNotification({placement: 'topRight', title: 'Contato Cadastrado', descricao: 'O Contado foi Cadastrado com Sucesso!'})
      })
      .catch(error => {
        console.error('Erro durante a requisição POST:', error);
      });
  }

  const handleChangeName = (e) => {
    const inputText = e.target.value

    if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
        setInput({
          nome: inputText,
          endereco: inputValue.endereco,
          idade: inputValue.idade
        })
    }
  }

  const handleChangeAddress = (e) => {
    const inputText = e.target.value

    if (/^[a-zA-Z 0-9']+$/.test(inputText) || inputText === '') {
      setInput({
        nome: inputValue.nome,
        endereco: inputText,
        idade: inputValue.idade
      })
    }
  }

  const handleChangeAge = (e) => {
    const inputText = e.target.value

    if (/^[0-9']+$/.test(inputText) || inputText === '') {
      setInput({
        nome: inputValue.nome,
        endereco: inputValue.endereco,
        idade: inputText
      })
    }
  }

  return(
      <main className={styles.main}>
        {contextHolder}
        {contextHolder2}
        <h1>Página de Criar Contatos</h1>
        <hr></hr>
        <Form>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridName">
                <Form.Label>Nome</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Fulano de Tal" 
                  required 
                  minLength="1" 
                  maxlength="250"
                  onChange={handleChangeName}
                  value={inputValue.nome}
                />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridAge">
                <Form.Label>Idade</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="18" 
                  required 
                  minLength="1" 
                  maxlength="3"
                  onChange={handleChangeAge}
                  value={inputValue.idade}
                />
                </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress">
                <Form.Label>Endereço</Form.Label>
                <Form.Control 
                  placeholder="Rua da Água" 
                  required 
                  minLength="1" 
                  maxlength="250"
                  value={inputValue.endereco}
                  onChange={handleChangeAddress}
                />
            </Form.Group>

            <Button variant="primary" onClick={formatData}>
                Cadastrar
            </Button>
        </Form>
      </main>
  )
}