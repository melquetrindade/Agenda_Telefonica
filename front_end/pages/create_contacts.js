import React, {useState} from "react";
import styles from '../styles/create_contacts.module.css'
import {notification, message} from 'antd'
import { useRouter } from "next/router";

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';

export default function DeleteContacts(){

  const router = useRouter()

  const [inputValue, setInput] = useState({
    nome: '',
    email: '',
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
      email: document.getElementById('formGridEmail').value,
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
        setTimeout(function () {
          router.back()
        }, 2000);
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
        <div className={styles.contProgress}>
          <ProgressBar className={styles.progress} now={20}/>
          <div className={styles.spanEmail}><span class="material-symbols-outlined">contact_mail</span></div>
          <div className={styles.spanHome}><span class="material-symbols-outlined">home</span></div>
          <div className={styles.spanCall}><span class="material-symbols-outlined">call</span></div>
        </div>
        <h1 style={{fontWeight: '300', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>Contatos</h1>
        <hr></hr>
        <Container>
            <Row className={styles.rowTop}>
                <Col className={styles.colOne}>
                    <Form className={styles.formContato}>
                        <Form.Group controlId="formGridName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Fulano de Tal" 
                            required 
                            minLength="1" 
                            maxlength="250"
                            onChange={changeName}
                            value={nome}
                        />
                        </Form.Group>
    
                        <Form.Group controlId="formGridEmail">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="fulado@gmail.com" 
                            required 
                            minLength="1" 
                            maxlength="250"
                            onChange={changeEmail}
                            value={email}
                        />
                        </Form.Group>
                    </Form>
                </Col>

            </Row>

        </Container>
        <div className={styles.contButtons}>
            <Button variant="success" size="sm" onClick={funcFormatData}>
                Salvar Alterações<span class="material-symbols-outlined">check</span>
            </Button>

            <Button variant="primary" size="sm" onClick={funcNext}>
                Editar Endereço<span class="material-symbols-outlined">navigate_next</span>
            </Button>

            <Button variant="danger" size="sm" onClick={funcCancel}>
                Cancelar Alterações<span class="material-symbols-outlined">cancel</span>
            </Button>

            <Modal
                show={show}
                onHide={funcHandleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Alterações realizadas com sucesso!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Para onde deseja ser redirecionado?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={funcCancel}>
                        Página Inicial
                    </Button>
                    <Button variant="primary" onClick={funcNext}>
                        Edição de Endereços
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
      </main>
  )
}